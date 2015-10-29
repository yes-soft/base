define(['base/services/mapper'], function (mapper) {
    "use strict";
    angular.module('app')
        .controller('app.wrap.selector', ['$scope', '$translate', 'ngDialog', 'utils',
            function ($scope, $translate, ngDialog, utils) {

        		$scope.current = $scope.$parent.current;
        		$scope.config = $scope.$parent.config;
        	
        		$scope.action = {
        			search: function () {
        				$scope.load();
                    },
                    reset: function () {
                        angular.forEach($scope.filter, function (raw, key) {
                            if (key != 'count')
                                delete $scope.filter[key];
                        });
                    }
            	}
            	
            	var pageSize = 20;
            	var names = [];
            	angular.forEach($scope.config.headers, function (name, key) {
                    if (angular.isObject(name)) {
                        name.original = name.displayName;
                        name.name = key;
                        names.push(name.original);
                    } else {
                        $scope.config.headers[key] = {"displayName": name, "name": key, "original": name};
                        names.push(name);
                    }
                });

                $translate(names).then(function (translations) {
                    angular.forEach($scope.config.headers, function (name, key) {
                        name.displayName = translations[name.original];
                    });
                }); 
            	
            	$scope.gridOptions = {
                    data: 'entries',
                    enableGridMenu: true,
                    exporterMenuCsv: true,
                    exporterMenuPdf: false,
                    enablePaginationControls: true,
                    enableFiltering: false,
                    enableRowHeaderSelection: true,
                    exporterOlderExcelCompatibility: true,
                    useExternalPagination: true,
                    onRegisterApi: function (gridApi) {
                        $scope.gridApi = gridApi;
                        $scope.$parent.gridApi = gridApi;
                        gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
                            $scope.filter.start = (newPage - 1) * pageSize;
                            $scope.filter.count = pageSize;
                            $scope.load();
                            $scope.paginationOptions.pageNumber = newPage;
                            $scope.paginationOptions.pageSize = pageSize;
                        });
                    },
                    selectedItems: [],
                    paginationPageSizes: [pageSize, 200, 1000],
                    paginationPageSize: pageSize,
                    virtualizationThreshold: 1000,
                    appScopeProvider: {
                        onDblClick: function (row) {}
                    },
                    rowTemplate: "<div ng-dblclick=\"grid.appScope.onDblClick(row)\" " +
                    "ng-repeat=\"(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name\" " +
                    "class=\"ui-grid-cell\" ng-class=\"{ 'ui-grid-row-header-cell': col.isRowHeader }\" " +
                    "ui-grid-cell ></div>"
                };

                $scope.pagination = {
                    pageSize: pageSize,
                    onPageChange: function (newPage) {
                        $scope.filter.start = (newPage - 1) * $scope.pagination.pageSize;
                        $scope.filter.count = $scope.pagination.pageSize;
                        $scope.load();
                    }
                };
                
                $scope.filter = {
        			count: pageSize
            	};
                
                $scope.load = function () {
                    var namespace = [$scope.current.name, $scope.current.page].join("/");
                    utils.async("GET", namespace, $scope.filter).then(function (res) {
                        requestApi(res);
                    });
                };
                
                var requestApi = function (res) {
                    var body = res.body;
                    $scope.entries = body.items || [];
                    if ($scope.config.headers) {
                        var columns = [];
                        angular.forEach($scope.config.headers, function (col, key) {
                            if (angular.isString(col)) {
                                col = {name: key, original: col, displayName: col};
                            } else if (angular.isObject(col) && key) {
                                col.name = key;
                            }
                            col.headerCellFilter = "translate";
                            if (col.filter && angular.isFunction(col.filter)) {
                                col.filter.apply(col, [columns, $rootScope]);
                            } else {
                                columns.push(col);
                            }
                        });
                        $scope.gridOptions.columnDefs = columns;
                    }
                    $scope.gridOptions.totalItems = body.count;
                };
                
                $scope.load();
               
            }
        ]);
});