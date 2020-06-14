const express = require('express');
const router = express.Router();
const shelfController = require('../../controllers/shelf/shelfController')
const authHandler = require('../../controllers/authentication/authHandler');
const middlewares = require('../../controllers/middlewares');

router.use(authHandler.protect);
router.use(middlewares.checkIfUserHasVerifiedAcct);

router.route('/:id/student/:student_id/shelves')
    .get(
        middlewares.checkIfSchoolStillExists,
        middlewares.restrictStudentData,
        shelfController.getBooksOnShelf
    )
    .patch(
        middlewares.checkIfSchoolStillExists,
        middlewares.restrictStudentData,
        shelfController.updateShelf
    )
    .delete(
        middlewares.checkIfSchoolStillExists,
        middlewares.restrictStudentData,
        shelfController.deleteShelf
    );

router.route('/:id/student/:student_id/shelves/:book_id')
    .get(
        middlewares.checkIfSchoolStillExists,
        middlewares.restrictStudentData,
        shelfController.getABookFromShelf
    )






module.exports = router;
