const Helper = require('../../helper/Helper');

class RecieptsController {
    constructor(collection) {
        this.collection = new Helper(collection);
        this.getAllReciepts = this.getAllReciepts.bind(this);
        this.getReciepts = this.getReciepts.bind(this);
        this.deleteReciept = this.deleteReciept.bind(this);
    }

    async getReciepts(req, res, next) {
        try {

            const message = 'Reciepts retrieved successfully';

            const cls = req.query.class ? { 'class': req.query.class } : {};
            const term = req.query.term ? { 'term': req.query.term } : {};
            const year = req.query.year ? { 'year': req.query.year } : {};
            const student = req.params.student_id ? { 'student': req.params.student_id } : {};
            const item = req.params.item_id ? { '_id': req.params.item_id } : {};

            let query = { 'school': req.params.id, ...item, ...student, ...term, ...year, ...cls };

            return await this.collection.findAll(req, res, next, message, query);
        } catch (error) {
            next(error);
        }
    }
    async getAllReciepts(req, res, next) {
        try {
            console.log(this.collection)
            const message = 'Reciepts retrieved successfully';
            const school = req.params.id ? { 'school': req.params.id } : {};
            let query = { ...school };
            return await this.collection.findAll(req, res, next, message, query);

        } catch (error) {
            next(error);
        }
    }
    async deleteReciept(req, res, next) {
        try {
            let message1 = 'Reciept not found';
            let message2 = 'Reciept was deleted successfully';
            const student = req.params.student_id ? { 'student': req.params.student_id } : {};

            let query = { '_id': req.params.reciept_id, 'school': req.params.id, ...student };
            return await this.collection.deleteOne(req, res, next, message1, message2, query);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = RecieptsController;