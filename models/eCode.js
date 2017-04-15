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
    expires: Date
});

var ECode = mongoose.model('eCodes', eCodeSchema);
module.exports = ECode;