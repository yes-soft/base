require.config({
    baseUrl: 'plugins',
    paths: {
        'app': 'base/app',
        'resolves': 'base/services/resolves',
        'forms': 'base/directives/forms',
        'uploader': 'base/directives/uploader',
        'gallery': 'base/directives/gallery',
        'datePicker': 'base/directives/date.picker',
        'yesQueries': 'base/directives/yes.query',
        'fixed': 'base/directives/fixed',
        'interpreter': 'base/services/interpreter'
    },
    shim: {
        'app': ['resolves', 'forms', 'uploader', 'gallery', 'datePicker', 'yesQueries', 'fixed', 'interpreter']
    }
});

require(['app'], function (app) {
    angular.bootstrap(document, ['app']);
});