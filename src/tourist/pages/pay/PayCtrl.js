var app = require('../../common/app.js');

app.controller('PayCtrl', ['$scope', '$http', '$stateParams', '$state', 'PageInfo',
function ($scope, $http, $stateParams, $state, PageInfo) {

    if(!PageInfo) return $state.go('home');

    // 页面信息
    $scope.$root.userInfo = PageInfo.userInfo;
    var status = PageInfo.status;
    if(status === '200') {
        $scope.order = PageInfo.order;
    } else if(status === '300') {
        swal('', '非本人订单', 'error').then(function() {
            $state.go('member.order');
        }, function() {});
    } else if(status === '400') {
        swal('', '订单编号错误', 'error').then(function() {
            $state.go('member.order');
        }, function() {});
    } else if(status === '500') {
        swal('', '未知错误', 'error').then(function() {
            $state.go('member.order');
        }, function() {});
    } else if(status === '600') {
        swal({
            type: 'error',
            text: '订单已被取消, 不能支付！'
        }).then(function() {
            $state.go('member.order');
        }, function() {});
    } else if(status === '700') {
        swal({
            type: 'error',
            text: '订单已支付, 不能重复支付！'
        }).then(function() {
            $state.go('member.order');
        });
    }

    $scope.pay = function() {
        swal({
            type: 'question',
            title: '支付订单？',
            showCancelButton: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonClass: 'btn btn-success',
            cancelButtonClass: 'btn btn-danger',
        }).then(function() {
            $scope.paying = new Spinner({ width: 2 }).spin(document.querySelector('swal2-modal'));

            $http({
                method: 'post',
                url: '/api/tourist/pay',
                data: {
                    orderId: $scope.order._id
                }
            }).then(function(res) {
                $scope.paying.stop();
                $scope.paying = null;
                var data = res.data,
                    status = data.status;
                if(status === '200') {
                    swal({
                        type: 'success',
                        text: '支付成功',
                        showConfirmButton: false,
                        timer: 1500
                    }).then(function() {}, function() {
                        $state.go('member.order');
                    });
                } else if(status === '300') {
                    swal({
                        type: 'error',
                        text: '不能支付非本人订单！'
                    }).then(function() {
                        $state.go('member.order');
                    }, function() {});
                } else if(status === '400') {
                    swal({
                        type: 'error',
                        text: '订单编号错误'
                    }).then(function() {
                        $state.go('member.order');
                    }, function() {});
                } else if(status === '500') {
                    swal({
                        type: 'error',
                        text: '未知错误'
                    });
                } else if(status === '600') {
                    swal('', '订单已被取消, 不能支付', 'error').then(function() {
                        $state.go('member.order');
                    }, function() {});
                } else if(status === '700') {
                    swal('', '订单已支付, 不能重复支付', 'error').then(function() {
                        $state.go('member.order');
                    }, function() {});
                } else if(status === '1024') {
                    return $state.go('login', {
                        redirect: encodeURIComponent('pay?' + JSON.stringify({orderId: PageInfo.order.orderId})),
                    });
                }
            }, function(error) {
                $scope.paying.stop();
                $scope.paying = null;
                swal({
                    type: 'error',
                    text: error.data
                });
            });
        }, function(){});
    };

}]);