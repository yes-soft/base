(function () {
    'use strict';
    angular.module('app')
        .directive('radioDialog', ['$location',
            function ($location) {
                return {
                    restrict: 'A',
                    scope: {
                        option: '=radioDialog',
                        model: '=ngModel'
                    },
                    require: 'ngModel',
                    templateUrl: "plugins/base/templates/dialogs/radio.dialog.html",
                    controller: ['$scope', 'ngDialog', function ($scope, ngDialog) {
                        var self = $scope;
                        var option = self.option;
                        self.isEdit = false;

                        $scope.$watch('model', function (newValue, oldValue) {
                            if (newValue == self.option.value) {
                                self.visible = true;
                            }
                        });

                        self.showDialog = function () {
                            ngDialog.open({
                                template: 'plugins/base/templates/dialogs/selector.html',
                                controller: function ($scope) {
                                    $scope.chooseValue = function (value) {
                                        self.model = value;
                                        self.option.value = value;
                                        self.isEdit = true;
                                    }
                                }
                            });
                        }
                    }]
                };
            }]);
})();