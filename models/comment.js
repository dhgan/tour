var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var commentSchema = new mongoose.Schema({

});

var Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;