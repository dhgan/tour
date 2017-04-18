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
}).directive('showTime',['$interval', 'commonService', function($interval, commonService) {
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

            $scope.sendCode = function(rForm) {
                // 防多次点击
                if($scope.sending) return;

                // 邮件格式错误或邮件为空
                if(rForm.email.$invalid) {
                    rForm.email.$touched = true;
                    return;
                }

                $scope.sending = true;

                var req = {
                    email: $scope.user.email,
                    eType: '100'
                };

                commonService.getECode(req).then(function(res) {
                    var data = res.data,
                        status = data.status;
                    if(status === '300') {
                        rForm.email.$invalid = true;
                    }
                }, function() {
                    $scope.sending = false;
                    alert('网络错误');
                });
            };

            function showLeftTime(leftTime) {
                $scope.leftTime = leftTime + '秒';
                timer = $interval(function() {
                    leftTime--;
                    if(0 == leftTime) {
                        clearInterval(timer);
                        $scope.sending = false;
                    } else {
                        $scope.leftTime = leftTime + '秒';
                    }
                }, 1000);
            }
        }
    }
}]);