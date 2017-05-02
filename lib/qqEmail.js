var email = require('./email');

var config = {
    service: 'QQ',
    user: 'dhgan@qq.com',
    pass: 'xsqlomrihuzzfhge',
    from: 'i旅行网 <dhgan@qq.com>'
};

module.exports = email(config);