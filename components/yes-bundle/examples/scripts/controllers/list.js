"use strict";
angular.module('app')
    .controller('app.wrap.list', ['$scope', '$stateParams', '$timeout', '$location',
        '$log', '$resource', '$http', 'utils', 'explain', 'plugins', 'toastr',
        function ($scope, $stateParams, $timeout, $location, $log, $resource, $http, utils, explain, plugins, toastr) {

            var self = $scope;
            var loading = 0;

            var showMessage = function (message) {
                if (loading == 0)
                    toastr.success(message);
                else if (loading > 0)
                    loading--;
            };

            self.action = {
                search: function () {
                    self.load();
                },
                reset: function () {
                    angular.forEach(self.filter, function (raw, key) {
                        if (key != 'count')
                            delete self.filter[key];
                    });
                },
                cancel: function () {
                    console.log(self.form);
                    angular.forEach(self.form.model, function (raw, key) {
                        delete self.form.model[key];
                    });
                },
                del: function () {
                    var rows = self.gridApi.selection.getSelectedRows() || [];
                    var loading = 0;
                    if (rows.length) {
                        angular.forEach(rows, function (row) {
                            var namespace = [$stateParams.name, $stateParams.page].join("/");
                            utils.async('delete', namespace + "/" + row.uid).then(function (res) {
                                self.load();
                                loading++;
                                if (loading == rows.length) {
                                    toastr.success('删除成功！');
                                    loading=0;
                                }
                            });
                        });
                    }
                    else{
                        toastr.warning('请选中要删除的数据');
                    }
                },
                create: function () {
                    self.detailLoad();
                    if (!self.form.schema) {

                        self.scaffold = true;

                        self.form.model = {"type": "object", "properties": []};

                        angular.forEach(self.headers, function (raw, key) {
                            var entry = {};
                            entry['key'] = key;
                            entry['title'] = raw;
                            entry['type'] = "string";
                            self.form.model.properties.push(entry);
                        });

                        self.form.schema = {
                            "type": "object",
                            "properties": {
                                "properties": {
                                    "type": "array",
                                    "title": "字段设置",
                                    "items": {
                                        "type": "object",
                                        "title": "属性名称",
                                        "properties": {
                                            "title": {
                                                "type": "string",
                                                "title": "名称"
                                            },
                                            "required": {
                                                "type": "boolean",
                                                "title": "是否必填"
                                            },
                                            "type": {
                                                "type": "string",
                                                "title": "类型",
                                                "enum": ["string", "boolean", "object"]
                                            },
                                            "partten": {
                                                "type": "string",
                                                "title": "验证正则"
                                            },
                                            "placeholder": {
                                                "type": "string",
                                                "title": "placeholder"
                                            }
                                        }
                                    }
                                }
                            }
                        };
                    }
                    utils.disableScroll();
                },
                save: function (form) {

                    self.$broadcast('schemaFormValidate');
                    if (form.$valid) {

                        var namespace = [$stateParams.name, $stateParams.page].join("/");
                        var method = self.form.model.uid ? "put" : "post";
                        if (method == "put") {
                            namespace = [namespace, self.form.model.uid].join("/");
                            delete self.form.model['new'];
                        }

                        if (self.form.model) {
                            for (var k in self.form.model) {
                                if (self.form.model.hasOwnProperty(k) && angular.isDate(self.form.model[k])) {
                                    self.form.model[k] = moment(self.form.model[k]).format("YYYY-MM-DD HH:mm:ss");
                                }
                            }
                        }

                        //TODO show loading;
                        utils.async(method, namespace, self.form.model).then(function (res) {
                            self.load();
                            self.events.trigger("closeDetail");
                            self.events.trigger("entrySaved");
                        });

                    } else {

                    }
                },
                close: function () {
                    self.events.trigger("closeDetail");
                },
                bulk: function () {
                    return self.gridApi.selection.getSelectedRows() || [];
                }
            };

            self.events = utils.createEvents();

            var config = explain.configuration(self), pageSize = config.list.pageSize;

            self.init = function () {
                self.entries = [];
                self.filter = {
                    count: pageSize
                };


                self.form = config.form;

                self.config = config;
                self.load();
                self.events.trigger('listInit');
            };

            self.load = function () {
                var namespace = [$stateParams.name, $stateParams.page].join("/");
                utils.async("GET", namespace, self.filter).then(function (res) {
                    var body = res.body;
                    self.entries = body.items || [];
                    self.headers = config.list.headers || body.headers;

                    if (self.headers) {
                        var columnDefs = [];
                        angular.forEach(self.headers, function (name, key) {

                            var col = angular.isObject(name) ? name : {name: key, displayName: name};

                            col.name = key;

                            if (key == "json") {
                                col.displayName = "预约的手机号码";
                                col.cellTemplate = '<div class="ui-grid-cell-contents" title="{{row.entity.json }}">{{ row.entity.json | jsonParse:"phoneNumbers" }}</div>';
                                columnDefs.push(col);

                                var col2 = {name: key + "2", displayName: name};
                                col2.displayName = "预约的短信内容";
                                col2.cellTemplate = '<div class="ui-grid-cell-contents" title="{{row.entity.json }}">{{ row.entity.json | jsonParse:"message" }}</div>';
                                columnDefs.push(col2);
                            } else {
                                columnDefs.push(col);
                            }

                        });
                        self.gridOptions.columnDefs = columnDefs;
                    }

                    self.gridOptions.totalItems = body.count;

                    if (self.form.debug && self.entries.length) {
                        self.detailLoad(self.entries[0]);
                    }
                });
            };

            self.detailLoad = function (entity) {
                if (!entity)
                    entity = {};

                self.entryCopy = angular.copy(entity);
                self.detailUid = entity.uid;
                self.form = self.form || {};
                self.form.model = entity;
                self.detailUrl = config.form.template;
                utils.disableScroll();
                self.events.trigger('detailLoad', entity);
            };

            self.paginationOptions = {
                pageNumber: 1,
                pageSize: pageSize,
                sort: null
            };

            self.gridOptions = {
                data: 'entries',
                enableGridMenu: true,
                exporterMenuCsv: true,
                enablePaginationControls: true,
                enableFiltering: false,
                enableRowHeaderSelection: true,
                exporterOlderExcelCompatibility: true,
                //useExternalPagination: true,
                //useExternalSorting: true,
                onRegisterApi: function (gridApi) {
                    self.gridApi = gridApi;
                    gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
                        self.filter.start = (newPage - 1) * pageSize;
                        self.filter.count = pageSize;
                        self.load();
                        self.paginationOptions.pageNumber = newPage;
                        self.paginationOptions.pageSize = pageSize;
                    });
                },
                selectedItems: [],
                paginationPageSizes: [pageSize, 200, 1000],
                paginationPageSize: pageSize,
                appScopeProvider: {
                    onDblClick: function (row) {
                        self.detailLoad(row.entity);
                    }
                },
                rowTemplate: "<div ng-dblclick=\"grid.appScope.onDblClick(row)\" " +
                "ng-repeat=\"(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name\" " +
                "class=\"ui-grid-cell\" ng-class=\"{ 'ui-grid-row-header-cell': col.isRowHeader }\" " +
                "ui-grid-cell ></div>"
            };

            self.events.on("closeDetail", function () {
                self.detailUrl = null;
                self.form.model = {};
                utils.resetScroll();
            });

            self.init();
        }
    ]);