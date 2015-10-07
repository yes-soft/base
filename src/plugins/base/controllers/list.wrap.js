define(['base/services/mapper'], function (mapper) {
    "use strict";
    angular.module('app')
        .controller('app.wrap.list', ['$scope', '$stateParams', '$timeout', '$location', '$rootScope',
            '$log', '$http', 'utils', 'interpreter', 'settings', 'toastr', '$translate', 'ngDialog',
            function ($scope, $stateParams, $timeout, $location, $rootScope,
                      $log, $http, utils, interpreter, settings, toastr, $translate, ngDialog) {

                /*$scope.refreshAddresses = function(add){
                 console.log("refreshAddresses:",add);
                 };*/

                var self = $scope;
                var detailId = $location.search()['uid'];

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
                        angular.forEach(self.form.model, function (raw, key) {
                            if (self.detailUid) {
                                var namespace = [$stateParams.name, $stateParams.page, self.detailUid].join("/");
                                utils.async('get', namespace).then(function (res) {
                                    self.detailLoad(res.body);
                                });
                            } else if (!angular.isArray(self.form.model[key])) {
                                delete self.form.model[key];
                            } else {
                                self.form.model[key] = [];
                            }
                        });
                    },
                    del: function () {
                        var rows = self.gridApi.selection.getSelectedRows() || [];
                        var loading = 0;
                        if (rows.length) {
                            ngDialog.openConfirm({
                                className: 'ngdialog-theme-default',
                                template: '\
                    <p style="margin-left:20px;">确定删除该条记录？</p>\
                    <div class="ngdialog-buttons">\
                        <button type="button" style="margin-right:45px;" class="ngdialog-button ngdialog-button-secondary" ng-click="closeThisDialog(0)">取消</button>\
                        <button type="button" style="margin-right:35px;" class="ngdialog-button ngdialog-button-primary" ng-click="confirm(1)">确认</button>\
                    </div>',
                                plain: true
                            }).then(function () {
                                angular.forEach(rows, function (row) {
                                    var namespace = [$stateParams.name, $stateParams.page].join("/");
                                    utils.async('delete', namespace + "/" + row.uid).then(function (res) {
                                        self.load();
                                        loading++;
                                        if (loading == rows.length) {
                                            toastr.success('删除成功！');
                                            loading = 0;
                                        }
                                    });
                                });
                            })
                        }
                        else {
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
                        //utils.disableScroll();
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

                            self.events.trigger("beforeSave", self.form);
                            //TODO show loading;
                            utils.async(method, namespace, self.form.model).then(function (res) {
                                self.load();
                                self.events.trigger("closeDetail");
                                self.events.trigger("entrySaved");
                            }, function (error) {
                                // toastr.error(error.message);  TODO
                            });

                        } else {
                            angular.element('.help-block').addClass('text-right');
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

                var config = interpreter.configuration(self), pageSize = config.list.pageSize;

                self.init = function () {
                    self.editable = true;
                    if (config.list.editable == false) {
                        self.editable = false;
                    }
                    self.entries = [];
                    self.filter = {
                        count: pageSize
                    };

                    self.form = config.form;
                    self.config = config;
                    self.headers = config.list.headers;// || body.headers;

                    var names = [];
                    angular.forEach(self.headers, function (name, key) {
                        if (angular.isObject(name)) {
                            name.original = name.displayName;
                            name.name = key;
                            names.push(name.original);
                        } else {
                            self.headers[key] = {"displayName": name, "name": key, "original": name};
                            names.push(name);
                        }
                    });

                    $translate(names).then(function (translations) {
                        angular.forEach(self.headers, function (name, key) {
                            name.displayName = translations[name.original];
                        });
                    });

                    self.load();

                    if (detailId) {
                        self.loadOne();
                    }

                    self.events.trigger('listInit');
                };


                self.load = function () {
                    var namespace = [$stateParams.name, $stateParams.page].join("/");
                    utils.async("GET", namespace, self.filter).then(function (res) {
                        var body = res.body;
                        self.entries = body.items || [];

                        if (self.headers) {
                            var columnDefs = [];
                            angular.forEach(self.headers, function (name, key) {
                                if (name.filter && angular.isFunction(name.filter)) {
                                    name.filter.apply(name, [columnDefs, $rootScope]);
                                } else {
                                    columnDefs.push(name);
                                }
                            });
                            self.gridOptions.columnDefs = columnDefs;

                            if (body.count > self.paginationOptions.pageSize) {
                                $scope.height = ((self.paginationOptions.pageSize * 30) + 90);
                                self.gridOptions.minRowsToShow = self.paginationOptions.pageSize;
                                // gridOptoins.virtualizationThreshold = self.paginationOptions.pageSize;

                                setTimeout(function () {
                                    angular.element(window).trigger('resize');
                                }, 500);

                            }
                            else {
                                $scope.height = ((body.count * 30) + 90) > 460 ? ((body.count * 30) + 90) : 460;
                                self.gridOptions.minRowsToShow = body.count;
                                // gridOptoins.virtualizationThreshold = body.count;

                                setTimeout(function () {
                                    angular.element(window).trigger('resize');
                                }, 500);
                            }

                        }

                        self.gridOptions.totalItems = body.count;

                        self.events.trigger('listLoaded');

                        if (self.form.debug && self.entries.length) {
                            self.detailLoad(self.entries[0]);
                        }
                    });
                };

                self.loadOne = function () {
                    var namespace = [$stateParams.name, $stateParams.page, detailId].join("/");
                    utils.async("GET", namespace, self.filter).then(function (res) {
                        var body = res.body;
                        self.detailLoad(body);
                    });
                };
                self.detailLoad = function (entity) {
                    if (!entity)
                        entity = {};

                    self.entryCopy = angular.copy(entity);
                    self.detailUid = entity.uid;
                    if (self.form) {
                        self.myform = angular.copy(self.form);
                    } else {
                        self.myform = {};
                    }
                    if (!self.editable) {
                        setReadonly(self.myform.form);
                    }
                    self.myform.model = entity;
                    self.detailUrl = config.form.template;
                    self.events.trigger('detailLoad', entity);
                    //utils.disableScroll();
                };

                function setReadonly(form) {
                    for (var i = 0, size = form.length; i < size; i++) {
                        var cnf = form[i];
                        if (angular.isObject(cnf)) {
                            if (cnf.type) {
                                if (cnf.type == "group" || cnf.type == "list") {
                                    setReadonly(cnf.items);
                                } else if (cnf.type == "gallery" || cnf.type == "uploader") {
                                    cnf.readonly = true;
                                } else {
                                    cnf.type = "label";
                                }
                            } else {
                                cnf.type = "label";
                            }
                        } else if (angular.isString(cnf)) {
                            form[i] = {"key": cnf, "type": "label"};
                        }
                    }
                }

                self.paginationOptions = {
                    pageNumber: 1,
                    pageSize: pageSize,
                    sort: null
                };

                self.gridOptions = {
                    data: 'entries',
                    enableGridMenu: true,
                    exporterMenuCsv: true,
                    exporterMenuPdf: false,
                    enablePaginationControls: true,
                    enableFiltering: false,
                    enableRowHeaderSelection: true,
                    exporterOlderExcelCompatibility: true,
                    useExternalPagination: true,
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
                    virtualizationThreshold: 1000,
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
        ])
    ;
});