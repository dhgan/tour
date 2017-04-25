var app = require('../../common/app.js');

app.controller('SearchCtrl',['$scope', '$http', '$stateParams', '$state', 'PageInfo',
function($scope, $http, $stateParams, $state, PageInfo) {

    var queryStr = $stateParams.q;

    if(!queryStr) return $state.go('home');

    $scope.queryStr = queryStr;
    $scope.curretQueryStr = queryStr;

    var currentPage = $stateParams.p || 1;

    var status = PageInfo.status;
    if(status === '200') {
        $scope.userInfo = PageInfo.userInfo;

        $scope.totalItems = PageInfo.totalItems;
        $scope.packages = PageInfo.packages;
    }

    $scope.currentPage = currentPage;

    $scope.maxSize = 5;

    $scope.goPage = function() {
        $state.go('search', {
            p: $scope.currentPage,
            q: queryStr
        });
    };
}]);