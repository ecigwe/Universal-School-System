const express = require('express');
const router = express.Router();
const authHandler = require('../../controllers/authentication/authHandler');
const middlewares = require('../../controllers/middlewares');
const SchoolReciepts = require('../../models/payments/schoolReciepts');
const StudentReciepts = require('../../models/payments/studentReciepts');
const ItemReciepts = require('../../models/payments/itemReciept');
const RecieptController = require('../../controllers/payments/RecieptsController');

const schools = new RecieptController(SchoolReciepts);
const students = new RecieptController(StudentReciepts);
const items = new RecieptController(ItemReciepts);


router.use(authHandler.protect);
router.use(middlewares.checkIfUserHasVerifiedAcct);

router.get(
    '/schools/reciepts',
    middlewares.checkCategory('Admin'),
    schools.getAllReciepts
)
router.get(
    '/schools/:id/reciepts',
    middlewares.checkCategory('School-Administrator'),
    middlewares.checkConnectionWithSchool,
    schools.getReciepts
)
router.delete(
    '/schools/:id/reciepts/:reciept_id',
    middlewares.checkCategory('Admin'),
    schools.deleteReciept
)

//students
router.get(
    '/schools/:id/students/reciepts',
    middlewares.checkIfSchoolStillExists,
    middlewares.checkCategory('Staff'),
    middlewares.checkConnectionWithSchool,
    students.getAllReciepts
)
router.get(
    '/schools/:id/students/:student_id/reciepts',
    middlewares.checkIfSchoolStillExists,
    middlewares.restrictStudentData,
    students.getReciepts
)
router.delete(
    '/schools/:id/students/:student_id/reciepts/:reciept_id',
    middlewares.checkCategory('Admin'),
    students.deleteReciept
)

//items
// router.get(
//     '/schools/:id/items/reciepts',
//     items.getAllReciepts
// )
router.get(
    '/schools/:id/students/:student_id/items/reciepts',
    middlewares.checkIfSchoolStillExists,
    middlewares.restrictStudentData,
    items.getReciepts
)
router.get(
    '/schools/:id/students/:student_id/items/:item_id/reciepts',
    middlewares.checkIfSchoolStillExists,
    middlewares.restrictStudentData,
    items.getReciepts
)
router.delete(
    '/schools/:id/students/:student_id/items/reciepts/:reciept_id',
    middlewares.checkCategory('Admin'),
    items.deleteReciept
)


module.exports = router;