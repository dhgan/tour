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

    res.json({
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

    /*res.json({
        status: '200',
        package: {
            images: [
                'https://m.tuniucdn.com/fb2/t1/G2/M00/74/DB/Cii-T1hbhkCINUd4AB7XBb7MUOkAAF4SQIzSywAHtcd583_w640_h480_c1_t0_w640_h320_c1_t0.jpg',
                'https://m.tuniucdn.com/fb2/t1/G2/M00/A7/C9/Cii-TFf80PGIapBPADplLY7PuykAADRhAAuVhgAOmVF841_w640_h480_c1_t0_w640_h320_c1_t0.png',
                'https://m.tuniucdn.com/fb2/t1/G2/M00/23/89/Cii-TFiv7HWIe9lMAAUMarHWU8IAAHjjwElbhIABQyC965_w640_h480_c1_t0_w640_h320_c1_t0.jpg'
            ],
            title: '豪门盛宴昆大丽洱海游船双飞6日游',
            packageId: packageId,
            departureCity: '西安',
            price: '899.00',
            features: `<p>精选昆明五星级酒店|温泉+高尔夫挥杆体验 ，让疲惫远离你的身心<br>
                        五味俱全（全程指定特色民族餐饮）<br>
                        精选云南地道民族美食，纳西火塘鸡∣洱海砂锅鱼∣过桥米线∣宜良烤鸭<br>
                        山水胜景<br>安排云南知名景点<br>AAAAA级景区：玉龙雪山（冰川大索道）∣石林<br>
                        AAAA级景区：南诏风情岛|洱海大游船<br>
                        人气景区：大理古城∣丽江古城|丽江恋歌<br>豪华赠礼<br>
                        洱海豪华游轮，观洱海盛景<br>赠送价值150元足疗SPA</p>`,
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
            collected: packageId%2,
            tourDetail: `<div class="itinerary">
                            <div class="clear"></div>
                
                            <a id="day0"></a> <div class="clear"></div> <div class="iti-title">
                            <span>第<strong>1</strong>天</span>
                            西安乘机赴昆明长水国际机场<img src="http://ms.xktec.com/images/vehicle_plane.png">
                            </div><ul><li class="line-iti"><div class="line-item-content">西安贵宾今日乘机抵达昆明长水国际机场，我社将安排接机人员于机场1号出口为您接机，并安排商务专车送至酒店办理入住手续。考虑您长途跋涉和进入高原地区，为避免出现身体不适应，我社今日将无行程安排，并为为您安排温泉酒店。</div><div class="line-iti-img"></div></li></ul><div class="clear"></div> <a id="day1"></a> <div class="clear"></div> <div class="iti-title">
                        <span>第<strong>2</strong>天</span>
                        昆明<img src="http://ms.xktec.com/images/vehicle_bus.png">大理<img src="http://ms.xktec.com/images/vehicle_bus.png">丽江
                        </div><ul><li class="line-iti"><div class="line-item-content">早餐后，乘车前往大理，抵达后品尝午餐“白族风味餐”，用餐后游览历史文化名城【大理古城】（游览60分钟，含古城维护费，电瓶车35元/人，），游览大理经典景区【蝴蝶泉】（游览40分钟）。结束后乘车至丽江，抵达后品尝晚餐“马帮菜”，用餐后游览国家AAAAA级景区【丽江古城】（古城为开放式景区，各位贵宾请自行游览），结束后入住酒店休息。</div></li></ul><div class="clear"></div> <a id="day2"></a> <div class="clear"></div> <div class="iti-title">
                        <span>第<strong>3</strong>天</span>
                        丽江一地<img src="http://ms.xktec.com/images/vehicle_bus.png">
                        </div><ul><li class="line-iti"><div class="line-item-content">早餐后，游览国家AAAAA景区【玉龙雪山】·【冰川大索道】（游览180分钟，不含排队及用餐时间），游览【蓝月谷】 （蓝月谷电瓶车自理60元/人）。结束后返回市区参观丽江康体特产【螺旋藻】，晚餐品尝“丽江火塘鸡”，用餐后游览【宋城景区】，并赠送实景演出《丽江恋歌》，观赏结束后入住酒店休息。</div></li></ul><div class="clear"></div> <a id="day3"></a> <div class="clear"></div> <div class="iti-title">
                        <span>第<strong>4</strong>天</span>
                        丽江<img src="http://ms.xktec.com/images/vehicle_bus.png">大理<img src="http://ms.xktec.com/images/vehicle_bus.png">安宁
                        </div><ul><li class="line-iti"><div class="line-item-content">早餐后，乘车前往大理。抵达后参观【白族民居】（参观60分钟，含“白族三道茶“歌舞表演）。中午品尝“洱海砂锅鱼”，用餐后乘坐【洱海豪华游轮】观赏苍山洱海美景，并游览国家AAAA级景区【南诏风情岛】（乘船、游览时间150分钟）。结束后乘车前往安宁，于指定餐厅品尝晚餐，用餐后入住温泉酒店休息（赠送足疗SPA）。</div></li></ul><div class="clear"></div> <a id="day4"></a> <div class="clear"></div> <div class="iti-title">
                        <span>第<strong>5</strong>天</span>
                        安宁<img src="http://ms.xktec.com/images/vehicle_bus.png">昆明
                        </div><ul><li class="line-iti"><div class="line-item-content">早餐后，乘车返程昆明。抵达后参观【云南民族村·翡翠博物馆】（参观180分钟）。中午品尝云南特色美食“过桥米线”，用餐后参观【黄龙玉展示馆】僰银博物馆，结束后乘车至石林，游览国家AAAAA级景区【石林风景名胜区】（游览120分钟）。晚餐品尝宜良烤鸭，用餐后返回昆明市区，入住高尔夫温泉酒店（赠送高尔夫球挥杆体验，每间房120球）。</div></li></ul><div class="clear"></div> <a id="day5"></a> <div class="clear"></div> <div class="iti-title">
                        <span>第<strong>6</strong>天</span>
                        昆明长水国际机场乘机<img src="http://ms.xktec.com/images/vehicle_plane.png">返回西安
                        </div><ul><li class="line-iti"><div class="line-item-content">早餐后，将根据各位贵宾的返程航班时间安排参观【鲜花市场】（参观60分钟），参观后由送机人员为您送机，并预祝您一路平安！</div></li></ul><div class="clear"></div>
                
                        <p class="p_notice">以上行程仅供参考，最终行程可能会根据实际情况进行微调，敬请以出团通知为准。</p>
                    </div>`,
            priceDetail: `<p>1、交通标准：西安/昆明往返机票(具体航班时刻仅供参考,以当日航空公司实际公布时间为准)及机场建设费及燃油费，当地空调旅游车（当地地接社将视具体团队人数安排用 &nbsp; &nbsp; &nbsp;车，保证每人一正座）。<br>
                            2、餐饮标准：此行程包含5早餐/8正餐，十人一桌（不含酒水）；正餐标准40元/人/餐，特色餐50元/人/餐<br>
                            3、住宿标准：昆明指定五星级酒店（1晚） +丽江豪华精品酒店（2晚）+安宁温泉酒店（1晚）+昆明高尔夫温泉酒店（1晚）<br>
                            4、车辆标准：此行程中所使用车辆为具有合法运营资质的空调旅游车。<br>
                            5、服务标准：此行程中所安排导游为持有国家导游资格证，并有5年以上从业经验的优秀省、地陪带有<br>
                            6、安全标准：此行程已为游客购买云南旅游组合保险（旅行社责任险）<br>
                            7、赠送项目：此行程中赠送丽江《丽江恋歌》、足疗SPA、高尔夫球挥杆体验，大理古城维护费30元/人<br>
                            昆明段入住酒店：汉唐莲花温泉酒店（第1日）（备选：蓝魅主题酒店）<br>
                            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 高尔夫温泉酒店（第5日/含温泉）（备选：铭春花园温泉酒店、唐韵大酒店）<br>
                            丽江入住酒店：吉钰酒店（第2、3日）<br>
                            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;（备选：华天大酒店、喜来福大酒店、天乐酒店）<br>
                            安宁入住酒店：瑞美温泉酒店（第4日）（永恒大酒店）<br>
                            备注：如遇不可抗力或政府接待等特殊原因，导致无法安排指定酒店时，我社有权安排同级别、同标准的其他酒店
                        </p>`,
            precautions: `<p>
                            ★药品：自备常用感冒药、肠胃药、晕船晕车药等。<br>
                            ★安全：在自由活动期间请注意安全，妥善保管好您的随身物品，以免丢失。<br>
                            云南属边疆区域，交通四通八达，藏民族较多，请您随时携带您的身份证件。<br>
                            ★装备：相机必不可少，因为丽香格里拉紫外线强，最好做好防晒措施，如防晒霜，太阳镜，遮阳帽等。<br>
                            ★饮食：民族地区的饮食颇有风味，当地的餐饮口味可能和自己家乡的口味相差很大，可以根据自己的要求询问导游或者相关工作人员，他们会给游客们最好的推荐，也可以自备些家乡的咸菜等。<br>
                            ★风俗：云南属少数民族聚集地，出行前最好是先对主要名族的民风习俗有所了解，以免造成不必要的误会。<br>
                            ★土特产：翡翠玉石、云南白药、纯银饰品、云南烤烟、黄龙玉、竹荪、围棋子、火腿、普洱茶、牛肝菌、各种时令水果等。
                        </p>`
        },
        userInfo: req.session.user
    });*/

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

    Package.findById(packageId, 'title choices departureCity days _id')
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
                }
            });

            if(!stockEnough) return;

            // 时间错误
            if(!order.price) {
                return res.json({
                    status: '300'
                })
            }

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
                        Package.findById(order.package).exec()
                            .then(function(package) {
                                var choices = package.choices;

                                choices.forEach(function(choice) {
                                    if(moment(choice.date).isSame(order.date, 'day')) {
                                        choice.left = choice.left + order.number;
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
                })

            } else {
                res.json({
                    status: '200'
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

            req.session.user = {
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