var app = require('../../common/app');

require('./tourFooter.scss');

app.directive('tourFooter', [function() {
    return {
        restrict: 'E',
        replace: true,
        template: `<div class="footer">
                © Copyright itravel (itravel@dhgan.com)
                </div>`,
    }

}]);