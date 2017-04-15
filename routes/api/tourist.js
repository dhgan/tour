var express = require('express');
var router = express.Router();
var checkLogin = require('../../middlewares/check.js').checkLogin;
var testLib = require('../../lib/testLib');
var logger = require('../../lib/log').logger;
var qqEmail = require('../../lib/qqEmail');
var wyEmail = require('../../lib/wyEmail');
var User = require('../../models/user');
var ECode = require('../../models/eCode');

router.post('/checkLogin', checkLogin, function (req, res) {
    res.send(req.session.user);
});

router.post('/login', function (req, res) {
    var name = req.body.name;
    var captcha = req.body.captcha;
    sCaptcha = req.session.captcha;
    logger.debug(req.body);
    /*if(!captcha || !sCaptcha || sCaptcha.toLowerCase() !== captcha.toLowerCase()) {
     logger.debug('captcha error');
     res.send('captcha error');
     }*/

    User.findOne({name: name})
        .exec()
        .then(function (test) {
            console.log(test);
        }, function (err) {
            console.log(err)
        });

    /*testLib.findUserByName(name)
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
     });*/
});

router.post('/register', function (req, res) {
    var rbody = req.body;
    userName = rbody.userName;
    email = rbody.email;
    eCode = rbody.eCode;
    password = rbody.password;

    logger.debug(rbody);

    // 用户名为空
    if (!userName || !email || !password || !eCode) {
        return res.json({
            status: '800'
        });
    }

    // 邮箱格式错误
    var emailReg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/i;
    if (!emailReg.test(email)) {
        return res.json({
            status: '300'
        });
    }

    User.findOne({userName: userName}).exec()
        .then(function (user) {
            // 用户名已存在
            if (user) {
                return res.json({
                    status: '400'
                })
            }

            ECode.findOne({email: email, eType: '100'}).exec()
                .then(function (ecode) {
                    logger.debug(ecode);

                    // 邮箱验证码错误
                    if (!ecode || ecode.eCode !== eCode) {
                        return res.json({
                            status: '600'
                        });
                    }

                    // 邮箱验证码过期
                    if (new Date(ecode.expires) < new Date()) {
                        return res.json({
                            status: '601'
                        });
                    }


                    user = new User({
                        userName: userName,
                        email: email,
                        password: password,
                        createDate: new Date()
                    });

                    user.save()
                        .then(function () {
                            res.json({
                                status: '200'
                            });
                        }, function (error) {
                            logger.debug(error);
                            return res.json({
                                status: '500'
                            });
                        });


                }, function (err) {
                    logger.error(err);
                    return res.json({
                        status: '500'
                    });
                });
        }, function (err) {
            logger.error(err);
            return res.json({
                status: '500'
            });
        });
});

module.exports = router;