require.config({
    baseUrl: 'plugins',
    paths: {
        'app': 'base/app',
        'resolves': 'base/services/resolves',
        'forms': 'base/directives/forms'
    },
    shim: {
        'app': ['resolves', 'forms']
    }
});

require(['app'], function (app) {
    angular.bootstrap(document, ['app']);
});