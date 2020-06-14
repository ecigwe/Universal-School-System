const responseHandler = require('../../utils/responseHandler');
const errorHandler = require('../../utils/errorUtils/errorHandler');
const Student = require('../../models/users/student');
const catchAsyncError = require('../../utils/errorUtils/catchAsyncError');
const StudyTimetable = require('../../models/timetables/study');
//const mongoose = require('mongoose');

exports.getAllStudentsOfSchool = catchAsyncError(async (request, response, next) => {
    const studentsOfSchool = await Student.find({ school: request.params.id });
    return responseHandler(response, studentsOfSchool, next, 200, 'Successfully retrieved all the students', studentsOfSchool.length);
});

exports.getStudentOfSchool = catchAsyncError(async (request, response, next) => {
    const studentOfSchool = request.student;
    if (!studentOfSchool) return errorHandler(404, 'We were unable to find the information you are looking for.');
    if (!studentOfSchool.school.equals(request.params.id)) return errorHandler(400, 'This student does not belong to this school!');
    return responseHandler(response, studentOfSchool, next, 200, 'Successfully retrieved the student\'s details', 1);
});

exports.updateStudentOfSchool = catchAsyncError(async (request, response, next) => {
    let studentOfSchool = request.student
    if (!studentOfSchool) return errorHandler(404, 'We were unable to find the information you are looking for.');
    if (!studentOfSchool.school.equals(request.params.id)) return errorHandler(400, 'This student does not belong to this school!');
    studentOfSchool = await Student.findByIdAndUpdate(request.params.student_id, request.body, {
        new: true,
        runValidators: true
    });
    return responseHandler(response, studentOfSchool, next, 200, 'Successfully updated student\'s details', 1);
});

exports.deleteStudentOfSchool = catchAsyncError(async (request, response, next) => {
    let studentOfSchool = request.student
    if (!studentOfSchool) return errorHandler(404, 'We were unable to find the information you are looking for.');
    if (!studentOfSchool.school.equals(request.params.id)) return errorHandler(400, 'This student does not belong to this school!');
    studentOfSchool = await Student.findByIdAndDelete(request.params.student_id);
    if (studentOfSchool.studyTimetable) await StudyTimetable.findByIdAndDelete(studentOfSchool.studyTimetable);
    return responseHandler(response, studentOfSchool, next, 204, 'Successfully deleted student\'s details', 1);
});
