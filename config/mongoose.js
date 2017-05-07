var mongoose = require('mongoose');
var config = require('./db_url');
var Q = require('q');
var fs = require('fs');
var path = require('path');
var logger = require('../lib/log').logger;

module.exports = function() {
    var db = mongoose.connect(config.mongodb);
    mongoose.Promise = Q.Promise;
    require('../models/eCode');
    require('../models/user');
    var Package = require('../models/package');
    var Slide = require('../models/homeSlides');


    // mock数据
    Package.find(function(err, package) {
        if(package.length) return ;
        var packages = fs.readdirSync(path.join(__dirname, '../packages/'));
        var len = packages.length;
        for(var i=0; i<len; i++) {
            var package = require(path.join(__dirname, '../packages/', packages[i]));
            new Package(package).save()
                .then(function(package) {
                    if(package.code === 'xz') {
                        new Slide({
                            url: '/#/package/' + package._id,
                            image: '/uploads/images/xz/xz.jpg'
                        }).save();
                    } else if(package.code === 'xgll') {
                        new Slide({
                            url: '/#/package/' + package._id,
                            image: '/uploads/images/xgll/xgll.jpg'
                        }).save();
                    }
                }, function(err) {
                    logger.error(err);
                });
        }

    });
    return db;
};