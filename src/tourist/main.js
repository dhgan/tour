if(ENV == 'dev') {
	require('./index.html');
}
var app = require('./common/app');

require('./main.scss');
require('./font.css');

window.Spinner = require('./common/spin');
require('sweetalert2/dist/sweetalert2.css');
window.swal = require('sweetalert2');


require('./common/router.js');

require('./common/commonService.js');
require('./common/commonDirective');
require('./component/tourHeader/tourHeader');

require('lodash');

app.controller('MainCtrl', ['$scope', function($scope) {

}]);