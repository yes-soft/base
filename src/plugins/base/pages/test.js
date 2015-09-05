"use strict";
angular.module('app')
    .controller('app.page.test', ['$scope', '$stateParams', '$timeout', '$location',
        function ($scope, $stateParams, $timeout, $location) {
            var self = $scope;
            console.log("loaded test");
        }
    ]);