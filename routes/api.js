var express = require('express');
var router = express.Router();
var checkLogin = require('../middlewares/check.js').checkLogin;
var testLib = require('../lib/testLib');
var logger = require('../middlewares/log').logger;
var svgCaptcha = require('svg-captcha');

router.post('/checkLogin', checkLogin, function(req, res) {
	res.send(req.session.user);
});

router.post('/login', function(req, res) {
    var name = req.body.name;
    var captcha = req.body.captcha;
        sCaptcha = req.session.captcha;
    logger.debug(req.body);
    if(!captcha || !sCaptcha || sCaptcha.toLowerCase() !== captcha.toLowerCase()) {
        logger.debug('captcha error');
        res.send('captcha error');
    }

    testLib.findUserByName(name)
        .then(function (test) {
            if(!test) return res.send('no user name');
            req.session.user = test;
            res.send('has logined');
        }, function (err) {
            logger.error(err);
        });
});

router.get('/captcha', function(req, res) {
    var captcha = svgCaptcha.create({
        size: 4,
        ignoreChars: '0oli',
        color: true,
        background: '#ccc'
    });
    req.session.captcha = captcha.text;

    res.set('Content-Type', 'image/svg+xml');
    res.status(200).send(captcha.data);
});

module.exports = router;