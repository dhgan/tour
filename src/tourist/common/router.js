var app = require('./app.js');
//require('./commonServer.js');

// 设置angular路由
app.config(['$stateProvider', '$locationProvider', function($stateProvider, $locationProvider) {

	// 将!#弄成#
	$locationProvider.hashPrefix('');
    function getResolve(page) {
        return {
            foo: ['$q', '$ocLazyLoad', function($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure([], function() {
                    var module = require('../pages/'+ page +'/'+ page +'.js');
                    $ocLazyLoad.load({
                        name: 'tour'
                    });
                    deferred.resolve(module);
                });
                return deferred.promise;
            }]
        }
    }

	$stateProvider
        .state('index', {
            url: '/',
            templateUrl: '/'
        })
        .state('page1', {
            url: '/page1',
            templateUrl: './page1.html',
            resolve: getResolve('page1')
        })
        .state('page2', {
            url: '/page2',
            templateUrl: './page2.html',
            resolve: getResolve('page2')
        })


        .state('register', {
            url: '/register?redirect',
            templateUrl: './register.html',
            resolve: getResolve('register')
        })
        .state('login', {
            url: '/login',
            templateUrl: './login.html',
            resolve: getResolve('login')
        });

}]);