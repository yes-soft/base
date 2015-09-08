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

                        }]
                };
            }]);
})();