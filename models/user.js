var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    userName: {
        type: String,
        index: true,
        unique: true,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    tel: String,
    createDate: {
        type: Date,
        required: true
    },
    state: {
        type: Number,
        enum: [-2, -1, 0],
        default: 0
    },
    comments: [mongoose.Schema.Types.ObjectId],
    collections: [mongoose.Schema.Types.ObjectId]

});

var user = mongoose.model('user', userSchema);
module.exports = user;