define(['resolves'],
    function (resolves) {

        var app = angular.module('app');
        app.config(
            ['$controllerProvider', '$compileProvider', '$filterProvider',
                '$provide', '$stateProvider', '$urlRouterProvider',
                'settingsProvider', '$locationProvider',
                function ($controllerProvider, $compileProvider, $filterProvider,
                          $provide, $stateProvider, $urlRouterProvider, settingsProvider,
                          $locationProvider) {

                    app.controller = $controllerProvider.register;
                    app.directive = $compileProvider.directive;
                    app.filter = $filterProvider.register;
                    app.factory = $provide.factory;
                    app.service = $provide.service;

                    var settings = settingsProvider.getSettings();

                    if (settings.routers) {
                        angular.forEach(settings.routers, function (route, name) {

                            if (route.dependencies) {
                                route.resolve = resolves(route.dependencies);
                            }

                            $stateProvider.state(name, route);

                        });
                    }

                    //$locationProvider.html5Mode({
                    //    enabled: true,
                    //    requireBase: false
                    //});

                    $urlRouterProvider.otherwise(settings.otherwise);
                }
            ]);

        return app;
    });