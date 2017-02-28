var spawn = require('child_process').spawn;

var devPort = 8888,
	serverPort = 8000;

var ls = spawn('node', ['./bin/www'], {
	env: {
		PORT: serverPort,
		DEBUG: "tour"
	}
});

ls.stdout.on('data', (data) => {
  console.log(`${data}`);
});

ls.stderr.on('data', (data) => {
  console.log(`${data}`);
});

ls.on('close', (code) => {
  console.log(`子进程退出码：${code}`);
});