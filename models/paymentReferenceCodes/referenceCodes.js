const mongoose = require('mongoose');

const refSchema = mongoose.Schema({
    reference: {
        type: String,
        required: [true]
    },

    createdOn: {
        type: Date,
    }
});

refSchema.index({ reference: 1 }, { unique: true });

const Reference = mongoose.model('Reference', refSchema);


module.exports = Reference;