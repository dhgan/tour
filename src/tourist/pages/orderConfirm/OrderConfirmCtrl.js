var app = require('../../common/app.js');

app.controller('OrderConfirmCtrl', ['$scope', '$http', '$stateParams', '$state', 'PageInfo',
function ($scope, $http, $stateParams, $state, PageInfo) {

    if(!PageInfo) return;

    // 页面信息
    $scope.$root.userInfo = PageInfo.userInfo;
    var status = PageInfo.status;
    if(status === '200') {
        $scope.order = PageInfo.order;
        $scope.package = PageInfo.package;
    } else if(status === '300') {
        return swal('', '时间错误', 'error');
    } else if(status === '400') {
        return swal('', '旅游套餐编号错误', 'error');
    } else if(status === '500') {
        return swal('', '未知错误', 'error');
    }

    $scope.order.date = moment($scope.order.date).format('YYYY-MM-DD');

    $scope.orderIt = function(cForm) {
        if(cForm.submitting) return ;

        cForm.submitting = new Spinner({ width: 2 }).spin(document.querySelector('.total'));

        var req = {
            packageId: $scope.package._id,
            number: $scope.order.number,
            date: $scope.order.date,
            name: $scope.order.name,
            tel: $scope.order.tel
        };

        $http({
            method: 'post',
            url: '/api/tourist/orderSubmit',
            data: req
        }).then(function(res) {
            cForm.submitting.stop();
            cForm.submitting = null;

            var data = res.data,
                status = data.status;
            if(status === '200') {
                $state.go('pay', {
                    orderId: data.orderId
                });
            } else if(status === '300') {
                swal('', '时间错误', 'error');
            } else if(status === '400') {
                swal('', '旅游套餐编号错误', 'error');
            } else if(status === '500') {
                swal('', '未知错误', 'error');
            } else if(status === '600') {
                swal('', '库存不足', 'error');
            } else if(status === '1024') {
                return $state.go('login', {
                    redirect: encodeURIComponent('orderConfirm?' + JSON.stringify({packageId: $scope.package._id, date: $scope.order.date, number: $scope.order.number})),
                });
            }
        }, function(error) {
            cForm.submitting.stop();
            cForm.submitting = null;
            swal(error.data);
        });
    }


}]);