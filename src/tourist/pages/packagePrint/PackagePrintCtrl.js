var app = require('../../common/app.js');

app.controller('PackagePrintCtrl', ['$scope', '$http', '$stateParams', '$state', '$anchorScroll', 'PageInfo',
function ($scope, $http, $stateParams, $state, $anchorScroll, PageInfo) {


    if(!PageInfo) return;
    // 页面信息
    var status = PageInfo.status,
        userInfo = PageInfo.userInfo;
    $scope.$root.userInfo = userInfo;
    $scope.package = PageInfo.package;

    if(!$scope.package) return;

    if(status === '500') {
        return swal('', '未知错误', 'error');
    }

}]);