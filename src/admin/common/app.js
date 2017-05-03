var angular = require('angular');

require('bootstrap-loader');

window.Headroom = require('headroom.js');
require('headroom.js/dist/angular.headroom');

var app = angular.module('tour', [
    require('angular-ui-router'),
    require('oclazyload'),
    require('angular-touch'),
    require('angular-sanitize'),
    require('angular-animate'),
    require('angular-ui-bootstrap'),
    'headroom'
]).run(['$rootScope', function($rootScope) {
    $rootScope.$on('$stateChangeSuccess', function () {
        $rootScope.isNavCollapsed = false;
    });
}]).filter('htmlToPlaintext', function() {
    return function(text) {
        return  text ? String(text).replace(/<[^>]+>/gm, '') : '';
    };
});

module.exports = app;