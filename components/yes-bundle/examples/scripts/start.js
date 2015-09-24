require.config({
    baseUrl: 'scripts',
    paths: {
        'jquery': './../../components/jquery/dist/jquery'
    },
    shim: {
        'app': {
            deps: ['settings', 'services/utils']
        }
    }
});

require(['app'], function (app) {
    angular.bootstrap(document, ['app']);
});