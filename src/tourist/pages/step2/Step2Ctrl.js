var app = require('../../common/app.js');

app.controller('Step2Ctrl', ['$scope', '$http', '$stateParams', '$state', 'PageInfo',
function ($scope, $http, $stateParams, $state, PageInfo) {

    $scope.email = PageInfo.email;

    $scope.eType = '300';

    $scope.resetPassword = function(cForm) {

        // 防多次点击
        if(cForm.submitting) return;

        cForm.submitting = new Spinner({ width: 2 }).spin(document.querySelector('.reset-form'));

        var req = angular.copy($scope.user);

        delete req.password1;
        delete req.email;

        $http({
            method: 'post',
            url: '/api/tourist/resetPassword',
            data: req
        }).then(function(res) {
            cForm.submitting.stop();
            cForm.submitting = null;
            var data = res.data,
                status = data.status;
            if(status === '200') {
                swal({
                    text: '修改成功',
                    type: 'success',
                    showConfirmButton: false,
                    timer: 1000
                }).then(function() {}, function() {
                    $state.go('login');
                });
            } else if(status === '300') {
                $scope.inputError.eCode = true;
                $scope.eCodeError = '邮箱验证码错误！';
            } else if(status === '400') {
                $scope.inputError.eCode = true;
                $scope.eCodeError = '邮箱验证码已过期！';
            } else if(status === '500') {
                swal({
                    type: 'error',
                    text: '未知错误'
                });
            } else if(status === '1000') {
                swal({
                    type: 'error',
                    text: '用户名验证过期，请重新验证'
                }).then(function() {
                    $state.go('forgetPassword.step1');
                }, function() {});
            }
        }, function(error) {
            cForm.submitting.stop();
            cForm.submitting = null;
            swal({
                type: 'error',
                text: error.data
            });
        });

    }

}]);