const express = require('express');
const router = express.Router();
const adminController = require('../../controllers/users/adminController');
const authHandler = require('../../controllers/authentication/authHandler');
const middlewares = require('../../controllers/middlewares');

router.use(authHandler.protect);
router.use(middlewares.checkIfUserHasVerifiedAcct);

router.get('/', adminController.getAllAdminUsers);
router.get('/:id', adminController.getAdmin);
router.patch('/:id', middlewares.confirmOwnership,
    middlewares.preventPasswordUpdate,
    adminController.updateAdmin);
router.delete('/:id', middlewares.confirmOwnership, adminController.deleteAdmin);

module.exports = router;