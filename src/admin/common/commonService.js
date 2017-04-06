var app = require('../common/app.js');

app.service('commonService', ['$http', function($http) {
	/**
	@param {string 必须} name
	@return {promise}
	*/
	this.Login = function(data) {
		return $http({
			method: 'post',
			url: '/api/login',
			data: data
		});
	};

	/**
	@return {promise}
	*/
	this.CheckLogin = function() {
		return $http({
			method: 'post',
			url: '/api/checkLogin'
		});
	};
}]);