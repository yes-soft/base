require.config({
    baseUrl: 'plugins',
    paths: {
        'app': 'base/app',
        'resolves': 'base/services/resolves'
    },
    shim: {
        'app': ['resolves']
    }
});

require(['app'], function (app) {
    angular.bootstrap(document, ['app']);
});