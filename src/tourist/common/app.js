var angular = require('angular');

require('bootstrap-loader');

window.Headroom = require('headroom.js');
require('headroom.js/dist/angular.headroom');
require('./angular-locale_zh.js');

var app = angular.module('tour', [
		require('angular-ui-router'),
		require('oclazyload'),
        require('angular-touch'),
        require('angular-sanitize'),
        require('angular-animate'),
		require('angular-ui-bootstrap'),
        'headroom'
	]).run(['$rootScope', '$anchorScroll', function($rootScope, $anchorScroll) {
	    $anchorScroll.yOffset = 60;
        $rootScope.$on('$stateChangeSuccess', function () {
            $anchorScroll();
            $rootScope.isNavCollapsed = false;
        });
    }]).filter('htmlToPlaintext', function() {
        return function(text) {
            return  text ? String(text).replace(/(<[^>]+>)|(&nbsp;)/gm, '') : '';
        };
    });

module.exports = app;