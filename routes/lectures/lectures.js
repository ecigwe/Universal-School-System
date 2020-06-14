const { Router } = require('express');
const lectureController = require('../../controllers/lectures/lectureController');
const authHandler = require('../../controllers/authentication/authHandler');
const middlewares = require('../../controllers/middlewares');
const router = Router({ mergeParams: true });

router.use(authHandler.protect);
router.use(middlewares.checkIfUserHasVerifiedAcct);

router.route('/')
    .post(
        middlewares.checkIfSchoolStillExists,
        middlewares.checkIfClassStillExists,
        middlewares.checkCategory('Staff'),
        middlewares.checkConnectionWithSchool,
        middlewares.teachesTheSubjectToClass,
        lectureController.createLecture
    )
    .get(middlewares.checkIfSchoolExists,
        middlewares.checkIfClassStillExists,
        middlewares.restrictSchoolInformation,
        middlewares.accessLectureNotes,
        lectureController.fetchAllLecturesForClass
    );

router.route('/:lecture_id')
    .get(middlewares.checkIfSchoolStillExists,
        middlewares.checkIfClassStillExists,
        middlewares.restrictSchoolInformation,
        middlewares.accessLectureNotes,
        lectureController.fetchOneLectureForClass
    )
    .patch(
        middlewares.checkIfSchoolStillExists,
        middlewares.checkIfClassStillExists,
        middlewares.checkCategory('Staff'),
        middlewares.checkConnectionWithSchool,
        middlewares.findLecture,
        middlewares.teachesTheSubjectToClass,
        lectureController.uploadLectureFiles,
        lectureController.updateOneLectureForClass
    )
    .delete(
        middlewares.checkIfSchoolStillExists,
        middlewares.checkIfClassStillExists,
        middlewares.checkCategory('Staff'),
        middlewares.checkConnectionWithSchool,
        middlewares.findLecture,
        middlewares.teachesTheSubjectToClass,
        lectureController.deleteLecture
    );

router.route('/:lecture_id/resource/:name')
    .delete(
        middlewares.checkIfSchoolStillExists,
        middlewares.checkIfClassStillExists,
        middlewares.checkCategory('Staff'),
        middlewares.checkConnectionWithSchool,
        middlewares.findLecture,
        middlewares.teachesTheSubjectToClass,
        lectureController.deleteLectureResource
    )
    .get(
        middlewares.checkIfSchoolStillExists,
        middlewares.checkIfClassStillExists,
        middlewares.restrictSchoolInformation,
        middlewares.accessLectureNotes,
        lectureController.downloadLectureResource
    );

module.exports = router;