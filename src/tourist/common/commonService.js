var app = require('../common/app.js');

app.service('commonService', ['$http', function($http) {
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

    /**
     @param {string} email
     @param {string} eType
     @return {promise}
     */
    this.getECode = function(data) {
        return $http({
            method: 'post',
            url: '/api/common/getECode',
            data: data
        });
    };

}]);