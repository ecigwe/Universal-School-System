const express = require('express');
const router = express.Router();
const PaymentDetailsController = require('../../controllers/payments/paymentDetailsController');
const authHandler = require('../../controllers/authentication/authHandler');
const middlewares = require('../../controllers/middlewares');

router.use(authHandler.protect);
router.use(middlewares.checkIfUserHasVerifiedAcct);

router.route('/schools/:id/account_details')
    .post(
        middlewares.checkIfSchoolStillExists,
        middlewares.checkUserRole('School-Administrator'),
        middlewares.checkConnectionWithSchool,
        PaymentDetailsController.createPaymentDetails
    )
    .get(
        middlewares.checkIfSchoolStillExists,
        middlewares.checkUserRole('School-Administrator'),
        middlewares.checkConnectionWithSchool,
        PaymentDetailsController.getASchoolPaymentDetails
    )
    .patch(
        middlewares.checkIfSchoolStillExists,
        middlewares.checkUserRole('School-Administrator'),
        middlewares.checkConnectionWithSchool,
        PaymentDetailsController.updatePaymentDetails

    )

    .delete(
        middlewares.checkIfSchoolStillExists,
        middlewares.checkUserRole('School-Administrator'),
        middlewares.checkConnectionWithSchool,
        PaymentDetailsController.deletePaymentDetails
    )

router.route('/schools/account_details')
    .get(
        middlewares.checkCategory('Admin'),
        PaymentDetailsController.getAllSchoolsPaymentDetails
    );

module.exports = router;