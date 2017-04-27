var express = require('express');
var router = express.Router();
var checkLogin = require('../../middlewares/check.js').checkLogin;
var logger = require('../../lib/log').logger;
var qqEmail = require('../../lib/qqEmail');
var wyEmail = require('../../lib/wyEmail');
var User = require('../../models/user');
var ECode = require('../../models/eCode');

router.post('/checkLogin', checkLogin, function (req, res) {
    res.send({
        status: '200',
        userInfo: req.session.user
    });
});

router.post('/register', function (req, res) {
    var rbody = req.body,
        userName = rbody.userName,
        email = rbody.email,
        eCode = rbody.eCode,
        password = rbody.password;

    logger.debug(rbody);

    // 存在参数为空
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
                            res.json({
                                status: '500'
                            });
                        });


                }, function (err) {
                    logger.error(err);
                    res.json({
                        status: '500'
                    });
                });
        }, function (err) {
            logger.error(err);
            res.json({
                status: '500'
            });
        });
});

router.post('/login', function (req, res) {
    var rbody = req.body,
        userName = rbody.userName,
        password = rbody.password,
        captcha = req.body.captcha;

    logger.debug(rbody);

    // 存在参数为空
    if (!userName || !password) {
        return res.json({
            status: '800'
        });
    }

    var sCaptcha = req.session.captcha;

    if(!captcha || !sCaptcha || sCaptcha.toLowerCase() !== captcha.toLowerCase()) {
        logger.debug('captcha error');
        return res.json({
            status: '300'
        });
    }

    User.findOne({userName: userName, password: password}).exec()
        .then(function(user) {

            // 用户名或密码错误
            if(!user) {
                res.json({
                    status: '400'
                });
            } else {
                req.session.user = user;
                res.json({
                    status: '200'
                });
            }
        }, function(error) {
           logger.error(error);
           res.json({
               status: '500'
           });
        });
});

router.post('/logout', function (req, res) {
    req.session.user = null;
    res.json({
        status: '200'
    });
});

