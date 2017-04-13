var express = require('express');
var router = express.Router();
var checkLogin = require('../../middlewares/check.js').checkLogin;
var testLib = require('../../lib/testLib');
var logger = require('../../lib/log').logger;
var qqEmail = require('../../lib/qqEmail');
var wyEmail = require('../../lib/wyEmail');

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
            qqEmail.send({
                to: '321566223@qq.com',
                subject: '你好',
                text: '你好，好久不见',
                html: '<h3>你好，好久不见</h3>'
            });
        }, function (err) {
            logger.error(err);
        });
});

module.exports = router;