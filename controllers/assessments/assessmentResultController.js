const Helper = require('../../helper/Helper');
const AssessmentResult = require('../../models/assessments/assessmentResult');
const StudentRecord = require('../../models/records/studentRecord');
const assessmentResult = new Helper(AssessmentResult);

class assessmentResultController {

    static async createAssessmentResult(req, res, next) {
        try {
            if (req.body.isCA === true) {
                let subject = req.body.subject.split(' ').join('').toLowerCase().trim();
                let term = req.body.term;
                let year = req.body.year;
                let cls = req.body.class;
                const record = await StudentRecord.findOne({
                    'school': req.params.id, 'student': req.body.student,
                    'year': year, 'term': term, 'class': cls
                });
                if (!record) {
                    let createdOn = Date();
                    await StudentRecord.create({
                        class: req.body.class,
                        term: req.body.term,
                        year: req.body.year,
                        student: req.body.student,   //later change to req.user._id
                        school: req.params.id,
                        [subject]: req.body.score,
                        createdOn
                    });
                } else if (record) {
                    record[subject] = parseInt(record[subject], 10) + parseInt(req.body.score, 10);
                    await record.save();
                }
            }
            req.body.createdOn = Date();
            req.body.school = req.params.id;
            return await assessmentResult.create(req, res, next, 'Result saved successfully');

        } catch (error) {
            next(error);
        }
    }

    static async getAllAssessmentResultsOfASchool(req, res, next) {
        try {
            const message = 'Assessment results retrieved successfully';

            const category = req.query.category ? { 'category': req.query.category } : {};
            const cls = req.query.class ? { 'class': req.query.class } : {};
            const subject = req.query.subject ? { 'subject': req.query.subject } : {};
            const term = req.query.term ? { 'term': req.query.term } : {};
            const year = req.query.year ? { 'year': req.query.year } : {};
            let query = { 'school': req.params.id, ...category, ...cls, ...subject, ...term, ...year };

            return await assessmentResult.findAll(req, res, next, message, query);
        } catch (error) {
            return next(error);
        }
    }

    static async findAssessmentResultsOfAStudent(req, res, next) {
        try {
            const message1 = 'Assessment results retrieved successfully';

            const category = req.query.category ? { 'category': req.query.category } : {};
            const cls = req.query.class ? { 'class': req.query.class } : {};
            const subject = req.query.subject ? { 'subject': req.query.subject } : {};
            const term = req.query.term ? { 'term': req.query.term } : {};
            const year = req.query.year ? { 'year': req.query.year } : {};
            const school = req.params.id
            const student = req.params.student_id
            let query = { 'school': school, 'student': student, ...category, ...cls, ...subject, ...term, ...year };

            return await assessmentResult.findAll(req, res, next, message1, query);
        } catch (error) {
            return next(error);
        }
    }

    // static async updateAssessmentResultOfAStudent(req, res, next) {
    //     try {

    //         const message1 = 'Assessment result was not found';
    //         const message2 = 'Assessment result was updated successfully';

    //         const query = { '_id': req.params.assessment_id, 'school': req.params.id };
    //         let { createdOn, ...updateData } = req.body;
    //         if (updateData.score || updateData.isCA) {
    //             let result = await AssessmentResult.findOne({ 'school': req.params.id, '_id': req.params.result_id });
    //             if(result.isCA){
    //                 const record = StudentRecord.findOne({ 'school': req.params.school, 'student': req.params.student_id });
    //             }
    //         }
    //         req.body = updateData;
    //         return assessment.update(req, res, next, message1, message2, query);

    //     } catch (error) {
    //         next(error);
    //     }
    // }

    static async deleteAssessmentResultOfAStudent(req, res, next) {
        try {
            let message1 = 'Assessment result not found';
            let message2 = 'Assessment result was deleted successfully';
            let query = { '_id': req.params.result_id, 'school': req.params.id, 'student': req.params.student_id };
            return await assessmentResult.deleteOne(req, res, next, message1, message2, query);
        } catch (error) {
            return next(error);
        }
    }
}

module.exports = assessmentResultController;