const { Router } = require('express');
const authHandler = require('../../controllers/authentication/authHandler');
const meController = require('../../controllers/users/meController');
const middlewares = require('../../controllers/middlewares');
const studyTimetableController = require('../../controllers/timetables/studyTimetableController');
const router = Router();

router.use(authHandler.protect);

router.get('/verification_code', middlewares.sendCodeToverifyAccount);
router.post('/verify_my_account', middlewares.verifyAccount);

router.use(middlewares.checkIfUserHasVerifiedAcct);

router.route('/')
    .get(meController.getMe)
    .patch(middlewares.checkIfSchoolExists,
        middlewares.checkIfParentIsRegistered,
        middlewares.preventPasswordUpdate,
        meController.updateMe)
    .delete(meController.deleteMe);

router.post('/study_timetable', studyTimetableController.createStudyTimetable);
router.get('/study_timetable', studyTimetableController.fetchMyTimetable);
router.patch('/study_timetable', studyTimetableController.updateMyTimetable);
router.delete('/study_timetable', studyTimetableController.deleteMyTimetable);

module.exports = router;