define(['base/services/mapper'], function (mapper) {
    "use strict";
    angular.module('app')
        .controller('app.wrap.list', ['$scope', '$stateParams', '$timeout', '$location', '$rootScope',
            '$log', '$http', 'utils', 'interpreter', 'settings', 'toastr', '$translate', 'ngDialog',
            function ($scope, $stateParams, $timeout, $location, $rootScope,
                      $log, $http, utils, interpreter, settings, toastr, $translate, ngDialog) {

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
                                    }, function (error) {
                                        toastr.error(error.message);
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
                                res.body.isNew = method != "put";
                                self.events.trigger("entrySaved", res.body);
                                self.load();
                                self.events.trigger("closeDetail");
                            }, function (error) {
                                toastr.error(error.message);
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

                function tempStop(stop) {
                    setTimeout(function () {
                        if (stop) {
                            tempStop(stop);
                        }
                    }, 500);
                }

                self.events = utils.createEvents();

                var config = interpreter.configuration(self), pageSize = config.list.pageSize;


                self.init = function () {
                    self.editable = config.list.editable !== false;
                    self.entries = [];
                    self.filter = {
                        count: pageSize
                    };

                    self.form = config.form;
                    self.config = config;
                    self.form.fullScreen = (self.form.fullScreen !== false);
                    self.load();

                    if (detailId) {
                        self.loadOne();
                    }

                    self.events.trigger('listInit');
                };


                var requestApi = function (res) {
                    var body = res.body;
                    self.entries = body.items || [];
                    self.headers = config.list.headers || body.headers;
                    if (self.headers) {
                        var columns = [];
                        angular.forEach(self.headers, function (col, key) {
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
                        self.gridOptions.columnDefs = columns;
                    }

                    self.gridOptions.totalItems = body.count;
                    self.events.trigger('listLoaded');

                    if (self.form.debug && self.entries.length) {
                        self.detailLoad(self.entries[0]);
                    }
                };

                self.load = function () {
                    var namespace = [$stateParams.name, $stateParams.page].join("/");
                    if (self.config.list.mock) {
                        requestApi({'body': {items: [], count: 0}});
                    } else {
                        utils.async("GET", namespace, self.filter).then(function (res) {
                            requestApi(res);
                        });
                    }
                };

                self.loadOne = function () {
                    var namespace = [$stateParams.name, $stateParams.page, detailId].join("/");
                    utils.async("GET", namespace, self.filter).then(function (res) {
                        var body = res.body;
                        self.detailLoad(body);
                    });
                };

                var Watcher = function (name) {
                    this.name = name;
                    var result = {
                        then: function () {
                        }
                    };

                    this.when = function (condition, callback) {
                        self.$watch(name, function () {
                            if (condition == true || self.$eval(condition)) {
                                if (angular.isFunction(callback))
                                    callback.apply();
                            }
                        });
                    };
                };

                var watch = function (name) {
                    return new Watcher(name);
                };

                self.detailLoad = function (entity) {
                    if (!entity)
                        entity = {};

                    self.entryCopy = angular.copy(entity);
                    self.detailUid = entity.uid;
                    if (!self.form) {
                        self.form = {};
                    }
                    if (!self.editable) {
                        setReadonly(self.form.form);
                    }
                    self.form.model = entity;
                    self.detailUrl = config.form.template;
                    self.form.initEdit && self.form.initEdit(self, watch);
                    self.events.trigger('detailLoad', entity);
                };

                self.pagination = {
                    pageSize: 20,
                    onPageChange: function (newPage) {
                        self.filter.start = (newPage - 1) * self.pagination.pageSize;
                        self.filter.count = self.pagination.pageSize;
                        self.load();
                    }
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
                    useExternalPagination: false,
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
        ]);
});