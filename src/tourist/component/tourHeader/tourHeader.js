var app = require('../../common/app');

require('./tourHeader.scss');

app.directive('tourHeader', ['$templateCache', '$state', '$http', function($templateCache, $state, $http) {
    //language=HTML
    $templateCache.put('template/tourHeader.html',
        '<div class="tour-header">\
            <div class="navbar navbar-default navbar-fixed-top" role="navigation" headroom tolerance="2" offset="200">\
                <div class="container">\
                    <div class="navbar-header">\
                        <button type="button" class="navbar-toggle" ng-click="toggleNav()" ng-if="!hideCollapse">\
                            <span class="sr-only">Toggle navigation</span>\
                            <span class="icon-bar"></span>\
                            <span class="icon-bar"></span>\
                            <span class="icon-bar"></span>\
                        </button>\
                        <a ui-sref="home" class="navbar-brand"><img ng-src="{{logoSrc}}" alt="爱旅游"></a>\
                    </div>\
                    <div class="collapse navbar-collapse" uib-collapse="!isNavCollapsed" ng-if="!hideCollapse">\
                        <ul class="nav navbar-nav navbar-right">\
                            <li><a ui-sref="home" class="nav-a">首页</a></li>\
                            <li ng-if="!hasLogin"><a ui-sref="login" class="nav-a">登录</a></li>\
                            <li ng-if="!hasLogin"><a ui-sref="register" class="nav-a">注册</a></li>\
                            <li uib-dropdown is-open="infoOpen" ng-if="hasLogin" ng-mouseleave="infoOpen=false">\
                                    <a class="nav-a user-name" href="javascript:" uib-dropdown-toggle ng-mouseover="infoOpen=true">{{userInfo.userName}} <span class="caret"></span></a>\
                                    <ul class="dropdown-menu" uib-dropdown-menu aria-labelledby="simple-dropdown">\
                                        <li><a ui-sref="collection">我的收藏</a></li>\
                                        <li><a ui-sref="order">我的订单</a></li>\
                                        <li><a ui-sref="info">个人信息</a></li>\
                                        <li ng-click="logout()"><a href="javascript:">退出</a></li>\
                                    </ul>\
                            </li>\
                        </ul>\
                        <form class="navbar-form navbar-right" ng-submit="goSearch()">\
                            <div class="form-group">\
                                <input type="text" class="form-control" ng-model="$parent.queryStr" maxlength="20" placeholder="搜索">\
                                <span class="search-btn" ng-click="goSearch()"><i class="glyphicon-search" aria-hidden="true"></i></span>\
                            </div>\
                        </form>\
                    </div>\
                </div>\
                <div class="shadow"></div>\
            </div>\
        </div>');

    return {
        restrict: 'E',
        replace: true,
        scope: {
            hideCollapse: '=',
            queryStr: '='
        },
        template: $templateCache.get("template/tourHeader.html"),
        link: function($scope, elem, attr, ctrl) {
            $scope.logoSrc = require('../../imgs/logo.png');
            $scope.toggleNav = function() {
                $scope.isNavCollapsed = !$scope.isNavCollapsed;
            };
            $scope.userInfo = $scope.$parent.userInfo;
            $scope.hasLogin = !!$scope.userInfo;

            $scope.goSearch = function() {
                $scope.queryStr = $scope.queryStr.replace(/^\s+|\s+$/g, '');
                if(!$scope.queryStr) return;
                $state.go('search', {
                    q: $scope.queryStr,
                    p: 1
                }, {
                    reload: true
                });
            };

            $scope.logout = function() {
                $http({
                    method: 'post',
                    url: '/api/tourist/logout'
                }).then(function() {
                    $state.reload();
                }, function() {
                    swal('退出失败');
                });
            };
         }
    }

}]);