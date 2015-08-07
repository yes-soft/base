'use strict';
angular.module('app')
    .config(["$stateProvider", "$urlRouterProvider",
        "$locationProvider", "$ocLazyLoadProvider", "plugins",
        function ($stateProvider, $urlRouterProvider, $locationProvider,
                  $ocLazyLoadProvider, plugins) {
            $ocLazyLoadProvider.config({/* debug: true */});
            var provider =
                $stateProvider
                    .state('app', {
                        url: '',
                        abstract: true,
                        templateUrl: plugins.templates.layout,
                        controller: 'AppCtrl'
                    })
                    .state("login", {
                        url: "/login",
                        templateUrl: plugins.templates.login,
                        controller: "app.login.index"
                    })
                    .state("app.dashboard", {
                        url: "/dashboard",
                        views: {
                            "content": {
                                templateUrl: function () {
                                    return plugins.templates.dashboard;
                                },
                                controller: "app.dashboard.index"
                            }
                        }
                    })
                    .state("app.list", {
                        url: "/:name/:page",
                        views: {
                            "content": {
                                templateUrl: function () {
                                    return plugins.templates.list;
                                },
                                controller: "app.wrap.list"
                            }
                        },
                        resolve: {
                            deps: ["$ocLazyLoad", "$stateParams", "$http", "utils",
                                function ($ocLazyLoad, $stateParams, $http, utils) {
                                    return $ocLazyLoad.load(
                                        [
                                            "plugins/" + $stateParams.name + "/config.js"
                                        ]
                                    )
                                        .then(function (res) {
                                            return res;
                                        }, function (err) {
                                            console.log(err);
                                        });
                                }]
                        }
                    });
            $urlRouterProvider.otherwise("/dashboard");
            //$locationProvider.hashPrefix('!');
        }]);