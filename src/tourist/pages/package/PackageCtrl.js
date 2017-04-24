var app = require('../../common/app.js');

app.controller('PackageCtrl', ['$scope', '$http', '$stateParams', '$state', '$anchorScroll',
function ($scope, $http, $stateParams, $state, $anchorScroll) {

    $scope.intervalTime = 5000;
    $scope.slides = [
        {
            image: 'https://m.tuniucdn.com/fb2/t1/G2/M00/74/DB/Cii-T1hbhkCINUd4AB7XBb7MUOkAAF4SQIzSywAHtcd583_w640_h480_c1_t0_w640_h320_c1_t0.jpg',
            text: 'new image',
            id: 0
        },
        {
            image: 'https://m.tuniucdn.com/fb2/t1/G2/M00/A7/C9/Cii-TFf80PGIapBPADplLY7PuykAADRhAAuVhgAOmVF841_w640_h480_c1_t0_w640_h320_c1_t0.png',
            text: 'new image',
            id: 1
        },
        {
            image: 'https://m.tuniucdn.com/fb2/t1/G2/M00/23/89/Cii-TFiv7HWIe9lMAAUMarHWU8IAAHjjwElbhIABQyC965_w640_h480_c1_t0_w640_h320_c1_t0.jpg',
            text: 'new image',
            id: 2
        }
    ];

    $scope.package = {
        url: 'https://m.tuniucdn.com/fb2/t1/G2/M00/74/DB/Cii-T1hbhkCINUd4AB7XBb7MUOkAAF4SQIzSywAHtcd583_w640_h480_c1_t0_w640_h320_c1_t0.jpg',
        title: '豪门盛宴昆大丽洱海游船双飞6日游',
        packageId: '1',
        departure_city: '西安',
        price: '899.00',
        features: '0购物，15人精品小团，醉美花季骑行洱海，十里春风百亩花田，明星导游贴心服务，亲子蜜月畅游古城',
        days: 8
    };

    $scope.open = function () {
        $scope.openDatepicker = true;
    };

    $scope.dateOptions = {
        showWeeks: false
    };

    $scope.num = 1;
    $scope.stock = 8;
    $scope.price = 899.00;
    $scope.totalPrice = '--';
    $scope.changeNum = function(n) {
        var num = $scope.num;
        if((num <= 1 && -1 === n) || (num >= $scope.stock && 1 === n)) return;
        $scope.num = num + n;
        $scope.totalPrice = ($scope.num * $scope.price).toFixed(2);
    };

    $scope.checkState = function() {
        var val = $scope.num;
        for(var i=val.length-1; i>=0; i--){
            var char = val.charAt(i);
            if(!(char>='0'&&char<='9')){
                val = val.substr(0, i)+val.substr(i+1);
            }
        }
        val = val.replace(/^0$/, function () {
            return '1';
        });
        if(!val) val = 1;
        $scope.num = val > $scope.stock ? $scope.stock : parseInt(val);
        $scope.totalPrice = ($scope.num * $scope.price).toFixed(2);
    };


    $scope.tabs = [
        {
            title:'产品特色',
            content:'<p>精选昆明五星级酒店|温泉+高尔夫挥杆体验 ，让疲惫远离你的身心<br>五味俱全（全程指定特色民族餐饮）<br>精选云南地道民族美食，纳西火塘鸡∣洱海砂锅鱼∣过桥米线∣宜良烤鸭<br>山水胜景<br>安排云南知名景点<br>AAAAA级景区：玉龙雪山（冰川大索道）∣石林<br>AAAA级景区：南诏风情岛|洱海大游船<br>人气景区：大理古城∣丽江古城|丽江恋歌<br>豪华赠礼<br> </p>'
        },
        {
            title:'行程详情',
            content:'西安乘机赴昆明长水国际机场西安贵宾今日乘机抵达昆明长水国际机场，我社将安排接机人员于机场1号出口为您接机，并安排商务专车送至酒店办理入住手续。考虑您长途跋涉和进入高原地区，为避免出现身体不适应，我社今日将无行程安排，并为为您安排温泉酒店。第2天 昆明大理丽江早餐后，乘车前往大理，抵达后品尝午餐“白族风味餐”，用餐后游览历史文化名城【大理古城】（游览60分钟，含古城维护费，电瓶车35元/人，），游览大理经典景区【蝴蝶泉】（游览40分钟）。结束后乘车至丽江，抵达后品尝晚餐“马帮菜”，用餐后游览国家AAAAA级景区【丽江古城】（古城为开放式景区，各位贵宾请自行游览），结束后入住酒店休息。'
        },
        {
            title: '费用说明',
            content: '1、交通标准：西安/昆明往返机票(具体航班时刻仅供参考,以当日航空公司实际公布时间为准)及机场建设费及燃油费，当地空调旅游车（当地地接社将视具体团队人数安排用      车，保证每人一正座）。'
        },
        {
            title: '注意事项',
            content: '★药品：自备常用感冒药、肠胃药、晕船晕车药等。★安全：在自由活动期间请注意安全，妥善保管好您的随身物品，以免丢失。'
        },
        {
            title: '用户点评',
            content: ''
        }
    ];

    $scope.gotoAnchor = function(anchor) {
        $anchorScroll(anchor);
    };

}]);