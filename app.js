var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
//var logger = require('morgan');
var compression = require('compression');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var session = require('express-session');
var mongoose = require('mongoose');
var log = require('./middlewares/log');

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
app.use(session({
    name: 'tour.sid',
    resave: true,
    saveUninitialized: false,
    secret: 'tour',
    cookie: {
        maxAge: 1000 * 60 * 1
    }
}));

mongoose.connect('mongodb://localhost/test');

// mock数据
var Test = require('./models/test');
Test.find(function(err, test) {
    if(test.length) return ;
    new Test({
        name: 'gdh',
        sex: 'man'
    }).save();

    new Test({
        name: 'yj',
        sex: 'woman'
    }).save();
});


var tourist = require('./routes/tourist');
var admin = require('./routes/admin');
var api = require('./routes/api');

// 页面路由
app.use('/', tourist);
app.use('/admin', admin);

// api
app.use('/api', api);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
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
