var express = require('express');
var router = express.Router();
var testLib = require('../../lib/testLib');
var logger = require('../../lib/log').logger;
var svgCaptcha = require('svg-captcha');
var ECode = require('../../models/eCode');
var qqEmail = require('../../lib/qqEmail');
var _ = require('lodash');

router.get('/captcha', function (req, res) {
    var captcha = svgCaptcha.create({
        size: 4,
        ignoreChars: '01o1iIOL',
        color: true,
        background: '#ccc'
    });

    req.session.captcha = captcha.text;

    res.set('Content-Type', 'image/svg+xml');
    res.status(200).send(captcha.data);
});

router.post('/getECode', function (req, res) {
    var email = req.body.email,
        eType = req.body.eType;

    logger.debug(req.body);

    // 存在参数为空
    if (!eType || !email) {
        return res.json({
            status: 800
        });
    }

    // 邮箱格式错误
    var emailReg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/i;
    if (!emailReg.test(email)) {
        return res.json({
            status: '300'
        });
    }

    var code = '';
    for (var i = 0; i < 6; i++) {
        code += _.random(0, 9);
    }

    ECode.findOne({
        email: email,
        eType: eType
    }).exec().then(function (ecode) {
        if (!ecode) {
            ecode = new ECode({
                email: email,
                eType: eType
            });
        }

        ecode.eCode = code;
        ecode.expires = new Date(+new Date() + 1000 * 60 * 60);

        ecode.save()
            .then(function () {
                qqEmail.send({
                    to: email,
                    subject: '旅游团网注册验证码',
                    text: '感谢您的注册，您的邮箱验证码位: ' + code + '。',
                    html: '<h3>感谢您的注册，您的邮箱验证码位: <b>' + code + '</b>。</h3>'
                });

                res.json({
                    status: '200'
                });
            }, function (err) {
                logger.debug(err);

                // eType数据错误
                if (err.errors['eType']) {
                    return res.json({
                        status: '400'
                    });
                }

                return res.json({
                    status: '500'
                });
            })

    }, function (err) {
        logger.error(err);
        return res.json({
            status: 500
        });
    })
});


module.exports = router;