const Helper = require('../../helper/Helper');
const request = require('request');
const SchoolReciept = require('../../models/payments/schoolReciepts');
const StudentReciept = require('../../models/payments/studentReciepts');
const ItemReciept = require('../../models/payments/itemReciept');
const Reference = require('../../models/paymentReferenceCodes/referenceCodes');
const Books = require('../../models/books/books');
const payment = require('../../helper/payments')(request);
const paystack = require('../../helper/verifyPayment');
const errorHandler = require('../../utils/errorUtils/errorHandler');
const responseHandler = require('../../utils/responseHandler');
const School = require('../../models/school/school');
const Student = require('../../models/users/student');
const paymentDetails = require('../../models/payments/paymentDetails');
const { initializePayment } = payment;

class PaymentController {

    static async makePayment(req, res, next) {  // function will be deleted before production
        try {
            let secret;
            let { email, amount, paymentFor } = req.body;
            let data = {};
            paymentFor = paymentFor ? paymentFor.trim() : '';

            if (paymentFor === 'Subscription') {
                const school = await School.findOne({ 'email': req.body.email.trim().toLowerCase() });

                secret = 'Bearer ' + process.env.PAYSTACK_SECRET;;
                let amount = parseFloat(process.env.SUBSCRIPTION_AMOUNT) * 100;
                let metadata = {
                    paymentFor,
                    email: req.body.email,
                    name: school.name,
                    school: school._id + '',
                };


                data = { metadata, email, amount }

            } else if (paymentFor === 'Fees') {
                console.log('Here')
                const [accountDetails, student] = await Promise.all([paymentDetails.findOne({ 'school': req.params.id }).lean(),
                Student.findOne({ '_id': req.params.student_id, 'school': req.params.id }).lean()]);
                console.log(accountDetails)

                if (!student) {
                    return errorHandler(404, 'This student does not exist');
                }
                if (!accountDetails || (accountDetails && !accountDetails.SECRET_KEY)) {
                    return errorHandler(404, 'Cannot find your school\'s account details');
                }

                secret = 'Bearer ' + accountDetails.SECRET_KEY;
                let amount = parseFloat(200) * 100;
                let metadata = {
                    paymentFor,
                    email: req.body.email,
                    school_name: req.body.school_name,
                    id: req.body.id + '',
                    term: req.body.term,
                    class: req.body.class
                };

                data = { metadata, email, amount }
            } else {
                const [accountDetails, student] = await Promise.all([paymentDetails.findOne({ 'school': req.params.id }).lean(),
                Student.findOne({ 'school': req.params.id, '_id': req.params.student_id }).lean()]);

                if (!student) {
                    return errorHandler(404, 'This student does not exist');
                }

                if (!accountDetails || (accountDetails && !accountDetails.SECRET_KEY)) {
                    return errorHandler(404, 'Cannot find your school\'s account details');
                }
                const recieptData = {
                    school: req.params.id,
                    student: req.params.student_id,
                    email: req.body.email,
                    paymentFor: req.body.itemName,
                    itemId: req.body.itemId + '',
                    createdOn: Date()
                };


                secret = 'Bearer ' + accountDetails.SECRET_KEY;
                let amount = parseFloat(15000) * 100;
                let metadata = {
                    itemId: `${req.body.itemId}`,
                    email: req.body.email,
                    id: req.body.id,
                    itemCategory: req.body.itemCategory,
                    itemName: req.body.itemName,
                };

                data = { metadata, email, amount }
            }

            initializePayment(data, secret, (error, body) => {
                if (error) {
                    return errorHandler(500, 'There was a problem initiating your transaction');
                }

                const response = JSON.parse(body);
                console.log(response);
                res.redirect(response.data.authorization_url);
            });


        } catch (error) {
            next(error);
        }
    }

