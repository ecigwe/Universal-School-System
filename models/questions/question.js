const mongoose = require('mongoose');
const validator = require('validator');

const questionSchema = mongoose.Schema({
    subject: {
        type: String,
        required: [true, 'Please provide a subject for this question'],
        minlength: [3, 'Subject must be between 3 and 50 characters'],
        maxlength: [50, 'Subject must be between 3 and 50 characters'],
        trim: true
    },
    class: {
        type: String,
        required: [true, 'Please provide a class for this question'],
        enum: ['Basic1', 'Basic2', 'Basic3', 'SS1', 'SS2', 'SS3'],
        trim: true
    },
    category: {
        type: String,
        required: [true, 'Please provide a category for this question'],
        enum: ['Exam', 'Quiz', 'Classwork', 'Assignment'],
        trim: true
    },
    question: {
        type: String,
        required: [true, 'Please enter a question']
    },
    options: {
        type: {
            a: {
                type: String,
                required: [true, 'Provide option a']

            },
            b: {
                type: String,
                required: [true, 'Provide option b']
            },
            c: {
                type: String,
                required: [true, 'Provide option c']
            },
            d: {
                type: String,
                required: [true, 'Provide option d']
            }
        }
    },
    answer: {
        type: String,
        required: [true, 'Please provide an answer for this question']
    },
    points: {
        type: Number,
        required: [true, 'Please provide the number of points for this question'],
        min: 0
    },
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'School',
        required: [true, 'Please provide a school that owns this question']
    },
    createdOn: {
        type: Date
    }
});

//Later on, we need to make room for preventing duplicate questions

questionSchema.index({ school: 1 });
questionSchema.index({ subject: 1 });
questionSchema.index({ class: 1 });
questionSchema.index({ category: 1 });

const Question = mongoose.model('Question', questionSchema);
module.exports = Question;
