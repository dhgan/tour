var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var collectionSchema = new mongoose.Schema({
    userId: {
        type: ObjectId,
        ref: 'User'
    },
    packageId: {
        type: ObjectId,
        ref: 'Package'
    },
    createDate: Date
});

var Collection = mongoose.model('Collection', collectionSchema);
module.exports = Collection;