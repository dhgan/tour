var mongoose = require('mongoose');
var config = require('./db_url');

module.exports = function() {
    var db = mongoose.connect(config.mongodb);
    require('../models/test.js');

    // mock数据
    var Test = require('../models/test.js');
    Test.find(function(err, test) {
        if(test.length) return ;
        new Test({
            name: 'gdh',
            sex: 'man'
        }).save();

        new Test({
            name: 'yj',
            sex: 'woman'
        }).save();
    });
    return db;
};