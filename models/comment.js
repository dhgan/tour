var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var commentSchema = new mongoose.Schema({
    user: {
        type: ObjectId,
        ref: 'User'
    },
    package: {
        type: ObjectId,
        ref: 'Package'
    },
    star: Number,
    content: String,
    createDate: Date
});

var Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;