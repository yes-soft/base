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
        'interpreter': 'base/services/interpreter',
        'mapper': 'base/services/mapper',
        'radioDialog': 'base/directives/radio.dialog'
    },
    shim: {
        'app': ['resolves', 'forms', 'uploader', 'gallery', 'datePicker', 'yesQueries',
            'fixed', 'interpreter', 'mapper', 'radioDialog']
    }
});

require(['app'], function (app) {
    angular.bootstrap(document, ['app']);
});

