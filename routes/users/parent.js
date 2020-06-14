const { Router } = require('express');
const parentController = require('../../controllers/users/parentsController');
const authHandler = require('../../controllers/authentication/authHandler');
const middlewares = require('../../controllers/middlewares');
const router = Router();

router.use(authHandler.protect);
router.use(middlewares.checkIfUserHasVerifiedAcct);

router.route('/:id')
    .get(middlewares.restrictParentData, parentController.getParent)
    .patch(middlewares.confirmOwnership,
        middlewares.preventPasswordUpdate,
        parentController.updateParent)
    .delete(middlewares.confirmOwnership, parentController.deleteParent);

module.exports = router;