// So I think we have been writing too much findbyid and findanddelete
const errorHandler = require('../utils/errorUtils/errorHandler');
const responseHandler = require('../utils/responseHandler');



class Helper {
    constructor(collection) {
        this.collection = collection;
    }

    async create(req, res, next, message = 'Created successfuly') {
        try {

            const data = new this.collection({
                ...req.body
            });
            const result = await data.save();

            return responseHandler(res, result,
                next, 201, message, 1);
        } catch (error) {
            next(error);
        }
    }

    async findAll(req, res, next, message, query = {}, exclude = {}, limit = null, offset = null) {
        try {
            const result = await this.collection.find(query).select(exclude).lean();
            return responseHandler(res, result, next, 200, message, result.length);
        } catch (error) {
            next(error);
        }
    }

    async findOne(req, res, next, message1, message2, query = {}, exclude = {}) {
        try {
            const result = await this.collection.findOne(query).select(exclude).lean();
            if (!result) {
                errorHandler(404, message1)
            }
            return responseHandler(res, result, next, 200, message2, 1);
        } catch (error) {
            next(error);
        }
    }

    async findById(req, res, next, message1, message2) {
        try {
            const result = await this.collection.findById(id).lean();
            if (!result) {
                errorHandler(404, message1)
            }
            return responseHandler(res, result, next, 200, message2, 1);
        } catch (error) {
            next(error);
        }
    }

    async update(req, res, next, message1, message2, query = {}, exclude) {
        try {
            const updatedData = await this.collection.findOneAndUpdate(query, req.body, {
                new: true,
                runValidators: false
            }).select(exclude).lean();
            if (!updatedData) return errorHandler(404, message1);
            return responseHandler(res, updatedData, next, 200, message2, 1);
        } catch (error) {
            next(error);
        }

    }

    async deleteOne(req, res, next, message1, message2, query = {}) {
        try {
            const result = await this.collection.findOneAndDelete(query).lean();
            if (!result) {
                return errorHandler(404, message1);
            }
            return responseHandler(res, null, next, 204, message2, 1);
        } catch (error) {
            next(error);
        }
    }

    async deleteArrayItem(req, res, next, message1, message2, query, field) {
        try {
            const document = await this.collection.findOne(query);
            if (!document) return errorHandler(404, message1);

            let num = document[field].indexOf(req.query[field]);
            if (num < 0) return errorHandler(404, message2);
            document[field].splice(num, 1);

            await document.save();

            responseHandler(res, null, next, 204, 'Deleted successfuly', 1)
        } catch (error) {
            next(error);
        }
    }
}

module.exports = Helper;