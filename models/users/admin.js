const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
//const User = require('./user');

const adminSchema = mongoose.Schema({
    fullname: {
        type: String,
        required: [true, 'Please Provide Your Full Name'],
        trim: true
    },
    email: {
        type: String,
        //required: [true, 'Please provide us with your email address'],
        unique: [true, 'This email already exists!'],
        validate: [validator.isEmail, 'Please provide us with a valid email address'],
        lowercase: true
    },
    username: {
        type: String,
        required: [true, 'Please enter a username'],
        unique: [true, 'This username already exists!'],
    },
    phoneNumber: {
        type: String,
        required: [true, 'Please provide us with your phone number'],
        unique: [true, 'This phone number already exists!'],
        minlength: [14, 'Your phone number must consist of 14 characters'],
        maxlength: [14, 'Your phone number must consist of 14 characters']
    },
    isAnAdmin: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        default: 'admin',
        enum: ['admin', 'backend-developer', 'mobile-developer', 'designer', 'manager']
    },
    category: {
        type: String,
        default: 'Admin',
        enum: 'Admin'
    },
    password: {
        type: String,
        required: [true, 'Please enter a password'],
        minlength: [8, 'Your password must consist of at least 8 characters'],
        select: false
    },
    confirmPassword: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
            validator: function (value) {
                return value === this.password;
            },
            message: 'Passwords do not match'
        }
    },
    passwordChangedAt: { type: Date },
    ResetToken: String,
    ResetExpires: Date,
    verified: {
        type: Boolean,
        default: false
    }
});

adminSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    this.confirmPassword = undefined;
    next();
});

adminSchema.pre('save', function (next) {
    if (!this.isModified('password') || this.isNew) return next();

    this.passwordChangedAt = Date.now() - 1500;
    next();
});

// adminSchema.pre('save', async function (next) {
//     const username = this.username;
//     const category = this.category;
//     const phoneNumber = this.phoneNumber;
//     const passwordResetToken = this.passwordResetToken;
//     const passwordResetExpires = this.passwordResetExpires;
//     const email = this.email;
//     const role = this.role;
//     const _id = this._id;
//     if (this.isNew) {
//         await User.create({
//             username,
//             category,
//             role,
//             _id,
//             email,
//             phoneNumber,
//             passwordResetToken,
//             passwordResetExpires
//         });
//     }
//     next();
// });

adminSchema.methods.crosscheckPassword = async function (enteredPlainPassword, encryptedPasswordInDb) {
    return await bcrypt.compare(enteredPlainPassword, encryptedPasswordInDb);
}

adminSchema.methods.passwordChangedAfterIssuingOfToken = function (TokenIssuedAt) {
    if (this.passwordChangedAt) {
        const TimeOfPasswordChange = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        return TokenIssuedAt < TimeOfPasswordChange;
    }
    return false;
}

adminSchema.methods.createResetToken = function () {
    const resetToken = crypto.randomBytes(3).toString('hex');

    this.ResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.ResetExpires = Date.now() + (1000 * 60 * 5); //Reset token expires in 5 minutes

    return resetToken;
}

module.exports = mongoose.model('Admin', adminSchema);