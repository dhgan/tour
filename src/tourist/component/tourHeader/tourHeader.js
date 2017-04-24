var app = require('../../common/app');

require('./tourHeader.scss');

app.directive('tourHeader', ['$templateCache', '$interval', function($templateCache, $interval) {
    $templateCache.put('template/tourHeader.html',
        '<div class="tour-header">\
            <div class="navbar navbar-default navbar-fixed-top" role="navigation" headroom tolerance="2" offset="200">\
                <div class="container">\
                    <div class="navbar-header">\
                        <button type="button" class="navbar-toggle" ng-click="toggleNav()">\
                            <span class="sr-only">Toggle navigation</span>\
                            <span class="icon-bar"></span>\
                            <span class="icon-bar"></span>\
                            <span class="icon-bar"></span>\
                        </button>\
                        <a ui-sref="home" class="navbar-brand"><img ng-src="{{logoSrc}}" alt="爱旅游"></a>\
                    </div>\
                    <div class="collapse navbar-collapse" uib-collapse="!isNavCollapsed">\
                        <ul class="nav navbar-nav navbar-right">\
                            <li><a ui-sref="home" class="nav-a">首页</a></li>\
                            <li><a ui-sref="login" class="nav-a" ng-if="!isLogin">登录</a></li>\
                            <li><a ui-sref="register" class="nav-a" ng-if="!isLogin">注册</a></li>\
                            <li uib-dropdown>\
                                    <a class="nav-a user-name" href="javascript:" uib-dropdown-toggle>\
                                    dhgan\
                                    </a>\
                                    <ul class="dropdown-menu" uib-dropdown-menu aria-labelledby="simple-dropdown">\
                                        <li ng-repeat="choice in items"><a href>{{choice}}</a></li>\
                                    </ul></li>\</ul>\
                        <form class="navbar-form navbar-right">\
                            <div class="form-group">\
                            <input type="text" class="form-control" placeholder="搜索">\
                            <span class="search-btn"><i class="glyphicon-search" aria-hidden="true"></i></span>\
                            </div>\
                        </form>\
                    </div>\
                </div>\
            </div>\
        </div>');

    return {
        restrict: 'E',
        replace: true,
        template: $templateCache.get("template/tourHeader.html"),
        link: function($scope, elem, attr, ctrl) {
            $scope.logoSrc = require('../../imgs/logo.png');
            $scope.isLogin = true;
            $scope.toggleNav = function() {
                $scope.isNavCollapsed = !$scope.isNavCollapsed;
            };
            $scope.items = [
                '我的收藏',
                '我的订单',
                '个人信息',
                '退出'
            ];
        }
    }

}]);