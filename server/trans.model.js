const mongoose = require('mongoose');

const TransSchema = mongoose.Schema({

    uid: {
        type: String,
        required: true,
        unique: true,
    },

    filePath: {
        type: String,
        required: true
    },

    hash: {
        type: String,
        required: true,
        unique: true
    }

});

module.exports = mongoose.model('Trans', TransSchema);