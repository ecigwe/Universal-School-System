const multer = require('multer');
const express = require('express');
const router = express.Router();
const bookController = require('../../controllers/books/bookController')
const authHandler = require('../../controllers/authentication/authHandler');
const middlewares = require('../../controllers/middlewares');
const AppError = require('../../utils/errorUtils/appError');
const slugify = require('slugify');

const multerStorage = multer.diskStorage({
    destination: (request, file, cb) => {
        cb(null, 'files/books');
    },
    filename: (request, file, cb) => {
        const ext = file.mimetype.split('/')[1];
        cb(null, `book-${slugify(request.book.title, { lower: true })}-${request.book.school}-${Date.now()}.${ext}`);
    }
});

const multerFilter = (request, file, cb) => {
    if (file.mimetype.startsWith('application')) {
        cb(null, true);
    } else {
        cb(new AppError('Please only pdf documents are allowed.', 400), false)
    }
}

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
});

router.use(authHandler.protect);
router.use(middlewares.checkIfUserHasVerifiedAcct);

router.route('/:id/books')
    .post(middlewares.checkIfSchoolStillExists,
        middlewares.checkCategory('Staff'),
        middlewares.checkConnectionWithSchool,
        bookController.createBook
    )
    .get(middlewares.checkIfSchoolStillExists,
        middlewares.restrictSchoolInformation,
        bookController.getAllBooksForASpecificSchool
    );

router.route('/:id/books/:book_id')
    .get(middlewares.checkIfSchoolStillExists,
        middlewares.restrictSchoolInformation,
        bookController.findOne
    )
    .patch(
        middlewares.checkIfSchoolStillExists,
        middlewares.checkCategory('Staff'),
        middlewares.checkConnectionWithSchool,
        bookController.findBook,
        upload.single('bookUrl'),
        bookController.updateBookOfASpecificSchool
    )
    .delete(
        middlewares.checkIfSchoolStillExists,
        middlewares.checkCategory('Staff'),
        middlewares.checkConnectionWithSchool,
        bookController.deleteBookOfASpecificSchool
    );

router.get('/:id/books/:book_id/download',
    middlewares.checkIfSchoolStillExists,
    middlewares.restrictSchoolInformation,
    bookController.findBook,
    bookController.downloadBook);


module.exports = router;
