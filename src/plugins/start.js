require.config({
    baseUrl: 'plugins',
    paths: {
        'app': 'base/app',
        'resolves': 'base/services/resolves',
        'forms': 'base/directives/forms',
        'uploader': 'base/directives/uploader',
        'gallery': 'base/directives/gallery'
    },
    shim: {
        'app': ['resolves', 'forms', 'uploader', 'gallery']
    }
});

require(['app'], function (app) {
    angular.bootstrap(document, ['app']);
});