var log4js = require('log4js');

log4js.configure({
    appenders: [
        { type: 'console' },
        { type: 'file', filename: 'logs/logger.log', category: 'logger' }
    ]
});

var logger = log4js.getLogger('logger');

module.exports = {
    logger: logger,
    use: function(app) {
        app.use(log4js.connectLogger(logger, {lever: 'auto'}));
    }
};