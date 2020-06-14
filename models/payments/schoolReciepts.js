const mongoose = require('mongoose');
const validator = require('validator');

const schoolRecieptSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please, provide a name for this school'],
        trim: true,
    },
    school: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true],
        ref: 'School'
    },
    email: {
        //Later on , emails will be sent to the payees email address
        type: String,
        required: [true, 'Please provide the registered email address of your school'],
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

schoolRecieptSchema.index({ school: 1 });
schoolRecieptSchema.index({ email: 1 });

const SchoolReciept = mongoose.model('SchoolReciept', schoolRecieptSchema);


module.exports = SchoolReciept;