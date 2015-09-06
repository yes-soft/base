define([], function () {
    return function (dependencies) {
        var definition;
        definition = {
            resolver: ['$ocLazyLoad', '$rootScope', '$stateParams', 'settings',
                function ($ocLazyLoad, $rootScope, $stateParams, settings) {
                    var list = [];

                    angular.forEach(dependencies, function (dep) {
                        for (var key in $stateParams) {
                            if ($stateParams.hasOwnProperty(key)) {
                                dep = dep.replace('{$' + key + '}', $stateParams[key]);
                            }
                        }
                        list.push(dep);
                    });

                    if ($stateParams.hasOwnProperty('name')
                        && $stateParams.hasOwnProperty('page')
                        && $stateParams.hasOwnProperty('action')) {
                        settings.templates.custom = ['plugins',
                                $stateParams.name,
                                'pages',
                                $stateParams.action].join('/') + '.html';
                    }

                    return $ocLazyLoad.load(list).then(function (res) {

                    }, function (e) {
                        console.log(e);
                    });
                }]
        };
        return definition;
    }
});