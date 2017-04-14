var mongoose = require('mongoose');
var config = require('./db_url');

module.exports = function() {
    var db = mongoose.connect(config.mongodb);
    require('../models/test');
    require('../models/eCode');
    require('../models/user');

    // mock数据
    var Test = require('../models/test');
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