define([], function () {
    "use strict";
    angular.module('app')
        .controller('app.demo.custom', ['$scope', '$http', 'uiGridConstants',
            function ($scope, $http, uiGridConstants) {


                $scope.gridOptions = {
                    showGridFooter: true,
                    showColumnFooter: true,
                    enableFiltering: true,
                    columnDefs: [
                        {field: 'name', width: '13%'},
                        {field: 'address.street', aggregationType: uiGridConstants.aggregationTypes.sum, width: '13%'},
                        {
                            field: 'age',
                            aggregationType: uiGridConstants.aggregationTypes.avg,
                            aggregationHideLabel: true,
                            width: '13%'
                        },
                        {
                            name: 'ageMin',
                            field: 'age',
                            aggregationType: uiGridConstants.aggregationTypes.min,
                            width: '13%',
                            displayName: 'Age for min'
                        },
                        {
                            name: 'ageMax',
                            field: 'age',
                            aggregationType: uiGridConstants.aggregationTypes.max,
                            width: '13%',
                            displayName: 'Age for max'
                        },
                        {
                            name: 'customCellTemplate',
                            field: 'age',
                            width: '14%',
                            footerCellTemplate: '<div class="ui-grid-cell-contents" style="background-color: Red;color: White">custom template</div>'
                        },
                        {
                            name: 'registered',
                            field: 'registered',
                            width: '20%',
                            cellFilter: 'date',
                            footerCellFilter: 'date',
                            aggregationType: uiGridConstants.aggregationTypes.max
                        }
                    ],
                    data: 'entries',
                    onRegisterApi: function (gridApi) {
                        $scope.gridApi = gridApi;
                    }
                };

                $scope.entries = [];

                //$scope.pagination = {
                //    pageSize: 20,
                //    onPageChange: function (newPage) {
                //        self.filter.start = (newPage - 1) * self.pagination.pageSize;
                //        self.filter.count = self.pagination.pageSize;
                //        self.load();
                //    }
                //};

                //$scope.toggleFooter = function () {
                //    $scope.gridOptions.showGridFooter = !$scope.gridOptions.showGridFooter;
                //    $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.OPTIONS);
                //};
                //
                //$scope.toggleColumnFooter = function () {
                //    $scope.gridOptions.showColumnFooter = !$scope.gridOptions.showColumnFooter;
                //    $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.OPTIONS);
                //};

                $http.get('data/grid_1.json')
                    .success(function (data) {
                        data.forEach(function (row) {
                            row.registered = Date.parse(row.registered);
                        });
                        $scope.entries = data;
                        //$scope.pagination.totalItems = data.length; //自定义的分页
                    });

            }
        ]);
});