router.get('/homePackage', function (req, res) {

    res.json({
        status: '200',
        slides: [
            {
                images: ['https://a2-q.mafengwo.net/s10/M00/76/A1/wKgBZ1j0N-SABO9sAAXHvvrSeYA45.jpeg?imageMogr2%2Finterlace%2F1'],
                packageId: '12'
            },
            {
                images: ['https://a2-q.mafengwo.net/s10/M00/EF/F8/wKgBZ1jsuNqAY13yAAe8CqrFYNQ74.jpeg?imageMogr2%2Finterlace%2F1'],
                packageId: '13'
            }
        ],
        packages: [
            {
                images: ['https://m.tuniucdn.com/fb2/t1/G2/M00/74/DB/Cii-T1hbhkCINUd4AB7XBb7MUOkAAF4SQIzSywAHtcd583_w640_h480_c1_t0_w640_h320_c1_t0.jpg'],
                title: '泰国普吉岛6或7日游',
                packageId: '1',
                price: '899.00',
                features: '0购物，15人精品小团，醉美花季骑行洱海，十里春风百亩花田，明星导游贴心服务，亲子蜜月畅游古城'
            },
            {
                images: ['http://b4-q.mafengwo.net/s9/M00/5C/56/wKgBs1hLebqAGNdpAAL8ymB_VtM64.jpeg?imageMogr2%2Fthumbnail%2F%21220x130r%2Fgravity%2FCenter%2Fcrop%2F%21220x130%2Fquality%2F100'],
                title: '泰国普吉岛6或7日游',
                packageId: '2',
                price: '899.00'
            },
            {
                images: ['https://m.tuniucdn.com/fb2/t1/G2/M00/A7/C9/Cii-TFf80PGIapBPADplLY7PuykAADRhAAuVhgAOmVF841_w640_h480_c1_t0_w640_h320_c1_t0.png'],
                title: '泰国普吉岛6或7日游',
                packageId: '3',
                price: '899.00',
                features: '0购物，15人精品小团，醉美花季骑行洱海，十里春风百亩花田，明星导游贴心服务，亲子蜜月畅游古城'
            },
            {
                images: ['https://m.tuniucdn.com/fb2/t1/G2/M00/23/89/Cii-TFiv7HWIe9lMAAUMarHWU8IAAHjjwElbhIABQyC965_w640_h480_c1_t0_w640_h320_c1_t0.jpg'],
                title: '泰国普吉岛6或7日游',
                packageId: '4',
                price: '899.00',
                features: '0购物，15人精品小团，醉美花季骑行洱海，十里春风百亩花田，明星导游贴心服务，亲子蜜月畅游古城'
            },
            {
                images: ['https://m.tuniucdn.com/fb2/t1/G2/M00/74/DB/Cii-T1hbhkCINUd4AB7XBb7MUOkAAF4SQIzSywAHtcd583_w640_h480_c1_t0_w640_h320_c1_t0.jpg'],
                title: '泰国普吉岛6或7日游',
                packageId: '5',
                price: '899.00',
                features: '0购物，15人精品小团，醉美花季骑行洱海，十里春风百亩花田，明星导游贴心服务，亲子蜜月畅游古城，0购物，15人精品小团，醉美花季骑行洱海，十里春风百亩花田，明星导游贴心服务，亲子蜜月畅游古城'
            },
            {
                images: ['https://m.tuniucdn.com/fb2/t1/G2/M00/E6/18/Cii-TFgZvlyIGKhRAAPnIr3YkYgAAEGqgL28e8AA-c6091_w640_h480_c1_t0_w640_h320_c1_t0.jpg'],
                title: '泰国普吉岛6或7日游',
                packageId: '6',
                price: '899.00',
                features: '0购物，15人精品小团，醉美花季骑行洱海，十里春风百亩花田，明星导游贴心服务，亲子蜜月畅游古城'
            },
            {
                images: ['https://m.tuniucdn.com/fb2/t1/G2/M00/A7/C9/Cii-TFf80PGIapBPADplLY7PuykAADRhAAuVhgAOmVF841_w640_h480_c1_t0_w640_h320_c1_t0.png'],
                title: '泰国普吉岛6或7日游',
                packageId: '7',
                price: '899.00',
                features: '0购物，15人精品小团，醉美花季骑行洱海，十里春风百亩花田，明星导游贴心服务，亲子蜜月畅游古城'
            },
            {
                images: ['https://m.tuniucdn.com/fb2/t1/G2/M00/23/89/Cii-TFiv7HWIe9lMAAUMarHWU8IAAHjjwElbhIABQyC965_w640_h480_c1_t0_w640_h320_c1_t0.jpg'],
                title: '泰国普吉岛6或7日游',
                packageId: '8',
                price: '899.00',
                features: '0购物，15人精品小团，醉美花季骑行洱海，十里春风百亩花田，明星导游贴心服务，亲子蜜月畅游古城'
            }
        ],
        userInfo: req.session.user
    });

});

router.get('/package/:packageId', function (req, res) {
    var params = req.params,
        packageId = params.packageId;

    logger.debug(params);

    // 存在参数为空
    if (!packageId) {
        return res.json({
            status: '800'
        });
    }

    res.json({
        status: '200',
        package: {
            images: [
                'https://m.tuniucdn.com/fb2/t1/G2/M00/74/DB/Cii-T1hbhkCINUd4AB7XBb7MUOkAAF4SQIzSywAHtcd583_w640_h480_c1_t0_w640_h320_c1_t0.jpg',
                'https://m.tuniucdn.com/fb2/t1/G2/M00/A7/C9/Cii-TFf80PGIapBPADplLY7PuykAADRhAAuVhgAOmVF841_w640_h480_c1_t0_w640_h320_c1_t0.png',
                'https://m.tuniucdn.com/fb2/t1/G2/M00/23/89/Cii-TFiv7HWIe9lMAAUMarHWU8IAAHjjwElbhIABQyC965_w640_h480_c1_t0_w640_h320_c1_t0.jpg'
            ],
            title: '豪门盛宴昆大丽洱海游船双飞6日游',
            packageId: packageId,
            departure_city: '西安',
            price: '899.00',
            features: '0购物，15人精品小团，醉美花季骑行洱海，十里春风百亩花田，明星导游贴心服务，亲子蜜月畅游古城',
            days: 8,
            choices: [
                {
                    price: 199.00,
                    date: '2017-04-25',
                    total: '50',
                    left: '20'
                },
                {
                    price: 299.00,
                    date: '2017-04-27',
                    total: '50',
                    left: '0'
                },
                {
                    price: 399.00,
                    date: '2017-04-29',
                    total: '50',
                    left: '20'
                },
                {
                    price: 599.00,
                    date: '2017-05-01',
                    total: '50',
                    left: '20'
                },
                {
                    price: 499.00,
                    date: '2017-05-03',
                    total: '50',
                    left: '20'
                },
                {
                    price: 399.00,
                    date: '2017-05-04',
                    total: '50',
                    left: '20'
                }
            ],
            collected: packageId%2
        },
        userInfo: req.session.user
    });

});

