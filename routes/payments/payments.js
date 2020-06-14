const express = require('express');
const router = express.Router();
const paymentDetails = require('./paymentDetailRoutes');
const paymentVerification = require('./paymentRoute');
const recipets = require('./reciepts');

router.use(paymentDetails);
router.use(paymentVerification);
router.use(recipets);

module.exports = router;