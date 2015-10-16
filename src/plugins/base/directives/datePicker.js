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
                                    language: settings.language
                                }).next().on("click", function () {
                                    $(this).prev().focus();
                                });
                            } else if (type == "datetime") {
                                $(element).datetimepicker({
                                    autoclose: true,
                                    todayBtn: true,
                                    todayHighlight: true,
                                    format: 'yyyy-mm-dd hh:ii',
                                    language: settings.language
                                    //pickerPosition:'bottom-left',
                                }).next().on("click", function () {
                                    $(this).prev().focus();
                                });
                            } else if (type == "daterange") {
                                var locale = {};
                                if (settings.language.toLowerCase().indexOf("cn") != -1) {
                                    locale = {
                                        "format": "YYYY-MM-DD",
                                        "applyLabel": "应用",
                                        "cancelLabel": "取消",
                                        "daysOfWeek": [
                                            "日",
                                            "一",
                                            "二",
                                            "三",
                                            "四",
                                            "五",
                                            "六"
                                        ],
                                        "monthNames": [
                                            "一月",
                                            "二月",
                                            "三月",
                                            "四月",
                                            "五月",
                                            "六月",
                                            "七月",
                                            "八月",
                                            "九月",
                                            "十月",
                                            "十一月",
                                            "十二月"
                                        ],
                                        "firstDay": 1
                                    };
                                }else{
                                    locale =  {
                                        "format": "MM/DD/YYYY",
                                        "applyLabel": "Apply",
                                        "cancelLabel": "Cancel",
                                        "daysOfWeek": [
                                            "Su",
                                            "Mo",
                                            "Tu",
                                            "We",
                                            "Th",
                                            "Fr",
                                            "Sa"
                                        ],
                                        "monthNames": [
                                            "January",
                                            "February",
                                            "March",
                                            "April",
                                            "May",
                                            "June",
                                            "July",
                                            "August",
                                            "September",
                                            "October",
                                            "November",
                                            "December"
                                        ],
                                        "firstDay": 1
                                    };
                                }

                                var changeInScope = "model";
                                if ($scope.changeInScope) {
                                    changeInScope = $scope.changeInScope;
                                }
                                var from = $scope.$parent[changeInScope][$scope.nameFrom];
                                var to = $scope.$parent[changeInScope][$scope.nameTo];
                                var date = $(element).daterangepicker({
                                    "locale": locale,
                                    'applyClass': 'btn-sm btn-success',
                                    'cancelClass': 'btn-sm btn-default'
                                }, function (start, end, label) {
                                    var str = start.format("YYYY-MM-DD"), end = end.format("YYYY-MM-DD");
                                    $scope.$parent[changeInScope][$scope.nameFrom] = str;
                                    $scope.$parent[changeInScope][$scope.nameTo] = end;
                                    ngModelController.$setViewValue(str + "~" + end);
                                    date.val(str + "~" + end);
                                    //$scope.$parent[changeInScope][ngModelController.$viewName] = ;
                                });
                                if (from && to) {
                                    date.val(from + "~" + to);
                                    ngModelController.$setViewValue(from + "~" + to);
                                } else {
                                    //date.val("");
                                    //ngModelController.$setViewValue("");
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