router.get('/search/:query/:page', function (req, res) {
    var params = req.params,
        page = params.page || 1,
        query = params.query;

    logger.debug(params);

    // 存在参数为空
    if (!query) {
        return res.json({
            status: '800'
        });
    }

    res.json({
        status: '200',
        packages: [
            {
                images: ['https://m.tuniucdn.com/fb2/t1/G2/M00/74/DB/Cii-T1hbhkCINUd4AB7XBb7MUOkAAF4SQIzSywAHtcd583_w640_h480_c1_t0_w640_h320_c1_t0.jpg'],
                title: '泰国普吉岛6或7日游',
                packageId: '1',
                departureCity: '西安',
                days: '3天',
                price: '899.00',
                features: '0购物，15人精品小团，醉美花季骑行洱海，十里春风百亩花田，明星导游贴心服务，亲子蜜月畅游古城'
            },
            {
                images: ['http://b4-q.mafengwo.net/s9/M00/5C/56/wKgBs1hLebqAGNdpAAL8ymB_VtM64.jpeg?imageMogr2%2Fthumbnail%2F%21220x130r%2Fgravity%2FCenter%2Fcrop%2F%21220x130%2Fquality%2F100'],
                title: '泰国普吉岛6或7日游',
                packageId: '1',
                departureCity: '西安',
                days: '3天',
                price: '899.00'
            },
            {
                images: ['https://m.tuniucdn.com/fb2/t1/G2/M00/A7/C9/Cii-TFf80PGIapBPADplLY7PuykAADRhAAuVhgAOmVF841_w640_h480_c1_t0_w640_h320_c1_t0.png'],
                title: '泰国普吉岛6或7日游泰国普吉岛国普吉岛6或7日游泰国普吉岛6或7日游',
                packageId: '1',
                departureCity: '西安',
                days: '3天',
                price: '899.00',
                features: '0购物，15人精品小团，醉美花季骑行洱海，十里春风百亩花田，明星导游贴心服务，亲子蜜月畅游古城'
            },
            {
                images: ['https://m.tuniucdn.com/fb2/t1/G2/M00/23/89/Cii-TFiv7HWIe9lMAAUMarHWU8IAAHjjwElbhIABQyC965_w640_h480_c1_t0_w640_h320_c1_t0.jpg'],
                title: '泰国普吉岛6或7日游',
                packageId: '1',
                departureCity: '西安',
                days: '3天',
                price: '899.00',
                features: '0购物，15人精品小团，醉美花季骑行洱海，十里春风百亩花田，明星导游贴心服务，亲子蜜月畅游古城0购物，15人精品小团，醉美花季骑行洱海，十里春风百亩花田，明星导游贴心服务，亲子蜜月畅游古城'
            },
            {
                images: ['https://m.tuniucdn.com/fb2/t1/G2/M00/74/DB/Cii-T1hbhkCINUd4AB7XBb7MUOkAAF4SQIzSywAHtcd583_w640_h480_c1_t0_w640_h320_c1_t0.jpg'],
                title: '泰国普吉岛6或7日游',
                packageId: '1',
                departureCity: '西安',
                days: '3天',
                price: '899.00',
                features: '0购物，15人精品小团，醉美花季骑行洱海，十里春风百亩花田，明星导游贴心服务，亲子蜜月畅游古城，0购物，15人精品小团，醉美花季骑行洱海，十里春风百亩花田，明星导游贴心服务，亲子蜜月畅游古城'
            },
            {
                images: ['https://m.tuniucdn.com/fb2/t1/G2/M00/E6/18/Cii-TFgZvlyIGKhRAAPnIr3YkYgAAEGqgL28e8AA-c6091_w640_h480_c1_t0_w640_h320_c1_t0.jpg'],
                title: '泰国普吉岛6或7日游',
                packageId: '1',
                departureCity: '西安',
                days: '3天',
                price: '899.00',
                features: '0购物，15人精品小团，醉美花季骑行洱海，十里春风百亩花田，明星导游贴心服务，亲子蜜月畅游古城'
            },
            {
                images: ['https://m.tuniucdn.com/fb2/t1/G2/M00/A7/C9/Cii-TFf80PGIapBPADplLY7PuykAADRhAAuVhgAOmVF841_w640_h480_c1_t0_w640_h320_c1_t0.png'],
                title: '泰国普吉岛6或7日游',
                packageId: '1',
                departureCity: '西安',
                days: '3天',
                price: '899.00',
                features: '0购物，15人精品小团，醉美花季骑行洱海，十里春风百亩花田，明星导游贴心服务，亲子蜜月畅游古城'
            },
            {
                images: ['https://m.tuniucdn.com/fb2/t1/G2/M00/23/89/Cii-TFiv7HWIe9lMAAUMarHWU8IAAHjjwElbhIABQyC965_w640_h480_c1_t0_w640_h320_c1_t0.jpg'],
                title: '泰国普吉岛6或7日游',
                packageId: '1',
                departureCity: '西安',
                days: '3天',
                price: '899.00',
                features: '0购物，15人精品小团，醉美花季骑行洱海，十里春风百亩花田，明星导游贴心服务，亲子蜜月畅游古城'
            }
        ],
        totalItems: 1237,
        userInfo: req.session.user
    });


});

