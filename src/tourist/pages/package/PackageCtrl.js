var app = require('../../common/app.js');

app.controller('PackageCtrl', ['$scope', '$http', '$stateParams', '$state', '$anchorScroll', 'PageInfo',
function ($scope, $http, $stateParams, $state, $anchorScroll, PageInfo) {

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

    $scope.gotoAnchor = function(anchor) {
        $anchorScroll(anchor);
    };

}]);