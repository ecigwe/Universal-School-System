const mongoose = require('mongoose');
const validator = require('validator');

const itemRecieptSchema = mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true],
        ref: 'Student'
    },
    school: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true],
        ref: 'School'
    },

    email: {
        //Later on , emails will be sent to the payees email address
        type: String,
        required: [true, 'Please provide the email address associated with your account'],
        validate: [validator.isEmail, 'Please provide a valid email address'],
        lowercase: true,
        trim: true
    },
    paymentFor: {
        type: String,
        required: [true, 'Please indicate what you are paying for']
    },
    itemId: {
        type: mongoose.Schema.Types.ObjectId
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

itemRecieptSchema.index({ school: 1 });
itemRecieptSchema.index({ student: 1 });

const ItemReciept = mongoose.model('ItemReciept', itemRecieptSchema);


module.exports = ItemReciept;