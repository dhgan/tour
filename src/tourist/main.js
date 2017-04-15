if(ENV == 'dev') {
	require('./index.html');
}

require('./main.scss');

require('./common/router.js');

require('./common/commonDirective');
require('./common/commonService.js');

var _ = require('lodash');