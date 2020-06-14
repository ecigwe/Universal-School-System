const express = require('express');
const router = express.Router();
const resultController = require('../../controllers/assessments/assessmentResultController')
const authHandler = require('../../controllers/authentication/authHandler');
const middlewares = require('../../controllers/middlewares');

router.use(authHandler.protect);
router.use(middlewares.checkIfUserHasVerifiedAcct);

router.route('/:id/student/assessment/results')
    .post(
        middlewares.checkIfSchoolStillExists,
        middlewares.checkCategory('Staff'),
        middlewares.checkConnectionWithSchool,
        resultController.createAssessmentResult
    )
    .get(
        //Later on staff should get only the assessment results they created
        middlewares.checkIfSchoolStillExists,
        middlewares.checkCategory('Staff'),
        middlewares.checkConnectionWithSchool,
        resultController.getAllAssessmentResultsOfASchool
    )

router.route('/:id/student/:student_id/assessment/results')
    .get(
        middlewares.checkIfSchoolStillExists,
        middlewares.restrictStudentData,
        resultController.findAssessmentResultsOfAStudent
    )

router.route('/:id/student/:student_id/assessment/results/:result_id')
    .delete(
        //Later on staff should delete only the assessment results they created
        middlewares.checkIfSchoolStillExists,
        middlewares.checkCategory('Staff'),
        middlewares.checkConnectionWithSchool,
        resultController.deleteAssessmentResultOfAStudent
    )
module.exports = router;    