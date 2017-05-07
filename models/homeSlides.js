var mongoose = require('mongoose');

var homeSlidesSchema = new mongoose.Schema({
    url: String,
    image: String
});

var HomeSlides = mongoose.model('HomeSlides', homeSlidesSchema);
module.exports = HomeSlides;