const School = require('../models/school/school');
const Parent = require('../models/users/parent');
const catchAsyncError = require('../utils/errorUtils/catchAsyncError');
const errorHandler = require('../utils/errorUtils/errorHandler');

exports.checkIfSchoolExists = catchAsyncError(async (request, response, next) => {
    const { schoolName, schoolAddress } = request.body;
    if (!schoolName || !schoolAddress) return errorHandler(400, 'Please provide the correct name and address of your school');

    const school = await School.findOne({ name: schoolName, address: schoolAddress });
    if (!school) return errorHandler(400, 'Your school is not yet registered on this platform.');

    request.school = school;
    return next();
});

exports.checkIfParentIsRegistered = catchAsyncError(async (request, response, next) => {
    const { parentUsername } = request.body;
    if (!parentUsername) return errorHandler(400, 'Please tell us the username of a parent or guardian that is registered on this platform');
    const parent = await Parent.findOne({ username: parentUsername });
    if (!parent) return errorHandler(400, 'Please tell us the username of a parent or guardian that is registered on this platform');
    request.parent = parent;
    return next();
});