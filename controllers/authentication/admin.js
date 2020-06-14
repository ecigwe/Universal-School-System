const crypto = require('crypto');
const Admin = require('../../models/users/admin');
//const User = require('../../models/users/user');
const errorHandler = require('../../utils/errorUtils/errorHandler');
const catchAsyncError = require('../../utils/errorUtils/catchAsyncError');
const twilio = require('twilio');
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
//const responseHandler = require('../../utils/responseHandler');

exports.register = catchAsyncError(async (request, response, next) => {
    if (request.body.adminCode === process.env.ADMIN_CODE) {
        const newAdmin = await Admin.create({
            fullname: request.body.fullname,
            email: request.body.email,
            username: request.body.username,
            role: request.body.role,
            phoneNumber: "+234" + request.body.phoneNumber,
            password: request.body.password,
            confirmPassword: request.body.confirmPassword,
            isAnAdmin: true
        });
        request.user = newAdmin;
        response.statusCode = 201;
        return next();
    }
    return errorHandler(400, 'Please enter the correct admin code');

});

//Later on I will ensure that you can login only when you are currently logged out
exports.login = catchAsyncError(async (request, response, next) => {
    const { username, password } = request.body;
    if (!username || !password) {
        return errorHandler(400, 'Please provide your username address and password');
    }

    const admin = await Admin.findOne({ username }).select('+password');
    if (!admin || !(await admin.crosscheckPassword(password, admin.password))) {
        return errorHandler(401, 'Incorrect username or password');
    }
    request.user = admin;
    response.statusCode = 200;
    return next();
});

exports.forgotPassword = catchAsyncError(async (request, response, next) => {
    const { phoneNumber } = request.body;
    if (!phoneNumber) return errorHandler(400, 'Please provide the phone number you used when signing up.');

    const admin = await Admin.findOne({ phoneNumber: "+234" + phoneNumber });
    if (!admin) return errorHandler(404, 'There is no admin with that phone number.');

    const resetToken = admin.createResetToken();
    await admin.save({ validateBeforeSave: false });

    await client.messages.create({
        to: admin.phoneNumber,
        from: process.env.TWILIO_PHONE_NUMBER,
        body: `Your password reset code is ${resetToken}. Expires in 5 minutes.`
    });

    return response.status(200).json({
        status: 'Success',
        message: 'Your password reset token has been sent to your mobile phone as a text message',
        resetCode: resetToken
    });
});

exports.resetPassword = catchAsyncError(async (request, response, next) => {
    const { resetCode, newPassword, confirmNewPassword } = request.body;
    if (!resetCode || !newPassword || !confirmNewPassword) return errorHandler(400, 'Please provide the reset code sent to your phone number as well as your new password and a confirmation of the new password.');

    const hashedResetCode = crypto.createHash('sha256').update(resetCode).digest('hex');

    const admin = await Admin.findOne({
        ResetToken: hashedResetCode,
        ResetExpires: { $gt: Date.now() }
    });
    if (!admin) return errorHandler(400, 'Your Reset Code Is Either Invailid Or Has Expired!');

    admin.password = newPassword;
    admin.confirmPassword = confirmNewPassword;
    admin.ResetToken = undefined;
    admin.ResetExpires = undefined;
    await admin.save();
    request.user = admin;
    response.statusCode = 200;
    return next();
});