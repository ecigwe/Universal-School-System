const fs = require('fs');
const { promisify } = require('util');
const { google } = require('googleapis');
const credentials = require('../../credentials.json');
const mongoose = require('mongoose');

const scopes = [
    'https://www.googleapis.com/auth/drive'
];

const auth = new google.auth.JWT(
    credentials.client_email, null,
    credentials.private_key, scopes
);

const drive = google.drive({ version: "v3", auth });

const lectureSchema = mongoose.Schema({
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'School'
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Staff'
    },
    class: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Classroom'
    },
    title: {
        type: String,
        required: [true, 'Every lecture must have a title. Example: Basic Trigonometry']
    },
    description: {
        type: String,
        required: [true, 'Please give a short description of this lecture']
    },
    subject: {
        type: String,
        required: [true, 'Every lecture must be based on a particular subject. Example: Mathematics']
    },
    studyDuration: {
        type: String,
        required: [true, 'Please, specify how long you think it will take for an average student to master the contents of this lecture']
    },
    materials: [
        { type: String, required: [true, 'Please provide materials for this lecture, whether in audio, video or text document formats'] }
    ],
    linksToLearningResources: [
        { type: String }
    ]
});

lectureSchema.pre(/^findOneAndDelete/, async function (next) {
    this.lecture = await this.findOne();
    next();
});

lectureSchema.post(/^findOneAndDelete/, async function () {
    for (i = 0; i < this.lecture.materials.length; i++) {
        await drive.files.delete({ fileId: this.lecture.materials[i] });
    }
});

lectureSchema.index({ school: 1, class: 1, title: 1, subject: 1 }, { unique: true });

module.exports = mongoose.model('Lecture', lectureSchema);