var app = require('./app');

app.directive('emailValidate', function() {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function($scope, elem, attr, ctrl) {
            var emailReg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/i;
            ctrl.$validators.email = function(modelValue) {
                return emailReg.test(modelValue);
            }
        }
    }
}).directive('showTips', function() {
    return {
        restrict: 'A',
        link: function($scope, elem, attr, ctrl) {
            $scope.inputError = {};
            $scope.inputError[attr.name] = false;
            elem.on('focus keyup', function() {
                $scope.inputError[attr.name] = false;
                $scope.formError = false;
            });
        }
    }
}).directive('showTime',['$interval', '$state', 'commonService', function($interval, $state, commonService) {
    return {
        restrict: 'A',
        link: function($scope, elem, attr, ctrl) {
            var otpTime = localStorage.getItem('otpTime'),
                leftTime = otpTime - new Date(),
                leftTime = Math.floor(leftTime/1000),
                timer = null;

            if(leftTime > 0) {
                $scope.sending = true;
                showLeftTime(leftTime);
            } else {
                $scope.sending = false;
            }
            $scope.$watch('sending', function(newValue, oldValue) {
                if(newValue === true && oldValue === false) {
                    localStorage.setItem('otpTime', +new Date() + 1000 * 60);
                    leftTime = 60;
                    showLeftTime(leftTime);
                } else if(newValue === false) {
                    $interval.cancel(timer);
                }
            });

            $scope.sendCode = function(form) {
                // 防多次点击
                if($scope.sending) return;

                // 邮件格式错误或邮件为空
                if(form.email.$invalid) {
                    form.email.$touched = true;
                    return;
                }

                $scope.sending = true;

                var req = {};
                if($scope.eType === '300') {
                    req = {
                        eType: $scope.eType
                    };
                } else {
                    req = {
                        email: $scope.user.email,
                        eType: $scope.eType
                    };
                }


                commonService.getECode(req).then(function(res) {
                    var data = res.data,
                        status = data.status;
                    if(status === '200') return ;
                    if(status === '300') {
                        form.email.$invalid = true;
                    } else if(status === '1000') {
                        swal({
                            type: 'error',
                            text: '用户名验证过期，请重新验证'
                        }).then(function() {
                            $state.go('forgetPassword.step1');
                        }, function() {});
                    } else if(status === '1024') {
                        swal({
                            type: 'error',
                            text: '登录状态失效，请重新登录'
                        }).then(function() {
                            $state.reload();
                        }, function() {});
                    } else {
                        swal({
                            type: 'error',
                            text: '未知错误'
                        });
                    }
                }, function(error) {
                    $scope.sending = false;
                    swal({
                        type: 'error',
                        text: error.data
                    });
                });
            };

            function showLeftTime(leftTime) {
                $scope.leftTime = leftTime + '秒';
                timer = $interval(function() {
                    leftTime--;
                    if(0 == leftTime) {
                        $scope.sending = false;
                    } else {
                        $scope.leftTime = leftTime + '秒';
                    }
                }, 1000);
            }
        }
    }
}]);