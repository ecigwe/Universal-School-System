const Parent = require('../../models/users/parent');
const Student = require('../../models/users/student');
const catchAsyncErrors = require('../../utils/errorUtils/catchAsyncError');
const errorHandler = require('../../utils/errorUtils/errorHandler');
const responseHandler = require('../../utils/responseHandler');

exports.getAllParents = catchAsyncErrors(async (request, response, next) => {
    let parents = [];
    const students = await Student.find({ school: request.params.id });
    for (var i = 0; i < students.length; i++) {
        let parent = await Parent.findById(students[i].parent);
        parents.push(parent);
    }
    return responseHandler(response, parents, next, 200, 'Successfully retrieved all parents', parents.length);
});

exports.getParent = catchAsyncErrors(async (request, response, next) => {
    const parent = await Parent.findById(request.params.id);
    if (!parent) return errorHandler(404, 'We could not find the information that you are looking for');
    return responseHandler(response, parent, next, 200, 'Successfully retrieved the requested information', 1);
});

exports.updateParent = catchAsyncErrors(async (request, response, next) => {
    const parent = await Parent.findByIdAndUpdate(request.params.id, request.body, {
        new: true,
        runValidators: true
    });
    if (!parent) return errorHandler(404, 'The information you want to update does not exist!');
    return responseHandler(response, parent, next, 200, 'Successfully updated', 1);
});

exports.deleteParent = catchAsyncErrors(async (request, response, next) => {
    const parent = await Parent.findByIdAndDelete(request.params.id);
    if (!parent) return errorHandler(404, 'We could not find the information you wanted to delete');
    return responseHandler(response, parent, next, 204, 'Successfully deleted', 1);
});