const mongoose = require('mongoose');
const validator = require('validator');

const teacherTimetableSchema = mongoose.Schema({
    staffUsername: {
        type: String,
        required: [true, 'Please input staff username for this timetable'],
        unique: true
    },
    staffCategory: {
        type: String,
        default: 'Staff',
        enum: 'Staff'
    },
    category: {
        type: String,
        default: 'Teaching',
        enum: 'Teaching'
    },
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'School'
    },
    createdOn: {
        type: Date
    },
    monday: [
        {
            class: {
                type: String,
                required: [true, 'Please provide the class to be taught within this period'],
                enum: ['Basic 1', 'Basic 2', 'Basic 3', 'SS 1', 'SS 2', 'SS 3']
            },
            subject: {
                type: String,
                required: [true, 'Please input a subject for this period.']
            },
            amountOfLectureTime: {
                type: String,
                required: [true, 'Please specify the amount of time allocated for this period'],

            },
            start: {
                type: String,
                required: [true, 'Please indicate period\'s start time'],
            },
            stop: {
                type: String,
                required: [true, 'Please indicate period\'s end time']
            }
        }
    ],
    tuesday: [
        {
            class: {
                type: String,
                required: [true, 'Please provide the class to be taught within this period'],
                enum: ['Basic 1', 'Basic 2', 'Basic 3', 'SS 1', 'SS 2', 'SS 3']
            },
            subject: {
                type: String,
                required: [true, 'Please input a subject for this period.']
            },
            amountOfLectureTime: {
                type: String,
                required: [true, 'Please specify the amount of time allocated for this period'],

            },
            start: {
                type: String,
                required: [true, 'Please indicate period\'s start time'],
            },
            stop: {
                type: String,
                required: [true, 'Please indicate period\'s end time']
            }
        }
    ],
    wednesday: [
        {
            class: {
                type: String,
                required: [true, 'Please provide the class to be taught within this period'],
                enum: ['Basic 1', 'Basic 2', 'Basic 3', 'SS 1', 'SS 2', 'SS 3']
            },
            subject: {
                type: String,
                required: [true, 'Please input a subject for this period.']
            },
            amountOfLectureTime: {
                type: String,
                required: [true, 'Please specify the amount of time allocated for this period'],

            },
            start: {
                type: String,
                required: [true, 'Please indicate period\'s start time'],
            },
            stop: {
                type: String,
                required: [true, 'Please indicate period\'s end time']
            }
        }
    ],
    thursday: [
        {
            class: {
                type: String,
                required: [true, 'Please provide the class to be taught within this period'],
                enum: ['Basic 1', 'Basic 2', 'Basic 3', 'SS 1', 'SS 2', 'SS 3']
            },
            subject: {
                type: String,
                required: [true, 'Please input a subject for this period.']
            },
            amountOfLectureTime: {
                type: String,
                required: [true, 'Please specify the amount of time allocated for this period'],

            },
            start: {
                type: String,
                required: [true, 'Please indicate period\'s start time'],
            },
            stop: {
                type: String,
                required: [true, 'Please indicate period\'s end time']
            }
        }
    ],
    friday: [
        {
            class: {
                type: String,
                required: [true, 'Please provide the class to be taught within this period'],
                enum: ['Basic 1', 'Basic 2', 'Basic 3', 'SS 1', 'SS 2', 'SS 3']
            },
            subject: {
                type: String,
                required: [true, 'Please input a subject for this period.']
            },
            amountOfLectureTime: {
                type: String,
                required: [true, 'Please specify the amount of time allocated for this period'],

            },
            start: {
                type: String,
                required: [true, 'Please indicate period\'s start time'],
            },
            stop: {
                type: String,
                required: [true, 'Please indicate period\'s end time']
            }
        }
    ]
});

teacherTimetableSchema.index({ school: 1 });
const TeacherTimetable = mongoose.model('TeacherTimetable', teacherTimetableSchema);
module.exports = TeacherTimetable;