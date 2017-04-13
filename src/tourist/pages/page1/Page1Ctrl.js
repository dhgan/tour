var app = require('../../common/app.js');
require('../../common/commonService.js');

app.controller('Page1', ['$scope', 'commonService', function($scope, commonService) {

    $scope.captchaSrc = 'api/common/captcha';

    $scope.refresh = function() {
      $scope.captchaSrc = 'api/common/captcha?d='+ Math.random();
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
	};

    $scope.alerts = [
        { type: 'danger', msg: 'Oh snap! Change a few things up and try submitting again.' },
        { type: 'success', msg: 'Well done! You successfully read this important alert message.' }
    ];

    $scope.addAlert = function() {
        $scope.alerts.push({msg: 'Another alert!'});
    };

    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };

}]);