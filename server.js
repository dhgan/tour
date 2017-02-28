var os = require('os');
var exec = require('child_process').exec;

var devPort = 8888,
	serverPort = 8080;

var cmdStr = '';

// 判断系统
if(os.platform().toLowerCase().indexOf('win32') > -1) {
	// windows系统
	cmdStr = 'set PORT=' + serverPort + ' set DEBUG=tour & node ./bin/www';
} else {
	cmdStr = 'PORT=' + serverPort + ' DEBUG=tour node ./bin/www';
}

exec(cmdStr, function(err, stdout, stderr) {
	//console.log('Listening on http://127.0.0.1:'+serverPort);
	if(err) {
		console.error(err);
	} else {
		console.log(stdout);
	}
});