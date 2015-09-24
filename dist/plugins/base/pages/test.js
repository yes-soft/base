"use strict";
angular.module('app')
    .controller('app.page.test', ['$scope', '$stateParams', '$timeout', '$location', 'utils', 'toastr',
        function ($scope, $stateParams, $timeout, $location, utils, toastr) {
            var self = $scope;

            self.model = {};

            self.action = {
                close: function () {
                    history.back();

                    console.log("", "goback..");
                    // $location.path("/base/accounts");
                },
                save: function () {
                    //  alert(JSON.stringify(self.model));

                    utils.async('post', '', self.model).then(function () {
                        toastr.success("保存成功");
                    }, function () {
                        toastr.error("失败");
                    }); //TODO
                }
            };
        }
    ]);