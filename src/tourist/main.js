if(ENV == 'dev') {
	require('./index.html');
}

require('./main.scss');

require('./common/router.js');

require('./common/commonService.js');
require('./common/commonDirective');

var _ = require('lodash');