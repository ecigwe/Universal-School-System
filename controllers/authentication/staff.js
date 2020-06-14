const crypto = require('crypto');
const Staff = require('../../models/users/staff');
const errorHandler = require('../../utils/errorUtils/errorHandler');
const catchAsyncError = require('../../utils/errorUtils/catchAsyncError');
const twilio = require('twilio');
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

exports.register = catchAsyncError(async (request, response, next) => {
    const newStaff = await Staff.create({
        fullname: request.body.fullname,
        email: request.body.email,
        username: request.body.username,
        phoneNumber: "+234" + request.body.phoneNumber,
        school: request.body.school,
        classes: request.body.classes,
        subjects: request.body.subjects,
        role: request.body.role,
        password: request.body.password,
        confirmPassword: request.body.confirmPassword,
        registrationDate: new Date(Date.now())
    });
    request.user = newStaff;
    response.statusCode = 201;
    return next();
});

//Later on I will ensure that you can login only when you are currently logged out
exports.login = catchAsyncError(async (request, response, next) => {
    const { username, password } = request.body;
    if (!username || !password) {
        return errorHandler(400, 'Please provide your username address and password');
    }

    const staff = await Staff.findOne({ username }).select('+password');
    if (!staff || !(await staff.crosscheckPassword(password, staff.password))) {
        return errorHandler(401, 'Incorrect username or password');
    }
    request.user = staff;
    response.statusCode = 200;
    return next();
});

exports.forgotPassword = catchAsyncError(async (request, response, next) => {
    const { phoneNumber } = request.body;
    if (!phoneNumber) return errorHandler(400, 'Please provide the phone number you used when signing up.');

    const staff = await Staff.findOne({ phoneNumber: "+234" + phoneNumber });
    if (!staff) return errorHandler(404, 'There is no staff with that phone number.');

    const resetToken = staff.createResetToken();
    await staff.save({ validateBeforeSave: false });

    await client.messages.create({
        to: staff.phoneNumber,
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

    const staff = await Staff.findOne({
        ResetToken: hashedResetCode,
        ResetExpires: { $gt: Date.now() }
    });
    if (!staff) return errorHandler(400, 'Your Reset Code Is Either Invailid Or Has Expired!');

    staff.password = newPassword;
    staff.confirmPassword = confirmNewPassword;
    staff.ResetToken = undefined;
    staff.ResetExpires = undefined;
    await staff.save();
    request.user = staff;
    response.statusCode = 200;
    return next();
});