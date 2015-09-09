define([], function () {
    angular.module('yes.ui')
        .filter('dict', ['$rootScope', function ($rootScope) {
            return function (str, dictName) {
                var dict = $rootScope[dictName];

                if (dict && dict.hasOwnProperty(str))
                    return dict[str];
                return str;
            };
        }]);
});