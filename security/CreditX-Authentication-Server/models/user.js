const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//User model schema definition.
const UserSchema = new Schema({

    username: {
        type: String
    },
    password: {
        type: String
    },
    publicKey: {
        type: String
    },
    privateKey: {
        type: String
    },
    url: {
        type: String
    },
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    email: {
        type: String
    },


});

const User = mongoose.model('User', UserSchema);

module.exports.User = User;