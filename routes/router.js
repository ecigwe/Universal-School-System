const { Router } = require('express');
const schools = require('./schools');
const student = require('./authentication/student');
const parent = require('./authentication/parent');
const staff = require('./authentication/staff');
const admin = require('./authentication/admin');
const payments = require('./payments/payments');
const adminUsers = require('./users/admins');
const parentRoutes = require('./users/parent');
const authHandler = require('../controllers/authentication/authHandler');
const userRoutes = require('./users/user');
const globalErrorHandler = require('../utils/errorUtils/globalErrorHandler');
const errorHandler = require('../utils/errorUtils/errorHandler');
const signToken = require('../utils/authenticationUtilities/signToken');
const attachTokenToCookie = require('../utils/authenticationUtilities/attachTokenToCookie');

const router = Router();

router.get('/', (request, response) => {
    response.status(200).json({
        status: 'success',
        message: 'The Universal School System API Has Started Successfully And Is Running Smoothly.'
    });
});

//router.use('/api/v1', users);

//Authentication
router.use('/api/v1/student', student);
router.use('/api/v1/parent', parent);
router.use('/api/v1/staff', staff);
router.use('/api/v1/admin', admin);
router.get('/api/v1/logout', authHandler.logout);
router.patch('/api/v1/update_my_password',
    authHandler.protect,
    authHandler.updateMyPassword,
    signToken,
    attachTokenToCookie);

//Plain users stuff
router.use('/api/v1/users/admins', adminUsers);
router.use('/api/v1/users/parents', parentRoutes);
router.use('/api/v1/users/me', userRoutes);
router.use('/api/v1/schools', schools);
router.use('/api/v1/payments', payments);

router.all('*', (request, response, next) => {
    return errorHandler(404, `Cannot find ${request.originalUrl} On This Server`);
});

router.use(globalErrorHandler);

module.exports = router;