const mongoose = require('mongoose');

const studyTimetableSchema = mongoose.Schema({
    authorUsername: {
        type: String,
        required: [true, 'Every study timetable must have an author']
    },
    authorCategory: {
        type: String,
        required: [true, 'Every timeteble author must belong to one of the user categories'],
        default: 'Student',
        enum: ['Student', 'Staff']
    },
    category: {
        type: String,
        default: 'Study',
        enum: 'Study'
    },
    monday: [
        {
            subject: { type: String, required: [true, 'Please indicate the subject you want to study.'] },
            numOfStudyHours: { type: String, required: [true, 'Please specify the amount of time you intend to spend on studying this subject'] },
            start: { type: String, required: [true, 'Please specify your starting time'] },
            stop: { type: String, required: [true, 'Please specify your stopping time'] }
        }
    ],
    tuesday: [
        {
            subject: { type: String, required: [true, 'Please indicate the subject you want to study.'] },
            numOfStudyHours: { type: String, required: [true, 'Please specify the amount of time you intend to spend on studying this subject'] },
            start: { type: String, required: [true, 'Please specify your starting time'] },
            stop: { type: String, required: [true, 'Please specify your stopping time'] }
        }
    ],
    wednesday: [
        {
            subject: { type: String, required: [true, 'Please indicate the subject you want to study.'] },
            numOfStudyHours: { type: String, required: [true, 'Please specify the amount of time you intend to spend on studying this subject'] },
            start: { type: String, required: [true, 'Please specify your starting time'] },
            stop: { type: String, required: [true, 'Please specify your stopping time'] }
        }
    ],
    thursday: [
        {
            subject: { type: String, required: [true, 'Please indicate the subject you want to study.'] },
            numOfStudyHours: { type: String, required: [true, 'Please specify the amount of time you intend to spend on studying this subject'] },
            start: { type: String, required: [true, 'Please specify your starting time'] },
            stop: { type: String, required: [true, 'Please specify your stopping time'] }
        }
    ],
    friday: [
        {
            subject: { type: String, required: [true, 'Please indicate the subject you want to study.'] },
            numOfStudyHours: { type: String, required: [true, 'Please specify the amount of time you intend to spend on studying this subject'] },
            start: { type: String, required: [true, 'Please specify your starting time'] },
            stop: { type: String, required: [true, 'Please specify your stopping time'] }
        }
    ],
    saturday: [
        {
            subject: { type: String, required: [true, 'Please indicate the subject you want to study.'] },
            numOfStudyHours: { type: String, required: [true, 'Please specify the amount of time you intend to spend on studying this subject'] },
            start: { type: String, required: [true, 'Please specify your starting time'] },
            stop: { type: String, required: [true, 'Please specify your stopping time'] }
        }
    ],
    sunday: [
        {
            subject: { type: String, required: [true, 'Please indicate the subject you want to study.'] },
            numOfStudyHours: { type: String, required: [true, 'Please specify the amount of time you intend to spend on studying this subject'] },
            start: { type: String, required: [true, 'Please specify your starting time'] },
            stop: { type: String, required: [true, 'Please specify your stopping time'] }
        }
    ],
});

studyTimetableSchema.index({ authorUsername: 1, authorCategory: 1 }, { unique: true });

module.exports = mongoose.model('StudyTimetable', studyTimetableSchema);