var express = require('express');
var router = express.Router();
var checkLogin = require('../../middlewares/check.js').checkLogin;
var logger = require('../../lib/log').logger;
var qqEmail = require('../../lib/qqEmail');
var wyEmail = require('../../lib/wyEmail');
var User = require('../../models/user');
var ECode = require('../../models/eCode');
var Package = require('../../models/package');
var Collection = require('../../models/collection');
var pageQuery = require('../../lib/pageQuery');
var async = require('async');
var moment = require('moment');
var Order = require('../../models/order');
var Comment = require('../../models/comment');
var HomeSlide = require('../../models/homeSlides');

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

    User.findOne({userName: userName, password: password})
        .populate('collections')
        .exec()
        .then(function(user) {

            // 用户名或密码错误
            if(!user) {
                res.json({
                    status: '400'
                });
            } else {
                req.session.user = {
                    _id: user._id,
                    userName: user.userName,
                    email: user.email,
                    collections: user.collections
                };
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


    HomeSlide.find().exec()
        .then(function(slides) {
            Package.find()
                .sort({
                    sold: -1
                })
                .limit(8)
                .exec()
                .then(function(packages) {


                    var homePackages = [];

                    for(var i=packages.length-1; i>=0; i--) {
                        homePackages[i] = packages[i].toObject();
                        homePackages[i].minPrice = packages[i].getMinPrice();
                    }

                    res.json({
                        status: '200',
                        slides: slides,
                        packages: homePackages,
                        userInfo: req.session.user
                    });
                }, function(err) {
                    logger.error(err);
                    res.json({
                        status: '500'
                    });
                });
        }, function(err) {
            logger.error(err);
            res.json({
                status: '500'
            });
        });

    /*res.json({
        status: '200',
        slides: [
            {
                images: ['https://a2-q.mafengwo.net/s10/M00/76/A1/wKgBZ1j0N-SABO9sAAXHvvrSeYA45.jpeg?imageMogr2%2Finterlace%2F1'],
                packageId: '59047ed808bef748384ce9cc'
            },
            {
                images: ['https://a2-q.mafengwo.net/s10/M00/EF/F8/wKgBZ1jsuNqAY13yAAe8CqrFYNQ74.jpeg?imageMogr2%2Finterlace%2F1'],
                packageId: '59047ed808bef748384ce9d3'
            }
        ],
        packages: [
            {
                images: ['https://m.tuniucdn.com/fb2/t1/G2/M00/74/DB/Cii-T1hbhkCINUd4AB7XBb7MUOkAAF4SQIzSywAHtcd583_w640_h480_c1_t0_w640_h320_c1_t0.jpg'],
                title: '泰国普吉岛6或7日游',
                packageId: '59047ed808bef748384ce9cc',
                price: '899.00',
                features: '0购物，15人精品小团，醉美花季骑行洱海，十里春风百亩花田，明星导游贴心服务，亲子蜜月畅游古城'
            },
            {
                images: ['http://b4-q.mafengwo.net/s9/M00/5C/56/wKgBs1hLebqAGNdpAAL8ymB_VtM64.jpeg?imageMogr2%2Fthumbnail%2F%21220x130r%2Fgravity%2FCenter%2Fcrop%2F%21220x130%2Fquality%2F100'],
                title: '泰国普吉岛6或7日游',
                packageId: '59047ed808bef748384ce9d3',
                price: '899.00'
            },
            {
                images: ['https://m.tuniucdn.com/fb2/t1/G2/M00/A7/C9/Cii-TFf80PGIapBPADplLY7PuykAADRhAAuVhgAOmVF841_w640_h480_c1_t0_w640_h320_c1_t0.png'],
                title: '泰国普吉岛6或7日游',
                packageId: '59047ed808bef748384ce9da',
                price: '899.00',
                features: '0购物，15人精品小团，醉美花季骑行洱海，十里春风百亩花田，明星导游贴心服务，亲子蜜月畅游古城'
            },
            {
                images: ['https://m.tuniucdn.com/fb2/t1/G2/M00/23/89/Cii-TFiv7HWIe9lMAAUMarHWU8IAAHjjwElbhIABQyC965_w640_h480_c1_t0_w640_h320_c1_t0.jpg'],
                title: '泰国普吉岛6或7日游',
                packageId: '59047ed808bef748384ce9cc',
                price: '899.00',
                features: '0购物，15人精品小团，醉美花季骑行洱海，十里春风百亩花田，明星导游贴心服务，亲子蜜月畅游古城'
            },
            {
                images: ['https://m.tuniucdn.com/fb2/t1/G2/M00/74/DB/Cii-T1hbhkCINUd4AB7XBb7MUOkAAF4SQIzSywAHtcd583_w640_h480_c1_t0_w640_h320_c1_t0.jpg'],
                title: '泰国普吉岛6或7日游',
                packageId: '59047ed808bef748384ce9d3',
                price: '899.00',
                features: '0购物，15人精品小团，醉美花季骑行洱海，十里春风百亩花田，明星导游贴心服务，亲子蜜月畅游古城，0购物，15人精品小团，醉美花季骑行洱海，十里春风百亩花田，明星导游贴心服务，亲子蜜月畅游古城'
            },
            {
                images: ['https://m.tuniucdn.com/fb2/t1/G2/M00/E6/18/Cii-TFgZvlyIGKhRAAPnIr3YkYgAAEGqgL28e8AA-c6091_w640_h480_c1_t0_w640_h320_c1_t0.jpg'],
                title: '泰国普吉岛6或7日游',
                packageId: '59047ed808bef748384ce9da',
                price: '899.00',
                features: '0购物，15人精品小团，醉美花季骑行洱海，十里春风百亩花田，明星导游贴心服务，亲子蜜月畅游古城'
            },
            {
                images: ['https://m.tuniucdn.com/fb2/t1/G2/M00/A7/C9/Cii-TFf80PGIapBPADplLY7PuykAADRhAAuVhgAOmVF841_w640_h480_c1_t0_w640_h320_c1_t0.png'],
                title: '泰国普吉岛6或7日游',
                packageId: '59047ed808bef748384ce9cc',
                price: '899.00',
                features: '0购物，15人精品小团，醉美花季骑行洱海，十里春风百亩花田，明星导游贴心服务，亲子蜜月畅游古城'
            },
            {
                images: ['https://m.tuniucdn.com/fb2/t1/G2/M00/23/89/Cii-TFiv7HWIe9lMAAUMarHWU8IAAHjjwElbhIABQyC965_w640_h480_c1_t0_w640_h320_c1_t0.jpg'],
                title: '泰国普吉岛6或7日游',
                packageId: '59047ed808bef748384ce9d3',
                price: '899.00',
                features: '0购物，15人精品小团，醉美花季骑行洱海，十里春风百亩花田，明星导游贴心服务，亲子蜜月畅游古城'
            }
        ],
        userInfo: req.session.user
    });*/

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

    Package.findOne({_id: packageId}).exec()
        .then(function(package) {
            if(!package) {
                return res.json({
                    status: '400',
                    userInfo: req.session.user
                });
            }

            var choices  = package.choices,
                minPrice = choices[0].price;

            for(var i=choices.length-1; i>0; i--) {
                if(minPrice > choices[i].price) {
                    minPrice = choices[i].price;
                }
            }

            package = package.toObject();

            package['minPrice'] = minPrice;

            res.json({
                status: '200',
                package: package,
                userInfo: req.session.user
            });

        }, function(error){
            logger.error(error);
            res.json({
                status: '500',
                userInfo: req.session.user
            });
        });

});

router.get('/search/:query/:page', function (req, res) {
    var params = req.params,
        page = parseInt(params.page) || 1,
        query = params.query,
        pageSize = parseInt(req.query.pageSize) || 10;

    logger.debug(params);

    // 存在参数为空
    if (!query) {
        return res.json({
            status: '800'
        });
    }

    var sessionUser = req.session.user;

    var reg = new RegExp(query, 'i');

    var queryParams = {
        $or: [
            { title: {$regex: reg} },
            { features: {$regex: reg} },
            { departureCity: {$regex: reg} },
            { days: {$regex: reg} }
        ]
    };

    var sortParams = {
        createTime: -1
    };

    var select = 'title features images choices _id days departureCity';

    pageQuery(page, pageSize, Package, '', queryParams, select, sortParams, function(err, $page) {
        if(err) {
            logger.error(err);
            return res.json({
                status: '500',
                userInfo: sessionUser
            });
        }

        var results = $page.results,
            packages = [];

        for(var i=results.length-1; i>=0; i--) {
            packages[i] = results[i].toObject();
            packages[i].minPrice = results[i].getMinPrice();
        }

        res.json({
            status: '200',
            packages: packages,
            page: $page.page,
            totalItems: $page.count,
            userInfo: sessionUser
        });

    })

    /*res.json({
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
    });*/


});

router.get('/order', checkLogin, function (req, res) {
    var query = req.query,
        packageId = query.packageId,
        date = query.date,
        number = query.number;

    logger.debug(query);

    // 存在参数为空
    if (!packageId || !date || !number) {
        return res.json({
            status: '800'
        });
    }

    var sessionUser = req.session.user;

    logger.debug(moment(date), moment(new Date()).add(1, 'days'));

    date = new Date(date);

    // 日期错误
    if(!moment(date).isValid() || moment(date).isBefore(moment(new Date()).add(1, 'days'), 'day')) {
        return res.json({
            status: '300',
            userInfo: sessionUser
        });
    }

    Package.findById(packageId, 'title choices departureCity days _id')
        .exec()
        .then(function(package) {

            // packageId错误
            if(!package) {
                return res.json({
                    status: '400',
                    userInfo: sessionUser
                });
            }

            var  order = {};

            var choices = package.choices;

            choices.forEach(function(choice) {
                if(moment(choice.date).isSame(date, 'day')) {
                    order.price = choice.price;
                    order.date = choice.date;
                    return ;
                }
            });

            // 时间错误
            if(!order.price) {
                return res.json({
                    status: '300',
                    userInfo: sessionUser
                })
            }

            order.number = number;
            order.totalPrice = order.price * number;


            res.json({
                status: '200',
                order: order,
                package: package,
                userInfo: sessionUser
            });


        }, function(err) {
            logger.error(err);
            res.json({
                status: '500',
                userInfo: sessionUser
            });
        });
});

router.post('/orderSubmit', checkLogin, function (req, res) {
    var rbody = req.body,
        packageId = rbody.packageId,
        date = rbody.date,
        number = parseInt(rbody.number),
        name = rbody.name,
        tel = rbody.tel;

    logger.debug(rbody);

    // 存在参数为空
    if (!packageId || !date || !number || !name || !tel) {
        return res.json({
            status: '800'
        });
    }

    var userId = req.session.user._id;

    logger.debug(moment(date), moment(new Date()).add(1, 'days'));

    date = new Date(date);

    // 日期错误
    if(!moment(date).isValid() || moment(date).isBefore(moment(new Date()).add(1, 'days'), 'day')) {
        return res.json({
            status: '300'
        });
    }

    Package.findById(packageId, 'title choices departureCity days sold _id')
        .exec()
        .then(function(package) {

            // packageId错误
            if(!package) {
                return res.json({
                    status: '400'
                });
            }

            var  order = {};

            var choices = package.choices,
                stockEnough = false;

            choices.forEach(function(choice) {
                if(moment(choice.date).isSame(date, 'day')) {
                    order.price = choice.price;
                    order.date = choice.date;

                    // 库存不足
                    if(choice.left < number) {
                        return res.json({
                            status: '600',
                        });
                    }
                    stockEnough = true;
                    choice.left = choice.left - number;
                    package.sold += number;
                }
            });

            if(!stockEnough) return;

            // 时间错误
            if(!order.price) {
                return res.json({
                    status: '300'
                })
            }

            logger.debug(package);

            package.save()
                .then(function() {

                    order.number = number;
                    order.totalPrice = order.price * number;
                    order.user = userId;
                    order.package = packageId;
                    order.name = name;
                    order.tel = tel;

                    var date = new Date();
                    order.createDate = date;
                    order.leastDate = moment(date).add('30', 'm');

                    new Order(order).save()
                        .then(function(order) {

                            User.findByIdAndUpdate(userId, {$addToSet: {'orders': order._id}}).exec()
                                .then(function() {
                                    return res.json({
                                        status: '200',
                                        orderId: order._id
                                    });
                                }, function(err) {
                                    logger.error(err);
                                    return res.json({
                                        status: '500',
                                    });
                                });
                        }, function(err) {
                            logger.error(err);
                            res.json({
                                status: '500'
                            });
                        });

                }, function(err) {
                    logger.error(err);
                    res.json({
                        status: '500'
                    });
                });


        }, function(err) {
            logger.error(err);
            res.json({
                status: '500'
            });
        });
});

router.get('/orderList/:p', checkLogin, function (req, res) {

    var params = req.params,
        page = params.page || 1,
        query = req.query,
        pageSize = query.pageSize || 10;

    logger.debug(params, query);

    // 存在参数为空
    if(!page || !pageSize) {
        return res.json({
            status: '800'
        });
    }

    var start = (page - 1) * pageSize;
    var sessionUser = req.session.user;
    var userId = sessionUser._id;

    logger.debug(start, pageSize);

    async.parallel({
        count: function(done) {
            User.findById(userId, 'orders', function(err, attr) {
                if(err) logger.error(err);
                logger.debug('user orders ', attr.orders);
                done(err, attr.orders.length);
            })
        },
        user: function(done) {
            User.findById(userId, 'orders')
                .populate({
                    path: 'orders',
                    options: {
                        sort: '-createDate',
                        skip: start,
                        limit: pageSize
                    },
                    populate: {
                        path: 'package',
                        select: 'title days departureCity',
                    }
                })
                .exec(function(err, doc) {
                    if(err) logger.error(err);
                    done(err, doc);
                });
        }
    }, function(err, results) {
        var count = results.count,
            orders = results.user.orders;
        if(err) {
            logger.error(err);
            return res.json({
                status: '500',
                userInfo: sessionUser
            });
        }

        res.json({
            status: '200',
            orderList: orders,
            totalItems: count,
            page: page,
            userInfo: sessionUser
        })

    });

});

router.post('/cancelOrder', checkLogin, function (req, res) {
    var rbody = req.body,
        orderId = rbody.orderId;

    logger.debug(rbody);

    // 存在参数为空
    if (!orderId) {
        return res.json({
            status: '800'
        });
    }

    var userId = req.session.user._id;

    Order.findById(orderId).exec()
        .then(function(order) {

            // orderId错误
            if(!order) {
                return res.json({
                    status: '400'
                });
            }

            // 非自己订单
            if(userId !== order.user.toString()) {
                return res.json({
                    status: '300'
                });
            }

            if(order.state === 0) {
                order.state = -1;
                order.save()
                    .then(function() {
                        Package.findById(order.package).exec()
                            .then(function(package) {
                                var choices = package.choices;

                                choices.forEach(function(choice) {
                                    if(moment(choice.date).isSame(order.date, 'day')) {
                                        choice.left = choice.left + order.number;
                                        package.sold -= order.number;
                                        return;
                                    }
                                });

                                package.save()
                                    .then(function() {
                                        res.json({
                                            status: '200'
                                        });
                                    }, function(err) {
                                        logger.error(err);
                                        return res.json({
                                            status: '500'
                                        });
                                    });
                            }, function(err) {
                                logger.error(err);
                                return res.json({
                                    status: '500'
                                });
                            });
                    }, function(err) {
                        logger.error(err);
                        res.json({
                            status: '500'
                        });
                    })
            } else if(order.state === -1) { // 订单已被取消
                res.json({
                    status: '600'
                });
            } else {
                res.json({ // 订单已支付不能取消
                    status: '700'
                });
            }

        }, function(err) {
            logger.error(err);
            res.json({
                status: '500'
            });
        })

});

router.get('/getPayOrder', checkLogin, function (req, res) {
    var query = req.query,
        orderId = query.orderId;

    logger.debug(query);

    // 存在参数为空
    if (!orderId) {
        return res.json({
            status: '800'
        });
    }

    var sessionUser = req.session.user,
        userId = sessionUser._id;


    Order.findById(orderId)
        .exec()
        .then(function(order) {

            // orderId错误
            if(!order) {
                return res.json({
                    status: '400',
                    userInfo: sessionUser
                });
            }

            // 非自己订单
            if(userId !== order.user.toString()) {
                return res.json({
                    status: '300',
                    userInfo: sessionUser
                });
            }

            if(order.state === 0) {
                res.json({
                    status: '200',
                    order: order,
                    userInfo: sessionUser
                });
            } else if(order.state === -1) { // 订单已被取消
                res.json({
                    status: '600'
                });
            } else {
                res.json({ // 订单已支付
                    status: '700'
                });
            }


        }, function(err) {
            logger.error(err);
            res.json({
                status: '500',
                userInfo: sessionUser
            });
        });
});

router.post('/pay', checkLogin, function (req, res) {
    var rbody = req.body,
        orderId = rbody.orderId;

    logger.debug(rbody);

    // 存在参数为空
    if (!orderId) {
        return res.json({
            status: '800'
        });
    }

    var userId = req.session.user._id;

    Order.findById(orderId).exec()
        .then(function(order) {

            // orderId错误
            if(!order) {
                return res.json({
                    status: '400'
                });
            }

            // 非自己订单
            if(userId !== order.user.toString()) {
                return res.json({
                    status: '300'
                });
            }


            if(order.state === 0) {
                order.state = 1;
                order.payDate = new Date();
                order.save()
                    .then(function() {
                        res.json({
                            status: '200'
                        });
                    }, function(err) {
                        logger.error(err);
                        res.json({
                            status: '500'
                        });
                    })
            } else if(order.state === -1) { // 订单已被取消
                res.json({
                    status: '600'
                });
            } else {
                res.json({ // 订单已支付
                    status: '700'
                });
            }

        }, function(err) {
            logger.error(err);
            res.json({
                status: '500'
            });
        })

});

router.post('/addCollection', checkLogin, function (req, res) {
    var rbody = req.body,
        packageId = rbody.packageId;

    logger.debug(rbody);

    // 存在参数为空
    if (!packageId) {
        return res.json({
            status: '800'
        });
    }

    var sessionUser = req.session.user,
        userId = sessionUser._id;

    Collection.findOne({user: userId, package: packageId}).exec()
        .then(function(collection) {
            if(!collection) {
                logger.debug('not collection');
                new Collection({
                    user: Object(userId),
                    package: Object(packageId),
                    createDate: new Date()
                }).save()
                    .then(function(collection) {
                        User.findByIdAndUpdate(userId, {$addToSet: {'collections': collection._id}}).exec()
                            .then(function() {
                                sessionUser.collections.push(collection);
                                return res.json({
                                    status: '200',
                                    userInfo: sessionUser
                                });
                            }, function(error) {
                                logger.error(error);
                                return res.json({
                                    status: '500',
                                    userInfo: sessionUser
                                });
                            });
                    }, function(error) {
                        logger.error(error);
                        return res.json({
                            status: '500',
                            userInfo: sessionUser
                        });
                    });
            } else {

                var collectionId = collection._id.toString();

                if(sessionUser.collections.indexOf(collectionId) >= 0) {
                    // 已收藏
                    return res.json({
                        status: '300',
                        userInfo: sessionUser
                    });
                }

                // else

                User.findByIdAndUpdate(userId, {$addToSet: {'collections': collection._id}}).exec()
                    .then(function() {
                        sessionUser.collections.push(collection);
                        return res.json({
                            status: '200',
                            userInfo: sessionUser
                        });
                    }, function(error) {
                        logger.error(error);
                        return res.json({
                            status: '500',
                            userInfo: sessionUser
                        });
                    });
            }
        }, function(error) {
            logger.error(error);
            return res.json({
                status: '500'
            });
        });


});


router.get('/collection/:page', checkLogin, function (req, res) {
    var params = req.params,
        page = parseInt(params.page) || 1,
        pageSize = parseInt(req.query.pageSize) || 10;

    logger.debug(params);
    logger.debug(req.query);

    // 存在参数为空
    if(!page || !pageSize) {
        return res.json({
            status: '800'
        });
    }

    var start = (page - 1) * pageSize;
    var sessionUser = req.session.user;
    var userId = sessionUser._id;

    logger.debug(start, pageSize);

    async.parallel({
        count: function(done) {
            User.findById(userId, 'collections', function(err, attr) {
                if(err) logger.error(err);
                logger.debug('user collections ', attr.collections);
                done(err, attr.collections.length);
            })
        },
        user: function(done) {
            User.findById(userId, 'collections')
                .populate({
                    path: 'collections',
                    options: {
                        sort: '-createDate',
                        skip: start,
                        limit: pageSize
                    },
                    populate: {
                        path: 'package',
                        select: 'title features images choices _id days departureCity',
                    }
                })
                .exec(function(err, doc) {
                    if(err) logger.error(err);
                    done(err, doc);
                });
        }
    }, function(err, results) {
        var count = results.count,
            collections = results.user.collections;
        if(err) {
            logger.error(err);
            return res.json({
                status: '500',
                userInfo: sessionUser
            });
        }

        var collect = [];

        for(var i=collections.length-1; i>=0; i--) {
            collect[i] = collections[i].toObject();
            collect[i].package.minPrice = collections[i].package.getMinPrice();
        }

        res.json({
            status: '200',
            collections: collect,
            totalItems: count,
            page: page,
            userInfo: sessionUser
        })

    });
});


router.post('/removeCollection', checkLogin, function (req, res) {
    var rbody = req.body,
        collectionId = rbody.collectionId;

    logger.debug(rbody);

    // 存在参数为空
    if (!collectionId) {
        return res.json({
            status: '800'
        });
    }

    var userId = req.session.user._id;

    Collection.findById(collectionId).exec()
        .then(function(collection) {

            logger.debug(collection);

            // collectionId错误
            if(!collection) {
                return res.json({
                    status: '400'
                });
            }

            // 非自己收藏
            if(userId !== collection.user.toString()) {
                return res.json({
                    status: '300'
                });
            }

            User.findByIdAndUpdate(userId, {$pull: {collections: collectionId}}, {new: true})
                .populate('collections')
                .exec()
                .then(function(user) {

                    req.session.user = {
                        _id: user._id,
                        userName: user.userName,
                        email: user.email,
                        collections: user.collections
                    };

                    collection.remove()
                        .then(function() {
                            res.json({
                                status: '200',
                                userInfo: req.session.user
                            });
                        }, function(err) {
                            logger.error(err);
                            res.json({
                                status: '500'
                            });
                        })

                }, function(err) {
                    logger.error(err);
                    res.json({
                        status: '500'
                    });
                });

        }, function(err) {
            logger.error(err);
            res.json({
                status: '500'
            });
        })

});


router.post('/comment', checkLogin, function (req, res) {
    var rbody = req.body,
        orderId = rbody.orderId,
        star = parseInt(rbody.star),
        content = rbody.content;

    logger.debug(rbody);

    // 存在参数为空
    if (!orderId, !star, !content) {
        return res.json({
            status: '800'
        });
    }

    var sessionUser = req.session.user,
        userId = sessionUser._id;

    Order.findById(orderId).exec()
        .then(function(order) {

            // orderId错误
            if(!order) {
                return res.json({
                    status: '400'
                });
            }

            // 非自己订单
            if(userId !== order.user.toString()) {
                return res.json({
                    status: '300'
                });
            }


            if(order.state === 1) {
                new Comment({
                    user: userId,
                    package: order.package,
                    star: star,
                    content: content,
                    createDate: new Date()
                }).save().then(function(comment) {
                    order.state = 2;
                    order.save()
                        .then(function() {
                            Package.findByIdAndUpdate(order.package, {$addToSet: {'comments': comment._id}}).exec()
                                .then(function() {
                                    return res.json({
                                        status: '200'
                                    });
                                }, function(error) {
                                    logger.error(error);
                                    return res.json({
                                        status: '500'
                                    });
                                });
                        }, function(err) {
                            logger.error(err);
                            res.json({
                                status: '500'
                            });
                        })
                }, function(err) {
                    logger.error(err);
                    res.json({
                        status: '500'
                    });
                });
            } else if(order.state === -1) { // 订单已被取消
                res.json({
                    status: '600'
                });
            } else if(order.state === 0) {
                res.json({ // 订单未支付
                    status: '700'
                });
            } else {
                res.json({ // 订单已评价
                    status: '900'
                })
            }

        }, function(err) {
            logger.error(err);
            res.json({
                status: '500'
            });
        });


});

router.get('/packageComments/:packageId/:page', function (req, res) {
    var params = req.params,
        packageId = params.packageId,
        page = parseInt(params.page) || 1,
        pageSize = parseInt(req.query.pageSize) || 10;

    logger.debug(params);

    // 存在参数为空
    if (!packageId) {
        return res.json({
            status: '800'
        });
    }

    var start = (page - 1) * pageSize;

    if(start < 0) { // page错误
        return res.json({
            status: '400'
        });
    }

    logger.debug(start, pageSize);


    Package.findById(packageId, 'comments')
        .populate({
            path: 'comments',
            options: {
                sort: '-createDate'
            },
            populate: {
                path: 'user',
                select: 'userName',
            }
        })
        .exec()
        .then(function(package){
            if(!package) {
                // package错误
                return res.json({
                    status: '300'
                });
            }

            var comments = package.comments.concat(),
                len = comments.length;

            logger.info(comments);

            if(len > 0) {
                var avgStar = 0;

                for(var i=0; i<comments.length; i++) {
                    avgStar += comments[i].star;
                    comments[i].user.userName = comments[i].user.userName.charAt(0) + '**';
                }

                avgStar /=len;

                avgStar = avgStar.toFixed(1);

                if(start > len) { // page错误
                    return res.json({
                        status: '400'
                    });
                }

                var cs = comments.slice(start, pageSize + start);

                res.json({
                    status: '200',
                    comments: cs,
                    avgStar: avgStar,
                    totalItems: len
                });

            } else {
                res.json({
                    status: '200',
                    totalItems: 0
                });
            }

        }, function(err){
            logger.error(err);
            res.json({
                status: '500'
            });
        });
});

router.get('/user', checkLogin, function (req, res) {

    var sessionUser = req.session.user;

    User.findById(req.session.user._id).exec()
        .then(function (user) {
            // 异常错误
            if (!user) {
                return res.json({
                    status: '500',
                    userInfo: sessionUser
                })
            }

            sessionUser = req.session.user = {
                _id: user._id,
                userName: user.userName,
                email: user.email,
                collections: user.collections
            };

            res.json({
                status: '200',
                userInfo: sessionUser
            });

        }, function (err) {
            logger.error(err);
            res.json({
                status: '500',
                userInfo: sessionUser
            });
        });
});

router.post('/changeEmail', checkLogin, function (req, res) {
    var rbody = req.body,
        email = rbody.email,
        eCode = rbody.eCode;

    logger.debug(rbody);

    // 存在参数为空
    if (!email || !eCode) {
        return res.json({
            status: '800'
        });
    }

    var sessionUser = req.session.user;

    // 邮箱格式错误
    var emailReg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/i;
    if (!emailReg.test(email)) {
        return res.json({
            status: '300',
            userInfo: sessionUser
        });
    }

    ECode.findOne({email: email, eType: '200'}).exec()
        .then(function (ecode) {
            logger.debug(ecode);

            // 邮箱验证码错误
            if (!ecode || ecode.eCode !== eCode) {
                return res.json({
                    status: '600',
                    userInfo: sessionUser
                });
            }

            // 邮箱验证码过期
            if (new Date(ecode.expires) < new Date()) {
                return res.json({
                    status: '601',
                    userInfo: sessionUser
                });
            }


            User.findById(req.session.user._id).exec()
                .then(function (user) {
                    // 异常错误
                    if (!user) {
                        return res.json({
                            status: '500',
                            userInfo: sessionUser
                        })
                    }

                    user.email = email;

                    user.save()
                        .then(function() {

                            res.json({
                                status: '200',
                                userInfo: sessionUser
                            });

                        }, function() {
                            logger.error(err);

                            return res.json({
                                status: '500',
                                userInfo: sessionUser
                            });
                        });


                }, function (err) {
                    logger.error(err);
                    res.json({
                        status: '500',
                        userInfo: sessionUser
                    });
                });


        }, function (err) {
            logger.error(err);
            res.json({
                status: '500',
                userInfo: sessionUser
            });
        });
});

router.post('/changePassword', checkLogin, function (req, res) {
    var rbody = req.body,
        opassword = rbody.opassword,
        password = rbody.password;

    logger.debug(rbody);

    // 存在参数为空
    if (!opassword || !password) {
        return res.json({
            status: '800'
        });
    }

    User.findById(req.session.user._id).exec()
        .then(function (user) {
            // 异常错误
            if (!user) {
                return res.json({
                    status: '500'
                })
            }

            // 原密码错误
            if (opassword !== user.password) {
                return res.json({
                    status: '300'
                });
            }

            user.password = password;

            user.save()
                .then(function() {

                    res.json({
                       status: '200'
                    });

                }, function() {
                    logger.error(err);

                    return res.json({
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

router.post('/validateName', function (req, res) {
    var rbody = req.body,
        userName = rbody.userName,
        captcha = rbody.captcha;

    logger.debug(rbody);

    // 存在参数为空
    if (!userName || !captcha) {
        return res.json({
            status: '800'
        });
    }

    var sCaptcha = req.session.captcha;

    // 验证码错误
    if(!captcha || !sCaptcha || sCaptcha.toLowerCase() !== captcha.toLowerCase()) {
        logger.debug('captcha error');
        return res.json({
            status: '300'
        });
    }

    User.findOne({userName: userName}).exec()
        .then(function (user) {
            // 用户名错误
            if (!user) {
                return res.json({
                    status: '400'
                })
            }

            req.session.forgetPassword = {
                userName: userName,
                email: user.email
            };

            res.json({
                status: '200'
            });


        }, function (err) {
            logger.error(err);
            res.json({
                status: '500'
            });
        });
});

router.get('/getValidateEmail', function (req, res) {

    var forgetPassword = req.session.forgetPassword;

    // session过期
    if(!forgetPassword) {
        return res.json({
            status: '1000'
        });
    }

    var email = forgetPassword.email,
        i = email.indexOf('@'),
        ef = email.substring(0, i),
        eb = email.substring(i);

    if(ef.length<=2) {
        ef = ef.charAt(0) + '*';
    } else {
        ef = ef.charAt(0) + '***' + ef.charAt(ef.length-1);
    }

    email = ef + eb;


    return res.json({
        status: '200',
        email:　email
    });

});

router.post('/resetPassword', function (req, res) {
    var rbody = req.body,
        eCode = rbody.eCode,
        password = rbody.password;

    logger.debug(rbody);

    // 存在参数为空
    if (!eCode || !password) {
        return res.json({
            status: '800'
        });
    }

    var forgetPassword = req.session.forgetPassword,
        email = forgetPassword.email;

    // session过期
    if(!forgetPassword) {
        return res.json({
            status: '1000'
        });
    }

    ECode.findOne({email: email, eType: '300'}).exec()
        .then(function (ecode) {
            logger.debug(ecode);

            // 邮箱验证码错误
            if (!ecode || ecode.eCode !== eCode) {
                return res.json({
                    status: '300'
                });
            }

            // 邮箱验证码过期
            if (new Date(ecode.expires) < new Date()) {
                return res.json({
                    status: '400'
                });
            }

            User.findOneAndUpdate({userName: forgetPassword.userName}, {password: password}).exec()
                .then(function() {
                    req.session.forgetPassword = null;
                    res.json({
                        status: '200'
                    });
                }, function(err){
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

module.exports = router;