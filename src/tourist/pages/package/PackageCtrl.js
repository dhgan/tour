var app = require('../../common/app.js');

app.controller('PackageCtrl', ['$scope', '$http', '$stateParams', '$state', '$anchorScroll', 'PageInfo',
function ($scope, $http, $stateParams, $state, $anchorScroll, PageInfo) {


    if(!PageInfo) return;
    // 页面信息
    var status = PageInfo.status,
        userInfo = PageInfo.userInfo;
    $scope.$root.userInfo = userInfo;
    $scope.package = PageInfo.package;

    if(!$scope.package) return;

    var packageId = PageInfo.package._id;

    if(userInfo) {
        var collections = userInfo.collections;
        collections.forEach(function(collection) {
            if(collection.package === packageId) {
                return $scope.package.collected = true;
            }
        });
    }


    if(status === '500') {
        return swal('', '未知错误', 'error');
    }



    $scope.status = {
        featuresOpen: true,
        detailOpen: true,
        priceDetailOpen: true,
        precautionsOpen: true,
        commentOpen: true
    };


    $scope.intervalTime = 5000;

    $scope.openDatepicker = function () {
        $scope.datepickerOpening = true;
    };

    $scope.dateOptions = {
        showWeeks: false,
        yearRows: 1,
        yearColumns: 3,
        startingDay: 1,
        formatDayTitle: 'yyyy MMMM',
        minDate: moment(new Date()).add(1, 'days'),
        dateDisabled: function (obj) {
            var formatStr = 'YYYY-MM-DD';
            if(obj.mode === 'day') {
                formatStr = 'YYYY-MM-DD';
            } else if(obj.mode ===  'month') {
                formatStr = 'YYYY-MM';
            } else if(obj.mode === 'year') {
                formatStr = 'YYYY';
            }

            return PageInfo.package.choices.every(function(choice) {
                return  moment(choice.date).format(formatStr) !== moment(obj.date).format(formatStr);
            });
        }
    };

    // 选择日期
    $scope.dateChange = function() {
        var date = $scope.dt;
        PageInfo.package.choices.forEach(function(choice) {
         if(moment(date).format('YYYY-MM-DD') === moment(choice.date).format('YYYY-MM-DD')) {
             $scope.choice = {
                stock: choice.left,
                price: choice.price
             };
             $scope.checkState();
             return;
         }
        });
    };

    $scope.num = 1;
    $scope.totalPrice = '--';
    $scope.changeNum = function(n) {
        // 未选择日期
        if(!$scope.choice) {
            $scope.num += n;
            return;
        }
        var num = parseInt($scope.num),
            stock = parseInt($scope.choice.stock);
        if((num <= 1 && -1 === n) || (num >= stock && 1 === n)) return;
        $scope.num = num + n;
        $scope.totalPrice = ($scope.num * $scope.choice.price).toFixed(2);
    };

    $scope.checkState = function() {
        if(!$scope.choice) return; // 未选择日期
        var val = '' + $scope.num,
            stock = parseInt($scope.choice.stock);
        for(var i=val.length-1; i>=0; i--){
            var char = val.charAt(i);
            if(!(char>='0'&&char<='9')){
                val = val.substr(0, i)+val.substr(i+1);
            }
        }
        val = val.replace(/^0$/, function () {
            return '1';
        });
        if(!val) val = 1;
        $scope.num = val > stock ? stock : parseInt(val);
        $scope.totalPrice = ($scope.num * $scope.choice.price).toFixed(2);
    };

    $scope.gotoAnchor = function(anchor) {
        $anchorScroll(anchor);
    };

    $scope.orderIt = function(bForm) {

        $state.go('orderConfirm', {
            packageId: packageId,
            number: $scope.num,
            date: moment($scope.dt).format('YYYY-MM-DD')
        });

        /*if(bForm.submitting) return ;

        bForm.submitting = new Spinner({ width: 2 }).spin(document.querySelector('.total'));

        var req = {
            packageId: packageId,
            number: $scope.num,
            date: moment($scope.dt).format('YYYY-MM-DD'),
            price: $scope.choice.price
        };

        $http({
            method: 'post',
            url: '/api/tourist/order',
            data: req
        }).then(function(res) {
            bForm.submitting.stop();
            bForm.submitting = null;

            var data = res.data,
                status = data.status;
            if(status === '200') {
                swal('下单成功');
            }
        }, function(error) {
            bForm.submitting.stop();
            bForm.submitting = null;
            swal(error.data);
        });*/
    };

    $scope.collectIt = function(cForm) {
        if($scope.package.collected) {
            swal({
                text: '您已收藏该线路，无需重复收藏',
                type: 'warning'
            });
            return;
        }

        if(cForm.submitting) return ;

        cForm.submitting = new Spinner({ width: 2 }).spin(document.querySelector('.collect-form'));

        $http({
            method: 'post',
            url: '/api/tourist/addCollection',
            data: {
                packageId: packageId
            }
        }).then(function(res) {
            cForm.submitting.stop();
            cForm.submitting = null;
            var data = res.data,
                status = data.status;
            if(status === '200') {
                swal({
                    type: 'success',
                    text: '收藏成功',
                    showConfirmButton: false,
                    timer: 1500
                }).catch(swal.noop);

                $scope.package.collected = true;
            } else if(status === '300') {
                swal({
                    text: '您已收藏该线路，无需重复收藏',
                    type: 'warning'
                });
                $scope.package.collected = true;
            } else if(status === '1024') {
                $state.go('login', {
                    redirect: encodeURIComponent('package?' + JSON.stringify({packageId: packageId}))
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

    };

    $scope.avgStar = 5;
    $scope.maxSize = 6;
    $scope.currentPage = 1;
    var gettingComment = false;

   getComments(true);

    // 获取评论
    function getComments(isFirst) {
        if(gettingComment) return;
        gettingComment = true;

        $http({
            method: 'get',
            url: '/api/tourist/packageComments/' + packageId + '/' + $scope.currentPage,
            params: {
                t: Math.random()
            }
        }).then(function(res) {
            gettingComment = false;
            var data = res.data,
                status = data.status;
            if(status === '200') {
                $scope.comments = data.comments;
                $scope.avgStar = data.avgStar;
                $scope.totalItems = data.totalItems;
                if(!isFirst) {
                    $anchorScroll('package-comment');
                }
            }
        }, function(error) {
            gettingComment = false;
            swal({
                type: 'error',
                text: error.data
            });
        });
    }


    $scope.goPage = function() {
        getComments(false);
    };

}]);