var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var packageSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    images: {
        type: Array,
        required: true
    },
    choices: [
        {
            price: Number,
            date: Date,
            total: Number,
            left: Number
        }
    ],
    days: String,
    priceDetail: String,
    departureCity: String,
    destination: String,
    features: String,
    tourDetail: String,
    precautions: String,
    comments: [{
        type: ObjectId,
        ref: 'Comment'
    }],
    state: Number
});

var Package = mongoose.model('Package', packageSchema);
module.exports = Package;