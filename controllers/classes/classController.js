const Helper = require('../../helper/Helper');
const Classroom = require('../../models/classes/classRoom');
const classRoom = new Helper(Classroom);

class classController {

    static async createClass(req, res, next) {
        try {
            req.body.createdOn = Date();
            req.body.school = req.params.id;
            return await classRoom.create(req, res, next, 'Class created successfully');
        } catch (error) {
            return next(error);
        }
    }

    static async getAllClassesOfASpecificSchool(req, res, next) {
        try {
            const message = 'Classes retrieved successfully';

            const title = req.query.title ? { 'name': req.query.title } : {};
            const term = req.query.term ? { 'term': req.query.term } : {};
            const year = req.query.year ? { 'year': req.query.year } : {};

            let query = { 'school': req.params.id, ...title, ...term, ...year };

            return await classRoom.findAll(req, res, next, message, query);
        } catch (error) {
            return next(error);
        }
    }

    static async findAClassOfASpecificSchool(req, res, next) {
        try {
            const message1 = 'The class you are looking for was not found';
            const message2 = 'Class retrieved successfully';
            const query = { '_id': req.params.class_id, 'school': req.params.id };
            return await classRoom.findOne(req, res, next, message1, message2, query);
        } catch (error) {
            return next(error);
        }
    }

    static async updateClassOfASpecificSchool(req, res, next) {
        try {
            const message1 = 'Class not found';
            const message2 = 'Class was updated successfully';

            const query = { '_id': req.params.class_id, 'school': req.params.id };
            let { createdOn, students, ...updateData } = req.body;
            if (students) {
                students = { $addToSet: { students: [...students] } };
                updateData = { ...updateData, ...students };
            }
            req.body = updateData;
            return await classRoom.update(req, res, next, message1, message2, query);
        } catch (error) {
            return next(error);
        }
    }

    static async deleteClassOfASpecificSchool(req, res, next) {
        try {
            let message1 = 'Class not found';
            let message2 = 'Class was deleted successfully';
            let query = { '_id': req.params.class_id, 'school': req.params.id };
            if (req.query.students) {
                let field = 'students' // name of field from which item is to be deleted
                message2 = 'Student was not found in current class';
                return await classRoom.deleteArrayItem(req, res, next, message1, message2, query, field);
            }
            return await classRoom.deleteOne(req, res, next, message1, message2, query);
        } catch (error) {
            return next(error);
        }
    }
}

module.exports = classController;