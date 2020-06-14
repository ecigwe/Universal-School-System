const mongoose = require('mongoose');

const lectureTimetableSchema = mongoose.Schema({
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'School'
    },
    class: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Classroom'
    },
    form_teacher: {
        type: mongoose.Schema.Types.ObjectId,
        required: 'Staff'
    },
    class_prefect: {
        type: mongoose.Schema.Types.ObjectId,
        required: 'Student'
    },
    category: {
        type: String,
        default: 'Lecture',
        enum: 'Lecture'
    },
    monday: [
        {
            subject: { type: String, required: [true, 'Please indicate the subject to be taught.'] },
            amountOfLectureTime: { type: String, required: [true, 'Please specify the amount of time that will be spent on lecturing this subject'] },
            start: { type: String, required: [true, 'Please specify when the lecture will start'] },
            stop: { type: String, required: [true, 'Please specify when the lecture will stop'] },
            tutor: { type: String, required: [true, 'Every subject must have a tutor. Please enter the username of the tutor.'] } //username
        }
    ],
    tuesday: [
        {
            subject: { type: String, required: [true, 'Please indicate the subject to be taught.'] },
            amountOfLectureTime: { type: String, required: [true, 'Please specify the amount of time that will be spent on lecturing this subject'] },
            start: { type: String, required: [true, 'Please specify when the lecture will start'] },
            stop: { type: String, required: [true, 'Please specify when the lecture will stop'] },
            tutor: { type: String, required: [true, 'Every subject must have a tutor. Please enter the username of the tutor.'] } //username
        }
    ],
    wednesday: [
        {
            subject: { type: String, required: [true, 'Please indicate the subject to be taught.'] },
            amountOfLectureTime: { type: String, required: [true, 'Please specify the amount of time that will be spent on lecturing this subject'] },
            start: { type: String, required: [true, 'Please specify when the lecture will start'] },
            stop: { type: String, required: [true, 'Please specify when the lecture will stop'] },
            tutor: { type: String, required: [true, 'Every subject must have a tutor. Please enter the username of the tutor.'] } //username
        }
    ],
    thursday: [
        {
            subject: { type: String, required: [true, 'Please indicate the subject to be taught.'] },
            amountOfLectureTime: { type: String, required: [true, 'Please specify the amount of time that will be spent on lecturing this subject'] },
            start: { type: String, required: [true, 'Please specify when the lecture will start'] },
            stop: { type: String, required: [true, 'Please specify when the lecture will stop'] },
            tutor: { type: String, required: [true, 'Every subject must have a tutor. Please enter the username of the tutor.'] } //username
        }
    ],
    friday: [
        {
            subject: { type: String, required: [true, 'Please indicate the subject to be taught.'] },
            amountOfLectureTime: { type: String, required: [true, 'Please specify the amount of time that will be spent on lecturing this subject'] },
            start: { type: String, required: [true, 'Please specify when the lecture will start'] },
            stop: { type: String, required: [true, 'Please specify when the lecture will stop'] },
            tutor: { type: String, required: [true, 'Every subject must have a tutor. Please enter the username of the tutor.'] } //username
        }
    ]
});

lectureTimetableSchema.index({ school: 1, class: 1 }, { unique: true });

module.exports = mongoose.model('LectureTimetable', lectureTimetableSchema);