var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
//var logger = require('morgan');
var compression = require('compression');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var session = require('express-session');
var log = require('./lib/log');

var app = express();

// view engine setup
app.engine('html', ejs.__express);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'favicon.ico')));
//app.use(logger('dev'));
log.use(app);
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(session({
    name: 'tour.sid',
    resave: true,
    saveUninitialized: true,
    secret: 'tour',
    cookie: {
        maxAge: 1000 * 60 * 30
    }
}));

// 数据库
var mongoose = require('./config/mongoose.js');
var db = mongoose();

var pages = require('./routes/pages');
var commonApi = require('./routes/api/common');
var adminApi = require('./routes/api/admin');
var touristApi = require('./routes/api/tourist');

// 页面路由
app.use('/', pages);

// api
app.use('/api/common', commonApi);
app.use('/api/admin', adminApi);
app.use('/api/tourist', touristApi);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('404');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    // res.locals.message = err.message;
    // res.locals.error = req.app.get('env') === 'dev' ? err : {};
    // var error = req.app.get('env') === 'dev' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.send(err.message);
});

module.exports = app;
