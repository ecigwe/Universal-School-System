const School = require('../models/school/school');
const Parent = require('../models/users/parent');
const Student = require('../models/users/student');
const catchAsyncError = require('../utils/errorUtils/catchAsyncError');
const errorHandler = require('../utils/errorUtils/errorHandler');

exports.checkIfSchoolExists = catchAsyncError(async (request, response, next) => {
    const { schoolName, schoolAddress } = request.body;
    if (!schoolName || !schoolAddress) return next(); /* return errorHandler(400, 'Please provide the correct name and address of your school');*/

    const school = await School.findOne({ name: schoolName, address: schoolAddress });
    if (!school) return errorHandler(400, 'Your school is not yet registered on this platform.');

    request.body.school = school._id;
    return next();
});

exports.checkIfParentIsRegistered = catchAsyncError(async (request, response, next) => {
    const { parentPhoneNumber } = request.body;
    if (!parentPhoneNumber) return next(); /*return errorHandler(400, 'Please give us the phone number of a parent or guardian that is registered on this platform');*/
    const parent = await Parent.findOne({ phoneNumber: "+234" + parentPhoneNumber });
    if (!parent) return errorHandler(400, 'Please give us the phone number of a parent or guardian that is registered on this platform');
    request.body.parent = parent._id;
    return next();
});

exports.checkIfSchoolStillExists = catchAsyncError(async (request, response, next) => {
    //check if school exists and return an error if it does not exist
    const school = await School.findById(request.params.id);
    if (!school) return errorHandler(404, 'We could not find the information you requested.');
    return next();
});

exports.checkUserRole = (...roles) => {
    return (request, response, next) => {
        if (request.user.category === 'Admin') return next();

        if (!roles.includes(request.user.role)) {
            return errorHandler(403, 'You are forbidden from performing this action.');
        }
        return next();
    }
}

exports.checkConnectionWithSchool = (request, response, next) => {
    if (request.user.category === 'Admin') return next();

    if (!request.user.school.equals(request.params.id)) {
        return errorHandler(403, 'You are forbidden from performing this action.');
    }
    return next();
}

exports.checkCategory = (...category) => {
    return (request, response, next) => {
        if (request.user.category === 'Admin') return next();

        if (!category.includes(request.user.category)) {
            return errorHandler(403, 'You are forbidden from performing this action.');
        }
        return next();
    }
}

exports.restrictStudentData = catchAsyncError(async (request, response, next) => {
    //Restricts the information of a student to the student, his or her parent and staff of the student school
    const student = await Student.findById(request.params.student_id);
    if (request.user.category === 'Admin' ||
        (request.user.category === 'Staff' && request.user.school.equals(request.params.id)) ||
        (request.user.category === 'Parent' && request.user._id.equals(student.parent)) ||
        (request.user.category === 'Student' && request.user._id.equals(student._id))) {
        request.student = student;
        return next();
    }
    return errorHandler(403, 'You are forbidden from performing this action');
});

exports.confirmOwnership = (request, response, next) => {
    if (request.user.category === 'Admin') return next();

    if (request.user._id.equals(request.params.id)) return next();
    return errorHandler(403, 'You are forbidden from performing this action.');
}

exports.restrictParentData = catchAsyncError(async (request, response, next) => {
    const parentChildren = await Student.find({ parent: request.params.id });
    let childrenSchools = [];

    for (i = 0; i < parentChildren.length; i++) {
        childrenSchools.push(JSON.stringify(parentChildren[i].school));
    }

    if (request.user.category === 'Admin' ||
        (request.user.category === 'Parent' && request.user._id.equals(request.params.id)) ||
        (request.user.category === 'Student' && request.user.parent.equals(request.params.id)) ||
        (request.user.category === 'Staff' && childrenSchools.includes(JSON.stringify(request.user.school)))
    ) {
        return next();
    }
    return errorHandler(403, 'You are forbidden from performing this action.');
});

exports.restrictStaffInformation = catchAsyncError(async (request, response, next) => {
    let parentChildren;
    let childrenSchools = [];

    if (request.user.category === 'Parent') {
        parentChildren = await Student.find({ parent: request.user._id });
        for (i = 0; i < parentChildren.length; i++) {
            childrenSchools.push(JSON.stringify(parentChildren[i].school));
        }
    }

    if (request.user.category === 'Admin' ||
        (request.user.category === 'Staff' && request.user.school.equals(request.params.id)) ||
        (request.user.category === 'Student' && request.user.school.equals(request.params.id)) ||
        (request.user.category === 'Parent' && childrenSchools.includes(JSON.stringify(request.params.id)))
    ) {
        return next();
    }
    return errorHandler(403, 'You are forbidden from performing this action.');
});

exports.restrictModificationOfStaffData = (request, response, next) => {
    if (request.user.category === 'Admin') return next();

    if (request.user._id.equals(request.params.staff_id)) return next();
    return errorHandler(403, 'You are forbidden from performing this action.');
}

exports.restrictSchoolInformation = catchAsyncError(async (request, response, next) => {
    if (request.user.category === 'Admin') return next();

    let parentChildren;
    let childrenSchools = [];

    if (request.user.category === 'Parent') {
        parentChildren = await Student.find({ parent: request.user._id });
        for (i = 0; i < parentChildren.length; i++) {
            childrenSchools.push(JSON.stringify(parentChildren[i].school));
        }
    }

    if (
        (request.user.category === 'Student' && request.user.school.equals(request.params.id)) ||
        (request.user.category === 'Staff' && request.user.school.equals(request.params.id)) ||
        (request.user.category === 'Parent' && childrenSchools.includes(JSON.stringify(request.params.id)))
    ) {
        return next();
    }

    return errorHandler(403, 'You are forbidden from performing this action.');
});

exports.preventPasswordUpdate = (request, response, next) => {
    if (request.body.password || request.body.confirmPassword) {
        return errorHandler('400', 'You can\'t update a password here. Please go to the section designated for updating passwords.');
    }
    next();
}