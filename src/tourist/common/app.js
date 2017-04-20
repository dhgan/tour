var angular = require('angular');

//require('font-awesome/css/font-awesome.min.css');
require('bootstrap-loader');

window.Headroom = require('headroom.js');
require('headroom.js/dist/angular.headroom');

var app = angular.module('tour', [
		require('angular-ui-router'),
		require('oclazyload'),
        require('angular-touch'),
        require('angular-animate'),
		require('angular-ui-bootstrap'),
        'headroom'
	]);

module.exports = app;