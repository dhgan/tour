var email = require('./email');

var config = {
    service: 'QQex',
    user: 'tour_group@dhgan.com',
    pass: 'gan.QQ6666',
    from: 'i旅行网 <tour_group@dhgan.com>'
};

module.exports = email(config);