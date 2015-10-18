(function () {
    'use strict';
    angular.module('app')
        .directive('yesGallery', ['$location', 'utils', '$log', 'FileUploader', 'settings',
            function ($location, utils, $log, FileUploader, settings) {

                return {
                    restrict: 'EA',
                    templateUrl: 'plugins/base/templates/gallery.html',
                    replace: true,
                    scope: {
                        options: "=",
                        readonly: "="
                    },
                    require: 'ngModel',
                    link: function link(scope, element, attrs, ngModelController) {
                        setTimeout(function () {
                            scope.attachmentId = ngModelController.$viewValue;
                            scope.options = angular.extend({
                                maxMB: 100,
                                multiple: 10
                            }, scope.options);
                            if (scope.options.multiple == false) {
                                scope.options.multiple = 1;
                            }
                            scope.init();
                            scope.$watch("attachmentId", function () {
                                if (scope.attachmentId && !ngModelController.$viewValue) {
                                    ngModelController.$setViewValue(scope.attachmentId);
                                }
                            });
                        }, 0);

                    },
                    controller: ['$scope', '$attrs', '$element',
                        function ($scope, $attrs, $element) {
                            var url = settings.uploadUrl;
                            url = utils.getAbsUrl(url);
                            var uploader = $scope.uploader = new FileUploader({
                                url: url,
                                autoUpload: true
                            });
                            $scope.sumSize = 0;
                            $scope.init = function () {
                                $scope.apiPath = settings.apiPath;
                                if (!$scope.attachmentId) {
                                    utils.async("GET", settings.getUuid).then(function (attId) {
                                        $scope.attachmentId = attId;
                                        uploader.formData = [{'attachmentId': $scope.attachmentId}, {'isImage': true}];
                                    });
                                } else {
                                	uploader.formData = [{'attachmentId': $scope.attachmentId}, {'isImage': true}];
                                    utils.async("GET", settings.getByAttIdUrl, {"attId": $scope.attachmentId}).then(function (rs) {
                                        $scope.items = rs.body;
                                    });
                                }
                                uploader.onSuccessItem = function (item, res, status, headers) {
                                    item.uid = res.body.data[0].uid;
                                    $scope.message = res.message;
                                };
                            };

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

                            uploader.filters.push({
                                name: 'sizeFilter',
                                fn: function (item /*{File|FileLikeObject}*/, options) {
                                    var tsum = 0;
                                    if ($scope.items) {
                                        $scope.items.forEach(function (item) {
                                            tsum += item.fileSize ? item.fileSize : 0;
                                        });
                                    }
                                    uploader.queue.forEach(function (item) {
                                        tsum += item.size;
                                    });
                                    tsum += item.size;
                                    if (tsum > $scope.options.maxMB * 1048576) {
                                        alert("大小不能超过" + $scope.options.maxMB + "M!");
                                        return false;
                                    } else if (((uploader.queue ? uploader.queue.length : 0) + ($scope.items ? $scope.items.length : 0)) >= $scope.options.multiple) {
                                        alert("最多只能上传" + $scope.options.multiple + "个文件!");
                                        return false;
                                    } else {
                                        return true;
                                    }
                                }
                            });

                            //if (angular.isFunction(options.resolve)) {
                            //    options.resolve.apply(uploader);
                            //}
                        }]
                };
            }]);
})();