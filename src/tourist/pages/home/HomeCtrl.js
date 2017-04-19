var app = require('../../common/app.js');

app.controller('HomeCtrl', ['$scope', '$http', '$stateParams', '$state',
function ($scope, $http, $stateParams, $state) {
    $scope.intervalTime = 2000;
    $scope.slides = [
        {
            image: 'https://img.alicdn.com/simba/img/TB1viZRPVXXXXctaXXXSutbFXXX.jpg',
            text: 'new image',
            id: 0
        },
        {
            image: 'https://img.alicdn.com/simba/img/TB1hMnJQpXXXXbKapXXSutbFXXX.jpg',
            text: 'new image',
            id: 1
        }
    ];

}]);