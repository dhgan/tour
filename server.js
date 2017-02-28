var spawn = require('child_process').spawn;

var devPort = 8888,
	serverPort = 8000;

var env = Object.create(process.env);
env.PORT = serverPort;
env.DEBUG = "tour";

var ls = spawn('node', ['./bin/www'], {
	env: env
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