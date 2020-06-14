const LectureTimetable = require('../../models/timetables/lectures');
const catchAsyncError = require('../../utils/errorUtils/catchAsyncError');
const errorHandler = require('../../utils/errorUtils/errorHandler');
const responseHandler = require('../../utils/responseHandler');
const Classroom = require('../../models/classes/classRoom');

exports.createLectureTimetable = catchAsyncError(async (request, response, next) => {
    const classroom = await Classroom.findById(request.params.class_id);
    if (!classroom) return errorHandler(400, 'The class that you are creating a lecture timetable for does not yet exist.');

    request.body.school = request.params.id;
    request.body.class = request.params.class_id;
    request.body.form_teacher = classroom.formTeacher;
    request.body.class_prefect = classroom.prefect;

    const newLectureTimetable = await LectureTimetable.create(request.body);

    classroom.lectureTimetable = newLectureTimetable._id;
    await classroom.save();

    return responseHandler(response, newLectureTimetable, next, 201, 'Lecture Timetable Created Successfully', 1);
});

exports.fetchAllLectureTimetables = catchAsyncError(async (request, response, next) => {
    const lectureTimetables = await LectureTimetable.find({ school: request.params.id });
    return responseHandler(response, lectureTimetables, next, 200, 'Successfully retrieved all the lecture timetables for your school', lectureTimetables.length);
});

exports.fetchLectureTimetableForSingleClass = catchAsyncError(async (request, response, next) => {
    const lectureTimetable = await LectureTimetable.findById(request.classroom.lectureTimetable);
    if (!lectureTimetable) return errorHandler(404, 'There is no lecture timetable for this class');

    return responseHandler(response, lectureTimetable, next, 200, 'Successfully retrieved the lecture timetable for this class.', 1);
});

exports.updateClassLectureTimetable = catchAsyncError(async (request, response, next) => {
    const updatedLectureTimetable = await LectureTimetable.findByIdAndUpdate(request.classroom.lectureTimetable, request.body, {
        new: true,
        runValidators: true
    });

    if (!updatedLectureTimetable) return errorHandler(404, 'There is no lecture timetable for this class');

    return responseHandler(response, updatedLectureTimetable, next, 200, 'Successfully updated the lecture timetable for this class.', 1);
});

exports.deleteClassLectureTimetable = catchAsyncError(async (request, response, next) => {
    const deletedLectureTimetable = await LectureTimetable.findByIdAndDelete(request.classroom.lectureTimetable);

    if (!deletedLectureTimetable) return errorHandler(404, 'There is no lecture timetable for this class');

    request.classroom.lectureTimetable = undefined;
    request.classroom.save();
    return responseHandler(response, deletedLectureTimetable, next, 204, 'Successfully deleted the lecture timetable for this class.', 1);
});