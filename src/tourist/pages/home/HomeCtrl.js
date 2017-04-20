var app = require('../../common/app.js');

app.controller('HomeCtrl', ['$scope', '$http', '$stateParams', '$state',
function ($scope, $http, $stateParams, $state) {
    $scope.intervalTime = 5000;
    $scope.slides = [
        {
            image: 'https://a2-q.mafengwo.net/s10/M00/76/A1/wKgBZ1j0N-SABO9sAAXHvvrSeYA45.jpeg?imageMogr2%2Finterlace%2F1',
            text: 'new image',
            id: 0
        },
        {
            image: 'https://a2-q.mafengwo.net/s10/M00/EF/F8/wKgBZ1jsuNqAY13yAAe8CqrFYNQ74.jpeg?imageMogr2%2Finterlace%2F1',
            text: 'new image',
            id: 1
        }
    ];

    $scope.packages = [
        {
            url: 'https://m.tuniucdn.com/fb2/t1/G2/M00/74/DB/Cii-T1hbhkCINUd4AB7XBb7MUOkAAF4SQIzSywAHtcd583_w640_h480_c1_t0_w640_h320_c1_t0.jpg',
            title: '泰国普吉岛6或7日游',
            price: '899.00',
            features: '0购物，15人精品小团，醉美花季骑行洱海，十里春风百亩花田，明星导游贴心服务，亲子蜜月畅游古城'
        },
        {
            url: 'https://m.tuniucdn.com/fb2/t1/G2/M00/E6/18/Cii-TFgZvlyIGKhRAAPnIr3YkYgAAEGqgL28e8AA-c6091_w640_h480_c1_t0_w640_h320_c1_t0.jpg',
            title: '泰国普吉岛6或7日游',
            price: '899.00',
            features: '0购物，15人精品小团，醉美花季骑行洱海，十里春风百亩花田，明星导游贴心服务，亲子蜜月畅游古城'
        },
        {
            url: 'https://m.tuniucdn.com/fb2/t1/G2/M00/A7/C9/Cii-TFf80PGIapBPADplLY7PuykAADRhAAuVhgAOmVF841_w640_h480_c1_t0_w640_h320_c1_t0.png',
            title: '泰国普吉岛6或7日游',
            price: '899.00',
            features: '0购物，15人精品小团，醉美花季骑行洱海，十里春风百亩花田，明星导游贴心服务，亲子蜜月畅游古城'
        },
        {
            url: 'https://m.tuniucdn.com/fb2/t1/G2/M00/23/89/Cii-TFiv7HWIe9lMAAUMarHWU8IAAHjjwElbhIABQyC965_w640_h480_c1_t0_w640_h320_c1_t0.jpg',
            title: '泰国普吉岛6或7日游',
            price: '899.00',
            features: '0购物，15人精品小团，醉美花季骑行洱海，十里春风百亩花田，明星导游贴心服务，亲子蜜月畅游古城'
        },
        {
            url: 'https://m.tuniucdn.com/fb2/t1/G2/M00/74/DB/Cii-T1hbhkCINUd4AB7XBb7MUOkAAF4SQIzSywAHtcd583_w640_h480_c1_t0_w640_h320_c1_t0.jpg',
            title: '泰国普吉岛6或7日游',
            price: '899.00',
            features: '0购物，15人精品小团，醉美花季骑行洱海，十里春风百亩花田，明星导游贴心服务，亲子蜜月畅游古城，0购物，15人精品小团，醉美花季骑行洱海，十里春风百亩花田，明星导游贴心服务，亲子蜜月畅游古城'
        },
        {
            url: 'https://m.tuniucdn.com/fb2/t1/G2/M00/E6/18/Cii-TFgZvlyIGKhRAAPnIr3YkYgAAEGqgL28e8AA-c6091_w640_h480_c1_t0_w640_h320_c1_t0.jpg',
            title: '泰国普吉岛6或7日游',
            price: '899.00',
            features: '0购物，15人精品小团，醉美花季骑行洱海，十里春风百亩花田，明星导游贴心服务，亲子蜜月畅游古城'
        },
        {
            url: 'https://m.tuniucdn.com/fb2/t1/G2/M00/A7/C9/Cii-TFf80PGIapBPADplLY7PuykAADRhAAuVhgAOmVF841_w640_h480_c1_t0_w640_h320_c1_t0.png',
            title: '泰国普吉岛6或7日游',
            price: '899.00',
            features: '0购物，15人精品小团，醉美花季骑行洱海，十里春风百亩花田，明星导游贴心服务，亲子蜜月畅游古城'
        },
        {
            url: 'https://m.tuniucdn.com/fb2/t1/G2/M00/23/89/Cii-TFiv7HWIe9lMAAUMarHWU8IAAHjjwElbhIABQyC965_w640_h480_c1_t0_w640_h320_c1_t0.jpg',
            title: '泰国普吉岛6或7日游',
            price: '899.00',
            features: '0购物，15人精品小团，醉美花季骑行洱海，十里春风百亩花田，明星导游贴心服务，亲子蜜月畅游古城'
        }
    ];

}]);