router.post('/order', function (req, res) {
    var rbody = req.body,
        packageId = rbody.packageId,
        date = rbody.date,
        number = rbody.number,
        price = rbody.price;

    logger.debug(rbody);

    // 存在参数为空
    if (!packageId || !date || !number || !price) {
        return res.json({
            status: '800'
        });
    }

    res.json({
        status: '200'
    });

});

router.get('/orderList/:p', function (req, res) {

    var params = req.params,
        page = params.page || 1;

    logger.debug(params);

    res.json({
        status: '200',
        orderList: [
            {
                orderId: '1',
                packageId: '23',
                title: '烟花三月下扬州+溧阳南山竹海+千垛油菜花海生态养生之旅4日跟团游',
                totalPrice: '8888',
                number: 2,
                date: '2017-05-01',
                price: '4444',
                createDate: new Date(),
                tel: '15079449251',
                name: '小刚',
                state: '1'
            },
            {
                orderId: '2',
                packageId: '23',
                title: '烟花三月下扬州+溧阳南山竹海+千垛油菜花海生态养生之旅4日跟团游',
                totalPrice: '8888',
                number: 2,
                date: '2017-05-01',
                price: '4444',
                createDate: new Date(),
                tel: '15079449251',
                name: '小刚',
                state: '-2'
            },
            {
                orderId: '3',
                packageId: '23',
                title: '烟花三月下扬州+溧阳南山竹海+千垛油菜花海生态养生之旅4日跟团游',
                totalPrice: '8888',
                number: 2,
                date: '2017-05-01',
                price: '4444',
                createDate: new Date(),
                tel: '15079449251',
                name: '小刚',
                state: '-1'
            },
            {
                orderId: '4',
                packageId: '23',
                title: '烟花三月下扬州+溧阳南山竹海+千垛油菜花海生态养生之旅4日跟团游',
                totalPrice: '8888',
                number: 2,
                date: '2017-05-01',
                price: '4444',
                createDate: new Date(),
                tel: '15079449251',
                name: '小刚',
                state: '0'
            }
        ],
        totalItems: 1237,
        userInfo: req.session.user
    });

});

