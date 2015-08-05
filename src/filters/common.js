'use strict';
angular.module('app')
    .filter('stringify', function () {
        return function (str) {
            if (angular.isObject(str)) {
                return JSON.stringify(str);
            }
            return str;
        };
    })
    .filter('now', function () {
        return function (str) {
            return moment(str).format('LLL');
        };
    })
    .filter('jsonParse', function () {
        return function (str) {
            if (angular.isString(str) && arguments.length == 2) {
                if (str.indexOf('{') == 0) {
                    var array = [];
                    var json = JSON.parse(str);
                    angular.forEach(arguments[1].split(','), function (param) {
                        array.push(json[param]);
                    });
                    return array.join(';');
                }
            }
            return str;
        };
    })
    .filter('protocol', function () {
        return function (src) {
            // add https protocol
            if (/^\/\//gi.test(src)) {
                return 'https:' + src;
            } else {
                return src;
            }
        };
    });
