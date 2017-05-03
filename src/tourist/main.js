if(ENV == 'dev') {
	require('./index.html');
}

var app = require('./common/app');

require('./main.scss');
require('./font.css');
require('./component/pace/pace.css');

window.Spinner = require('./common/spin');
require('sweetalert2/dist/sweetalert2.css');
window.swal = require('sweetalert2');
window.moment = require('moment/min/moment.min');
require('./component/pace/pace.min');

require('./common/router.js');

require('./common/commonService.js');
require('./common/commonDirective');
require('./component/tourHeader/tourHeader');
require('./component/tourFooter/tourFooter');
require('./component/scrollUp/scrollUp');

app.controller('MainCtrl', ['$scope', function($scope) {

}]);