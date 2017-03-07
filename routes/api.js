var express = require('express');
var router = express.Router();
var checkLogin = require('../middlewares/check.js').checkLogin;
var testLib = require('../lib/testLib');
var logger = require('../middlewares/log').logger;

router.post('/checkLogin', checkLogin, function(req, res) {
	res.send(req.session.user);
});

router.post('/login', function(req, res) {
    var name = req.body.name;
    logger.debug(req.body);
    testLib.findUserByName(name)
        .then(function (test) {
            if(!test) return res.send('no user name');
            req.session.user = test;
            res.send('has logined');
        }, function (err) {
            logger.error(err);
        });
});

module.exports = router;