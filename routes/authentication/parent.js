const express = require('express');
const parent = require('../../controllers/authentication/parent');
const signToken = require('../../utils/authenticationUtilities/signToken');
const attachTokenToCookie = require('../../utils/authenticationUtilities/attachTokenToCookie');
const router = express.Router();

router.post('/register', parent.register, signToken, attachTokenToCookie);
router.post('/login', parent.login, signToken, attachTokenToCookie);
router.post('/forgot_password', parent.forgotPassword);
router.patch('/reset_password', parent.resetPassword, signToken, attachTokenToCookie);

module.exports = router;