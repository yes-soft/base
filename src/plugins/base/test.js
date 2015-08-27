define(function () {
    angular.module('app')
        .controller('app.test', ['$scope', '$stateParams',
            function ($scope, $stateParams) {
                console.log('controller load test ....');
            }]);
});

console.log("load test ....");

