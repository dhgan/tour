var app = require('../../common/app.js');

app.controller('CollectionCtrl', ['$scope', '$http', '$stateParams', '$state', 'PageInfo',
function ($scope, $http, $stateParams, $state, PageInfo) {

    var status = PageInfo.status;
    if(status === '200') {
        $scope.userInfo = PageInfo.userInfo;

        $scope.totalItems = PageInfo.totalItems;
        $scope.packages = PageInfo.packages;
    }

    $scope.currentPage = $stateParams.p || 1;

    $scope.maxSize = 6;

    $scope.goPage = function() {
        $state.go('collection', {
            p: $scope.currentPage
        });
    };

    $scope.removeCollect = function(package) {

        if(package.submitting) return ;

        package.submitting = new Spinner({ width: 2 }).spin(document.querySelector('.package'+package.packageId));

        $http({
            method: 'post',
            url: '/api/tourist/removeCollection',
            data: {
                packageId: package.packageId
            }
        }).then(function(res) {
            package.submitting.stop();
            package.submitting = null;
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
            }
        }, function(error) {
            package.submitting.stop();
            package.submitting = null;
            swal({
                type: 'error',
                text: error.data
            });
        });
    };

}]);