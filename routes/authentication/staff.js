const express = require('express');
const staff = require('../../controllers/authentication/staff');
const signToken = require('../../utils/authenticationUtilities/signToken');
const attachTokenToCookie = require('../../utils/authenticationUtilities/attachTokenToCookie');
const middlewares = require('../../controllers/middlewares');

const router = express.Router();

router.post('/register', middlewares.checkIfSchoolExists, staff.register, signToken, attachTokenToCookie);
router.post('/login', staff.login, signToken, attachTokenToCookie);
router.post('/forgot_password', staff.forgotPassword);
router.patch('/reset_password', staff.resetPassword, signToken, attachTokenToCookie);

module.exports = router;