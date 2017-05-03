var app = require('../../common/app');

require('./scrollUp.scss');

app.directive('scrollUp', ['$window', '$anchorScroll', function($window, $anchorScroll) {
    return {
        restrict: 'E',
        replace: true,
        scope: false,
        template: `<div class="scrollUp" ng-class="{showUp: showUp}" ng-click="scrollToUp()">
                    <i class="glyphicon-angle-up"></i>
                </div>`,
        link: function(scope, elem, attr, ctrl) {
            angular.element($window).on('scroll', function(e) {
                scope.showUp = this.scrollY > 200;
                scope.$apply();
            });

            scope.scrollToUp = function() {
                $anchorScroll()
            };
        }
    }

}]);