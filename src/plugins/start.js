require.config({
    baseUrl: 'plugins',
    paths: {
        'app': 'base/app',
        'resolves': 'base/services/resolves',
        'forms': 'base/directives/forms',
        'uploader': 'base/directives/uploader',
        'gallery': 'base/directives/gallery',
        'datePicker': 'base/directives/datePicker',
        'selector': 'base/pages/selector'
    },
    shim: {
        'app': ['resolves', 'forms', 'uploader', 'gallery','datePicker','selector']
    }
});

require(['app'], function (app) {
    angular.bootstrap(document, ['app']);
});