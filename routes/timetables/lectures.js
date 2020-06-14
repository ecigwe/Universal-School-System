const { Router } = require('express');
const lectureTimetableController = require('../../controllers/timetables/lectureTimetableController');
const authHandler = require('../../controllers/authentication/authHandler');
const middlewares = require('../../controllers/middlewares');
const router = Router({ mergeParams: true });

router.use(authHandler.protect);
router.use(middlewares.checkIfUserHasVerifiedAcct);

router.get('/', middlewares.checkIfSchoolStillExists,
    middlewares.checkUserRole('School-Administrator', 'Principal', 'Vice-Principal'),
    middlewares.checkConnectionWithSchool,
    lectureTimetableController.fetchAllLectureTimetables);

module.exports = router;