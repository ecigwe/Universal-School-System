const Helper = require('../../helper/Helper');
const Assessment = require('../../models/assessments/assessment');
const assessment = new Helper(Assessment);

class assessmentController {

    static async createAssessment(req, res, next) {
        try {
            req.body.createdOn = Date();
            req.body.school = req.params.id;
            return await assessment.create(req, res, next, 'Assessment created successfully');
        } catch (error) {
            return next(error);
        }
    }

    static async getAllAssessmentsOfASpecificSchool(req, res, next) {
        try {
            const message = 'Assessments retrieved successfully';
            const category = req.query.category ? { 'category': req.query.category } : {};
            const cls = req.query.class ? { 'class': req.query.class } : {};
            const subject = req.query.subject ? { 'subject': req.query.subject } : {};
            const term = req.query.term ? { 'term': req.query.term } : {};
            const year = req.query.year ? { 'year': req.query.year } : {};
            let query = { 'school': req.params.id, ...category, ...cls, ...subject, ...term, ...year };

            return await assessment.findAll(req, res, next, message, query);
        } catch (error) {
            return next(error);
        }

    }

    static async findOneAssessmentOfASpecificSchool(req, res, next) {
        try {
            const message1 = 'The assessment you are looking for was not found';
            const message2 = 'Assessment retrieved successfully';
            const query = { '_id': req.params.assessment_id, 'school': req.params.id };
            return await assessment.findOne(req, res, next, message1, message2, query);
        } catch (error) {
            return next(error);
        }
    }

    static async updateAssessmentOfASpecificSchool(req, res, next) {
        try {
            const message1 = 'Assessment not found';
            const message2 = 'Assessment was updated successfully';

            const query = { '_id': req.params.assessment_id, 'school': req.params.id };
            let { createdOn, questions, ...updateData } = req.body;
            if (questions) {
                questions = { $push: { questions: [...questions] } };
                updateData = { ...updateData, ...questions };
            }
            req.body = updateData;
            return await assessment.update(req, res, next, message1, message2, query);
        } catch (error) {
            return next(error);
        }
    }

    static async deleteAssessmentOfASpecificSchool(req, res, next) {
        try {
            let message1 = 'Assessment not found';
            let message2 = 'Assessment was deleted successfully';
            let query = { '_id': req.params.assessment_id, 'school': req.params.id };
            if (req.query.questions) {
                let field = 'questions' // name of field from which item is to be deleted
                message2 = 'Question not found in current assessment';
                return await assessment.deleteArrayItem(req, res, next, message1, message2, query, field);
            }
            return await assessment.deleteOne(req, res, next, message1, message2, query);
        } catch (error) {
            return next(error);
        }
    }
}

module.exports = assessmentController