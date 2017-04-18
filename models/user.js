var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    userName: {
        type: String,
        index: true,
        unique: true,
        required: true,
        maxlength: 20
    },
    email: {
        type: String,
        required: true,
        maxlength: 30
    },
    password: {
        type: String,
        required: true,
        maxlength: 32
    },
    tel: {
        type: String,
        maxlength: 11
    },
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

var User = mongoose.model('users', userSchema);
module.exports = User;