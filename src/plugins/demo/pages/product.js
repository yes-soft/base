define(['base/services/mapper'], function (mapper) {
    "use strict";
    angular.module('app')
        .controller('app.demo.product', ['$scope', '$stateParams', '$timeout', '$location', '$rootScope',
            '$log', '$http', 'utils', 'interpreter', 'settings', 'toastr', '$translate', 'ngDialog', 'oPath',
            function ($scope, $stateParams, $timeout, $location, $rootScope,
                      $log, $http, utils, interpreter, settings, toastr, $translate, ngDialog, oPath) {

                var pageSize = settings.pageSize.defaults;
                var self = $scope;
                var detailId = $location.search()['uid'];

                var api = [$stateParams.name, $stateParams.action].join("/");

                self.detailUrl = "plugins/demo/pages/product.detail.html";

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
                    cancel: function (editForm) {
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

                        editForm.$setPristine();

                    },
                    del: function () {
                        var rows = self.gridApi.selection.getSelectedRows() || [];
                        var loading = 0;
                        if (rows.length) {
                            ngDialog.openConfirm({
                                className: 'ngdialog-theme-default',
                                template: '',
                                plain: true
                            }).then(function () {
                                angular.forEach(rows, function (row) {

                                    utils.async('delete', api + "/" + row.uid).then(function (res) {
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

                            var namespace = api;
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
                            utils.async(method, api, self.form.model).then(function (res) {
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

                self.events = utils.createEvents();

                var config = {
                    title: "配置示例",
                    operations: [],
                    list: {
                        filters: [
                            {
                                type: "input",
                                name: "username$match",
                                label: "用户名"
                            },
                            {
                                type: "select",
                                name: "type$match",
                                label: "账号类型",
                                titleMap: [{name: 'admin', value: 'admin'}, {name: '普通用户', value: 'user'}]
                            },
                            {
                                type: "dateRangePicker",
                                name: "createdAtRang",
                                from: "createdAt$gte",
                                to: "createdAt$lte",
                                label: "创建日期"
                            },
                            {
                                type: "input",
                                name: "mobile$match",
                                label: "手机号码"
                            }]
                    }
                };

                self.form = {};

                self.detail = {
                    operations: [{
                        name: '保存', action: function (form) {
                            self.action.save(form);
                        }

                    }, {
                        name: '重置', action: function (form) {
                            self.action.cancel(form);
                        }
                    }]
                };

                function Watcher(name) {
                    this.name = name;

                    this.when = function (condition, callback) {
                        self.$watchCollection(name, function (newValue, oldValue) {
                            if (condition == true || self.$eval(condition)) {

                                if (angular.isFunction(callback))
                                    callback.call(null, newValue);
                            }
                        });
                    };

                    this.change = function (callback) {
                        this.when(true, callback);
                    };
                }

                function watch(name) {
                    name = "form.model." + name;
                    return new Watcher(name);
                }

                function setValue(key, valueMap, value) {
                    if (!angular.isUndefined(self.form.model) && valueMap && valueMap.hasOwnProperty(value))
                        self.form.model[key] = valueMap[value];
                    else if (value == "") {
                        self.form.model[key] = "";
                    }
                }

                function findByFormKey(form, key) {
                    for (var i = 0, size = form.length; i < size; i++) {
                        var cnf = form[i];
                        if (angular.isObject(cnf)) {
                            if (cnf.type == "group" || cnf.type == "list") {
                                var rs = findByFormKey(cnf.items, key);
                                if (rs) {
                                    return rs;
                                }
                            } else if (cnf.key == key) {
                                return cnf;
                            }
                        } else if (key == cnf) {
                            return cnf;
                        }
                    }
                }

                function setStatus(key, attributte, status) {
                    var form = findByFormKey(self.form.form, key);
                    form = form || {};
                    form[attributte] = status;
                }

                function getValue(key) {
                    if (self.form.model && self.form.model.hasOwnProperty(key))
                        return self.form.model[key];
                }

                function requestApi(res) {
                    var body = res.body;
                    self.entries = body.items || [];
                    self.gridOptions.totalItems = body.count;
                    self.events.trigger('listLoaded');
                }

                function setGridHeaders() {
                    var rawColumns = [
                        {
                            field: ' uid',
                            displayName: '用户编号',
                            visible: false
                        },
                        {
                            field: ' username',
                            displayName: "用户名",
                            width: 90
                        },
                        {
                            field: ' mobile',
                            displayName: '手机',
                            enableSorting: false
                        }
                    ], columns = [];

                    angular.forEach(rawColumns, function (col) {
                        col.name = col.key;
                        if (!col.headerCellFilter)
                            col.headerCellFilter = "translate";
                        columns.push(col);
                    });
                    self.gridOptions.columnDefs = columns;
                }

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

                self.loadSchema = function () {
                    $http.jsonp('/api/form?callback=JSON_CALLBACK').success(function (res) {
                        self.form = res.form;

                        if (self.form && self.form.form) {
                            angular.forEach(self.form.form,
                                function (group) {
                                    angular.forEach(group.items, function (item) {
                                        if (angular.isObject(item)) {
                                            item.editable = true;
                                            item.htmlClass = "cfg-line";
                                            item.editUrl = "...";
                                            item.del = function () {
                                                //item.key;
                                                /* delete */
                                            };
                                        }
                                    });
                                }
                            );
                        }


                        var context = {
                            watch: watch,
                            getValue: getValue,
                            setValue: setValue,
                            setStatus: setStatus
                        };
                        if (angular.isFunction(res.script)) {
                            res.script.apply(context);
                        } else if (angular.isString(res.script)) {

                            eval("var fn=" + res.script);
                            console.log(fn);
                        }

                    }).error(function (err) {
                        console.log("error...", err);
                    });
                };

                self.init = function () {
                    self.editable = config.list.editable !== false;
                    self.entries = [];
                    self.filter = {
                        count: pageSize
                    };

                    config.operations.push({
                        name: "test",
                        action: function () {
                            console.log("test");
                        }
                    });

                    self.config = config;
                    self.form.fullScreen = (self.form.fullScreen !== false);
                    // self.load();

                    if (detailId) {
                        self.loadOne();
                    }

                    self.loadSchema();
                    self.events.trigger('listInit');
                };

                self.load = function () {
                    setGridHeaders();
                    if (self.config.list.mock) {
                        requestApi({'body': {items: [], count: 0}});
                    } else {
                        utils.async("GET", api, self.filter).then(function (res) {
                            requestApi(res);
                        });
                    }
                };

                self.loadEntity = function () {
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

                    if (!self.editable) {
                        setReadonly(self.form.form);
                    }
                    // self.form.initEdit && self.form.initEdit(self, watch);
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
                });

                self.init();
            }
        ]);
});
