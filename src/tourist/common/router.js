var app = require('./app.js');

// 设置angular路由
app.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', function($stateProvider, $locationProvider, $urlRouterProvider) {

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
            url: '/home',
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
                }],
                PageInfo: ['$http', function($http) {
                    var spinner = new Spinner({
                        width: 4,
                        position: 'fixed'
                    }).spin(document.querySelector('body'));
                    return $http({
                        method: 'get',
                        url: '/api/tourist/homePackage?t=' + Math.random()
                    }).then(function (res) {
                        spinner.stop();
                        return res.data;
                    }, function(error) {
                        spinner.stop();
                        swal(error.data);
                    });
                }]
            },
            controller: 'HomeCtrl'
        })
        .state('package', {
            url: '/package/{packageId}',
            templateUrl: './package.html',
            resolve: {
                foo: ['$q', '$ocLazyLoad', function($q, $ocLazyLoad) {
                    var deferred = $q.defer();
                    require.ensure([], function() {
                        var module = require('../pages/package/package.js');
                        $ocLazyLoad.load({
                            name: 'tour'
                        });
                        deferred.resolve(module);
                    });
                    return deferred.promise;
                }],
                PageInfo: ['$http', '$stateParams', function($http, $stateParams) {
                    var packageId = $stateParams.packageId;
                    var spinner = new Spinner({
                        width: 4,
                        position: 'fixed'
                    }).spin(document.querySelector('body'));
                    return $http({
                        method: 'get',
                        url: '/api/tourist/package/' + packageId,
                        params: {
                            t: Math.random()
                        }
                    }).then(function(res) {
                        spinner.stop();
                        return res.data;
                    }, function(error) {
                        spinner.stop();
                        swal(error.data);
                    });
                }]
            },
            controller: 'PackageCtrl'
        })
        .state('search', {
            url: '/search/:q/:p', // q = query and p = page num
            templateUrl: './search.html',
            resolve: {
                foo: ['$q', '$ocLazyLoad', function($q, $ocLazyLoad) {
                    var deferred = $q.defer();
                    require.ensure([], function() {
                        var module = require('../pages/search/search.js');
                        $ocLazyLoad.load({
                            name: 'tour'
                        });
                        deferred.resolve(module);
                    });
                    return deferred.promise;
                }],
                PageInfo: ['$http', '$stateParams', function($http, $stateParams) {
                    var page = $stateParams.p || 1,
                        query = $stateParams.q;
                    if(!query) return null;
                    var spinner = new Spinner({
                        width: 4,
                        position: 'fixed'
                    }).spin(document.querySelector('body'));
                    return $http({
                        method: 'get',
                        url: '/api/tourist/search/' + query + '/' + page,
                        params: {
                            t: Math.random()
                        }
                    }).then(function(res) {
                        spinner.stop();
                        return res.data;
                    }, function(error) {
                        spinner.stop();
                        swal(error.data);
                    });
                }]
            },
            controller: 'SearchCtrl'
        });

	$urlRouterProvider.otherwise('/home');

}]);