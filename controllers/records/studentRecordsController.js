const Helper = require('../../helper/Helper');
const Shelf = require('../../models/shelf/shelf');
const StudentRecord = require('../../models/records/studentRecord');
const record = new Helper(StudentRecord);
const errorHandler = require('../../utils/errorUtils/errorHandler');
const responseHandler = require('../../utils/responseHandler');

class studentRecordsController {
    static async createRecord(data, next) {
        try {
            const record = await StudentRecord.create({
                ...data
            });

            return record;
        } catch (error) {
            next(error);
        }
    }

    static async getAllStudentRecordsForAspecificSchool(req, res, next) {
        try {
            const message = 'Records retrieved successfully';

            const cls = req.query.class ? { 'name': req.query.class } : {};
            const term = req.query.term ? { 'term': req.query.term } : {};
            const year = req.query.year ? { 'year': req.query.year } : {};

            let query = { 'school': req.params.id, ...cls, ...term, ...year };

            return await record.findAll(req, res, next, message, query);
        } catch (error) {
            return next(error);
        }
    }

    static async getAStudentRecordsForAspecificStudent(req, res, next) {
        try {
            const message = 'Student records retrieved successfully';

            const cls = req.query.class ? { 'name': req.query.class } : {};
            const term = req.query.term ? { 'term': req.query.term } : {};
            const year = req.query.year ? { 'year': req.query.year } : {};
            const student = req.params.student_id;

            let query = { 'school': req.params.id, 'student': student, ...cls, ...term, ...year };

            return await record.findAll(req, res, next, message, query);
        } catch (error) {
            return next(error);
        }
    }

    static async updateAStudentRecord(req, res, next) {
        try {
            const message1 = 'Student record not found';
            const message2 = 'Student record was updated successfully';
            const query = { '_id': req.params.record_id, 'school': req.params.id, 'student': req.params.student_id };
            const { createdOn, ...updateData } = req.body;
            req.body = updateData;
            return await record.update(req, res, next, message1, message2, query);
        } catch (error) {
            return next(error);
        }
    }

    static async deleteAStudentRecord(req, res, next) {
        try {
            const message1 = 'Student record not found';
            const message2 = 'Student record was deleted successfully';
            const query = { '_id': req.params.record_id, 'school': req.params.id, 'student': req.params.student_id };

            return await record.deleteOne(req, res, next, message1, message2, query);
        } catch (error) {
            return next(error);
        }
    }
}

module.exports = studentRecordsController;
