var app = require('../../common/app.js');

app.controller('CollectionCtrl', ['$scope', '$http', '$stateParams', '$state', 'PageInfo',
function ($scope, $http, $stateParams, $state, PageInfo) {

    var status = PageInfo.status;
    $scope.$root.userInfo = PageInfo.userInfo;
    if(status === '200') {
        $scope.totalItems = PageInfo.totalItems;
        $scope.currentPage = PageInfo.currentPage;
        $scope.collections = PageInfo.collections;
    } else if(status === '500') {
        return swal('', '未知错误', 'error');
    }

    $scope.$parent.currentState = $state.current.name;

    $scope.currentPage = $stateParams.p || 1;
    $scope.pageSize = $stateParams.pageSize || 10;

    $scope.maxSize = 6;

    $scope.goPage = function() {
        $state.go('member.collection', {
            p: $scope.currentPage
        });
    };

    $scope.removeCollect = function(collection) {

        if(collection.submitting) return ;

        swal({
            type: 'warning',
            text: '你确定要取消收藏吗？',
            showCancelButton: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonClass: 'btn btn-success',
            cancelButtonClass: 'btn btn-danger',
        }).then(function() {
            collection.submitting = new Spinner({ width: 2 }).spin(document.querySelector('.collection-' + collection._id));

            $http({
                method: 'post',
                url: '/api/tourist/removeCollection',
                data: {
                    collectionId: collection._id
                }
            }).then(function(res) {
                collection.submitting.stop();
                collection.submitting = null;
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
                        text: '不能取消非本人收藏！'
                    }).then(function() {}, function() {
                        $state.reload();
                    });
                } else if(status === '400') {
                    swal({
                        type: 'error',
                        text: '收藏编号错误'
                    });
                } else if(status === '500') {
                    swal({
                        type: 'error',
                        text: '未知错误'
                    });
                } else if(status === '1024') {
                    $state.go('login', {
                        redirect: 'member.collection'
                    });
                }
            }, function(error) {
                collection.submitting.stop();
                collection.submitting = null;
                swal({
                    type: 'error',
                    text: error.data
                });
            });
        }, function(){});
    };

}]);