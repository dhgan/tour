var app = require('../../common/app.js');

app.controller('RegisterCtrl',['$scope', '$http', '$stateParams', '$state',
function($scope, $http, $stateParams, $state) {

    var redirect = decodeURIComponent($stateParams.redirect);

    $scope.register = function(rForm) {
        // 防多次点击
        if(rForm.submitting) return;

        rForm.submitting = new Spinner({ width: 2 }).spin(document.querySelector('.register-form'));

        var req = angular.copy($scope.user);

        delete req.password1;

        $http({
            method: 'post',
            url: '/api/tourist/register',
            data: req
        }).then(function(res) {
            rForm.submitting.stop();
            rForm.submitting = null;
            var data = res.data,
                status = data.status;
            if(status === '200') {
                swal({
                    text: '注册成功',
                    type: 'success',
                    showConfirmButton: false,
                    timer: 1000
                }).then(function() {}, function() {
                    if(redirect) {
                        try {
                            $state.go(redirect);
                        } catch(err) {
                            $state.go('home');
                        }
                    } else {
                        $state.go('home');
                    }
                });
            } else if(status === '300') {
                rForm.email.$invalid = true;
            } else if(status === '400') {
                $scope.inputError.userName = true;
            } else if(status === '500') {
                swal({
                    type: 'error',
                    text: '未知错误'
                });
            } else if(status === '600') {
                $scope.inputError.eCode = true;
                $scope.eCodeError = '邮箱验证码错误！';
            } else if(status === '601') {
                $scope.inputError.eCode = true;
                $scope.eCodeError = '邮箱验证码已过期！';
            }
        }, function(error) {
            rForm.submitting.stop();
            rForm.submitting = null;
            swal({
                type: 'error',
                text: error.data
            });
        });
    };
}]);