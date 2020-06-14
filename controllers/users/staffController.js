const responseHandler = require('../../utils/responseHandler');
const errorHandler = require('../../utils/errorUtils/errorHandler');
const Staff = require('../../models/users/staff');
const catchAsyncError = require('../../utils/errorUtils/catchAsyncError');
//const mongoose = require('mongoose');

exports.getAllStaffOfSchool = catchAsyncError(async (request, response, next) => {
    const staffOfSchool = await Staff.find({ school: request.params.id });
    return responseHandler(response, staffOfSchool, next, 200, 'Successfully retrieved all the staff officials', staffOfSchool.length);
});

exports.getStaffOfSchool = catchAsyncError(async (request, response, next) => {
    const staffOfSchool = await Staff.findById(request.params.staff_id);
    if (!staffOfSchool) return errorHandler(404, 'We were unable to find the information you are looking for.');
    if (!staffOfSchool.school.equals(request.params.id)) return errorHandler(400, 'This official does not belong to this school!');
    return responseHandler(response, staffOfSchool, next, 200, 'Successfully retrieved the official\'s details', 1);
});

exports.updateStaffOfSchool = catchAsyncError(async (request, response, next) => {
    let staffOfSchool = await Staff.findById(request.params.staff_id);
    if (!staffOfSchool) return errorHandler(404, 'We were unable to find the information you are looking for.');
    if (!staffOfSchool.school.equals(request.params.id)) return errorHandler(400, 'This official is not a staff of this school!');
    staffOfSchool = await Staff.findByIdAndUpdate(request.params.staff_id, request.body, {
        new: true,
        runValidators: true
    });
    return responseHandler(response, staffOfSchool, next, 200, 'Successfully updated staff information', 1);
});

exports.deleteStaffOfSchool = catchAsyncError(async (request, response, next) => {
    let staffOfSchool = await Staff.findById(request.params.staff_id);
    if (!staffOfSchool) return errorHandler(404, 'We were unable to find the information you are looking for.');
    if (!staffOfSchool.school.equals(request.params.id)) return errorHandler(400, 'This official is not a staff of this school!');
    staffOfSchool = await Staff.findByIdAndDelete(request.params.staff_id);
    return responseHandler(response, staffOfSchool, next, 204, 'Successfully deleted official\'s details', 1);
});