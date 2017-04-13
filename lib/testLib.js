var Test = require('../models/test');
var logger = require('./log').logger;
var Q = require('q');

module.exports = {
    findUserByName: function(name, callback) {
        var defer = Q.defer();
        Test.findOne({name: name}, function (err, test) {
            if(err) {
                defer.reject(err);
            } else {
                defer.resolve(test);
            }
        });
        return defer.promise;
    }
};