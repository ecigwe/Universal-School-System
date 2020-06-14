const mongoose = require('mongoose');
const validator = require('validator');

const paymentDetailsSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please, provide a name for this school'],
        trim: true,
    },

    email: {
        //Later on , emails will be sent to the payees email address
        type: String,
        required: [true, 'Please provide the email associated with this school'],
        unique: [true, 'This email already exists!'],
        validate: {
            validator: value => {
                return validator.isEmail(value)
            },
            message: 'Please provide a valid email address',
        },
        lowercase: true,
        trim: true
    },

    amount_payable: {
        type: Number,
        required: [true, 'Please provide an amount to be payed by students as fees'],
        min: 0
    },

    SECRET_KEY: {
        type: String
    },
    school: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Please provide your school\'s id'],
        ref: 'School',
    },
    createdOn: {
        type: Date
    }
});

//Later on, we need to make room for preventing duplicate payment details

paymentDetailsSchema.index({ school: 1 });
paymentDetailsSchema.index({ email: 1 });


const PaymentDetails = mongoose.model('PaymentDetails', paymentDetailsSchema);
module.exports = PaymentDetails;