router.post('/addCollection', function (req, res) {
    var rbody = req.body,
        packageId = rbody.packageId;

    logger.debug(rbody);

    // 存在参数为空
    if (!packageId) {
        return res.json({
            status: '800'
        });
    }

    res.json({
        status: '200'
    });

});


router.get('/collection/:page', function (req, res) {
    var params = req.params,
        page = params.page || 1;

    logger.debug(params);

    res.json({
        status: '200',
        packages: [
            {
                images: ['https://m.tuniucdn.com/fb2/t1/G2/M00/74/DB/Cii-T1hbhkCINUd4AB7XBb7MUOkAAF4SQIzSywAHtcd583_w640_h480_c1_t0_w640_h320_c1_t0.jpg'],
                title: '泰国普吉岛6或7日游',
                packageId: '1',
                departureCity: '西安',
                days: '3天',
                price: '899.00',
                features: '0购物，15人精品小团，醉美花季骑行洱海，十里春风百亩花田，明星导游贴心服务，亲子蜜月畅游古城'
            },
            {
                images: ['http://b4-q.mafengwo.net/s9/M00/5C/56/wKgBs1hLebqAGNdpAAL8ymB_VtM64.jpeg?imageMogr2%2Fthumbnail%2F%21220x130r%2Fgravity%2FCenter%2Fcrop%2F%21220x130%2Fquality%2F100'],
                title: '泰国普吉岛6或7日游',
                packageId: '2',
                departureCity: '西安',
                days: '3天',
                price: '899.00'
            },
            {
                images: ['https://m.tuniucdn.com/fb2/t1/G2/M00/A7/C9/Cii-TFf80PGIapBPADplLY7PuykAADRhAAuVhgAOmVF841_w640_h480_c1_t0_w640_h320_c1_t0.png'],
                title: '泰国普吉岛6或7日游泰国普吉岛国普吉岛6或7日游泰国普吉岛6或7日游',
                packageId: '3',
                departureCity: '西安',
                days: '3天',
                price: '899.00',
                features: '0购物，15人精品小团，醉美花季骑行洱海，十里春风百亩花田，明星导游贴心服务，亲子蜜月畅游古城'
            },
            {
                images: ['https://m.tuniucdn.com/fb2/t1/G2/M00/23/89/Cii-TFiv7HWIe9lMAAUMarHWU8IAAHjjwElbhIABQyC965_w640_h480_c1_t0_w640_h320_c1_t0.jpg'],
                title: '泰国普吉岛6或7日游',
                packageId: '4',
                departureCity: '西安',
                days: '3天',
                price: '899.00',
                features: '0购物，15人精品小团，醉美花季骑行洱海，十里春风百亩花田，明星导游贴心服务，亲子蜜月畅游古城0购物，15人精品小团，醉美花季骑行洱海，十里春风百亩花田，明星导游贴心服务，亲子蜜月畅游古城'
            },
            {
                images: ['https://m.tuniucdn.com/fb2/t1/G2/M00/74/DB/Cii-T1hbhkCINUd4AB7XBb7MUOkAAF4SQIzSywAHtcd583_w640_h480_c1_t0_w640_h320_c1_t0.jpg'],
                title: '泰国普吉岛6或7日游',
                packageId: '5',
                departureCity: '西安',
                days: '3天',
                price: '899.00',
                features: '0购物，15人精品小团，醉美花季骑行洱海，十里春风百亩花田，明星导游贴心服务，亲子蜜月畅游古城，0购物，15人精品小团，醉美花季骑行洱海，十里春风百亩花田，明星导游贴心服务，亲子蜜月畅游古城'
            },
            {
                images: ['https://m.tuniucdn.com/fb2/t1/G2/M00/E6/18/Cii-TFgZvlyIGKhRAAPnIr3YkYgAAEGqgL28e8AA-c6091_w640_h480_c1_t0_w640_h320_c1_t0.jpg'],
                title: '泰国普吉岛6或7日游',
                packageId: '6',
                departureCity: '西安',
                days: '3天',
                price: '899.00',
                features: '0购物，15人精品小团，醉美花季骑行洱海，十里春风百亩花田，明星导游贴心服务，亲子蜜月畅游古城'
            },
            {
                images: ['https://m.tuniucdn.com/fb2/t1/G2/M00/A7/C9/Cii-TFf80PGIapBPADplLY7PuykAADRhAAuVhgAOmVF841_w640_h480_c1_t0_w640_h320_c1_t0.png'],
                title: '泰国普吉岛6或7日游',
                packageId: '7',
                departureCity: '西安',
                days: '3天',
                price: '899.00',
                features: '0购物，15人精品小团，醉美花季骑行洱海，十里春风百亩花田，明星导游贴心服务，亲子蜜月畅游古城'
            },
            {
                images: ['https://m.tuniucdn.com/fb2/t1/G2/M00/23/89/Cii-TFiv7HWIe9lMAAUMarHWU8IAAHjjwElbhIABQyC965_w640_h480_c1_t0_w640_h320_c1_t0.jpg'],
                title: '泰国普吉岛6或7日游',
                packageId: '8',
                departureCity: '西安',
                days: '3天',
                price: '899.00',
                features: '0购物，15人精品小团，醉美花季骑行洱海，十里春风百亩花田，明星导游贴心服务，亲子蜜月畅游古城'
            }
        ],
        totalItems: 1237,
        userInfo: req.session.user
    });


});


