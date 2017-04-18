var app = require('./app.js');

// 设置angular路由
app.config(['$stateProvider', '$locationProvider', function($stateProvider, $locationProvider) {

	// 将!#变成#
	$locationProvider.hashPrefix('');

	$stateProvider
        .state('page1', {
            url: '/page1',
            templateUrl: './page1.html',
            resolve: {
                foo: ['$q', '$ocLazyLoad', function($q, $ocLazyLoad) {
                    var deferred = $q.defer();
                    require.ensure([], function() {
                        var module = require('../pages/page1/page1.js');
                        $ocLazyLoad.load({
                            name: 'tour'
                        });
                        deferred.resolve(module);
                    });
                    return deferred.promise;
                }]
            }
        })
        .state('page2', {
            url: '/page2',
            templateUrl: './page2.html',
            resolve: {
                foo: ['$q', '$ocLazyLoad', function($q, $ocLazyLoad) {
                    var deferred = $q.defer();
                    require.ensure([], function() {
                        var module = require('../pages/page2/page2.js');
                        $ocLazyLoad.load({
                            name: 'tour'
                        });
                        deferred.resolve(module);
                    });
                    return deferred.promise;
                }]
            }
        })


        .state('register', {
            url: '/register?redirect',
            templateUrl: './register.html',
            resolve: {
                foo: ['$q', '$ocLazyLoad', function($q, $ocLazyLoad) {
                    var deferred = $q.defer();
                    require.ensure([], function() {
                        var module = require('../pages/register/register.js');
                        $ocLazyLoad.load({
                            name: 'tour'
                        });
                        deferred.resolve(module);
                    });
                    return deferred.promise;
                }]
            }
        })
        .state('login', {
            url: '/login?redirect',
            templateUrl: './login.html',
            resolve: {
                foo: ['$q', '$ocLazyLoad', function($q, $ocLazyLoad) {
                    var deferred = $q.defer();
                    require.ensure([], function() {
                        var module = require('../pages/login/login.js');
                        $ocLazyLoad.load({
                            name: 'tour'
                        });
                        deferred.resolve(module);
                    });
                    return deferred.promise;
                }]
            }
        })
        .state('home', {
            url: '',
            templateUrl: './home.html',
            resolve: {
                foo: ['$q', '$ocLazyLoad', function($q, $ocLazyLoad) {
                    var deferred = $q.defer();
                    require.ensure([], function() {
                        var module = require('../pages/home/home.js');
                        $ocLazyLoad.load({
                            name: 'tour'
                        });
                        deferred.resolve(module);
                    });
                    return deferred.promise;
                }]
            }
        });

}]);