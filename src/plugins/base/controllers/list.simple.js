define(['base/services/mapper'], function (mapper) {
    "use strict";
    angular.module('app')
        .controller('app.simple.list', ['$scope', '$stateParams', '$timeout', '$location', '$rootScope',
            '$log', '$http', 'utils', 'interpreter', 'settings', 'toastr',
            function ($scope, $stateParams, $timeout, $location, $rootScope,
                      $log, $http, utils, interpreter, settings, toastr) {

                var self = $scope;
                var detailId = $location.search()['uid'];

                self.checkAllChanged = function () {
                    if (self.checkedAll) {
                        angular.forEach(self.entries, function (entry) {
                            entry.checked = true;
                        })
                    } else {
                        angular.forEach(self.entries, function (entry) {
                            entry.checked = false;
                        })
                    }
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
                        angular.forEach(self.form.model, function (raw, key) {
                            delete self.form.model[key];
                        });
                    },
                    edit: function (row) {
                        self.detailLoad(row);
                    },
                    delSingle: function (row) {
                        var namespace = [$stateParams.name, $stateParams.page].join("/");
                        utils.async('delete', namespace + "/" + row.uid).then(function (res) {
                            self.load();
                            toastr.success('删除成功!');
                        });
                    },
                    del: function () {
                        var loading = 0;

                        var rows = self.entries.filter(function (r) {
                            return r.checked;
                        });

                        if (rows.length) {
                            angular.forEach(rows, function (row) {
                                var namespace = [$stateParams.name, $stateParams.page].join("/");
                                utils.async('delete', namespace + "/" + row.uid).then(function (res) {
                                    self.load();
                                    loading++;
                                    if (loading == rows.length) {
                                        toastr.success('删除成功!');
                                        loading = 0;
                                    }
                                });
                            });
                        }
                        else {
                            toastr.warning('请选中要删除的数据');
                        }
                    },
                    create: function () {
                        self.detailLoad();
                        // utils.disableScroll();
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
                    self.entries = [];
                    self.filter = {
                        count: pageSize
                    };

                    self.form = config.form;
                    self.config = config;
                    self.load();

                    if (detailId) {
                        self.loadOne();
                    }

                    self.events.trigger('listInit');
                };

                var requestApi = function (res) {
                    var body = res.body;
                    self.entries = body.items || [];
                    var headers = config.list.headers || body.headers;

                    if (headers) {
                        var columns = [];
                        angular.forEach(headers, function (name, key) {
                            var col = angular.isObject(name) ? name : {name: key, displayName: name};
                            col.name = key;

                            if (col.filter && angular.isFunction(col.filter)) {
                                col.filter.apply(col, [columns, $rootScope]);
                            } else {
                                columns.push(col);
                            }
                        });

                        self.columns = columns;
                    }

                    self.pagination.totalItems = body.count;
                    self.events.trigger('listLoaded');
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

                self.detailLoad = function (entity) {
                    if (!entity)
                        entity = {};

                    self.entryCopy = angular.copy(entity);
                    self.detailUid = entity.uid;
                    self.form = self.form || {};
                    self.form.model = entity;
                    self.detailUrl = config.form.template;
                    // utils.disableScroll();
                    self.events.trigger('detailLoad', entity);
                };

                self.pagination = {
                    data: 'entries',
                    pageSize: 20,
                    onPageChange: function (newPage) {
                        self.filter.start = (newPage - 1) * self.pagination.pageSize;
                        self.filter.count = self.pagination.pageSize;
                        self.load();
                    }
                };

                self.events.on("closeDetail", function () {
                    self.detailUrl = null;
                    self.form.model = {};
                    // utils.resetScroll();
                });

                self.init();
            }
        ]);
});