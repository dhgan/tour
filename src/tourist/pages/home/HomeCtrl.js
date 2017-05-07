var app = require('../../common/app.js');

app.controller('HomeCtrl', ['$rootScope', '$scope', '$http', '$stateParams', '$state', 'PageInfo',
function ($rootScope, $scope, $http, $stateParams, $state, PageInfo) {
    $scope.intervalTime = 5000;

    var status = PageInfo.status;
    if(status === '200') {
        $scope.$root.userInfo = PageInfo.userInfo;
        var packages = PageInfo.packages;
        $scope.hasPackage = packages && packages.length > 0;
        $scope.slides = PageInfo.slides;
        $scope.packages = packages;
    }

}]);