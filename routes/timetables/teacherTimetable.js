const { Router } = require('express');
const TeacherTimetableController = require('../../controllers/timetables/TeacherTimetableController');
const authHandler = require('../../controllers/authentication/authHandler');
const middlewares = require('../../controllers/middlewares');
const router = Router({ mergeParams: true });

router.use(authHandler.protect);
router.use(middlewares.checkIfUserHasVerifiedAcct);

router.route('/')
    .post(
        middlewares.checkIfSchoolStillExists,
        middlewares.checkCategory('Staff'),
        middlewares.checkConnectionWithSchool,
        TeacherTimetableController.createTimetable
    )
    .get(
        middlewares.checkIfSchoolStillExists,
        middlewares.checkUserRole('School-Administrator'),
        middlewares.checkConnectionWithSchool,
        TeacherTimetableController.getAllTeachersTimetables
    );

//Later on staff will be able to interact with only their own teaching timetable
router.route('/staff/:staff_username')
    .get(
        middlewares.checkIfSchoolStillExists,
        middlewares.checkCategory('Staff'),
        middlewares.checkConnectionWithSchool,
        TeacherTimetableController.findOne
    )
    .patch(
        middlewares.checkIfSchoolStillExists,
        middlewares.checkCategory('Staff'),
        middlewares.checkConnectionWithSchool,
        TeacherTimetableController.updateTeacherTimetable
    )
    .delete(
        middlewares.checkIfSchoolStillExists,
        middlewares.checkCategory('Staff'),
        middlewares.checkConnectionWithSchool,
        TeacherTimetableController.deleteTeacherTimetable
    );

module.exports = router;
