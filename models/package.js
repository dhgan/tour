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
    code: {
        type: String,
        index: true
    },
    sold: {
        type: Number,
        default: 0
    },
    state: Number
});

packageSchema.methods.getMinPrice = function() {
    var choices  = this.choices,
        minPrice = choices[0].price;

    for(var i=choices.length-1; i>0; i--) {
        if(minPrice > choices[i].price) {
            minPrice = choices[i].price;
        }
    }

    return minPrice;
};

var Package = mongoose.model('Package', packageSchema);

module.exports = Package;