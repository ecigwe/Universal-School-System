const express = require('express');
const router = express.Router();
const adminController = require('../../controllers/users/adminController');

router.get('/', adminController.getAllAdminUsers);
router.get('/:id', adminController.getAdmin);

module.exports = router;