var app = require('../../common/app.js');

app.controller('SearchCtrl',['$scope', '$http', '$stateParams', '$state', 'PageInfo',
function($scope, $http, $stateParams, $state, PageInfo) {

    var queryStr = $stateParams.q;

    if(!queryStr) return $state.go('home');

    var status = PageInfo.status;
    if(status === '200') {
        $scope.$root.userInfo = PageInfo.userInfo;

        $scope.totalItems = PageInfo.totalItems;
        $scope.packages = PageInfo.packages;
    }

    $scope.queryStr = queryStr;
    $scope.curretQueryStr = queryStr;

    $scope.currentPage = $stateParams.p || 1;

    $scope.maxSize = 6;

    $scope.goPage = function() {
        $state.go('search', {
            p: $scope.currentPage,
            q: queryStr
        });
    };
}]);