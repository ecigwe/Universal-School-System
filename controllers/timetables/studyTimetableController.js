const StudyTimetable = require('../../models/timetables/study');
const catchAsyncError = require('../../utils/errorUtils/catchAsyncError');
const errorHandler = require('../../utils/errorUtils/errorHandler');
const responseHandler = require('../../utils/responseHandler');

exports.createStudyTimetable = catchAsyncError(async (request, response, next) => {
    request.body.authorUsername = request.user.username;
    request.body.authorCategory = request.user.category;

    const newStudyTimetable = await StudyTimetable.create(request.body);
    request.user.studyTimetable = newStudyTimetable._id;

    await request.user.save({ validateBeforeSave: false });
    return responseHandler(response, newStudyTimetable, next, 201, 'Your timetable has been successfully created', 1);
});

exports.fetchMyTimetable = catchAsyncError(async (request, response, next) => {
    if (!request.user.studyTimetable) return errorHandler(400, 'You have not yet created a personal study timetable.');

    const studyTimetable = await StudyTimetable.findById(request.user.studyTimetable);

    if (!studyTimetable) return errorHandler(404, 'The information you are looking for does not exist.');

    return responseHandler(response, studyTimetable, next, 200, 'Timetable retrieved successfully', 1);
});

exports.updateMyTimetable = catchAsyncError(async (request, response, next) => {
    if (!request.user.studyTimetable) return errorHandler(400, 'You have not yet created a personal study timetable.');

    const studyTimetable = await StudyTimetable.findByIdAndUpdate(request.user.studyTimetable, request.body, {
        new: true,
        runValidators: true
    });

    if (!studyTimetable) return errorHandler(404, 'The information you want to update does not exist.');

    return responseHandler(response, studyTimetable, next, 200, 'Timetable updated successfully', 1);
});

exports.deleteMyTimetable = catchAsyncError(async (request, response, next) => {
    if (!request.user.studyTimetable) return errorHandler(400, 'You have not yet created a personal study timetable.');

    const studyTimetable = await StudyTimetable.findByIdAndDelete(request.user.studyTimetable);

    if (!studyTimetable) return errorHandler(404, 'The information you want to delete does not exist.');

    request.user.studyTimetable = undefined;
    await request.user.save({ validateBeforeSave: false });
    return responseHandler(response, studyTimetable, next, 204, 'Timetable deleted successfully', 1);
});

