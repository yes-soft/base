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
                            utils.async("GET", settings.getUuid).then(function (attId) {
                                $scope.attachmentId = attId;
                                uploader.formData = [{'attachmentId': $scope.attachmentId}];
                                uploader.onSuccessItem = function (item, res, status, headers) {
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