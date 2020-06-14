const mongoose = require('mongoose');
const validator = require('validator');

const studentRecieptSchema = mongoose.Schema({
    fullname: {
        type: String,
        required: [true, 'Please, provide student\'s full name'],
        trim: true,
    },
    school: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true],
        ref: 'School'
    },
    school_name: {
        type: String,
        required: [true, 'Please provide student\'s school name']
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true],
        ref: 'Student'
    },
    email: {
        //Later on , emails will be sent to the payees email address
        type: String,
        required: [true, 'Please provide the email associated with your account'],
        validate: {
            validator: value => {
                return validator.isEmail(value)
            },
            message: 'Please provide a valid email address',
        },
        lowercase: true,
        trim: true
    },
    paymentFor: {
        type: String,
        required: [true, 'Please indicate what you are paying for']
    },
    class: {
        type: String,
    },
    term: {
        type: Number,
        enum: [1, 2, 3]
    },
    year: {
        type: String
    },
    amount: {
        type: Number,
        default: 0
    },
    requested_amount: {
        type: Number,
        default: 0
    },

    reference: {
        type: String
    },
    status: {
        type: String,
        default: 'null'
    },
    createdOn: {
        type: Date
    }
})

//Later on, we need to make room for preventing duplicate receipts

studentRecieptSchema.index({ school: 1 });
studentRecieptSchema.index({ student: 1 });
studentRecieptSchema.index({ year: 1 });
studentRecieptSchema.index({ term: 1 });
studentRecieptSchema.index({ class: 1 });

const StudentReciept = mongoose.model('StudentReciept', studentRecieptSchema);


module.exports = StudentReciept;