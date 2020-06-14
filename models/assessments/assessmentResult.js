const mongoose = require('mongoose');
const validator = require('validator');

const resultSchema = mongoose.Schema({
    subject: {
        type: String,
        required: [true, 'Please provide a subject for this assessment result'],
        minlength: [3, 'Subject must be between 3 and 50 characters'],
        maxlength: [50, 'Subject must be between 3 and 50 characters'],
        trim: true
    },
    class: {
        type: String,
        required: [true, 'Please provide a class for this assessment result'],
        enum: ['Basic1', 'Basic2', 'Basic3', 'SS1', 'SS2', 'SS3'],
        trim: true
    },
    term: {
        type: Number,
        required: [true, 'Please provide a term which this assessment result is associated with'],
        enum: [1, 2, 3],
        trim: true
    },

    year: {
        type: String,
        required: [true, 'Please provide assessment result year'],
        validate: {
            validator: value => {
                return value.length === 4 && !isNaN(parseInt(value, 10));
            },
            message: 'Please provide a valid year for this assessment result'
        }
    },
    category: {
        type: String,
        required: [true, 'Please provide a category for this assessment result'],
        enum: ['Exam', 'Quiz', 'Classwork', 'Assignment'],
        trim: true
    },

    student: {
        type: mongoose.Types.ObjectId,
        required: [true, 'Please provide an student id for this result'],
        ref: 'Studnet'
    },

    score: {
        type: Number,
        required: [true, 'Please provide the student\'s score in percentage for this assessment'],
        min: 0,
        max: 100
    },
    school: {
        type: mongoose.Types.ObjectId,
        ref: 'School',
        required: [true, 'Please provide a school that owns this assessment result']
    },
    isCA: {
        type: Boolean,
        required: [true, 'Please indicate if this result should be added to student\'s continuous assessment records']
    },
    createdOn: {
        type: Date
    }
});

//Later on, we need to make room for preventing duplicate assessments results

resultSchema.index({ school: 1 });
resultSchema.index({ subject: 1 });
resultSchema.index({ class: 1 });
resultSchema.index({ student: 1 });
resultSchema.index({ term: 1 });
resultSchema.index({ year: 1 });
resultSchema.index({ category: 1 });


const AssessmentResult = mongoose.model('AssessmentResult', resultSchema);
module.exports = AssessmentResult;
