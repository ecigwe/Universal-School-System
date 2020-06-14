const express = require('express');
const router = express.Router();
const PaymentController = require('../../controllers/payments/paymentController');
const authHandler = require('../../controllers/authentication/authHandler');
const middlewares = require('../../controllers/middlewares');

//Except for /complete, all other routes are for testing
router.use(authHandler.protect);
router.use(middlewares.checkIfUserHasVerifiedAcct);

router.post(
    '/subscription',
    PaymentController.makePayment
);

router.post(
    '/complete',
    PaymentController.verifyPayment
);

router.post(
    '/fees/schools/:id/student/:student_id',
    middlewares.checkIfSchoolStillExists,
    middlewares.restrictSchoolInformation,
    middlewares.restrictStudentData,
    PaymentController.makePayment
)
router.post(
    '/purchase/schools/:id/student/:student_id',
    middlewares.checkIfSchoolStillExists,
    middlewares.restrictSchoolInformation,
    middlewares.restrictStudentData,
    PaymentController.makePayment
)

module.exports = router;