const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const Admin = require('../../models/users/admin');
const Parent = require('../../models/users/parent');
const Student = require('../../models/users/student');
const Staff = require('../../models/users/staff');
const errorHandler = require('../../utils/errorUtils/errorHandler');
const catchAsyncError = require('../../utils/errorUtils/catchAsyncError');

exports.protect = catchAsyncError(async (request, response, next) => {
    let token;
    if (request.headers.authorization && request.headers.authorization.startsWith('Bearer')) {
        token = request.headers.authorization.split(' ')[1];
    } else if (request.cookies.jwt) {
        token = request.cookies.jwt;
    }

    if (!token) return errorHandler(401, 'Please login to gain access.');

    const decodedToken = await promisify(jwt.verify)(token, process.env.SECRET);
    let theCurrentUser;

    if (decodedToken.category === 'Admin') theCurrentUser = await Admin.findById(decodedToken.id);
    if (decodedToken.category === 'Parent') theCurrentUser = await Parent.findById(decodedToken.id);
    if (decodedToken.category === 'Student') theCurrentUser = await Student.findById(decodedToken.id);
    if (decodedToken.category === 'Staff') theCurrentUser = await Staff.findById(decodedToken.id);

    if (!theCurrentUser) return errorHandler(401, `This user no longer has an account with this platform.`);

    if (theCurrentUser.passwordChangedAfterIssuingOfToken(decodedToken.iat)) return errorHandler(401, `You changed your password recently. Please login again.`);

    request.user = theCurrentUser;
    return next();
});

//Later on, I will ensure that you can logout only when you are currently logged in
exports.logout = (request, response, next) => {
    response.cookie('jwt', 'logYouOut', {
        httpOnly: true,
        expiresIn: new Date(Date.now() + (5 * 1000))
    });
    return response.status(200).json({
        status: 'success',
        message: 'successfully logged out',
        token: null
    });
}

exports.updateMyPassword = catchAsyncError(async (request, response, next) => {
    const { currentPassword, newPassword, confirmNewPassword } = request.body;
    if (!currentPassword || !newPassword || !confirmNewPassword) return errorHandler(400, 'Please provide us with your old password, your new password, and confirm your new password');

    let user;
    if (request.user.category === 'Admin') user = await Admin.findById(request.user._id).select('+password');
    if (request.user.category === 'Parent') user = await Parent.findById(request.user._id).select('+password');
    if (request.user.category === 'Staff') user = await Staff.findById(request.user._id).select('+password');
    if (request.user.category === 'Student') user = await Student.findById(request.user._id).select('+password');

    if (!(await user.crosscheckPassword(currentPassword, user.password))) return errorHandler(401, 'Your current password is not correct.');

    user.password = newPassword;
    user.confirmPassword = confirmNewPassword;
    await user.save();

    return next();
});