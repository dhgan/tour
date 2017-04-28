var app = require('../../common/app.js');

app.controller('UserCtrl', ['$scope', '$http', '$stateParams', '$state', 'PageInfo',
function ($scope, $http, $stateParams, $state, PageInfo) {

    var status = PageInfo.status;
    if(status === '200') {
        $scope.$root.userInfo = PageInfo.userInfo;
    }

    $scope.$parent.currentState = $state.current.name;

}]);