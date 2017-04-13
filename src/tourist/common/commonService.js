var app = require('../common/app.js');

app.service('commonService', ['$http', '$httpParamSerializer', function($http, $httpParamSerializer) {
	/**
	@param {string} name
	@param {string} captcha
	@return {promise}
	*/
	this.Login = function(data) {
		return $http({
			method: 'post',
			url: '/api/tourist/login',
			data: data
		});
	};

	/**
	@return {promise}
	*/
	this.CheckLogin = function() {
		return $http({
			method: 'post',
			url: '/api/tourist/checkLogin'
		});
	};
}]);