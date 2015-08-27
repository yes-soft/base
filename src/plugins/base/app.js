define(['resolves'],
    function (resolves) {

        var app = angular.module('app');
        app.config(
            ['$controllerProvider', '$compileProvider', '$filterProvider',
                '$provide', '$stateProvider', '$urlRouterProvider',
                'settingsProvider',
                function ($controllerProvider, $compileProvider, $filterProvider,
                          $provide, $stateProvider, $urlRouterProvider,settingsProvider) {

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
                    $urlRouterProvider.otherwise(settings.otherwise);
                }
            ]);

        return app;
    });