const express = require('express');
const router = express.Router();
const assessmentController = require('../../controllers/assessments/assessmentController')
const authHandler = require('../../controllers/authentication/authHandler');
const middlewares = require('../../controllers/middlewares');

router.use(authHandler.protect);
router.use(middlewares.checkIfUserHasVerifiedAcct);

router.route('/:id/assessments')
    .post(middlewares.checkIfSchoolStillExists,
        middlewares.checkCategory('Staff'),
        middlewares.checkConnectionWithSchool,
        assessmentController.createAssessment
    )
    //Later on staff can have access only to assessments they created
    //Later on, students should have access to only their own assessments on a specified condition
    //Later on School Admins can have access even if they did not create the assessments.
    .get(middlewares.checkIfSchoolStillExists,
        middlewares.restrictSchoolInformation,
        assessmentController.getAllAssessmentsOfASpecificSchool
    );

router.route('/:id/assessments/:assessment_id')
    .get(middlewares.checkIfSchoolStillExists,
        middlewares.restrictSchoolInformation,
        assessmentController.findOneAssessmentOfASpecificSchool
    )
    //Later on, staff should be able to modify and delete the assessments that they created.
    .patch(
        middlewares.checkIfSchoolStillExists,
        middlewares.checkCategory('Staff'),
        middlewares.checkConnectionWithSchool,
        assessmentController.updateAssessmentOfASpecificSchool
    )
    .delete(
        middlewares.checkIfSchoolStillExists,
        middlewares.checkCategory('Staff'),
        middlewares.checkConnectionWithSchool,
        assessmentController.deleteAssessmentOfASpecificSchool
    );


module.exports = router;
