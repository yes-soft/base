angular.module('app')
    .controller('app.dashboard.index', ['$scope', '$stateParams', 'utils', 'ENV',
        function ($scope, $stateParams, utils, ENV) {
            var self = $scope;
            self.init = function () {

                console.log("....");
            };
            console.log("init ...");
            self.init();
        }]);