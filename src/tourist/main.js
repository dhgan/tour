if(ENV == 'dev') {
	require('./index.html');
}

require('./main.scss');
require('./font.css');

window.Spinner = require('./common/spin');
require('sweetalert2/dist/sweetalert2.css');
window.swal = require('sweetalert2');


require('./common/router.js');

require('./common/commonService.js');
require('./common/commonDirective');

require('lodash');