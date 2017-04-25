var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');


/* GET admin page. */
router.get('/admin', function(req, res) {
    res.render('admin/index');
});

router.get(/^\/admin((\/\w+)+)(?:\.html)$/, function(req, res) {
    var page = req.params[0];
    if(fs.existsSync(path.resolve(__dirname, '../views/admin'+ page +'.html'))) {
        res.render('admin' + page);
    } else {
        res.sendStatus(404);
    }
});

/* GET tourist page. */
router.get('/', function(req, res) {
    res.render('tourist/index');
});

router.get(/^((\/\w+)+)(?:\.html)$/, function(req, res) {
    var page = req.params[0];
    if(fs.existsSync(path.resolve(__dirname, '../views/tourist'+ page +'.html'))) {
        res.render('tourist' + page, {
            userInfo: req.session.user
        });
    } else {
        res.sendStatus(404);
    }
});

module.exports = router;