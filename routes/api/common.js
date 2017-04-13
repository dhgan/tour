var express = require('express');
var router = express.Router();
var testLib = require('../../lib/testLib');
var logger = require('../../lib/log').logger;
var svgCaptcha = require('svg-captcha');
var path = require('path');

router.get('/captcha', function(req, res) {
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

module.exports = router;