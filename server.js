var childProcess = require('child_process');
var spawn = childProcess.spawn;
var exec = childProcess.exec;
var os = require('os');
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config');

var ENV = process.env.NODE_ENV;

var devPort = 8888,
	serverPort = 8000;

var env = Object.create(process.env);
env.PORT = serverPort;
env.DEBUG = "tour";

var ls = null;
var isWin = os.platform().toLowerCase().indexOf('win32') > -1;

// 开发环境
if(ENV == 'dev') {
    var cmd = 'supervisor';

    if(isWin) {
        cmd = 'supervisor.cmd'
    }
    ls = spawn(cmd, ['-w', 'bin,lib,middlewares,models,routes,app.js', './bin/www'], {
        env: env
    });

	var proxy= {
		"*": "http://localhost:" + serverPort
	};

	config.entry.unshift("webpack-dev-server/client?http://localhost:"+ devPort, "webpack/hot/dev-server");
	config.plugins.push(new webpack.HotModuleReplacementPlugin());

	//启动服务
	var app = new WebpackDevServer(webpack(config), {
		hot: true,
		proxy: proxy,
		compress: true,
		stats: {
			colors: true
		}
	});

	app.listen(devPort, function() {
		console.log('dev server on http://127.0.0.1:'+ devPort);
	})
} else {

    var cmd = 'forever';

    if(isWin) {
        cmd = 'forever.cmd'
    }

    ls = spawn(cmd, ['start', './bin/www'], {
        env: env
    });

	var cmdStr = 'webpack --progress';
	exec(cmdStr, function(err, stdout, stderr) {
		if(err) {
			console.error(err);
		} else {
			console.log(stdout);
			console.log(stderr);
		}
	});
}

ls.stdout.on('data', function (data) {
    console.log(data.toString());
});

ls.stderr.on('data', function (data) {
    console.log(data.toString());
});

ls.on('close', function (code) {
    console.log('exit:' + code.toString());
});