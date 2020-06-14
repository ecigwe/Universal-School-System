const Helper = require('../../helper/Helper');
const TeacherTimetable = require('../../models/timetables/teacherTimetable');
const Staff = require('../../models/users/staff');
const timetable = new Helper(TeacherTimetable);
const errorHandler = require('../../utils/errorUtils/errorHandler');
const responseHandler = require('../../utils/responseHandler');

class Timetable {

    static async createTimetable(req, res, next) {
        try {
            //only for staff who owns the account or schooladmin
            req.body.staffUsername = req.body.staffUsername || req.user.username;
            req.body.staffCategory = req.body.staffCategory || req.user.category;
            req.body.createdOn = Date();
            req.body.school = req.user.school || req.params.id;

            let doc = req.user.username === req.body.staffUsername ? req.user :
                await Staff.findOne({ 'username': req.body.staffUsername, 'school': req.params.id }).select({ 'teacherTimetable': 1 });

            if (!doc) { return errorHandler(404, 'Can\'t find staff with specified username in this school') };
            if (doc.teacherTimetable) { return errorHandler(409, 'Teacher timetable already exists for this staff') };

            const result = await TeacherTimetable.create({
                ...req.body
            });

            doc.teacherTimetable = result._id
            await doc.save({ validateBeforeSave: false });

            return responseHandler(res, result, next, 201, 'Timetable created successfully', 1);
        } catch (error) {
            next(error);
        }
    }

    static async getAllTeachersTimetables(req, res, next) {
        try {
            const message = 'Teachers timetables retrieved successfully';
            const query = { 'school': req.params.id };
            return await timetable.findAll(req, res, next, message, query);
        } catch (error) {
            return next(error);
        }
    }

    static async findOne(req, res, next) {
        try {
            const message1 = 'The timetable you are looking for was not found';
            const message2 = 'Timetable retrieved successfully';
            const query = { 'staffUsername': req.params.staff_username, 'school': req.params.id };
            return await timetable.findOne(req, res, next, message1, message2, query);
        } catch (error) {
            return next(error);
        }
    }

    static async updateTeacherTimetable(req, res, next) {
        try {
            const message1 = 'The timetable you are looking for was not found';
            const message2 = 'Timetable updated successfully';
            const query = { 'staffUsername': req.params.staff_username, 'school': req.params.id };
            const { createdOn, ...updateData } = req.body;
            req.body = updateData;
            return await timetable.update(req, res, next, message1, message2, query);
        } catch (error) {
            return next(error);
        }
    }

    static async deleteTeacherTimetable(req, res, next) {
        try {
            const message1 = 'The timetable you are looking for was not found';
            const message2 = 'Timetable was deleted successfully';
            const query = { 'staffUsername': req.params.staff_username, 'school': req.params.id };
            return await timetable.deleteOne(req, res, next, message1, message2, query);
        } catch (error) {
            return next(error);
        }
    }
}

module.exports = Timetable;