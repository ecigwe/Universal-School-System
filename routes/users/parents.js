const { Router } = require('express');
const parentController = require('../../controllers/users/parentsController');
const authHandler = require('../../controllers/authentication/authHandler');
const middlewares = require('../../controllers/middlewares');
const router = Router({ mergeParams: true });

router.use(authHandler.protect);
router.use(middlewares.checkIfUserHasVerifiedAcct);
router.use(middlewares.checkIfSchoolStillExists);

router.get('/',
    middlewares.checkCategory('Staff'),
    middlewares.checkConnectionWithSchool,
    parentController.getAllParents);

module.exports = router;
