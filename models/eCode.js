var mongoose = require('mongoose');

var eCodeSchema = new mongoose.Schema({
    email: {
        type: String,
        index: true,
        required: true
    },
    eType: {
        type: String,
        enum: ['100']
    },
    eCode: String,
    expired: Date
});

var eCode = mongoose.model('eCode', eCodeSchema);
module.exports = eCode;