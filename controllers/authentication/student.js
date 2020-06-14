const crypto = require('crypto');
const Student = require('../../models/users/student');
const errorHandler = require('../../utils/errorUtils/errorHandler');
const catchAsyncError = require('../../utils/errorUtils/catchAsyncError');
const shelfController = require('../shelf/shelfController');
const twilio = require('twilio');
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

exports.register = catchAsyncError(async (request, response, next) => {
    const newStudent = await Student.create({
        fullname: request.body.fullname,
        email: request.body.email,
        username: request.body.username,
        phoneNumber: "+234" + request.body.phoneNumber,
        dateOfBirth: request.body.dateOfBirth,
        school: request.body.school,
        parent: request.body.parent,
        class: request.body.class,
        password: request.body.password,
        confirmPassword: request.body.confirmPassword,
        registrationDate: new Date(Date.now())
    });
    request.user = newStudent;
    const shelf = await shelfController.createShelf(newStudent, next);
    request.user.bookshelf = shelf._id;
    await request.user.save({validateBeforeSave: false});
    response.statusCode = 201;
    return next();
});

//Later on I will ensure that you can login only when you are currently logged out
exports.login = catchAsyncError(async (request, response, next) => {
    const { username, password } = request.body;
    if (!username || !password) {
        return errorHandler(400, 'Please provide your username address and password');
    }

    const student = await Student.findOne({ username }).select('+password');
    if (!student || !(await student.crosscheckPassword(password, student.password))) {
        return errorHandler(401, 'Incorrect username or password');
    }
    request.user = student;
    response.statusCode = 200;
    return next();
});

exports.forgotPassword = catchAsyncError(async (request, response, next) => {
    const { phoneNumber } = request.body;
    if (!phoneNumber) return errorHandler(400, 'Please provide the phone number you used when signing up.');

    const student = await Student.findOne({ phoneNumber: "+234" + phoneNumber });
    if (!student) return errorHandler(404, 'There is no student with that phone number.');

    const resetToken = student.createResetToken();
    await student.save({ validateBeforeSave: false });

    await client.messages.create({
        to: student.phoneNumber,
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

    const student = await Student.findOne({
        ResetToken: hashedResetCode,
        ResetExpires: { $gt: Date.now() }
    });
    if (!student) return errorHandler(400, 'Your Reset Code Is Either Invailid Or Has Expired!');

    student.password = newPassword;
    student.confirmPassword = confirmNewPassword;
    student.ResetToken = undefined;
    student.ResetExpires = undefined;
    await student.save();
    request.user = student;
    response.statusCode = 200;
    return next();
});