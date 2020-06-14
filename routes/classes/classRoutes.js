const express = require('express');
const router = express.Router();
const classController = require('../../controllers/classes/classController');
const lectureTimetableController = require('../../controllers/timetables/lectureTimetableController');
const authHandler = require('../../controllers/authentication/authHandler');
const middlewares = require('../../controllers/middlewares');
const lectureRoutes = require('../lectures/lectures');

router.use('/:id/classes/:class_id/lectures', lectureRoutes);

router.use(authHandler.protect);
router.use(middlewares.checkIfUserHasVerifiedAcct);

//Classroom routes
router.route('/:id/classes')
    .post(middlewares.checkIfSchoolStillExists,
        middlewares.checkUserRole('School-Administrator', 'Principal', 'Vice-Principal'),
        middlewares.checkConnectionWithSchool,
        classController.createClass
    )
    .get(middlewares.checkIfSchoolStillExists,
        middlewares.checkUserRole('School-Administrator', 'Principal', 'Vice-Principal'),
        middlewares.checkConnectionWithSchool,
        classController.getAllClassesOfASpecificSchool
    );

router.route('/:id/classes/:class_id')
    .get(middlewares.checkIfSchoolStillExists,
        middlewares.restrictSchoolInformation,
        middlewares.checkIfClassStillExists,
        middlewares.restrictClassInformation,
        classController.findAClassOfASpecificSchool
    )
    .patch(middlewares.checkIfSchoolStillExists,
        middlewares.checkUserRole('School-Administrator', 'Principal', 'Vice-Principal', 'Form-Teacher'),
        middlewares.checkConnectionWithSchool,
        middlewares.checkIfClassStillExists,
        middlewares.restrictClassInformation,
        classController.updateClassOfASpecificSchool
    )
    .delete(middlewares.checkIfSchoolStillExists,
        middlewares.checkUserRole('School-Administrator', 'Principal', 'Vice-Principal'),
        middlewares.checkConnectionWithSchool,
        middlewares.checkIfClassStillExists,
        classController.deleteClassOfASpecificSchool
    );

//Lecture Timetables For Classrooms
router.post('/:id/classes/:class_id/lecture_timetable',
    middlewares.checkIfSchoolStillExists,
    middlewares.checkUserRole('School-Administrator', 'Principal', 'Vice-Principal', 'Form-Teacher'),
    middlewares.checkConnectionWithSchool,
    middlewares.checkIfClassStillExists,
    middlewares.restrictClassInformation,
    lectureTimetableController.createLectureTimetable);

router.route('/:id/classes/:class_id/lecture_timetable')
    .get(middlewares.checkIfSchoolStillExists,
        middlewares.restrictSchoolInformation,
        middlewares.checkIfClassStillExists,
        middlewares.restrictClassInformation,
        lectureTimetableController.fetchLectureTimetableForSingleClass)
    .patch(middlewares.checkIfSchoolExists,
        middlewares.checkUserRole('School-Administrator', 'Principal', 'Vice-Principal', 'Form-Teacher'),
        middlewares.checkConnectionWithSchool,
        middlewares.checkIfClassStillExists,
        middlewares.restrictClassInformation,
        lectureTimetableController.updateClassLectureTimetable)
    .delete(middlewares.checkIfSchoolExists,
        middlewares.checkUserRole('School-Administrator', 'Principal', 'Vice-Principal', 'Form-Teacher'),
        middlewares.checkConnectionWithSchool,
        middlewares.checkIfClassStillExists,
        middlewares.restrictClassInformation,
        lectureTimetableController.deleteClassLectureTimetable);

module.exports = router;
