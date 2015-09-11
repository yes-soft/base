define([], function () {
    angular.module('yes.ui')
        .filter('dict', ['$rootScope', function ($rootScope) {
            return function (str, dictName) {

                if (angular.isUndefined(str))
                    str = "";

                if (!angular.isString(str))
                    str = str.toString();

                var dict = $rootScope[dictName];

                if (dict && dict.hasOwnProperty(str))
                    return dict[str];
                return str;
            };
        }]).filter('time', function () {
            return function (str, format) {
                return moment(str).format(format);
            };
        });
});