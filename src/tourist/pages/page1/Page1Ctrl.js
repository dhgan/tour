var app = require('../../common/app.js');
require('../../common/commonService.js');

app.controller('Page1', ['$scope', 'commonService', function($scope, commonService) {

    $scope.captchaSrc = 'api/captcha';

    $scope.refresh = function() {
      $scope.captchaSrc = 'api/captcha?d='+ Math.random();
    };

	commonService.CheckLogin().then(function(res){
		var data = res.data;
		$scope.result = data;
	}, function(err){
		console.log(err);
	});

	$scope.login = function() {
		var req = {
			name: $scope.name,
			captcha: $scope.captcha
		};
		console.log(req);
		commonService.Login(req).then(function(res) {
			var data = res.data;
			$scope.result = data;
		}, function(err) {
			console.log(err);
		});
	}

}]);