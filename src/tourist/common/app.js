var angular = require('angular');

require('angular-animate');
require('angular-touch');
require('font-awesome/css/font-awesome.min.css');
require('bootstrap-loader');


var app = angular.module('tour', [
		require('angular-ui-router'),
		require('oclazyload'),
		require('angular-ui-bootstrap')
	]);

module.exports = app;