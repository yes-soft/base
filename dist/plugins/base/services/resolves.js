define([], function () {
    return function (dependencies) {
        var definition;
        definition = {
            resolver: ['$ocLazyLoad', '$rootScope', '$stateParams',
                function ($ocLazyLoad, $rootScope, $stateParams) {
                    var list = [];

                    angular.forEach(dependencies, function (dep) {
                        for (var key in $stateParams) {
                            if ($stateParams.hasOwnProperty(key)) {
                                dep = dep.replace('{$' + key + '}', $stateParams[key]);
                            }
                        }
                        list.push(dep);
                    });
                    return $ocLazyLoad.load(list).then(function (res) {

                    }, function (e) {
                        console.log(e);
                    });
                }]
        };
        return definition;
    }
});