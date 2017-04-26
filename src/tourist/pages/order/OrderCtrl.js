var app = require('../../common/app.js');

app.controller('OrderCtrl', ['$scope', '$http', '$stateParams', '$state', 'PageInfo',
function ($scope, $http, $stateParams, $state, PageInfo) {

    // 页面信息
    var status = PageInfo.status;
    if(status === '200') {
        $scope.userInfo = PageInfo.userInfo;

        PageInfo.orderList.forEach(function(value) {
            value.createDate = moment(value.createDate).format('YYYY-MM-DD HH:mm:ss');
        });
        $scope.orderList = PageInfo.orderList;
        $scope.totalItems = PageInfo.totalItems;
    }


    $scope.currentPage = $stateParams.p || 1;
    $scope.maxSize = 6;

    $scope.goPage = function() {
        $state.go('order', {
            p: $scope.currentPage
        });
    };


}]);