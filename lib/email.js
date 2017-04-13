var nodemailer = require('nodemailer');
var _ = require('lodash');
var logger = require('../lib/log').logger;

module.exports = function(config) {

    // create reusable transporter object using the default SMTP transport
    var mailTransport = nodemailer.createTransport({
        service: config.service,
        auth: {
            user: config.user,
            pass: config.pass
        },
        logger: logger,
        debug: true
    });

    // setup email data with unicode symbols
    var mailOptions = {
        from: config.from
    };

    return {
        send: function(options) {

            var options = _.assignIn(options, mailOptions);

            // send mail with defined transport object
            mailTransport.sendMail(options, function(err, info) {
                if(err) {
                    logger.error(err);
                    return;
                }
                logger.debug('Message %s sent: %s', info.messageId, info.response);
            });
        }
    }

};