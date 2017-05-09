var async = require('async');

var pageQuery = function(page, pageSize, Model, populate, queryParams, select, sortParams, callback) {
    var start = (page - 1) * pageSize;
    var $page = {
        pageNumber: page
    };
    async.parallel({
        count: function(done) {
            Model.count(queryParams).exec(function(err, count) {
                done(err, count);
            });
        },
        records: function(done) {
            Model.find(queryParams, select)
                .sort(sortParams)
                .skip(start)
                .limit(pageSize)
                .populate(populate)
                .exec(function(err, doc) {
                    done(err, doc);
            });
        }
    }, function(err, results) {
        $page.count = results.count;
        $page.results = results.records;
        callback(err, $page);
    });
};

module.exports = pageQuery;