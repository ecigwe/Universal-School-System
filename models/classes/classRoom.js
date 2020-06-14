const mongoose = require('mongoose');
const validator = require('validator');

const classSchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please, provide a name for this class'],
        trim: true,
        unique: true
    },
    formTeacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Staff'
    },
    students: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student'
        }
    ],
    prefect: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student'
    },
    term: {
        type: Number,
        required: [true, 'Please provide term for this class'],
        enum: [1, 2, 3],
    },

    year: {
        type: String,
        required: [true, 'Please provide a year for this class'],
        validate: {
            validator: value => {
                return value.length === 4 && !isNaN(parseInt(value, 10));
            },
            message: 'Please provide a valid year for this class'
        }
    },
    population: {
        type: Number,
        required: [true, 'Please provide the population of this class'],
        min: 0
    },

    numOfBoys: {
        type: Number,
        min: 0
    },

    numOfGirls: {
        type: Number,
        min: 0
    },

    school: {
        type: mongoose.Types.ObjectId,
        ref: 'School',
        required: [true, 'Please provide a school for this class']
    },
    createdOn: {
        type: Date
    },
    lectureTimetable: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'LectureTimetable'
    }
});

classSchema.index({ title: 1, school: 1 }, {unique: true});
classSchema.index({ term: 1 });
classSchema.index({ year: 1 });


const Classroom = mongoose.model('Classroom', classSchema);
module.exports = Classroom;
