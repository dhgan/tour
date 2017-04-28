var app = require('../../common/app.js');

app.controller('ChangeEmailCtrl', ['$scope', '$http', '$stateParams', '$state', 'PageInfo',
function ($scope, $http, $stateParams, $state, PageInfo) {

    var status = PageInfo.status;
    if(status === '200') {
        $scope.$root.userInfo = PageInfo.userInfo;
    }

    $scope.$parent.currentState = $state.current.name;

    $scope.eType = '200';

    $scope.changeEmail = function(cForm) {

        // 防多次点击
        if(cForm.submitting) return;

        cForm.submitting = new Spinner({ width: 2 }).spin(document.querySelector('.change-form'));

        var req = $scope.user;

        $http({
            method: 'post',
            url: '/api/tourist/changeEmail',
            data: req
        }).then(function(res) {
            cForm.submitting.stop();
            cForm.submitting = null;
            var data = res.data,
                status = data.status;
            if(status === '200') {
                $scope.user = {};
                cForm.$setPristine();
                cForm.$setUntouched();
                swal({
                    text: '修改成功',
                    type: 'success',
                    showConfirmButton: false,
                    timer: 1000
                }).catch(swal.noop);
            } else if(status === '300') {
                cForm.email.$invalid = true;
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
            } else if(status === '1024') {
                $state.go('login', {
                    redirect: 'member.changeEmail'
                });
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