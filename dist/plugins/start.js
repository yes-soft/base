require.config({
    baseUrl: 'plugins',
    paths: {
        'app': 'base/app',
        'resolves': 'base/services/resolves',
        'forms': 'base/directives/forms',
        'uploader': 'base/directives/uploader'
    },
    shim: {
        'app': ['resolves', 'forms', 'uploader']
    }
});

require(['app'], function (app) {
    angular.bootstrap(document, ['app']);
});