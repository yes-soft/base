define([], function () {
    'use strict';
    var settings = {
        version: "0.1.0",
        templates: {
            'layout': 'templates/layout.html',
            'login': 'templates/login.html',
            'dashboard': 'templates/dashboard.html',
            'list': 'templates/list.uigrid.html',
            'detail': 'templates/detail.html',
            'searchCommon': 'templates/search-common.html'
        },
        gateway: {
            host: 'self'
        },
        runtime: {
            "mock": true,
            "menuRoot": null,
            "menuApi": 'base/menus',
            "language": navigator.language || navigator.userLanguage,
            "apiPath": "api",
            "serverRoot": 'src',
            "pluginFolder": 'plugins',
            "pageSize": {
                "default": 20,
                "more": 10
            },
            "debug": true
        }
    };

    settings.routers = {
        'app': {
            url: '',
            templateUrl: settings.templates.layout,
            abstract: true,
            controller: 'app.root',
            dependencies:[
                'controllers/appcontroller'
            ]
        },
        'login': {
            url: '/login',
            templateUrl: settings.templates.login,
            controller: "app.login"
        },
        'app.dashboard': {
            url: '/dashboard',
            views: {
                "content": {
                    templateUrl: function () {
                        return settings.templates.dashboard;
                    },
                    controller: "app.dashboard"
                }
            },
            dependencies:[
                'controllers/dashboard'
            ]
        },
        'app.list': {
            url: '/:name/:page',
            views: {
                "content": {
                    templateUrl: function () {
                        return settings.templates.list;
                    },
                    controller: "app.wrap.list"
                }
            },
            dependencies: [
                'plugins/{$name}/config'
            ]
        },
        'app.detail': {
            url: '/:name/:page/:action',
            templateUrl: settings.templates.detail
        }
    };
    settings.otherwise = '/dashboard';
    return settings;
});