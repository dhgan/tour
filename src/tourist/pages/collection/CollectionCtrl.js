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
        swal('未知错误');
    }

    $scope.$parent.currentState = $state.current.name;

    $scope.currentPage = $stateParams.p || 1;
    $scope.pageSize = $stateParams.pageSize || 10;

    $scope.maxSize = 6;

    $scope.goPage = function() {
        $state.go('member.collection', {
            p: $scope.currentPage,
            pageSize: $scope.pageSize
        });
    };

    $scope.removeCollect = function(collection) {

        if(collection.submitting) return ;

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
            } else if(status === '500') {
                swal({
                    type: 'error',
                    text: '未知错误'
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
    };

}]);