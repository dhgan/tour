var app = require('../../common/app.js');

app.controller('OrderCtrl', ['$scope', '$http', '$stateParams', '$state', '$uibModal', 'PageInfo',
function ($scope, $http, $stateParams, $state, $uibModal, PageInfo) {

    // 页面信息
    var status = PageInfo.status;
    $scope.$root.userInfo = PageInfo.userInfo;
    if(status === '200') {
        $scope.orderList = PageInfo.orderList;
        $scope.totalItems = PageInfo.totalItems;
    } else if(status === '500') {
        return swal('', '未知错误', 'error');
    }

    $scope.$parent.currentState = $state.current.name;


    $scope.currentPage = $stateParams.p || 1;
    $scope.pageSize = $stateParams.pageSize || 10;
    $scope.maxSize = 6;

    $scope.goPage = function() {
        $state.go('member.order', {
            p: $scope.currentPage
        });
    };

    $scope.cancelOrder = function(order) {

        if(order.submitting) return ;

        swal({
            type: 'warning',
            text: '你确定要取消订单吗？',
            showCancelButton: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonClass: 'btn btn-success',
            cancelButtonClass: 'btn btn-danger',
        }).then(function() {
            order.submitting = new Spinner({ width: 2 }).spin(document.querySelector('.order-' + order._id));

            $http({
                method: 'post',
                url: '/api/tourist/cancelOrder',
                data: {
                    orderId: order._id
                }
            }).then(function(res) {
                order.submitting.stop();
                order.submitting = null;
                var data = res.data,
                    status = data.status;
                if(status === '200') {
                    swal({
                        type: 'success',
                        text: '取消成功',
                        showConfirmButton: false,
                        timer: 1500
                    }).then(function() {}, function() {
                        $state.reload();
                    });
                } else if(status === '300') {
                    swal({
                        type: 'error',
                        text: '不能取消非本人订单！'
                    }).then(function() {}, function() {
                        $state.reload();
                    });
                } else if(status === '400') {
                    swal({
                        type: 'error',
                        text: '订单编号错误'
                    });
                } else if(status === '500') {
                    swal({
                        type: 'error',
                        text: '未知错误'
                    });
                } else if(status === '600') {
                    swal({
                        type: 'error',
                        text: '订单已被取消，请勿重复取消'
                    });
                } else if(status === '700') {
                    swal({
                        type: 'error',
                        text: '订单已支付，不能取消'
                    });
                } else if(status === '1024') {
                    $state.go('login', {
                        redirect: 'member.order'
                    });
                }
            }, function(error) {
                order.submitting.stop();
                order.submitting = null;
                swal({
                    type: 'error',
                    text: error.data
                });
            });
        }, function(){});
    };

    $scope.payOrder = function(order) {
        $state.go('pay', {
            orderId: order._id
        });
    };

    $scope.commentOrder = function(order) {

        var modalInstance =  $uibModal.open({
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'commentBox.html',
            controller: ['$scope', function($scope) {
                $scope.order = order;
                $scope.comment = {
                    star: 0,
                    content: ''
                };

                $scope.clickStar = function(star) {
                    $scope.comment.star = star;
                };

                $scope.submitComment = function(cForm) {
                    // 防多次点击
                    if(cForm.submitting) return;

                    cForm.submitting = new Spinner({ width: 2 }).spin(document.querySelector('.comment-form'));

                    var req = {
                        orderId: order._id,
                        star: $scope.comment.star,
                        content: $scope.comment.content
                    };

                    $http({
                        method: 'post',
                        url: '/api/tourist/comment',
                        data: req
                    }).then(function(res) {
                        cForm.submitting.stop();
                        cForm.submitting = null;
                        var data = res.data,
                            status = data.status;
                        if(status === '200') {
                            swal({
                                type: 'success',
                                text: '评论成功',
                                showConfirmButton: false,
                                timer: 1000
                            }).then(function(){}, function() {
                                modalInstance.close();
                                $state.reload();
                            });
                        } else if(status === '300') {
                            swal({
                                type: 'error',
                                text: '不能评论非本人订单'
                            }).then(function() {}, function() {
                                $state.reload();
                            });
                        } else if(status === '400') {
                            swal({
                                type: 'error',
                                text: '订单编号错误'
                            });
                        } else if(status === '500') {
                            swal({
                                type: 'error',
                                text: '未知错误'
                            });
                        } else if(status === '600') {
                            swal({
                                type: 'error',
                                text: '订单已被取消，不能评论'
                            });
                        } else if(status === '700') {
                            swal({
                                type: 'error',
                                text: '订单未支付，不能评论'
                            });
                        } else if(status === '900') {
                            swal({
                                type: 'error',
                                text: '订单已被评论，不能重复评论'
                            });
                        } else if(status === '1024') {
                            $state.go('login', {
                                redirect: 'member.order'
                            });
                        }

                    }, function(err) {
                        cForm.submitting.stop();
                        cForm.submitting = null;
                        swal('', err.data, 'error');
                    });
                };

                $scope.cancelComment = function() {
                    modalInstance.dismiss();
                };
            }]
        });
        modalInstance.result.then(function(){}, function(){});
    };



}]);