(function () {
    'use strict';
    angular.module('app')
        .directive('yesUploader', ['$location', 'utils', '$log', 'FileUploader',
            function ($location, utils, $log, FileUploader) {

                return {
                    restrict: 'EA',
                    require:"ngModel",
                    templateUrl: 'plugins/base/templates/uploader.html',
                    replace: true,
                    scope: {
                        options: "="
                    },
                    controller: ['$scope', '$attrs', '$element', 'utils', 'settings',
                        function ($scope, $attrs, $element, utils, settings) {
                            var url = settings.uploadUrl;
                            url = utils.getAbsUrl(url);
                            var uploader = $scope.uploader = new FileUploader({
                                url: url,
                                autoUpload: true
                            });
                            $scope.apiPath = settings.apiPath;
                            utils.async("GET", settings.getUuid).then(function (attId) {
                                $scope.model = attId;
                                uploader.formData = [{'attachmentId': $scope.model}];
                                uploader.onSuccessItem = function (item, res, status, headers) {
                                	item.uid = res.body.data[0].uid;
                                    $scope.message = res.message;
                                    //if (angular.isFunction(options.resolve)) {
                                    //    options.resolve.apply();
                                    //}
                                };
                            });

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