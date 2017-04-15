var app = require('./app');

app.directive('showTips', function() {
    return {
        restrict: 'A',
        link: function($scope, elem, attr, ctrl) {
            $scope.inputError = {};
            $scope.inputError[attr.name] = false;
            elem.on('focus', function() {
                $scope.inputError[attr.name] = false;
            });
        }
    }
}).directive('showTime',['$interval', function($interval) {
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