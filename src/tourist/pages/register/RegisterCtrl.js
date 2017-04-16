var app = require('../../common/app.js');

app.controller('RegisterCtrl',['$scope', '$http', '$stateParams', '$state',
function($scope, $http, $stateParams, $state) {

    $scope.register = function(rForm) {
        // 防多次点击
        if(rForm.submitting) return;

        rForm.submitting = true;

        var req = _.clone($scope.user);

        delete req.password1;

        $http({
            method: 'post',
            url: '/api/tourist/register',
            data: req
        }).then(function(res) {
            rForm.submitting = false;
            var data = res.data,
                status = data.status;
            if(status === '200') {
                alert('注册成功');
                var redirect = decodeURIComponent($stateParams.redirect);
                if(redirect) {
                    try {
                        $state.go(redirect);
                    } catch(err) {
                        $state.go('index');
                    }
                }
            } else if(status === '300') {
                rForm.email.$invalid = true;
            } else if(status === '400') {
                $scope.inputError.userName = true;
            } else if(status === '500') {
                alert('未知错误');
            } else if(status === '600') {
                $scope.inputError.eCode = true;
                $scope.eCodeError = '邮箱验证码错误！';
            } else if(status === '601') {
                $scope.inputError.eCode = true;
                $scope.eCodeError = '邮箱验证码已过期！';
            }
        }, function(error) {
            rForm.submitting = false;
            alert('网络错误');
        });
    };
}]);