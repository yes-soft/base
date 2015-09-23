angular.module('app')
    .controller('app.root', ['$scope', '$stateParams', 'utils',
        function ($scope, $stateParams, utils) {
            var self = $scope;
            console.log(utils);
        }]);

