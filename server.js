var os = require('os');
var spawn = require('child_process').spawn;

var devPort = 8888,
	serverPort = 8000;

var cmdStr = '';

// 判断系统
if(os.platform().toLowerCase().indexOf('win32') > -1) {
	// windows系统
	cmdStr = 'set PORT=' + serverPort + ' & set DEBUG=tour & node ./bin/www';
} else {
	cmdStr = 'PORT=' + serverPort + ' DEBUG=tour node ./bin/www';
}

var ls = spawn('node', ['./bin/www']);

ls.stdout.on('data', (data) => {
  console.log(`${data}`);
});

ls.stderr.on('data', (data) => {
  console.log(`${data}`);
});

ls.on('close', (code) => {
  console.log(`子进程退出码：${code}`);
});