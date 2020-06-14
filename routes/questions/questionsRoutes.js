const express = require('express');
const router = express.Router();
const questionController = require('../../controllers/questions/questionController');
const authHandler = require('../../controllers/authentication/authHandler');
const middlewares = require('../../controllers/middlewares');

router.use(authHandler.protect);
router.use(middlewares.checkIfUserHasVerifiedAcct);

router.route('/:id/questions')
    .post(middlewares.checkIfSchoolStillExists,
        middlewares.checkCategory('Staff'),
        middlewares.checkConnectionWithSchool,
        questionController.createQuestion
    )
    //Later on students will be granted access only on a specified condition
    .get(middlewares.checkIfSchoolStillExists,
        middlewares.restrictSchoolInformation,
        questionController.getAllQuestionsForASpecificSchool
    );

//Later on students will be granted access only on a specified condition
router.route('/:id/questions/:question_id')
    .get(middlewares.checkIfSchoolStillExists,
        middlewares.restrictSchoolInformation,
        questionController.findOneQuestionOfASpecificSchool
    )
    //Later on, staff will be able to modify and delete only the questions that they created.
    .patch(middlewares.checkIfSchoolStillExists,
        middlewares.checkCategory('Staff'),
        middlewares.checkConnectionWithSchool,
        questionController.updateQuestionOfASpecificSchool
    )
    .delete(middlewares.checkIfSchoolStillExists,
        middlewares.checkCategory('Staff'),
        middlewares.checkConnectionWithSchool,
        questionController.deleteQuestionOfASpecificSchool
    );


module.exports = router;