const fs = require('fs');
const path = require('path');
const mime = require('node-mime');
const { google } = require('googleapis');
const credentials = require('../../credentials.json');
const { promisify } = require('util');
const multer = require('multer');
const slugify = require('slugify');
const Lecture = require('../../models/lectures/lecture');
const catchAsyncError = require('../../utils/errorUtils/catchAsyncError');
const errorHandler = require('../../utils/errorUtils/errorHandler');
const responseHandler = require('../../utils/responseHandler');
const AppError = require('../../utils/errorUtils/appError');

const multerStorage = multer.diskStorage({
    destination: (request, file, cb) => {
        cb(null, 'files/lectures');
    },
    filename: (request, file, cb) => {
        const ext = file.mimetype.split('/')[1];
        cb(null, `lecture-${slugify(request.lecture.subject, { lower: true })}-${slugify(request.lecture.title, { lower: true })}-${request.user.username}-${Date.now()}.${ext}`);
    }
});

const multerFilter = (request, file, cb) => {
    if (file.mimetype.startsWith('audio') ||
        file.mimetype.startsWith('video') ||
        file.mimetype.startsWith('application')) {
        cb(null, true);
    } else {
        cb(new AppError('Please upload only a video file or an audio file or an application file', 400), false)
    }
}

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
});

exports.uploadLectureFiles = upload.array('materials', 10);

const scopes = [
    'https://www.googleapis.com/auth/drive'
];

const auth = new google.auth.JWT(
    credentials.client_email, null,
    credentials.private_key, scopes
);

const drive = google.drive({ version: "v3", auth });

//drive.files.list({}).then(res => res.data.files.map(file => console.log(file.id)));

async function uploadLectureResources(pathToFile, filename, mimeType) {
    const fileMetadata = {
        'name': filename
    }

    const media = {
        mimeType,
        body: fs.createReadStream(pathToFile)
    }

    const uploadedLectureResource = await drive.files.create({
        resource: fileMetadata,
        media: media,
        fields: 'id'
    });

    const unlink = promisify(fs.unlink);
    await unlink(pathToFile);

    return uploadedLectureResource.data;
}

exports.createLecture = catchAsyncError(async (request, response, next) => {
    request.body.school = request.params.id;
    request.body.class = request.params.class_id;
    request.body.teacher = request.user._id;

    const lecture = await Lecture.create(request.body);
    return responseHandler(response, lecture, next, 201, 'Lecture Created Successfully', 1);
});

exports.fetchAllLecturesForClass = catchAsyncError(async (request, response, next) => {
    let query = request.query || { class: request.params.class_id };

    const lectures = await Lecture.find(query);

    if (request.query && !lectures.length) return errorHandler(404, 'Your Search Query Does Not Match Any Entries!');

    return responseHandler(response, lectures, next, 200, 'Successfully retrieved all the lectures for your class', lectures.length);
});

exports.fetchOneLectureForClass = catchAsyncError(async (request, response, next) => {
    const lecture = await Lecture.findById(request.params.lecture_id);
    if (!lecture) return errorHandler(404, 'We could not find the information you requested.');
    return responseHandler(response, lecture, next, 200, 'Successfully retrieved the lecture you requested', 1);
});

exports.updateOneLectureForClass = catchAsyncError(async (request, response, next) => {
    request.body.materials = request.lecture.materials;
    if (request.files) {
        for (i = 0; i < request.files.length; i++) {
            let uploadedLectureResourceData = await uploadLectureResources(`${__dirname}/../../../Univeral-School-System/files/lectures/${request.files[i].filename}`, request.files[i].filename, request.files[i].mimeType);
            request.body.materials.push(uploadedLectureResourceData.id);
        }
    }

    request.body.teacher = request.user._id;
    const updatedLecture = await Lecture.findByIdAndUpdate(request.params.lecture_id, request.body, {
        new: true,
        runValidators: true
    });

    if (!updatedLecture) return errorHandler(404, 'We could not find the data you want to update.');

    return responseHandler(response, updatedLecture, next, 200, 'Lecture successfully updated', 1);
});

exports.deleteLecture = catchAsyncError(async (request, response, next) => {
    const deletedLecture = await Lecture.findByIdAndDelete(request.params.lecture_id);

    if (!deletedLecture) return errorHandler(404, 'We could not find the data you want to delete.');

    return responseHandler(response, deletedLecture, next, 204, 'Lecture successfully deleted', 1);
});

exports.deleteLectureResource = catchAsyncError(async (request, response, next) => {
    for (i = 0; i < request.lecture.materials.length; i++) {
        if (request.lecture.materials[i] === request.params.name) {
            request.lecture.materials.splice(i, 1);
            await request.lecture.save({ validateBeforeSave: false });
            await drive.files.delete({ fileId: request.params.name });

            return response.status(200).json({
                status: 'success',
                message: 'Lecture resource successfully deleted.'
            });
        }
    }

    return errorHandler(404, 'The resource you want to delete does not exist.')
});

exports.downloadLectureResource = catchAsyncError(async (request, response, next) => {
    //Later on, a more efficient method will be implemented. 
    //Currently, we are looping through potentially all the existing uploaded files
    const lectures = await drive.files.list({});
    const lectureFiles = lectures.data.files;

    let lectureFile;
    for (i = 0; i < lectureFiles.length; i++) {
        if (lectureFiles[i].id === request.params.name) {
            lectureFile = lectureFiles[i];
            i = lectureFiles.length;
        }
    }

    const result = await drive.files.get({
        fileId: request.params.name,
        alt: 'media'
    }, { responseType: 'stream' });

    response.setHeader('Content-disposition', 'attachment; filename=' + lectureFile.name);
    response.setHeader('Content-type', lectureFile.mimeType);

    result.data.pipe(response);
});