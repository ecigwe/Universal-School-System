const mongoose = require('mongoose');
const validator = require('validator');

const assessmentSchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a title for this assessment']
    },

    subject: {
        type: String,
        required: [true, 'Please provide a subject for this assessment'],
        minlength: [3, 'Subject must be between 3 and 50 characters'],
        maxlength: [50, 'Subject must be between 3 and 50 characters'],
        trim: true
    },
    class: {
        type: String,
        required: [true, 'Please provide a class for this assessment'],
        enum: ['Basic1', 'Basic2', 'Basic3', 'SS1', 'SS2', 'SS3'],
        trim: true
    },
    term: {
        type: Number,
        required: [true, 'Please provide a term which this assessment is associated with'],
        enum: [1, 2, 3],
        trim: true
    },

    year: {
        type: String,
        required: [true, 'Please provide assessment year'],
        validate: {
            validator: value => {
                return value.length === 4 && !isNaN(parseInt(value, 10));
            },
            message: 'Please provide a valid year for this assessment'
        }
    },
    category: {
        type: String,
        required: [true, 'Please provide a category for this assessment'],
        enum: ['Exam', 'Quiz', 'Classwork', 'Assignment'],
        trim: true
    },

    questions: {
        type: [mongoose.Types.ObjectId],
    },

    percentage: {
        type: Number,
        required: [true, 'Please provide the percentage this assessment contributes to students\' CA '],
        min: 0
    },
    school: {
        type: mongoose.Types.ObjectId,
        ref: 'School',
        required: [true, 'Please provide a school that owns this assessment']
    },
    createdOn: {
        type: Date
    }
});


assessmentSchema.index({ school: 1 });
assessmentSchema.index({ subject: 1 });
assessmentSchema.index({ class: 1 });
assessmentSchema.index({ category: 1 });
assessmentSchema.index({ term: 1 });
assessmentSchema.index({ year: 1 });


const Assessment = mongoose.model('Assessment', assessmentSchema);
module.exports = Assessment;