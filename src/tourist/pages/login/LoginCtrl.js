var app = require('../../common/app.js');

app.controller('LoginCtrl', ['$scope', '$http', '$stateParams', '$state',
function ($scope, $http, $stateParams, $state) {

    function refreshCaptcha() {
        $scope.captchaSrc = 'api/common/captcha?d='+ Math.random();
    }

    $scope.refreshCaptcha = refreshCaptcha;

    refreshCaptcha();

    $scope.login = function(lForm) {

        // 防多次点击
        if(lForm.submitting) return;

        lForm.submitting = true;

        var req = $scope.user;

        $http({
            method: 'post',
            url: '/api/tourist/login',
            data: req
        }).then(function(res) {
            lForm.submitting = false;
            var data = res.data,
                status = data.status;
            $scope.formError = true;
        }, function(error) {
            lForm.submitting = false;
        });
    };
}]);