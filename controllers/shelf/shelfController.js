const Helper = require('../../helper/Helper');
const Shelf = require('../../models/shelf/shelf');
const Books = require('../../models/books/books');
const shelf = new Helper(Shelf);
const errorHandler = require('../../utils/errorUtils/errorHandler');
const responseHandler = require('../../utils/responseHandler');

class shelfController {
    static async createShelf(student, next) {
        try {
            let createdOn = Date();
            const shelf = await Shelf.create({
                student: student._id,
                school: student.school,
                createdOn
            });
            return shelf;
        } catch (error) {
            next(error);
        }
    }


    static async getBooksOnShelf(req, res, next) {
        try {
            //req.user._id later, all ids will be checked to ensure that no student can access another student's shelf

            const results = await Shelf.findOne({ 'school': req.params.id, 'student': req.params.student_id })
                .select({ books: 1 }).lean();

            if (!results) {
                return errorHandler(404, 'Shelf not found');
            }
            const books = results.books.map(async id => {
                let book = await Books.findOne({ school: req.params.id, _id: id }).lean();
                return book;
            })
            const studentBooks = await Promise.all(books);
            return responseHandler(res, studentBooks, next, 200, 'Books retrieved successfully', studentBooks.length);
        } catch (error) {
            next(error);
        }
    }
    static async getABookFromShelf(req, res, next) {
        try {

            const results = await Shelf.findOne({ 'school': req.params.id, 'student': req.params.student_id })
                .select({ books: 1 }).lean();

            if (!results) {
                return errorHandler(404, 'Shelf not found');
            }
            const book = results.books.find(book => (book + '') === req.params.book_id);
            if (!book) {
                return errorHandler(404, 'Book not found on shelf');
            }
            const result = await Books.findOne({ school: req.params.id, _id: req.params.book_id }).lean();
            if (!result) {
                return errorHandler(404, 'Book does not exist');
            }
            responseHandler(res, result, next, 200, 'Book retrieved successfully', 1);
        } catch (error) {
            next(error);
        }
    }


    static async updateShelf(req, res, next) { //Function will be updated in the future to add single book
        try {
            const message1 = 'Shelf not found';
            const message2 = 'Shelf was updated successfully';

            const query = { 'school': req.params.id, 'student': req.params.student_id };
            let { books } = req.body;

            books = { $addToSet: { books: [...books] } };
            books = { ...books };

            req.body = books;
            return await shelf.update(req, res, next, message1, message2, query);
        } catch (error) {
            return next(error);
        }
    }

    static async deleteShelf(req, res, next) {
        try {
            let message1 = 'Shelf not found';
            let message2 = 'Shelf was deleted successfully';
            let query = { 'student': req.params.student_id, 'school': req.params.id };
            if (req.query.books) {
                let field = 'books' // name of field from which item is to be deleted
                message2 = 'Book was not found on this shelf';
                return await shelf.deleteArrayItem(req, res, next, message1, message2, query, field);
            }
            return await shelf.deleteOne(req, res, next, message1, message2, query);
        } catch (error) {
            return next(error);
        }
    }
}

module.exports = shelfController;