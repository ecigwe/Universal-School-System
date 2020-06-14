const mongoose = require('mongoose');
const validator = require('validator');

const recordSchema = mongoose.Schema({
    class: {
        type: String,
        required: [true, 'Please provide a class for this record']
    },
    term: {
        type: Number,
        required: [true, 'Please indicate which school term this record belongs to'],
        enum: [1, 2, 3]
    },

    year: {
        type: String,
        validate: {
            validator: value => {
                return value.length === 4 && !isNaN(parseInt(value, 10));
            },
            message: 'Please provide a valid year for this record'
        }
    },

    student: {
        type: mongoose.Types.ObjectId,
        required: [true, 'Please provide the id of student who owns this record'],
        ref: 'Student'
    },
    school: {
        type: mongoose.Types.ObjectId,
        required: [true, 'Please provide a school for this record'],
        ref: 'School'
    },
    createdOn: {
        type: Date
    },
    english: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },

    mathematics: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },
    government: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },
    englishliterature: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },
    physics: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },
    geography: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },
    agriculturalscience: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },
    economics: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },
    basicscience: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },
    biology: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },
    civic: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },
    basictechnology: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },
    socialstudies: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },
    computerscience: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },
    chemistry: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    }
});

//Later on, we need to make room for preventing duplicate student records

recordSchema.index({ class: 1 });
recordSchema.index({ term: 1 });
recordSchema.index({ year: 1 });
recordSchema.index({ student: 1 });
recordSchema.index({ school: 1 });

const StudentRecord = mongoose.model('StudentRecord', recordSchema);
module.exports = StudentRecord;