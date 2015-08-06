'use strict';
angular.module('app').factory('authInterceptor', ['$rootScope', '$q', '$window', '$location', function ($rootScope, $q, $window, $location) {

    var redirectOnce = true;

    return {
        request: function (config) {
            return config;
        },
        response: function (res) {
            return res || $q.when(res);
        },
        responseError: function (rejection) {
            if (rejection.status === 401 && redirectOnce) {
                redirectOnce = false;
                $location.path("/login").search('return', encodeURIComponent(location.hash));

                setTimeout(function () {
                    redirectOnce = true;
                }, 12000);
            }
            return $q.reject(rejection);
        }
    };
}]).config(["$httpProvider", function ($httpProvider) {
    $httpProvider.defaults.withCredentials = true;
    $httpProvider.interceptors.push('authInterceptor');
}]);
