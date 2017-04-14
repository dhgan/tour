var app = require('../../common/app.js');

app.controller('RegisterCtrl',['$scope', 'commonService', function($scope, commonService) {

    $scope.sending = false;

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
            $scope.sending = false;
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

    $scope.register = function(rForm) {
        // 防多次点击
        if(rForm.register) return;

        $scope.register = true;

        var req = $scope.user;

        delete req.password1;

        console.log(req);
    }
}]);