'use strict';

(function () {
    angular.module('app')
        .directive('uploaderContainer', ['$location', 'utils', '$log',
            function ($location, utils, $log) {
                return {
                    restrict: 'EA',
                    templateUrl: 'base/templates/uploader-container.html',
                    replace: true,
                    scope: {
                        options: "="
                    },
                    controller: ['$scope', '$attrs', '$element',
                        function ($scope, $attrs, $element) {
                            var options = $scope.options;

                            var url = options.url || "/upload";
                            url = utils.getAbsUrl(url);


                            var uploader = $scope.uploader = new FileUploader({
                                url: url
                            });

                            uploader.filters.push({
                                name: 'customFilter',
                                fn: function (item /*{File|FileLikeObject}*/, options) {
                                    return this.queue.length < 10;
                                }
                            });

                            if (angular.isFunction(options.resolve)) {
                                options.resolve.apply(uploader);
                            }

                            //uploader.onWhenAddingFileFailed = function (item /*{File|FileLikeObject}*/, filter, options) {
                            //    console.info('onWhenAddingFileFailed', item, filter, options);
                            //};
                            //uploader.onAfterAddingFile = function (fileItem) {
                            //    console.info('onAfterAddingFile', fileItem);
                            //};
                            //uploader.onAfterAddingAll = function (addedFileItems) {
                            //    console.info('onAfterAddingAll', addedFileItems);
                            //};
                            //uploader.onBeforeUploadItem = function (item) {
                            //    console.info('onBeforeUploadItem', item);
                            //};
                            //uploader.onProgressItem = function (fileItem, progress) {
                            //    console.info('onProgressItem', fileItem, progress);
                            //};
                            //uploader.onProgressAll = function (progress) {
                            //    console.info('onProgressAll', progress);
                            //};
                            //uploader.onSuccessItem = function (fileItem, response, status, headers) {
                            //    console.info('onSuccessItem', fileItem, response, status, headers);
                            //};
                            //uploader.onErrorItem = function (fileItem, response, status, headers) {
                            //    console.info('onErrorItem', fileItem, response, status, headers);
                            //};
                            //uploader.onCancelItem = function (fileItem, response, status, headers) {
                            //    console.info('onCancelItem', fileItem, response, status, headers);
                            //};
                            //uploader.onCompleteItem = function (fileItem, response, status, headers) {
                            //    console.info('onCompleteItem', fileItem, response, status, headers);
                            //};
                            //uploader.onCompleteAll = function () {
                            //    console.info('onCompleteAll');
                            //};
                            // console.info('uploader', uploader);
                        }]
                };
            }]);
})();