const Helper = require('../../helper/Helper');
const errorHandler = require('../../utils/errorUtils/errorHandler');
const responseHandler = require('../../utils/responseHandler');
const request = require('request');
const payment = require('../../helper/payments')(request);
const School = require('../../models/school/school');
const PaymentDetails = require('../../models/payments/paymentDetails');
const payment_details = new Helper(PaymentDetails);


class PaymentDetailsController {
    static async createPaymentDetails(req, res, next) {
        try {
            req.body.school = req.params.id;
            req.body.createdOn = Date();
            const paymentInfo = await PaymentDetails.create({
                ...req.body
            })
            return responseHandler(res, paymentInfo, next, 201, 'Payment details created successfully', 1);
        } catch (error) {
            console.log(error)
            next(error);
        }
    }

    static async getAllSchoolsPaymentDetails(req, res, next) {
        try {
            const message = 'Payment details retrieved successfully';
            const query = {};
            return await payment_details.findAll(req, res, next, message, query);
        } catch (error) {
            return next(error);
        }
    }

    static async getASchoolPaymentDetails(req, res, next) {
        try {
            const message1 = 'The payment details you are looking for has not been created';
            const message2 = 'Payment details retrieved successfully';
            const query = { 'school': req.params.id };
            return await payment_details.findOne(req, res, next, message1, message2, query);
        } catch (error) {
            return next(error);
        }
    }

    static async updatePaymentDetails(req, res, next) {
        try {
            const message1 = 'The payment details you are looking for has not been created';
            const message2 = 'Payment details was updated successfully';
            const query = { 'school': req.params.id };
            const { createdOn, recipient_code, ...updateData } = req.body;
            req.body = updateData;
            return await payment_details.update(req, res, next, message1, message2, query);
        } catch (error) {
            return next(error);
        }
    }

    static async deletePaymentDetails(req, res, next) {
        try {
            const message1 = 'Payment details not found';
            const message2 = 'Payment details was deleted successfully';
            const query = { 'school': req.params.id };
            return await payment_details.deleteOne(req, res, next, message1, message2, query);
        } catch (error) {
            return next(error);
        }
    }
}

module.exports = PaymentDetailsController;