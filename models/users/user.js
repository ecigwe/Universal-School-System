const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Every user registering on this platform must have a unique username'],
        unique: true
    },
    email: {
        type: String,
        required: [true, 'Every user registering on this platform must have a unique email address'],
        unique: true
    },
    category: {
        type: String,
        required: [true, 'Every user must belong to a category. You could be an admin or a student or a staff or a parent']
    },
    phoneNumber: {
        type: String,
        required: [true, 'Every user registering on this platform must have a unique phone number'],
        unique: true
    },
    passwordResetToken: String,
    passwordResetExpires: String,
    role: String
});

module.exports = mongoose.model('User', userSchema);