var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var collectionSchema = new mongoose.Schema({
    user: {
        type: ObjectId,
        ref: 'User'
    },
    package: {
        type: ObjectId,
        ref: 'Package'
    },
    createDate: Date
});

var Collection = mongoose.model('Collection', collectionSchema);
module.exports = Collection;