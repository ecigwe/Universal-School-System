const express = require('express');
const student = require('../../controllers/authentication/student');
const signToken = require('../../utils/authenticationUtilities/signToken');
const attachTokenToCookie = require('../../utils/authenticationUtilities/attachTokenToCookie');
const middlewares = require('../../controllers/middlewares');

const router = express.Router();

router.post('/register',
    middlewares.provideSchoolDetails,
    middlewares.checkIfSchoolExists,
    //middlewares.checkIfParentIsRegistered,
    student.register,
    signToken,
    attachTokenToCookie);

router.post('/login',
    student.login,
    signToken,
    attachTokenToCookie);

router.post('/forgot_password', student.forgotPassword);
router.patch('/reset_password', student.resetPassword, signToken, attachTokenToCookie)

module.exports = router;