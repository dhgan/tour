var app = require('../../common/app.js');

app.controller('Step1Ctrl', ['$scope', '$http', '$stateParams', '$state',
function ($scope, $http, $stateParams, $state) {

    function refreshCaptcha() {
        $scope.captchaSrc = 'api/common/captcha?d='+ Math.random();
    }

    $scope.refreshCaptcha = refreshCaptcha;

    refreshCaptcha();


    $scope.validateName = function(vForm) {

        // 防多次点击
        if(vForm.submitting) return;

        vForm.submitting = new Spinner({ width: 2 }).spin(document.querySelector('.validate-form'));

        var req = $scope.user;

        $http({
            method: 'post',
            url: '/api/tourist/validateName',
            data: req
        }).then(function(res) {
            vForm.submitting.stop();
            vForm.submitting = null;
            refreshCaptcha();
            var data = res.data,
                status = data.status;
            if(status === '200') {
                $state.go('forgetPassword.step2');
            } else if(status === '300') {
                $scope.inputError.captcha = true;
            } else if(status === '400') {
                $scope.inputError.userName = true;
            } else if(status === '500') {
                swal({
                    type: 'error',
                    text: '未知错误'
                });
            }
        }, function(error) {
            vForm.submitting.stop();
            vForm.submitting = null;
            swal({
                type: 'error',
                text: error.data
            });
        });

    }

}]);