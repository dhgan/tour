var app = require('../../common/app.js');

app.controller('HomeCtrl', ['$rootScope', '$scope', '$http', '$stateParams', '$state', 'PageInfo',
function ($rootScope, $scope, $http, $stateParams, $state, PageInfo) {
    $scope.intervalTime = 5000;

    var status = PageInfo.status;
    if(status === '200') {
        $scope.userInfo = PageInfo.userInfo;

        $scope.hasPackage = PageInfo.packages.length > 0;
        $scope.slides = PageInfo.slides;
        $scope.packages = PageInfo.packages;
    }

}]);