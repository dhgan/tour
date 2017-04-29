var app = require('../../common/app.js');

app.controller('LoginCtrl', ['$scope', '$http', '$stateParams', '$state',
function ($scope, $http, $stateParams, $state) {

    var redirect = decodeURIComponent($stateParams.redirect),
        i = redirect.indexOf('?'),
        params = JSON.parse(redirect.substr(i+1)),
        redirect = redirect.substr(0, i);

    function refreshCaptcha() {
        $scope.captchaSrc = 'api/common/captcha?d='+ Math.random();
    }

    $scope.refreshCaptcha = refreshCaptcha;

    refreshCaptcha();

    $scope.login = function(lForm) {

        // 防多次点击
        if(lForm.submitting) return;

        lForm.submitting = new Spinner({ width: 2 }).spin(document.querySelector('.login-form'));

        var req = $scope.user;

        $http({
            method: 'post',
            url: '/api/tourist/login',
            data: req
        }).then(function(res) {
            lForm.submitting.stop();
            lForm.submitting = null;
            refreshCaptcha();
            var data = res.data,
                status = data.status;
            if(status === '200') {
                if(redirect) {
                    try {
                        $state.go(redirect, params);
                    } catch(err) {
                        $state.go('home');
                    }
                } else {
                    $state.go('home');
                }
            } else if(status === '300') {
                $scope.inputError.captcha = true;
            } else if(status === '400') {
                $scope.formError = true;
            } else if(status === '500') {
                swal({
                    type: 'error',
                    text: '未知错误'
                });
            }
        }, function(error) {
            lForm.submitting.stop();
            lForm.submitting = null;
            refreshCaptcha();
            swal({
                type: 'error',
                text: error.data
            });
        });
    };
}]);