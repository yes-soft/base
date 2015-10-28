(function () {
    'use strict';
    angular.module('app')
        .directive('yesQuery', ['$location', '$templateCache', '$http', '$compile',
            function ($location, $templateCache, $http, $compile) {

                var SNAKE_CASE_REGEXP = /[A-Z]/g;

                function snake_case(name, separator) {
                    separator = separator || '_';
                    return name.replace(SNAKE_CASE_REGEXP, function (letter, pos) {
                        return (pos ? separator : '') + letter.toLowerCase();
                    });
                }

                return {
                    restrict: 'EA',
                    scope: {
                        option: "=yesQuery",
                        value: '=ngModel',
                        filter: '='
                    },
                    require: 'ngModel',
                    link: function (scope, element, attrs, ngModel) {
                        var option = scope.option;
                        $http.get("plugins/base/templates/queries/" + snake_case(option.type, '-') + ".html",
                            {cache: $templateCache})
                            .success(function (html) {
                                element.html('').append($compile(html)(scope));
                            });
                    }
                };
            }]);
})();