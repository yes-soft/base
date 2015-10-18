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
        }).filter('translatePrefix', ['$translate', function ($translate) {

            var translateFilter = function (translationId, prefix) {
                return $translate.instant(prefix + "_" + translationId);
            };

            if ($translate.statefulFilter()) {
                translateFilter.$stateful = true;
            }

            return translateFilter;
        }]);
});