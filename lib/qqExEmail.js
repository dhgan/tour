var email = require('./email');

var config = {
    service: 'QQex',
    user: 'itravel@dhgan.com',
    pass: 'gan.QQ6666',
    from: 'i旅行 <itravel@dhgan.com>'
};

module.exports = email(config);