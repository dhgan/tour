var app = require('../../common/app.js');

app.controller('PackageCtrl', ['$scope', '$http', '$stateParams', '$state', '$anchorScroll', 'PageInfo',
function ($scope, $http, $stateParams, $state, $anchorScroll, PageInfo) {

    // 页面信息
    var status = PageInfo.status;
    if(status === '200') {
        $scope.userInfo = PageInfo.userInfo;

        $scope.package = PageInfo.package;
    }

    $scope.status = {
        featuresOpen: true,
        detailOpen: true,
        priceDetailOpen: true,
        precautionsOpen: true
    };


    $scope.intervalTime = 5000;

    $scope.openDatepicker = function () {
        $scope.datepickerOpening = true;
    };

    $scope.dateOptions = {
        showWeeks: false,
        yearRows: 1,
        yearColumns: 3,
        startingDay: 1,
        formatDayTitle: 'yyyy MMMM',
        minDate: moment(new Date()).add('day', 1),
        dateDisabled: function (obj) {
            var formatStr = 'YYYY-MM-DD';
            if(obj.mode === 'day') {
                formatStr = 'YYYY-MM-DD';
            } else if(obj.mode ===  'month') {
                formatStr = 'YYYY-MM';
            } else if(obj.mode === 'year') {
                formatStr = 'YYYY';
            }

            return PageInfo.package.choices.every(function(choice) {
                return  moment(choice.date).format(formatStr) !== moment(obj.date).format(formatStr);
            });
        }
    };

    // 选择日期
    $scope.dateChange = function() {
        var date = $scope.dt;
        PageInfo.package.choices.forEach(function(choice) {
         if(moment(date).format('YYYY-MM-DD') === moment(choice.date).format('YYYY-MM-DD')) {
             $scope.choice = {
                stock: choice.left,
                price: choice.price
             };
             $scope.checkState();
             return;
         }
        });
    };

    $scope.num = 1;
    $scope.totalPrice = '--';
    $scope.changeNum = function(n) {
        // 未选择日期
        if(!$scope.choice) {
            $scope.num += n;
            return;
        }
        var num = parseInt($scope.num),
            stock = parseInt($scope.choice.stock);
        if((num <= 1 && -1 === n) || (num >= stock && 1 === n)) return;
        $scope.num = num + n;
        $scope.totalPrice = ($scope.num * $scope.choice.price).toFixed(2);
    };

    $scope.checkState = function() {
        if(!$scope.choice) return; // 未选择日期
        var val = '' + $scope.num,
            stock = parseInt($scope.choice.stock);
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
        $scope.num = val > stock ? stock : parseInt(val);
        $scope.totalPrice = ($scope.num * $scope.choice.price).toFixed(2);
    };

    $scope.gotoAnchor = function(anchor) {
        $anchorScroll(anchor);
    };

    $scope.orderIt = function() {
        var req = {
            packageId: $stateParams.packageId,
            number: $scope.num,
            date: moment($scope.dt).format('YYYY-MM-DD'),
            price: $scope.choice.price
        };

        $http({
            method: 'post',
            url: '/api/tourist/order',
            data: req
        }).then(function(res) {
            var data = res.data,
                status = data.status;
            if(status === '200') {
                swal('下单成功');
            }
        }, function(error) {
            swal(error.data);
        });
    };

}]);