router.post('/removeCollection', function (req, res) {
    var rbody = req.body,
        packageId = rbody.packageId;

    logger.debug(rbody);

    // 存在参数为空
    if (!packageId) {
        return res.json({
            status: '800'
        });
    }

    res.json({
        status: '200'
    });

});

router.get('/packageComments/:packageId/:page', function (req, res) {
    var params = req.params,
        packageId = params.packageId,
        page = params.page || 1;

    logger.debug(params);

    // 存在参数为空
    if (!packageId) {
        return res.json({
            status: '800'
        });
    }

    res.json({
        status: '200',
        avgStar: 4.1,
        totalItems: 76,
        comments: [
            {
                userName: '小**',
                star: '5',
                content: '温泉不错，携程预订的时候不太满意，下单的时候没有填发票的地方，最后还要打电话去补发票比较纠结',
                time: '2017-04-18 16:47:55'
            },
            {
                userName: '疯狂***',
                star: '4',
                content: '在网上第一眼就找到这家的拼车活动，感觉行程还不错，我们是两个车一起出发的，为了节省费用，大家都是临时拼再一起出行的，不过都很随和，景色很美，玩的也很开心，不错的行程。',
                time: '2017-04-18 16:47:55'
            },
            {
                userName: '疯狂***',
                star: '4',
                content: '在网上第一眼就找到这家的拼车活动，感觉行程还不错，我们是两个车一起出发的，为了节省费用，大家都是临时拼再一起出行的，不过都很随和，景色很美，玩的也很开心，不错的行程。',
                time: '2017-04-18 16:47:55'
            },
            {
                userName: '疯狂***',
                star: '4',
                content: '在网上第一眼就找到这家的拼车活动，感觉行程还不错，我们是两个车一起出发的，为了节省费用，大家都是临时拼再一起出行的，不过都很随和，景色很美，玩的也很开心，不错的行程。',
                time: '2017-04-18 16:47:55'
            },
            {
                userName: '疯狂***',
                star: '4',
                content: '在网上第一眼就找到这家的拼车活动，感觉行程还不错，我们是两个车一起出发的，为了节省费用，大家都是临时拼再一起出行的，不过都很随和，景色很美，玩的也很开心，不错的行程。',
                time: '2017-04-18 16:47:55'
            },
            {
                userName: '疯狂***',
                star: '4',
                content: '在网上第一眼就找到这家的拼车活动，感觉行程还不错，我们是两个车一起出发的，为了节省费用，大家都是临时拼再一起出行的，不过都很随和，景色很美，玩的也很开心，不错的行程。',
                time: '2017-04-18 16:47:55'
            },
            {
                userName: '疯狂***',
                star: '4',
                content: '在网上第一眼就找到这家的拼车活动，感觉行程还不错，我们是两个车一起出发的，为了节省费用，大家都是临时拼再一起出行的，不过都很随和，景色很美，玩的也很开心，不错的行程。',
                time: '2017-04-18 16:47:55'
            }
        ]
    });

});

module.exports = router;