    static async verifyPayment(req, res, next) {
        try {
            const refCode = await Reference.findOne({ 'reference': req.query.reference.trim() }).lean()
            if (refCode) {
                return errorHandler(403, 'This payment reference code has already been used.');
            }
            const types = ['Subscription']
            const ref = req.query.reference;
            let secret = 'Bearer ' + process.env.PAYSTACK_SECRET;
            let fees;
            // Later in production, we should test if reference codes are tied to specific API secret.
            if (!types.includes(req.body.paymentFor)) {
                const accountDetails = await paymentDetails.findOne({ 'school': req.body.school }).lean();

                if (!accountDetails || (accountDetails && !accountDetails.SECRET_KEY)) {
                    return errorHandler(404, 'Cannot find your school\'s account details');
                }
                fees = accountDetails.amount_payable;
                secret = 'Bearer ' + accountDetails.SECRET_KEY;
            }

            const response = await paystack.verifyPayment(ref, secret, next);
            const verified = response.data;

            if (verified.data && verified.data.status === 'success') {

                await Reference.create({
                    reference: ref.trim(),
                    createdOn: Date()
                });
                return PaymentController.saveReciept(res, next, verified, fees)

            } else {
                const message = verified.data ? verified.data.gateway_response : verified.message;
                return responseHandler(res, null, next, 200, message, 1);
            }
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    static async saveReciept(res, next, response, fees = null) {
        try {
            const { requested_amount, status, reference, amount } = response.data;
            let cur = { status, reference, amount, requested_amount };
            const { id, itemId, school, email, paymentFor, name, school_name, itemCategory, term, class: cls } = response.data.metadata

            if (paymentFor === 'Subscription') {
                if (amount < (process.env.SUBSCRIPTION_AMOUNT * 100)) {
                    return errorHandler(403, 'Your payment is below the subscription amount');
                }
                let exSchool = await School.findOne({ 'email': email.trim().toLowerCase() });
                const recieptData = { name: exSchool.name, school: school, email, paymentFor, createdOn: Date(), ...cur };
                exSchool.isSubscribed = true;
                const [updatedSchool, newReciept] = await Promise.all([
                    exSchool.save({ validateBeforeSave: false }),
                    SchoolReciept.create({
                        ...recieptData
                    })]);
                if (!updatedSchool) {
                    errorHandler(404, 'School not found');
                }

                return responseHandler(res, newReciept, next, 200, response.data.gateway_response, 1);

            } else if (paymentFor === 'Fees') {
                if (amount < (fees * 100)) {
                    return errorHandler(403, 'Your payment is below the fees required by your school. Please contact your school administration');
                }
                const student = await Student.findOne({ '_id': id }).lean();
                if (!student) return errorHandler(404, 'Student not found')

                const recieptData = {
                    fullname: student.fullname, school: student.school, email, school_name, paymentFor, student: id, term,
                    year: new Date().getFullYear(), class: cls, createdOn: Date(), ...cur
                }

                const newReciept = await StudentReciept.create({
                    ...recieptData
                });
                return responseHandler(res, newReciept, next, 200, response.data.gateway_response, 1);

            } else {
                const itemCategories = { Books: Books };
                let price;

                if (itemCategory) {
                    const item = await itemCategories[itemCategory].findOne({ '_id': itemId }).select({ 'price': 1 }).lean();
                    price = item.price;
                }
                
                if (price && amount < (price * 100)) {
                    return errorHandler(403, 'Amount paid is below price of item');
                }
                const { itemName: paymentFor } = response.data.metadata;
                const student = await Student.findOne({ '_id': id }).lean();


                const recieptData = { school: student.school, student: id, email, paymentFor, itemId, createdOn: Date(), ...cur };

                const newReciept = await ItemReciept.create({
                    ...recieptData
                });
                return responseHandler(res, newReciept, next, 200, response.data.gateway_response, 1);

            }

        } catch (error) {
            next(error);
        }
    }
}

module.exports = PaymentController;