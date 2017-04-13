var email = require('./email');

var config = {
    service: 'QQ',
    user: 'dhgan@qq.com',
    pass: 'xsqlomrihuzzfhge',
    from: '旅游团 <dhgan@qq.com>'
};

module.exports = email(config);