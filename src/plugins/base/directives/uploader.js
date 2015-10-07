(function () {
    'use strict';
    angular.module('app')
        .directive('yesUploader', ['$location', 'utils', '$log', 'FileUploader',
            function ($location, utils, $log, FileUploader) {

                return {
                    restrict: 'EA',
                    templateUrl: 'plugins/base/templates/uploader.html',
                    replace: true,
                    scope: {
                        options: "=",
                        readonly: "="
                    },
                    require: 'ngModel',
                    link: function link(scope, element, attrs, ngModelController) {
                        setTimeout(function () {
                            scope.attachmentId = ngModelController.$viewValue;
                            scope.init();
                            scope.$watch("attachmentId", function () {
                                if (scope.attachmentId && !ngModelController.$viewValue) {
                                    ngModelController.$setViewValue(scope.attachmentId);
                                }
                            });
                        }, 0);

                    },
                    controller: ['$scope', '$attrs', '$element', 'utils', 'settings',
                        function ($scope, $attrs, $element, utils, settings) {
                            var url = settings.uploadUrl;
                            url = utils.getAbsUrl(url);
                            var uploader = $scope.uploader = new FileUploader({
                                url: url,
                                autoUpload: true
                            });

                            $scope.init = function () {
                                $scope.apiPath = settings.apiPath;
                                if (!$scope.attachmentId) {
                                    utils.async("GET", settings.getUuid).then(function (attId) {
                                        $scope.attachmentId = attId;
                                    });
                                } else {
                                    utils.async("GET", settings.getByAttIdUrl, {"attId": $scope.attachmentId}).then(function (rs) {
                                        $scope.items = rs.body;
                                    });
                                }
                                uploader.formData = [{'attachmentId': $scope.attachmentId}];
                                uploader.onSuccessItem = function (item, res, status, headers) {
                                    item.uid = res.body.data[0].uid;
                                    $scope.message = res.message;
                                };
                            }

                            $scope.remove = function (item) {
                                utils.async("DELETE", settings.delByUid + "/" + item.uid).then(function (rs) {
                                    if (rs.body) {
                                        if ($scope.items) {
                                            for (var i = 0, size = $scope.items.length; i < size; i++) {
                                                if ($scope.items[i] == item) {
                                                    $scope.items.splice(i, 1);
                                                }
                                            }
                                        }
                                    } else {
                                        console.log("后台删除出错!");
                                    }
                                });
                            };

                            //
                            //uploader.filters.push({
                            //    name: 'customFilter',
                            //    fn: function (item /*{File|FileLikeObject}*/, options) {
                            //        return this.queue.length < 10;
                            //    }
                            //});
                            //
                            //if (angular.isFunction(options.resolve)) {
                            //    options.resolve.apply(uploader);
                            //}
                        }]
                };
            }]);
})();