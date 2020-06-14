const express = require('express');
const router = express.Router();
const recordController = require('../../controllers/records/studentRecordsController')
const authHandler = require('../../controllers/authentication/authHandler');
const middlewares = require('../../controllers/middlewares');

router.use(authHandler.protect);
router.use(middlewares.checkIfUserHasVerifiedAcct);


router.route('/:id/student/records')
    .get(
        middlewares.checkIfSchoolStillExists,
        //School admins and form teachers are the only staff that should see the records of their students
        middlewares.checkCategory('Staff'),
        middlewares.checkConnectionWithSchool,
        recordController.getAllStudentRecordsForAspecificSchool
    );
router.route('/:id/student/:student_id/records')
    .get(
        middlewares.checkIfSchoolStillExists,
        middlewares.restrictStudentData,
        recordController.getAllStudentRecordsForAspecificSchool
    );
router.route('/:id/student/:student_id/records/:record_id')
    .patch(
        //Only the school admin and the student's form teacher should have this ability
        middlewares.checkIfSchoolStillExists,
        middlewares.checkUserRole('Staff'),
        middlewares.checkConnectionWithSchool,
        recordController.updateAStudentRecord
    )
    .delete(
        middlewares.checkIfSchoolStillExists,
        middlewares.checkUserRole('School-Administrator'),
        middlewares.checkConnectionWithSchool,
        recordController.deleteAStudentRecord
    );


module.exports = router;