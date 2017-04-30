var mongoose = require('mongoose');
var config = require('./db_url');
var Q = require('q');

module.exports = function() {
    var db = mongoose.connect(config.mongodb);
    mongoose.Promise = Q.Promise;
    require('../models/test');
    require('../models/eCode');
    require('../models/user');
    require('../models/package');

    // mock数据
    var Test = require('../models/test');
    Test.find(function(err, test) {
        if(test.length) return ;
        new Test({
            name: 'gdh',
            sex: 'man'
        }).save();

        new Test({
            name: 'yj',
            sex: 'woman'
        }).save();
    });
    var Package = require('../models/package');
    Package.find(function(err, package) {
        if(package.length) return ;
        new Package({
            images: [
                'https://m.tuniucdn.com/fb2/t1/G2/M00/74/DB/Cii-T1hbhkCINUd4AB7XBb7MUOkAAF4SQIzSywAHtcd583_w640_h480_c1_t0_w640_h320_c1_t0.jpg',
                'https://m.tuniucdn.com/fb2/t1/G2/M00/A7/C9/Cii-TFf80PGIapBPADplLY7PuykAADRhAAuVhgAOmVF841_w640_h480_c1_t0_w640_h320_c1_t0.png',
                'https://m.tuniucdn.com/fb2/t1/G2/M00/23/89/Cii-TFiv7HWIe9lMAAUMarHWU8IAAHjjwElbhIABQyC965_w640_h480_c1_t0_w640_h320_c1_t0.jpg'
            ],
            title: '豪门盛宴昆大丽洱海游船双飞6日游',
            departureCity: '西安',
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
        }).save();


        new Package({
            images: [
                'http://file.xktec.com/images/large/1389164297917432.jpg',
                'http://file.xktec.com/images/large/1389164298276082.jpg',
                'http://file.xktec.com/images/large/1389164298213494.jpg',
                'http://file.xktec.com/images/large/14216366404555.jpg'
            ],
            title: '【海南篇】别样海南---三亚往返零自费系列产品',
            departureCity: '西安',
            features: `<ul>
                            <li><span style="line-height:1.6">三亚3晚指定酒店 （含2晚海景房）、龙沐湾1晚五星规模 福安温泉海景酒店 一线海边 海景房 （温泉水入客房）、兴隆1晚温泉酒店&nbsp; 标准双人间&nbsp; （温泉水入客房）。</span></li>
                            <li>丰富膳食：全程含7正5早。正餐标准不低于20元/人/餐，安排十菜一汤，十人一桌。<br>
                            <span style="line-height:1.6">特色餐安排：道家养生自助餐、呀诺达雨林药膳、乐东黄流老鸭。</span><span style="line-height:1.6">（如因客人原因放弃用餐，费用不退；如当团人数低于8人，在餐标不变的前提下，菜品做相应的调整，<span style="line-height:1.6">保证一人一菜）</span></span></li>
                            <li>精华景点：灵秀美女岛分界洲岛、山海图画大小洞天、热带雨林呀喏达、银色沙滩亚龙湾、浪漫天涯海角、苗族古寨椰田古寨、热带药用植物园等。</li>
                            <li>特别安排欣赏：价值248元的精彩绝伦车技表演。</li>
                            <li>零自费：绝不增加白天和晚上的任何自费（潜水摩托艇空中拖伞等水上娱乐项目除外）。</li>
                            <li>高级用车：旅游用车为2010年投入使用的高一级旅游新车、指定委派高一级GPS安全监控系统空调。</li>
                            <li>旅游保险: 海南旅行社责任险（最高保额60万元/人）、强烈建议游客自行购买旅游意外险。</li>
                        </ul>`,
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
            tourDetail: `<div class="itinerary">
                            <div class="clear"></div>
                            <a id="day0"></a>
                            <div class="clear"></div>
                            <div class="iti-title">
                                <span>第<strong>1</strong>天</span> 西安
                                <img src="http://ms.xktec.com/images/vehicle_plane.png">三亚
                            </div>
                            <ul>
                                <li class="line-iti">
                                    <div class="line-item-content">1 根据航班时间提前三个小时集合，安排送机。 2 抵达机场，专人协助客人办理登机手续。 3 抵达三亚，专人专车机场接机，沿途欣赏鹿城-三亚的热带风光，到达酒店休息。 4 住宿：三亚指定酒店
                                    </div>
                                    <div class="line-iti-img"></div>
                                </li>
                            </ul>
                            <div class="clear"></div>
                            <a id="day1"></a>
                            <div class="clear"></div>
                            <div class="iti-title">
                                <span>第<strong>2</strong>天</span> 三亚
                                <img src="http://ms.xktec.com/images/vehicle_bus.png">龙沐湾
                            </div>
                            <ul>
                                <li class="line-iti">
                                    <div class="line-item-content">今日行程：天涯海角—大小洞天—拉网捕鱼 【天涯海角】：“天之涯、海之角” 著名的国家4A级景区（游览约120分钟）。 【大小洞天】：中国最南端的鳌山之麓，南海之滨、道家文化旅游胜地，景区以其秀丽的海景、山景和石景号称琼崖第一山水名胜，山海之间宛如一副古朴优美的山海图画（游览及用餐约150分钟）。 【拉网捕鱼】：中国最美落日海滩，探秘西海岸渔家风情，体验原始的渔家作业方式，享受共同拉网捕鱼的乐趣和对收获的期望，感受渔民的智慧造就了传承千年捕鱼为生的传统文化；现抓现做美味鲜鱼汤，伴着收获的喜悦，观赏以天空、大海、落日为主题的唯美动态影像，记录下醉美的瞬间、最心动的画面。随着落日一点点消逝，云霞呈现变幻无穷的瑰丽景象，不禁有“夕阳无限好，只是近黄昏”的深切感触 晚餐品尝乐东美食：黄流老鸭等；入住酒店休息。
                                    </div>
                                </li>
                            </ul>
                            <div class="clear"></div>
                            <a id="day2"></a>
                            <div class="clear"></div>
                            <div class="iti-title">
                                <span>第<strong>3</strong>天</span> 龙沐湾
                                <img src="http://ms.xktec.com/images/vehicle_bus.png">兴隆
                            </div>
                            <ul>
                                <li class="line-iti">
                                    <div class="line-item-content">07:00 用餐：早餐 08:00 ① 海南的“香巴拉”、热带雨林净肺养心 前往欣赏海南独特的热带雨林景观【呀喏达热带雨林风景区—含门票及景区观光车】，热带雨林谷遮天蔽日，流泉叠瀑倾泻而下。在这里，百年古藤、千年古蕨、巨大的仙草灵芝、“冷血杀手”见血封喉以及热带雨林的六大奇观等，让您惊叹不已（游览及用餐约120分钟）。 12:00 用餐：午餐 今日行程：呀喏达热带雨林风景区—分界洲岛—兴隆热带药用植物园 【呀喏达热带雨林风景区】：海南独特的热带雨林景观，热带雨林谷遮天蔽日，流泉叠瀑倾泻而下。在这里，百年古藤、千年古蕨、巨大的仙草灵芝、“冷血杀手”见血封喉以及热带雨林的六大奇观等，让您惊叹不已（游览及用餐约120分钟，含门票及景区观光车）。 【分界洲岛】：岛上辟有“鬼斧神工”、“大洞天”、“剌桐花艳”等20多处自然景观，秀丽的风景、柔软的海滩、清澈蔚蓝的海水，椰树婆娑（过渡及游览约150分钟）。 【兴隆热带药用植物园】：是中科院南药研究基地，奇花异草繁多，四大南药植物、见血封喉树、千年印度紫檀，千年沉香、海南黄花梨等珍稀药用植物都是镇园之宝（游览约60分钟）。 晚餐后自由活动，感受东南亚华侨小镇的浓郁风情。
                                    </div>
                                </li>
                            </ul>
                            <div class="clear"></div>
                            <a id="day3"></a>
                            <div class="clear"></div>
                            <div class="iti-title">
                                <span>第<strong>4</strong>天</span> 兴隆
                                <img src="http://ms.xktec.com/images/vehicle_bus.png">三亚
                            </div>
                            <ul>
                                <li class="line-iti">
                                    <div class="line-item-content">今日行程：奥特莱斯—椰田古寨—亚龙湾沙滩—骏达车技 【首创奥特莱斯文化旅游区】：—项目集合购物、餐饮、休闲、娱乐等为一体的休闲度假消费新模式，打造海南全岛规模最大、品牌最多首家纯正奥特莱斯（游览约180分钟）。 【椰田古寨生态旅游区】：祖国最南端、民风淳朴的苗族古寨，感觉“银色世界”的傩蛊文化、欣赏欢乐苗家歌舞、独特角度展示海南苗家原生态生活场景（游览约90分钟）。 【亚龙湾沙滩】：有东方夏威夷美誉之称，您可于海滩享受阳光浴，洁白的沙滩，让您流连忘返（游览约40分钟）。 【骏达车技】：晚餐后安排欣赏，现场身临其境感受精彩绝伦的车技世界。。。（欣赏约60分钟） 当天行程结束，自由活动感受让您意犹未尽的魅力三亚。
                                    </div>
                                </li>
                            </ul>
                            <div class="clear"></div>
                            <a id="day4"></a>
                            <div class="clear"></div>
                            <div class="iti-title">
                                <span>第<strong>5</strong>天</span>
                                <img src="http://ms.xktec.com/images/vehicle_bus.png">三亚一地
                            </div>
                            <ul>
                                <li class="line-iti">
                                    <div class="line-item-content">今日行程：槟榔谷—海螺姑娘创意文化景区 【槟榔谷黎苗文化旅游区】：是一个多民族、多文化、多形态的，集观光游览、文化展示、民俗体验、休闲娱乐为一体的少数民族型旅游景区（游览约120分钟）。 【海螺姑娘创意文化景区】：参观围绕三亚当地流传的《南海海螺姑娘传说》而精心打造的3A级景区，走进螺的海洋，贝的世界，感受创意奇观，相约海螺姑娘。（游览约60分钟）， 之后自由活动，感受让您意犹未尽的魅力三亚。
                                    </div>
                                </li>
                            </ul>
                            <div class="clear"></div>
                            <a id="day5"></a>
                            <div class="clear"></div>
                            <div class="iti-title">
                                <span>第<strong>6</strong>天</span> 三亚
                                <img src="http://ms.xktec.com/images/vehicle_plane.png">西安
                            </div>
                            <ul>
                                <li class="line-iti">
                                    <div class="line-item-content">1 根据航班时间提前三个小时安排送机。 2 抵达西安，专人接机，将客人送至西安指定地点，回到温馨的家，结束愉快的旅行。
                                    </div>
                                    <div class="line-iti-img"></div>
                                </li>
                            </ul>
                            <div class="clear"></div>
                            <p class="p_notice">以上行程仅供参考，最终行程可能会根据实际情况进行微调，敬请以出团通知为准。</p>
                        </div>`,
            priceDetail: `<ul>
                            <li>交通：含往返机票、机场建设税、燃油费。出发航班时间以机票显示时间为准；团队机票不得改签、更改或退票。</li>
                            <li>海南旅游用车为2010年投入使用的高一级空调旅游车（接、送机为普通车型），车型根据此团游客人数而定，保证每人正座车座。</li>
                            <li>
                            <p>住宿：三亚参考酒店：<span style="line-height:1.6">3晚指定酒店 （含2晚海景房）</span></p>
                        
                            <p>正扬国际、横丰酒店、二月海、梧桐墅精品、汇凯海景、水业海景、鑫兴花园、蓝海银滩、银苑临海主题、臻澜海景、铂金海景、中苑、春天假日、丽莱假日、佰思特、九里香、东方大酒店、城市运通</p>
                        
                            <p>（海景房）：鑫兴花园、蓝海银滩、二月海海景、水业海景、臻澜海景、嘉悦莱登、汇凯海景、铂金海景、海悦湾、百栎度假公寓、豪威海景、银苑临海主题、福汇楼（华蓉）酒店、春天假日、华东海景酒店、芒果海景、果喜以上指定酒店，两晚海景房（海边酒店）、一晚温泉度假酒店。全程不提供自然单间，如出现单人，请补交单住房差。<br>
                            龙沐湾：1晚五星规模 福安温泉海景酒店 一线海边 海景房 （温泉水入客房）龙沐湾福安温泉酒店<br>
                            兴隆：1晚温泉酒店&nbsp; 标准双人间&nbsp; （温泉水入客房）温泉宾馆酒店、兴隆太阳岛酒店、天健花园酒店、明珠温泉酒店、港隆酒店、金银岛酒店、明阳山庄酒店、惠康假日酒店、同发酒店</p>
                        
                            <p>海南酒店多为旅游度假酒店，标准较内地偏低。<span style="line-height:1.6">如旺季等特殊情况，因房源紧张，将安排不低于以上酒店档次的酒店。</span></p>
                            </li>
                            <li>
                            <p>餐饮：含7正5早餐。早餐为中式自助或中式围桌，正餐标准不低于20元/人/餐，安排十菜一汤，十人一桌。赠送矿泉水每人每天一瓶。特色餐安排：道家养生自助餐。</p>
                            </li>
                            <li>
                            <p>景点：含景点第一门票，以下景区电瓶车不含，游客可自由选择乘坐或徒步，不影响正常的游览：（天涯海角电瓶车15元、大小洞天电瓶车20元）。</p>
                            </li>
                            <li>
                            <p>导游：特选优秀导游贴心服务。</p>
                            </li>
                            <li>
                            <p>儿童：12周岁以下儿童收费及接待标准以确认书为准。</p>
                            </li>
                            <li>
                            <p>保险：含海南旅行社责任险（建议游客另行购买旅游意外险）。</p>
                            </li>
                            <li>
                            <p>承诺：不满意免费再玩一次（解释权归海南地接旅行社所有）。</p>
                            </li>
                        </ul>`,
            precautions: `<ul>
                            <li>海南天气炎热，请自备防暑降温药品，携带好夏季防晒霜、太阳伞、太阳帽、泳衣、拖鞋等夏季必需品。</li>
                            <li>海南酒店大堂、房间、洗手间及餐厅多为光滑地面，行走时请注意脚下，避免摔倒。</li>
                            <li>酒店退房时间为中午的12:00，晚班机的客人可把行李寄存在酒店后自由活动或自补房差开钟点房休息。</li>
                            <li>如遇人力不可抗力因素或政策性调整导致无法游览的景点，经双方友好协商，我社可调整为其他等价景区参观，如客人不同意，我社将按旅行社与景区协议价格退还景区门票；赠送景点费用不退。</li>
                            <li>旅游期间请不要私自下海游泳，也不建议在景区内海滨浴场游泳，游泳时请注意人身安全；请不要攀爬礁石，不要攀树摘花，不要从事危险活动，因此出现的安全问题旅行社及导游不承担任何责任。</li>
                            <li>注意用餐卫生，尽量少在路边小摊用餐。热带水果不宜多吃，避免过敏及腹泄情况发生。</li>
                        </ul>`
        }).save();

        new Package({
            images: [
                'http://file.xktec.com/images/large/1389164297917432.jpg',
                'http://file.xktec.com/images/large/1389164298276082.jpg',
                'http://file.xktec.com/images/large/1389164298213494.jpg',
                'http://file.xktec.com/images/large/14216366404555.jpg'
            ],
            title: '2017挑战天门双飞5日】张家界/黄龙洞/天门山/玻璃栈道/土家风情园/大峡谷玻璃桥 凤凰古城2017挑战天门双飞5日】张家界/黄龙洞/天门山/玻璃栈道/土家风情园/大峡谷玻璃桥 凤凰古城',
            departureCity: '西安',
            features: `<p>
                        ★ 白天0自费
                        ★ 世界最高、跨度最长的-【全透明玻璃桥】
                        ★ 世界溶洞全能冠军—【黄龙洞】
                        ★ 体验惊险刺激的趴地，扶墙感觉--【玻璃栈道】
                        ★ 赠送2个特色餐、体验双玻之旅！                                         
                        ★ 当地豪华型酒店，每天保证您充足的睡眠
                        </p>`,
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
            tourDetail: `<div class="itinerary">
                            <div class="clear"></div>
                            <a id="day0"></a>
                            <div class="clear"></div>
                            <div class="iti-title">
                                <span>第<strong>1</strong>天</span> 西安
                                <img src="http://ms.xktec.com/images/vehicle_plane.png">三亚
                            </div>
                            <ul>
                                <li class="line-iti">
                                    <div class="line-item-content">1 根据航班时间提前三个小时集合，安排送机。 2 抵达机场，专人协助客人办理登机手续。 3 抵达三亚，专人专车机场接机，沿途欣赏鹿城-三亚的热带风光，到达酒店休息。 4 住宿：三亚指定酒店
                                    </div>
                                    <div class="line-iti-img"></div>
                                </li>
                            </ul>
                            <div class="clear"></div>
                            <a id="day1"></a>
                            <div class="clear"></div>
                            <div class="iti-title">
                                <span>第<strong>2</strong>天</span> 三亚
                                <img src="http://ms.xktec.com/images/vehicle_bus.png">龙沐湾
                            </div>
                            <ul>
                                <li class="line-iti">
                                    <div class="line-item-content">今日行程：天涯海角—大小洞天—拉网捕鱼 【天涯海角】：“天之涯、海之角” 著名的国家4A级景区（游览约120分钟）。 【大小洞天】：中国最南端的鳌山之麓，南海之滨、道家文化旅游胜地，景区以其秀丽的海景、山景和石景号称琼崖第一山水名胜，山海之间宛如一副古朴优美的山海图画（游览及用餐约150分钟）。 【拉网捕鱼】：中国最美落日海滩，探秘西海岸渔家风情，体验原始的渔家作业方式，享受共同拉网捕鱼的乐趣和对收获的期望，感受渔民的智慧造就了传承千年捕鱼为生的传统文化；现抓现做美味鲜鱼汤，伴着收获的喜悦，观赏以天空、大海、落日为主题的唯美动态影像，记录下醉美的瞬间、最心动的画面。随着落日一点点消逝，云霞呈现变幻无穷的瑰丽景象，不禁有“夕阳无限好，只是近黄昏”的深切感触 晚餐品尝乐东美食：黄流老鸭等；入住酒店休息。
                                    </div>
                                </li>
                            </ul>
                            <div class="clear"></div>
                            <a id="day2"></a>
                            <div class="clear"></div>
                            <div class="iti-title">
                                <span>第<strong>3</strong>天</span> 龙沐湾
                                <img src="http://ms.xktec.com/images/vehicle_bus.png">兴隆
                            </div>
                            <ul>
                                <li class="line-iti">
                                    <div class="line-item-content">07:00 用餐：早餐 08:00 ① 海南的“香巴拉”、热带雨林净肺养心 前往欣赏海南独特的热带雨林景观【呀喏达热带雨林风景区—含门票及景区观光车】，热带雨林谷遮天蔽日，流泉叠瀑倾泻而下。在这里，百年古藤、千年古蕨、巨大的仙草灵芝、“冷血杀手”见血封喉以及热带雨林的六大奇观等，让您惊叹不已（游览及用餐约120分钟）。 12:00 用餐：午餐 今日行程：呀喏达热带雨林风景区—分界洲岛—兴隆热带药用植物园 【呀喏达热带雨林风景区】：海南独特的热带雨林景观，热带雨林谷遮天蔽日，流泉叠瀑倾泻而下。在这里，百年古藤、千年古蕨、巨大的仙草灵芝、“冷血杀手”见血封喉以及热带雨林的六大奇观等，让您惊叹不已（游览及用餐约120分钟，含门票及景区观光车）。 【分界洲岛】：岛上辟有“鬼斧神工”、“大洞天”、“剌桐花艳”等20多处自然景观，秀丽的风景、柔软的海滩、清澈蔚蓝的海水，椰树婆娑（过渡及游览约150分钟）。 【兴隆热带药用植物园】：是中科院南药研究基地，奇花异草繁多，四大南药植物、见血封喉树、千年印度紫檀，千年沉香、海南黄花梨等珍稀药用植物都是镇园之宝（游览约60分钟）。 晚餐后自由活动，感受东南亚华侨小镇的浓郁风情。
                                    </div>
                                </li>
                            </ul>
                            <div class="clear"></div>
                            <a id="day3"></a>
                            <div class="clear"></div>
                            <div class="iti-title">
                                <span>第<strong>4</strong>天</span> 兴隆
                                <img src="http://ms.xktec.com/images/vehicle_bus.png">三亚
                            </div>
                            <ul>
                                <li class="line-iti">
                                    <div class="line-item-content">今日行程：奥特莱斯—椰田古寨—亚龙湾沙滩—骏达车技 【首创奥特莱斯文化旅游区】：—项目集合购物、餐饮、休闲、娱乐等为一体的休闲度假消费新模式，打造海南全岛规模最大、品牌最多首家纯正奥特莱斯（游览约180分钟）。 【椰田古寨生态旅游区】：祖国最南端、民风淳朴的苗族古寨，感觉“银色世界”的傩蛊文化、欣赏欢乐苗家歌舞、独特角度展示海南苗家原生态生活场景（游览约90分钟）。 【亚龙湾沙滩】：有东方夏威夷美誉之称，您可于海滩享受阳光浴，洁白的沙滩，让您流连忘返（游览约40分钟）。 【骏达车技】：晚餐后安排欣赏，现场身临其境感受精彩绝伦的车技世界。。。（欣赏约60分钟） 当天行程结束，自由活动感受让您意犹未尽的魅力三亚。
                                    </div>
                                </li>
                            </ul>
                            <div class="clear"></div>
                            <a id="day4"></a>
                            <div class="clear"></div>
                            <div class="iti-title">
                                <span>第<strong>5</strong>天</span>
                                <img src="http://ms.xktec.com/images/vehicle_bus.png">三亚一地
                            </div>
                            <ul>
                                <li class="line-iti">
                                    <div class="line-item-content">今日行程：槟榔谷—海螺姑娘创意文化景区 【槟榔谷黎苗文化旅游区】：是一个多民族、多文化、多形态的，集观光游览、文化展示、民俗体验、休闲娱乐为一体的少数民族型旅游景区（游览约120分钟）。 【海螺姑娘创意文化景区】：参观围绕三亚当地流传的《南海海螺姑娘传说》而精心打造的3A级景区，走进螺的海洋，贝的世界，感受创意奇观，相约海螺姑娘。（游览约60分钟）， 之后自由活动，感受让您意犹未尽的魅力三亚。
                                    </div>
                                </li>
                            </ul>
                            <div class="clear"></div>
                            <a id="day5"></a>
                            <div class="clear"></div>
                            <div class="iti-title">
                                <span>第<strong>6</strong>天</span> 三亚
                                <img src="http://ms.xktec.com/images/vehicle_plane.png">西安
                            </div>
                            <ul>
                                <li class="line-iti">
                                    <div class="line-item-content">1 根据航班时间提前三个小时安排送机。 2 抵达西安，专人接机，将客人送至西安指定地点，回到温馨的家，结束愉快的旅行。
                                    </div>
                                    <div class="line-iti-img"></div>
                                </li>
                            </ul>
                            <div class="clear"></div>
                            <p class="p_notice">以上行程仅供参考，最终行程可能会根据实际情况进行微调，敬请以出团通知为准。</p>
                        </div>`,
            priceDetail: `<ul>
                            <li>交通：含往返机票、机场建设税、燃油费。出发航班时间以机票显示时间为准；团队机票不得改签、更改或退票。</li>
                            <li>海南旅游用车为2010年投入使用的高一级空调旅游车（接、送机为普通车型），车型根据此团游客人数而定，保证每人正座车座。</li>
                            <li>
                            <p>住宿：三亚参考酒店：<span style="line-height:1.6">3晚指定酒店 （含2晚海景房）</span></p>
                        
                            <p>正扬国际、横丰酒店、二月海、梧桐墅精品、汇凯海景、水业海景、鑫兴花园、蓝海银滩、银苑临海主题、臻澜海景、铂金海景、中苑、春天假日、丽莱假日、佰思特、九里香、东方大酒店、城市运通</p>
                        
                            <p>（海景房）：鑫兴花园、蓝海银滩、二月海海景、水业海景、臻澜海景、嘉悦莱登、汇凯海景、铂金海景、海悦湾、百栎度假公寓、豪威海景、银苑临海主题、福汇楼（华蓉）酒店、春天假日、华东海景酒店、芒果海景、果喜以上指定酒店，两晚海景房（海边酒店）、一晚温泉度假酒店。全程不提供自然单间，如出现单人，请补交单住房差。<br>
                            龙沐湾：1晚五星规模 福安温泉海景酒店 一线海边 海景房 （温泉水入客房）龙沐湾福安温泉酒店<br>
                            兴隆：1晚温泉酒店&nbsp; 标准双人间&nbsp; （温泉水入客房）温泉宾馆酒店、兴隆太阳岛酒店、天健花园酒店、明珠温泉酒店、港隆酒店、金银岛酒店、明阳山庄酒店、惠康假日酒店、同发酒店</p>
                        
                            <p>海南酒店多为旅游度假酒店，标准较内地偏低。<span style="line-height:1.6">如旺季等特殊情况，因房源紧张，将安排不低于以上酒店档次的酒店。</span></p>
                            </li>
                            <li>
                            <p>餐饮：含7正5早餐。早餐为中式自助或中式围桌，正餐标准不低于20元/人/餐，安排十菜一汤，十人一桌。赠送矿泉水每人每天一瓶。特色餐安排：道家养生自助餐。</p>
                            </li>
                            <li>
                            <p>景点：含景点第一门票，以下景区电瓶车不含，游客可自由选择乘坐或徒步，不影响正常的游览：（天涯海角电瓶车15元、大小洞天电瓶车20元）。</p>
                            </li>
                            <li>
                            <p>导游：特选优秀导游贴心服务。</p>
                            </li>
                            <li>
                            <p>儿童：12周岁以下儿童收费及接待标准以确认书为准。</p>
                            </li>
                            <li>
                            <p>保险：含海南旅行社责任险（建议游客另行购买旅游意外险）。</p>
                            </li>
                            <li>
                            <p>承诺：不满意免费再玩一次（解释权归海南地接旅行社所有）。</p>
                            </li>
                        </ul>`,
            precautions: `<ul>
                            <li>海南天气炎热，请自备防暑降温药品，携带好夏季防晒霜、太阳伞、太阳帽、泳衣、拖鞋等夏季必需品。</li>
                            <li>海南酒店大堂、房间、洗手间及餐厅多为光滑地面，行走时请注意脚下，避免摔倒。</li>
                            <li>酒店退房时间为中午的12:00，晚班机的客人可把行李寄存在酒店后自由活动或自补房差开钟点房休息。</li>
                            <li>如遇人力不可抗力因素或政策性调整导致无法游览的景点，经双方友好协商，我社可调整为其他等价景区参观，如客人不同意，我社将按旅行社与景区协议价格退还景区门票；赠送景点费用不退。</li>
                            <li>旅游期间请不要私自下海游泳，也不建议在景区内海滨浴场游泳，游泳时请注意人身安全；请不要攀爬礁石，不要攀树摘花，不要从事危险活动，因此出现的安全问题旅行社及导游不承担任何责任。</li>
                            <li>注意用餐卫生，尽量少在路边小摊用餐。热带水果不宜多吃，避免过敏及腹泄情况发生。</li>
                        </ul>`
        }).save();

    });
    return db;
};