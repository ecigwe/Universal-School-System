const mongoose = require('mongoose');
const validator = require('validator');

const schoolSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'School name is required'],
        minlength: [3, 'School name must be between 3 and 100 characters'],
        maxlength: [100, 'School name must be between 3 and 100 characters'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Provide a valid email address'],
        validate: [validator.isEmail, 'Provide a valid email address'],
        unique: true
    },

    admin: {
        type: String,
        required: [true, 'Every school must have an administrator.'],
        unique: true
    },

    population: {
        type: Number,
        required: [true, 'School population is required'],
        min: 100
    },

    registeredOn: {
        type: Date
    },

    address: {
        type: String,
        required: [true, 'School address is required in full, including the city and state.'],
        minlength: [5, 'School name must be between 5 and 150 characters'],
        maxlength: [150, 'School name must be between 5 and 150 characters'],

    },
    phoneNumber: {
        type: String,
        required: [true, 'Please provide a phone number'],
        validate: {
            validator: value => validator.isMobilePhone(value, 'en-NG', { strictMode: true }),
            message: 'Please provide a valid phone number'
        },
        unique: true
    },

    imageUrl: {
        type: String,
        validate: [validator.isURL, 'Please provide a valid url']
    },

    isSubscribed: {
        type: Boolean,
        required: true,
        default: false
    }

});

schoolSchema.index({ name: 1, address: 1 }, { unique: true });

const School = mongoose.model('School', schoolSchema);


module.exports = School;