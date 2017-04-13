var email = require('./email');

var config = {
    service: '126',
    user: 'tour_group@126.com',
    pass: 'gan12345678',
    from: 'tour_group@126.com'
};

module.exports = email(config);