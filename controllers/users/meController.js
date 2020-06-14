const Admin = require('../../models/users/admin');
const Parent = require('../../models/users/parent');
const Staff = require('../../models/users/staff');
const Student = require('../../models/users/student');
const catchAsyncError = require('../../utils/errorUtils/catchAsyncError');
const responseHandler = require('../../utils/responseHandler');

exports.getMe = catchAsyncError(async (request, response, next) => {
    let me;
    const category = request.user.category;
    if (category === 'Admin') me = await Admin.findById(request.user._id);
    if (category === 'Parent') me = await Parent.findById(request.user._id);
    if (category === 'Staff') me = await Staff.findById(request.user._id);
    if (category === 'Student') me = await Student.findById(request.user._id);
    return responseHandler(response, me, next, 200, 'Successfully retrieved your details', 1);
});

exports.updateMe = catchAsyncError(async (request, response, next) => {
    let me;
    const category = request.user.category;
    if (category === 'Admin') me = await Admin.findByIdAndUpdate(request.user._id, request.body, {
        new: true,
        runValidators: true
    });
    if (category === 'Parent') me = await Parent.findByIdAndUpdate(request.user._id, request.body, {
        new: true,
        runValidators: true
    });
    if (category === 'Staff') me = await Staff.findByIdAndUpdate(request.user._id, request.body, {
        new: true,
        runValidators: true
    });
    if (category === 'Student') me = await Student.findByIdAndUpdate(request.user._id, request.body, {
        new: true,
        runValidators: true
    });
    return responseHandler(response, me, next, 200, 'Successfully updated your details', 1);
});

exports.deleteMe = catchAsyncError(async (request, response, next) => {
    let me;
    const category = request.user.category;
    if (category === 'Admin') me = await Admin.findByIdAndDelete(request.user._id);
    if (category === 'Parent') me = await Parent.findByIdAndDelete(request.user._id);
    if (category === 'Staff') me = await Staff.findByIdAndDelete(request.user._id);
    if (category === 'Student') me = await Student.findByIdAndDelete(request.user._id);
    return responseHandler(response, me, next, 204, 'Successfully deleted your details', 1);
});