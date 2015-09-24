(function () {
    'use strict';
    angular.module('app')
        .directive('datePicker', ['$location', 'utils', '$log', 'FileUploader', 'settings',
            function ($location, utils, $log, FileUploader, settings) {
                return {
                    restrict: 'EA',
                    scope: {
                        pickerType: "=",
                        options: "=",
                        nameFrom: "=",
                        nameTo: "=",
                        changeInScope: "="
                    },
                    require: 'ngModel',
                    link: function link($scope, element, attrs, ngModelController) {
                        setTimeout(function () {
                            $scope.value = ngModelController.$viewValue;
                            var type = "date";//1:date 2:datetime 3:dateRange
                            if ($scope.pickerType) {
                                type = $scope.pickerType;
                            }
                            if (type == "date") {
                                $(element).datepicker({
                                    autoclose: true,
                                    todayHighlight: true,
                                    language: 'zh-CN'
                                }).next().on("click", function () {
                                    $(this).prev().focus();
                                });
                            } else if (type == "datetime") {
                                $(element).datetimepicker({
                                    autoclose: true,
                                    todayBtn: true,
                                    todayHighlight: true,
                                    format: 'yyyy-mm-dd hh:ii',
                                    language: 'zh-CN'
                                    //pickerPosition:'bottom-left',
                                }).next().on("click", function () {
                                    $(this).prev().focus();
                                });
                            } else if (type == "daterange") {
                                var changeInScope="model";
                                if($scope.changeInScope){
                                    changeInScope = $scope.changeInScope;
                                }
                                var from = $scope.$parent[changeInScope][$scope.nameFrom];
                                var to = $scope.$parent[changeInScope][$scope.nameTo];
                                var date = $(element).daterangepicker({
                                    language: 'zh-CN',
                                    startDate: new moment(from),
                                    endDate: new moment(to),
                                    format: 'YYYY-MM-DD',
                                    'applyClass': 'btn-sm btn-success',
                                    'cancelClass': 'btn-sm btn-default',
                                    locale: {
                                        applyLabel: 'Apply',
                                        cancelLabel: 'Cancel'
                                    }
                                }, function (start, end, label) {
                                    $scope.$parent[changeInScope][$scope.nameFrom] = start.format("YYYY-MM-DD");
                                    $scope.$parent[changeInScope][$scope.nameTo] = end.format("YYYY-MM-DD");
                                });
                                if (from && to) {
                                    date.val(from + " - " + to);
                                }
                                $(element).prev().on("click", function () {
                                    $(this).next().focus();
                                });
                            }
                        }, 0);
                    }
                };
            }]);
})();