const express = require('express');
const staffController = require('../../controllers/users/staffController');
const authHandler = require('../../controllers/authentication/authHandler');
const middlewares = require('../../controllers/middlewares');

const router = express.Router({ mergeParams: true });

router.use(authHandler.protect);
router.use(middlewares.checkIfUserHasVerifiedAcct);
router.use(middlewares.checkIfSchoolStillExists);

router.get('/',
    middlewares.restrictStaffInformation,
    staffController.getAllStaffOfSchool);

router.route('/:staff_id')
    .get(middlewares.restrictStaffInformation, staffController.getStaffOfSchool)
    .patch(middlewares.restrictModificationOfStaffData,
        middlewares.preventPasswordUpdate,
        staffController.updateStaffOfSchool)
    .delete(middlewares.restrictModificationOfStaffData,
        staffController.deleteStaffOfSchool);

module.exports = router;
