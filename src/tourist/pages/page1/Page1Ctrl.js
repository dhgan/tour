var app = require('../../common/app.js');
require('../../common/commonService.js');

app.controller('Page1', ['$scope', 'commonService', function($scope, commonService) {

	commonService.CheckLogin().then(function(res){
		var data = res.data;
		$scope.result = data;
	}, function(err){
		console.log(err);
	});

	$scope.login = function() {
		var req = {
			name: $scope.name
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