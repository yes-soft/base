'use strict';
angular.module('app', [
    'ngAnimate',
    'ngResource',
    'ngSanitize',
    'ngTouch',
    'ngStorage',
    'angularMoment',
    'oc.lazyLoad',
    'ui.router',
    'app.config',
    'ui.bootstrap',
    'ui.bootstrap.datetimepicker',
    'ui.grid',
    'ui.grid.selection',
    'ui.grid.resizeColumns',
    'ui.grid.pagination',
    'schemaForm',
    'app.controllers'])
    .run(['$log', '$timeout', '$state', '$rootScope', 'amMoment', 'i18nService',
        function ($log, $timeout, $state, $rootScope, amMoment, i18nService) {
            i18nService.setCurrentLang('zh-cn');
            amMoment.changeLocale('zh-cn');
        }]);
angular.module('app.controllers', [])
    .controller('AppCtrl', ["$scope", "$location", '$resource', '$log', 'utils', '$http', 'ENV',
        function ($scope, $location, $resource, $log, utils, $http, ENV) {

            utils.async("GET", ENV.menuApi, {}).then(function (res) {

                var data = res.body;

                if (!angular.isArray(data)) {
                    data = data.items;
                }

                var menus = data.sort(function (a, b) {
                    return a.order - b.order;
                });

                $scope.menus = utils.initMenus(ENV.menuRoot, menus);

                if ($scope.menus.length) {
                    $scope.menus[0].expanded = true; //TODO
                }
                $scope.menusCache = utils.buildMenuTree(menus);
            });

            $scope.onSelect = function ($item, $model, $label) {
                //var hash = $item.url;
                location.hash = $item.url;
            };

            $scope.getMenus = function (value) {

                return $scope.menusCache.filter(function (raw) {
                    return raw.label.contains(value);
                });
            };

            $scope.displayName = localStorage.getItem("displayName");
            $scope.action = {
                logout: function () {
                    utils.async("GET", "logout").then(function (res) {
                        localStorage.removeItem("displayName");
                        location.reload();
                    }, function (error) {
                        location.reload();
                    });
                }
            };
        }]);
'use strict';
angular.module('app')
    .config(["$stateProvider", "$urlRouterProvider",
        "$locationProvider", "$ocLazyLoadProvider", "plugins",
        function ($stateProvider, $urlRouterProvider, $locationProvider,
                  $ocLazyLoadProvider, plugins) {
            $ocLazyLoadProvider.config({/* debug: true */});
            var provider =
                $stateProvider
                    .state('app', {
                        url: '',
                        abstract: true,
                        templateUrl: plugins.templates.layout,
                        controller: 'AppCtrl'
                    })
                    .state("login", {
                        url: "/login",
                        templateUrl: plugins.templates.login,
                        controller: "app.login.index"
                    })
                    .state("app.dashboard", {
                        url: "/dashboard",
                        views: {
                            "content": {
                                templateUrl: function () {
                                    return plugins.templates.dashboard;
                                },
                                controller: "app.dashboard.index"
                            }
                        }
                    })
                    .state("app.list", {
                        url: "/:name/:page",
                        views: {
                            "content": {
                                templateUrl: function () {
                                    return plugins.templates.list;
                                },
                                controller: "app.wrap.list"
                            }
                        },
                        resolve: {
                            deps: ["$ocLazyLoad", "$stateParams", "$http", "utils",
                                function ($ocLazyLoad, $stateParams, $http, utils) {
                                    return $ocLazyLoad.load(
                                        [
                                            "plugins/" + $stateParams.name + "/config.js"
                                        ]
                                    )
                                        .then(function (res) {
                                            return res;
                                        }, function (err) {
                                            console.log(err);
                                        });
                                }]
                        }
                    });
            //.state("app.detail", {
            //    url: "/:name/:page/:id",
            //    views: {
            //        "content": {
            //            templateUrl: function () {
            //                return plugins.templates.detail
            //            },
            //            controller: "app.module.detail"
            //        }
            //    },
            //    resolve: {
            //        deps: ["$ocLazyLoad", "$stateParams", "$http", "utils",
            //            function ($ocLazyLoad, $stateParams, $http, utils) {
            //
            //                return $ocLazyLoad.load(
            //                    [
            //                        "plugins/" + $stateParams.name + "/config.js"
            //                    ]
            //                )
            //                    .then(function (res) {
            //                        return res;
            //                    }, function (err) {
            //                        console.log(err);
            //                    });
            //            }]
            //    }
            //});

            $urlRouterProvider.otherwise("/dashboard");
            //$locationProvider.hashPrefix('!');
        }]);
'use strict';

(function () {
    angular.module('app')
        .directive('changeTab', function ($timeout) {
            return {
                restrict: 'A',
                link: function (scope, element, attr) {
                    $(element).click(function (event) {
                        $(this).parents(".tabbable").find(".active").removeClass("active");
                        $($(this).attr("change-tab")).addClass("active");
                        $(this).addClass("active");
                        event.stopPropagation();
                    });
                }
            }
        })
        .directive('boxChangeShowHide', function () {
            return {
                restrict: 'A',
                link: function (scope, element, attr) {
                    $(element).click(function (event) {
                        var ion = $(this).children();
                        if (ion.hasClass("fa-chevron-up")) {
                            ion.removeClass("fa-chevron-up").addClass("fa-chevron-down")
                                .parents(".util-box:eq(0)").children(".box-body").hide();
                        } else {
                            ion.removeClass("fa-chevron-down").addClass("fa-chevron-up")
                                .parents(".util-box:eq(0)").children(".box-body").show();
                        }
                        event.stopPropagation();
                    });
                }
            }
        })
        .directive('onDomReady', function ($timeout) {
            return {
                restrict: 'A',
                link: function (scope, element, attr) {
                    $timeout(function () {
                        var $sideBar = angular.element("#sidebar");
                        element.on(
                            'click', '.navbar-toggle.menu-toggler',
                            function (event) {
                                var $self = angular.element(this);
                                $self.toggleClass('display');
                                $sideBar.toggleClass('display');
                                event.stopPropagation();
                            }
                        );

                        element.on('click', '.toggle-open', function (event) {
                            angular.element(this).toggleClass('open');
                            event.stopPropagation();
                        });

                        element.on('click', function () {
                            angular.element('.toggle-open').removeClass('open');
                        });

                        element.on(
                            'click', '.tabbable.tabs-left li',
                            function (event) {
                                var $self = angular.element(this);
                                angular.element('.tabbable.tabs-left li').not($self).removeClass('active');
                                $self.addClass('active');

                                var $id = $self.attr('id');
                                var $tabContent = angular.element('#tab_' + $id);
                                element.parent().find('.tab-pane').removeClass('active');

                                $tabContent.addClass('active');
                                event.stopPropagation();
                            }
                        );

                    });
                }
            }
        })
        .directive('onFinishRender', function ($timeout) {
            return {
                restrict: 'A',
                link: function (scope, element, attr) {
                    if (scope.$last === true) {
                        $timeout(function () {
                            scope.$emit('ngRepeatFinished');
                        });
                    }
                }
            }
        })
        .directive('onMenuRender', function ($timeout) {
            return {
                restrict: 'A',
                link: function (scope, element, attr) {
                    if (scope.$last === true) {
                        $timeout(function () {
                            element.parent().on(
                                'click', 'li',
                                function (event) {
                                    var $self = angular.element(this);
                                    if ($self.hasClass("last-menu")) {
                                        angular.element(".last-menu.open").removeClass("open");
                                    }
                                    $self.toggleClass("open").siblings().removeClass('open');
                                    if ($self.hasClass('open')) {
                                        $self.children('.submenu').show();
                                    } else {
                                        $self.children('.submenu').hide();
                                    }
                                    event.stopPropagation();
                                }
                            );
                        });
                    }
                }
            }
        })
        .directive('onSideBarRender', function ($timeout) {
            return {
                restrict: 'A',
                link: function (scope, element, attr) {
                    $timeout(function () {
                        element.on(
                            'click', '#sidebar-collapse',
                            function () {
                                element.toggleClass('menu-min');
                                element.find('.tabbable.tabs-left').toggleClass("hidden-ele");
                                angular.element('#sidebar-collapse').find('i').toggleClass('fa-angle-double-right');
                            }
                        );
                    });
                }
            }
        })
        .directive('includeReplace', function () {
            return {
                require: 'ngInclude',
                restrict: 'A',
                /* optional */
                link: function (scope, el, attrs) {
                    el.replaceWith(el.children());
                }
            };
        })
        .directive('pageBar', ['$location', 'utils', function ($location, utils) {
            return {
                restrict: 'EA',
                templateUrl: 'base/templates/page-bar.html',
                replace: true,
                scope: {
                    conf: '='
                },
                link: function (scope, element, attrs) {
                    scope.conf = scope.conf || {};
                    scope.conf.currentPage = utils.currentPage();
                    scope.changeCurrentPage = function (index) {
                        if (index == '...') {
                            return null;
                        } else {
                            scope.conf.currentPage = index;
                            $location.search('p', index);
                        }

                    };
                    scope.conf.pagesLength = parseInt(scope.conf.pagesLength) ? parseInt(scope.conf.pagesLength) : 9;
                    if (scope.conf.pagesLength % 2 === 0) {
                        scope.conf.pagesLength = scope.conf.pagesLength - 1;
                    }
                    if (!scope.conf.perPageOptions) {
                        scope.conf.perPageOptions = [10, 15, 20, 30, 50];
                    }

                    function getPagination() {
                        if (scope.conf.totalItems == null) {
                            return;
                        }
                        scope.conf.currentPage = parseInt(scope.conf.currentPage) ? parseInt(scope.conf.currentPage) : 1;
                        scope.conf.totalItems = parseInt(scope.conf.totalItems);

                        scope.conf.itemsPerPage = parseInt(scope.conf.itemsPerPage) ? parseInt(scope.conf.itemsPerPage) : 15;

                        scope.conf.numberOfPages = Math.ceil(scope.conf.totalItems / scope.conf.itemsPerPage);
                        if (scope.conf.currentPage < 1) {
                            scope.conf.currentPage = 1;
                        }
                        if (scope.conf.currentPage > scope.conf.numberOfPages) {
                            scope.conf.currentPage = scope.conf.numberOfPages;
                        }
                        scope.jumpPageNum = scope.conf.currentPage;
                        var perPageOptionsLength = scope.conf.perPageOptions.length;
                        var perPageOptionsStatus;
                        for (var i = 0; i < perPageOptionsLength; i++) {
                            if (scope.conf.perPageOptions[i] == scope.conf.itemsPerPage) {
                                perPageOptionsStatus = true;
                            }
                        }
                        if (!perPageOptionsStatus) {
                            scope.conf.perPageOptions.push(scope.conf.itemsPerPage);
                        }
                        scope.conf.perPageOptions.sort(function (a, b) {
                            return a - b
                        });

                        scope.pageList = [];

                        if (scope.conf.numberOfPages <= scope.conf.pagesLength) {
                            for (i = 1; i <= scope.conf.numberOfPages; i++) {
                                scope.pageList.push(i);
                            }
                        } else {
                            var offset = (scope.conf.pagesLength - 1) / 2;
                            if (scope.conf.currentPage <= offset) {
                                for (i = 1; i <= offset + 1; i++) {
                                    scope.pageList.push(i);
                                }
                                scope.pageList.push('...');
                                scope.pageList.push(scope.conf.numberOfPages);
                            } else if (scope.conf.currentPage > scope.conf.numberOfPages - offset) {
                                scope.pageList.push(1);
                                scope.pageList.push('...');
                                for (i = offset + 1; i >= 1; i--) {
                                    scope.pageList.push(scope.conf.numberOfPages - i);
                                }
                                scope.pageList.push(scope.conf.numberOfPages);
                            } else {
                                scope.pageList.push(1);
                                scope.pageList.push('...');
                                for (i = Math.ceil(offset / 2); i >= 1; i--) {
                                    scope.pageList.push(scope.conf.currentPage - i);
                                }
                                scope.pageList.push(scope.conf.currentPage);
                                for (i = 1; i <= offset / 2; i++) {
                                    scope.pageList.push(scope.conf.currentPage + i);
                                }
                                scope.pageList.push('...');
                                scope.pageList.push(scope.conf.numberOfPages);
                            }
                        }
                        if (scope.conf.onChange) {
                            scope.conf.onChange();
                        }
                        if (scope.conf.currentPage < 1) {
                            scope.conf.currentPage = 1;
                        }
                    }


                    scope.prevPage = function () {
                        if (scope.conf.currentPage > 1) {
                            scope.conf.currentPage -= 1;
                        }
                    };
                    scope.nextPage = function () {
                        if (scope.conf.currentPage < scope.conf.numberOfPages) {
                            scope.conf.currentPage += 1;
                        }
                    };
                    scope.jumpToPage = function () {
                        scope.jumpPageNum = scope.jumpPageNum.replace(/[^0-9]/g, '');
                        if (scope.jumpPageNum !== '') {
                            scope.conf.currentPage = scope.jumpPageNum;
                        }
                    };
                    scope.changeItemsPerPage = function () {};

                    scope.$watch('conf.totalItems', getPagination);
                }
            };
        }])
        .directive('searchCommon', function (plugins) {
            return {
                restrict: 'E',
                templateUrl: plugins.templates.searchCommon,
                replace: true,
                scope: {
                    filtersConf: "=",
                    filter: "=",
                    onSearch: "&",
                    operations: "="
                },
                link: function (scope, element, attrs) {},
                controller: ['$scope', '$attrs', '$element', '$rootScope', '$timeout', '$modal',
                    function ($scope, $attrs, $element, $rootScope, $timeout, $modal) {
                        $scope.selectChange = function (search) {
                            $scope.filtersConf.forEach(function (sch) {
                                if (sch.hide) {
                                    sch.hide = false;
                                    if (sch.lastValue) {
                                        $scope.filter[sch.name] = sch.lastValue;
                                    } else {
                                        delete $scope.filter[sch.name];
                                    }
                                }
                            });

                            angular.forEach(search.options, function (option) {
                                if (option.hideKeys && option.value == $scope.filter[search.name]) {
                                    option.hideKeys.split(",").forEach(function (key) {
                                        $scope.filtersConf.forEach(function (sch) {
                                            if (sch.name == key && sch.hide != true) {
                                                sch.lastValue = $scope.filter[sch.name];
                                                delete $scope.filter[sch.name];
                                                sch.hide = true;
                                            }
                                        });
                                    });
                                }
                            });
                        };


                        $scope.selectors = {};

                        function initConf() {
                            if ($scope.filtersConf) {
                                $scope.filtersConf.forEach(function (search) {
                                    if (search.type == "select") {
                                        if ($scope.filter[search.name] == null) {
                                            $scope.filter[search.name] = "";
                                        }
                                        $scope.selectChange(search);
                                    } else if (search.type == "department" || search.type == "people") {
                                        var turl = null;
                                        if ("department" == search.type) {
                                            turl = "base/templates/s.department.html";
                                        } else if ("people" == search.type) {
                                            turl = "base/templates/s.people.html";
                                        }
                                        $scope.selectors[search.name] = {
                                            "turl": turl,
                                            "search": search
                                        };
                                    }
                                });
                            }
                        }

                        $scope.$watch("filtersConf", function () {
                            initConf();
                        });

                        $scope.dateChange = function (dateName) {
                            if ($scope.filter[dateName]) {
                                $scope.filter[dateName] = moment($scope.filter[dateName]).format('YYYY-MM-DD');
                            }
                        };
                        $scope.openDate = function ($event, search) {
                            $event.preventDefault();
                            $event.stopPropagation();
                            search.opened = true;
                        };

                        $scope.reset = function () {
                            $scope.filtersConf.forEach(function (search) {
                                search.lastValue = null;
                            });
                            $scope.filtersConf.forEach(function (search) {
                                if (search.type == "select") {
                                    $scope.filter[search.name] = "";
                                    $scope.selectChange(search);
                                } else {
                                    delete $scope.filter[search.name];
                                }
                            });
                        };

                        $scope.keyDown = function (event) {
                            var e = event || window.event;
                            if (e && e.keyCode == 13) {
                                $scope.onSearch();
                            }
                        };
                    }
                ]
            };
        });
})();
angular.module('app')
    .controller('app.dashboard.index', ['$scope', '$stateParams', 'utils', 'ENV',
        function ($scope, $stateParams, utils, ENV) {
            var self = $scope;
            self.init = function () {
            };
            self.init();
        }]);
"use strict";
angular.module('app')
    .controller('app.wrap.list', ['$scope', '$stateParams', '$timeout', '$location',
        '$log', '$resource', '$http', 'utils', 'explain', 'plugins',
        function ($scope, $stateParams, $timeout, $location, $log, $resource, $http, utils, explain, plugins) {

            var self = $scope;

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

                    angular.forEach(rows, function (row) {
                        var namespace = [$stateParams.name, $stateParams.page].join("/");
                        utils.async('delete', namespace + "/" + row.uid).then(function (res) {
                            self.load();
                        });
                    });
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
                enablePaginationControls: true,
                enableFiltering: false,
                enableRowHeaderSelection: false,
                useExternalPagination: true,
                useExternalSorting: true,
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
angular.module('app')
    .controller('app.login.index', ['$scope', '$stateParams', '$location', '$resource', 'utils', 'ENV',
        function ($scope, $stateParams, $location, $resource, utils, ENV) {

            $scope.filter = {};

            $scope.login = function () {
                utils.async("POST", ENV.apiPath + "/login", $scope.filter).then(function (res) {
                    //  console.log(res);
                    localStorage.setItem("displayName", res.body.displayName || res.body.name);
                    localStorage.setItem("username", $scope.filter.username);
                    localStorage.setItem("password", $scope.filter.password);
                    var hash = decodeURIComponent($location.search()["return"]);
                    if (hash)
                        location.hash = hash;
                    $location.search("return", null);

                }, function (err) {
                    utils.alert(err.message);
                });
            };
        }
    ]);
"use strict";
angular.module('app')
    .controller('app.selector', ['$scope', 'utils', '$ionicModal',
        function ($scope, utils, $ionicModal) {
            var search = $scope.search = $scope.$parent.selectors[$scope.$parent.currentName].search;
            $scope.count = 0;
            $scope.loadDepartment = function () {
                utils.async("GET", "/api/department/all",{"count":999999}).then(function (res) {
                    var original = res.items;
                    var items = [];
                    original.forEach(function (it) {
                        var tid = it.u_id;
                        it.name = it.u_lname;
                        if (tid.indexOf("_") == -1) {
                            items.push(it);
                        } else {
                            putInParent(items, it, 0)
                        }
                    });
                    $scope.items = items;
                }, function (err) {
                });
            };

            function putInParent(items, it, index) {
                var tids = it.u_id.split("_");
                var tid = "";
                for (var i = 0; i <= index; i++) {
                    tid += tids[i];
                    if (i != index) {
                        tid += "_";
                    }
                }
                var parent = items.filter(function (topIt) {
                    return (tid == topIt.u_id);
                });
                parent = parent[0];
                if (index + 2 == tids.length) {
                    if (!parent.tree) {
                        parent.tree = [];
                    }
                    parent.tree.push(it);
                } else {
                    putInParent(parent.tree, it, ++index);
                }
            }

            function cancelCheck(items) {
                if (items) {
                    items.forEach(function (item) {
                        if (item.check) {
                            item.check = false;
                        }
                        cancelCheck(item.tree);
                    });
                }
            }

            function checkChildren(items, check) {
                if (items) {
                    items.forEach(function (item) {
                        if (item.check != check) {
                            item.check = check;
                        }
                        checkChildren(item.tree, item.check);
                    });
                }
            }

            function findById(items, id) {
                for (var i = 0, size = items.length; i < size; i++) {
                    var item = items[i];
                    if (item.u_id == id) {
                        return item;
                    }
                    if (item.tree) {
                        var rs = findById(item.tree, id);
                        if (rs) {
                            return rs;
                        }
                    }
                }
            }

            $scope.check = function (item) {
                if (search.radio) {
                    if (!item.check) {
                        cancelCheck($scope.items);
                    }
                } else {
                    if (item.check) {
                        var tempIds = item.u_id.split("_");
                        tempIds.pop();
                        var pid = tempIds.join("_");
                        var parent = findById($scope.items, pid);
                        if (parent && parent.check) {//如果不是单选的情况下 想取消选中,需要先检测上级是否被选中  上级选中的时候禁止取消选中
                            return;
                        }
                    }
                }
                item.check = !item.check;
                checkChildren(item.tree, item.check);
                var topSelected = [];
                setSelectTop(topSelected, $scope.items);
                $scope.count = topSelected.length;
            };

            function setChecks(checks, items) {
                items.forEach(function (item) {
                    if (item.check) {
                        checks.push(item);
                    }
                    if (item.tree) {
                        setChecks(checks, item.tree);
                    }
                });
            }

            function setSelectTop(checks, items) {
                items.forEach(function (item) {
                    if (item.check) {
                        checks.push(item);
                    }
                    if ((!item.check) && item.tree) {
                        setSelectTop(checks, item.tree);
                    }
                });
            }

            var alreadySelect = null;
            $scope.back = function () {
                alreadySelect.hide();
            };
            $scope.goAlreadySelect = function () {
                var topSelected = [];
                setSelectTop(topSelected, $scope.items);
                $scope.topSelected = topSelected;
                if (!alreadySelect) {
                    $ionicModal.fromTemplateUrl("base/templates/s.alreadySelect.html", {
                        scope: $scope
                    }).then(function (modal) {
                        alreadySelect = modal;
                        alreadySelect.show();
                    });
                } else {
                    alreadySelect.show();
                }
            };

            $scope.okay = function () {
                var checks = [];
                setChecks(checks, $scope.items);
                var topSelected = [];
                setSelectTop(topSelected, $scope.items);
                var labels = [], ids = [];
                checks.forEach(function (item) {
                    ids.push(item.uid);
                });
                topSelected.forEach(function (item) {
                    labels.push(item.name);
                });
                $scope.$parent.departmentOkay(ids,labels);
            };

            $scope.cancel = function () {
                $scope.$parent.cancel();
            };


        }
    ]);
'use strict';
angular.module('app')
    .filter('stringify', function () {
        return function (str) {
            if (angular.isObject(str)) {
                return JSON.stringify(str);
            }
            return str;
        };
    })
    .filter('now', function () {
        return function (str) {
            return moment(str).format('LLL');
        };
    })
    .filter('jsonParse', function () {
        return function (str) {
            if (angular.isString(str) && arguments.length == 2) {
                if (str.indexOf('{') == 0) {
                    var array = [];
                    var json = JSON.parse(str);
                    angular.forEach(arguments[1].split(','), function (param) {
                        array.push(json[param]);
                    });
                    return array.join(';');
                }
            }
            return str;
        };
    })
    .filter('protocol', function () {
        return function (src) {
            // add https protocol
            if (/^\/\//gi.test(src)) {
                return 'https:' + src;
            } else {
                return src;
            }
        };
    });

'use strict';
angular.module('app').factory('authInterceptor', ['$rootScope', '$q', '$window', '$location', function ($rootScope, $q, $window, $location) {

    var redirectOnce = true;

    return {
        request: function (config) {
            return config;
        },
        response: function (res) {
            return res || $q.when(res);
        },
        responseError: function (rejection) {
            if (rejection.status === 401 && redirectOnce) {
                redirectOnce = false;
                $location.path("/login").search('return', encodeURIComponent(location.hash));

                setTimeout(function () {
                    redirectOnce = true;
                }, 12000);
            }
            return $q.reject(rejection);
        }
    };
}]).config(["$httpProvider", function ($httpProvider) {
    $httpProvider.defaults.withCredentials = true;
    $httpProvider.interceptors.push('authInterceptor');
}]);

'use strict';

angular.module('app').factory('explain', ["$stateParams", "oPath", "ENV", "plugins", "utils",
    function ($stateParams, oPath, ENV, plugins, utils) {

        var injector = angular.element(document.body).injector();

        var defaultListOperations = {
            'search': {
                'name': '查找'
            },
            'reset': {
                'name': '重置'
            },
            'add': {
                'name': '新建'
            },
            'del': {
                'name': '删除'
            }
        };

        var defaultFormOperations = {
            'save': {
                'name': '保存'
            },
            'reset': {
                'name': '重置'
            },
            'del': {
                'name': '删除'
            }
        };

        var array2Object = function (arr, key) {
            var rv = {};
            for (var i = 0; i < arr.length; ++i) {
                if (arr[i].hasOwnProperty(key))
                    rv[arr[i][key]] = arr[i];
                else
                    rv[i] = arr[i];
            }
            return rv;
        };

        var getConfig = function (name, pageName) {
            try {
                return injector.get(name + ".config")[pageName];
            } catch (ex) {
                return null;
            }
        };

        var invoke = function (fn, context) {
            if (angular.isFunction(fn)) {
                injector.invoke(fn, context);
            } else if (angular.isArray(fn)) {
                angular.forEach(fn, function (f) {
                    invoke(f, context);
                });
            }
        };


        var explainOperations = function (config, scope) {

            var ops = oPath.get(config, 'operation', []);
            if (!ops)
                return config;

            var operations = [];
            var defaults = {
                add: {
                    'name': '新建',
                    'action': scope.action.create
                },
                del: {
                    'name': '删除',
                    'action': scope.action.del
                }
            };
            var context = {scope: scope};

            angular.forEach(ops, function (op, key) {
                if (op) {
                    var entry = defaults[key] || {'name': op.name, action: op.action};
                    if (angular.isFunction(op.action)) {
                        entry.action = function () {
                            injector.invoke(op.action, context);
                        };
                    }
                    operations.push(entry);
                }
            });
            config.operations = operations;
            return config;
        };

        var explainList = function (config, scope) {
            var context = {scope: scope, list: config.list};
            var resolves = oPath.get(config, 'list.resolves', []);
            invoke(resolves, context);
            return config
        };

        var overrideDefault = function (config, property, defaultValue) {
            if (config) {
                config[property] = config[property] || angular.copy(defaultValue);
            }
        };

        var overrideProperties = function (target, defaults) {
            if (!target)
                throw ('can not override properties with null');
            for (var prop in defaults) {
                if (defaults.hasOwnProperty(prop)) {
                    overrideDefault(target, prop, defaults[prop]);
                }
            }
        };

        var explainForm = function (config, scope) {

            var properties = oPath.get(config, 'schema.properties', {});
            if (angular.isArray(properties)) {
                config.schema.properties = array2Object(properties, 'key');
            }

            var context = {scope: scope, form: config.form};

            if (angular.isArray(config.form)) {
                angular.forEach(config.form, function (form) {
                    angular.forEach(form.items, function (entry) {
                        if (entry.type == 'datepicker' || entry.type == 'datetimepicker') {
                            entry.title = entry.title || config.schema.properties[entry.key].title;
                            entry.open = function ($event) {
                                $event.preventDefault();
                                $event.stopPropagation();
                                entry.opened = true;
                            };
                        }
                        if (angular.isObject(entry)) {
                            entry.required = entry.required || config.schema.properties[entry.key].required;
                        }
                    });
                });
            }

            var resolves = oPath.get(config, 'resolves', []);
            invoke(resolves, context);
            return config;
        };

        var getFullTemplatePath = function (path) {

            if (angular.isUndefined(path))
                return;

            if (path.indexOf('http') == 0 || path.indexOf('plugins') > -1)
                return path;

            var template = [ENV.pluginFolder, $stateParams.name, 'templates', path].join('/').replace(/\/\//g, '/');

            return [utils.root, template].join('/');
        };

        var getDefaultSettings = function () {
            var __default = getConfig($stateParams.name, '__default') || {};
            __default = angular.extend({list: {}, form: {}}, __default);
            overrideDefault(__default.form, 'template', [utils.root, plugins.templates.detail].join('/'));
            overrideDefault(__default.list, 'template', [utils.root, plugins.templates.list].join('/'));
            overrideDefault(__default.list, 'pageSize', ENV.pageSize['default']);
            return __default;
        };

        return {
            configuration: function (scope) {
                var defaultSettings = getDefaultSettings();
                var config = getConfig($stateParams.name, $stateParams.page) || {};

                overrideDefault(config, 'form', {});
                overrideDefault(config, 'list', {});

                overrideProperties(config.form, defaultSettings.form);
                overrideProperties(config.list, defaultSettings.list);


                config.list.template = getFullTemplatePath(config.list.template);
                config.form.template = getFullTemplatePath(config.form.template);

                console.log(config.form.template);

                config = explainOperations(config, scope);

                //validateAuthority(config.form.operations);
                //validateAuthority(config.list.operations);

                config = explainList(config, scope);
                config.form = explainForm(config.form, scope);
                return config
            }
        }
    }]);
'use strict';
angular.module('app').factory('fileSize',
    function () {

        var units = 'BKMGTPEZY'.split('');

        function equals(a, b) {
            return a && a.toLowerCase() === b.toLowerCase()
        }

        return function getSize(bytes, options) {
            bytes = typeof bytes == 'number' ? bytes : 0;
            options = options || {};
            options.fixed = typeof options.fixed == 'number' ? options.fixed : 2;
            options.spacer = typeof options.spacer == 'string' ? options.spacer : ' ';

            options.calculate = function (spec) {
                var type = equals(spec, 'si') ? ['k', 'B'] : ['K', 'iB'];
                var algorithm = equals(spec, 'si') ? 1e3 : 1024;
                var magnitude = Math.log(bytes) / Math.log(algorithm) | 0;
                var result = (bytes / Math.pow(algorithm, magnitude));
                var fixed = result.toFixed(options.fixed);
                var suffix;

                if (magnitude - 1 < 3 && !equals(spec, 'si') && equals(spec, 'jedec'))
                    type[1] = 'B';

                suffix = magnitude
                    ? (type[0] + 'MGTPEZY')[magnitude - 1] + type[1]
                    : ((fixed | 0) === 1 ? 'Byte' : 'Bytes');

                return {
                    suffix: suffix,
                    magnitude: magnitude,
                    result: result,
                    fixed: fixed,
                    bits: {result: result / 8, fixed: (result / 8).toFixed(options.fixed)}
                }
            };

            options.to = function (unit, spec) {
                var algorithm = equals(spec, 'si') ? 1e3 : 1024;
                var position = units.indexOf(typeof unit == 'string' ? unit[0].toUpperCase() : 'B');
                var result = bytes;

                if (position === -1 || position === 0) return result.toFixed(2);
                for (; position > 0; position--) result /= algorithm
                return result.toFixed(2)
            };

            options.human = function (spec) {
                var output = options.calculate(spec);
                return output.fixed + options.spacer + output.suffix
            };

            return options;
        }

    });
'use strict';

angular.module('app').factory('oPath', [
    function () {

        var oPath = (function () {
            var toStr = Object.prototype.toString,
                _hasOwnProperty = Object.prototype.hasOwnProperty;

            function isEmpty(value) {
                if (!value) {
                    return true;
                }
                if (isArray(value) && value.length === 0) {
                    return true;
                } else if (!isString(value)) {
                    for (var i in value) {
                        if (_hasOwnProperty.call(value, i)) {
                            return false;
                        }
                    }
                    return true;
                }
                return false;
            }

            function toString(type) {
                return toStr.call(type);
            }

            function isNumber(value) {
                return typeof value === 'number' || toString(value) === "[object Number]";
            }

            function isString(obj) {
                return typeof obj === 'string' || toString(obj) === "[object String]";
            }

            function isObject(obj) {
                return typeof obj === 'object' && toString(obj) === "[object Object]";
            }

            function isArray(obj) {
                return typeof obj === 'object' && typeof obj.length === 'number' && toString(obj) === '[object Array]';
            }

            function isBoolean(obj) {
                return typeof obj === 'boolean' || toString(obj) === '[object Boolean]';
            }

            function getKey(key) {
                var intKey = parseInt(key);
                if (intKey.toString() === key) {
                    return intKey;
                }
                return key;
            }

            function set(obj, path, value, doNotReplace) {
                if (isNumber(path)) {
                    path = [path];
                }
                if (isEmpty(path)) {
                    return obj;
                }
                if (isString(path)) {
                    return set(obj, path.split('.').map(getKey), value, doNotReplace);
                }
                var currentPath = path[0];

                if (path.length === 1) {
                    var oldVal = obj[currentPath];
                    if (oldVal === void 0 || !doNotReplace) {
                        obj[currentPath] = value;
                    }
                    return oldVal;
                }

                if (obj[currentPath] === void 0) {
                    //check if we assume an array
                    if (isNumber(path[1])) {
                        obj[currentPath] = [];
                    } else {
                        obj[currentPath] = {};
                    }
                }

                return set(obj[currentPath], path.slice(1), value, doNotReplace);
            }

            function del(obj, path) {
                if (isNumber(path)) {
                    path = [path];
                }

                if (isEmpty(obj)) {
                    return void 0;
                }

                if (isEmpty(path)) {
                    return obj;
                }
                if (isString(path)) {
                    return del(obj, path.split('.'));
                }

                var currentPath = getKey(path[0]);
                var oldVal = obj[currentPath];

                if (path.length === 1) {
                    if (oldVal !== void 0) {
                        if (isArray(obj)) {
                            obj.splice(currentPath, 1);
                        } else {
                            delete obj[currentPath];
                        }
                    }
                } else {
                    if (obj[currentPath] !== void 0) {
                        return del(obj[currentPath], path.slice(1));
                    }
                }

                return obj;
            }

            var objectPath = function (obj) {
                return Object.keys(objectPath).reduce(function (proxy, prop) {
                    /*istanbul ignore else*/
                    if (typeof objectPath[prop] === 'function') {
                        proxy[prop] = objectPath[prop].bind(objectPath, obj);
                    }

                    return proxy;
                }, {});
            };

            objectPath.has = function (obj, path) {
                if (isEmpty(obj)) {
                    return false;
                }

                if (isNumber(path)) {
                    path = [path];
                } else if (isString(path)) {
                    path = path.split('.');
                }

                if (isEmpty(path) || path.length === 0) {
                    return false;
                }

                for (var i = 0; i < path.length; i++) {
                    var j = path[i];
                    if ((isObject(obj) || isArray(obj)) && _hasOwnProperty.call(obj, j)) {
                        obj = obj[j];
                    } else {
                        return false;
                    }
                }

                return true;
            };

            objectPath.ensureExists = function (obj, path, value) {
                return set(obj, path, value, true);
            };

            objectPath.set = function (obj, path, value, doNotReplace) {
                return set(obj, path, value, doNotReplace);
            };

            objectPath.insert = function (obj, path, value, at) {
                var arr = objectPath.get(obj, path);
                at = ~~at;
                if (!isArray(arr)) {
                    arr = [];
                    objectPath.set(obj, path, arr);
                }
                arr.splice(at, 0, value);
            };

            objectPath.empty = function (obj, path) {
                if (isEmpty(path)) {
                    return obj;
                }
                if (isEmpty(obj)) {
                    return void 0;
                }

                var value, i;
                if (!(value = objectPath.get(obj, path))) {
                    return obj;
                }

                if (isString(value)) {
                    return objectPath.set(obj, path, '');
                } else if (isBoolean(value)) {
                    return objectPath.set(obj, path, false);
                } else if (isNumber(value)) {
                    return objectPath.set(obj, path, 0);
                } else if (isArray(value)) {
                    value.length = 0;
                } else if (isObject(value)) {
                    for (i in value) {
                        if (_hasOwnProperty.call(value, i)) {
                            delete value[i];
                        }
                    }
                } else {
                    return objectPath.set(obj, path, null);
                }
            };

            objectPath.push = function (obj, path /*, values */) {
                var arr = objectPath.get(obj, path);
                if (!isArray(arr)) {
                    arr = [];
                    objectPath.set(obj, path, arr);
                }

                arr.push.apply(arr, Array.prototype.slice.call(arguments, 2));
            };

            objectPath.coalesce = function (obj, paths, defaultValue) {
                var value;

                for (var i = 0, len = paths.length; i < len; i++) {
                    if ((value = objectPath.get(obj, paths[i])) !== void 0) {
                        return value;
                    }
                }

                return defaultValue;
            };

            objectPath.find = function (obj, path, defaultValue) {

                if (isNumber(path)) {
                    path = [path];
                }
                if (isEmpty(path)) {
                    return obj;
                }
                if (isEmpty(obj)) {
                    return defaultValue;
                }
                if (isString(path)) {

                    objectPath.find(obj, path.split('.'), defaultValue);
                }

                var currentPath = getKey(path[0]);

                if (/\[(.*?)\]/g.test(currentPath) && isArray(obj)) {
                    var rv = /\[(.*?)\]/g.exec(currentPath)[1];
                    var arrRv = rv.split(':');
                    for (var i = 0; i < obj.length; i++) {
                        if (obj[i].hasOwnProperty(arrRv[0]) && obj[i][arrRv[0]] == arrRv[1]) {
                            return objectPath.find(obj[i], path.slice(1), defaultValue);
                        }
                    }
                }

                if (path.length === 1) {
                    if (obj[currentPath] === void 0) {
                        return defaultValue;
                    }
                    return obj[currentPath];
                }

                return objectPath.find(obj[currentPath], path.slice(1), defaultValue);
            };

            objectPath.get = function (obj, path, defaultValue) {
                if (isNumber(path)) {
                    path = [path];
                }
                if (isEmpty(path)) {
                    return obj;
                }
                if (isEmpty(obj)) {
                    return defaultValue;
                }
                if (isString(path)) {
                    return objectPath.get(obj, path.split('.'), defaultValue);
                }

                var currentPath = getKey(path[0]);

                if (path.length === 1) {
                    if (obj[currentPath] === void 0) {
                        return defaultValue;
                    }
                    return obj[currentPath];
                }

                return objectPath.get(obj[currentPath], path.slice(1), defaultValue);
            };

            objectPath.del = function (obj, path) {
                return del(obj, path);
            };

            return objectPath;

        })();

        return oPath;
    }]);
'use strict';
angular.module('app').factory('utils', ["$http", "$q", "$location", "$stateParams", "ENV", 'gateway',
    function ($http, $q, $location, $stateParams, ENV, gateway) {
        var headers = ENV.headers;
        var cacheContainer = {};
        var __menus = {};
        var handles = {
            async: function (method, uri, entry, _headers) {
                var options = {
                    "method": method,
                    "url": uri,
                    "cache": false,
                    "headers": _headers || headers
                };

                if (entry) {
                    angular.forEach(entry, function (raw, key) {
                        if (raw == "") {
                            delete entry[key];
                        }
                    });
                }

                if (entry
                    && (method.toLowerCase() == "post" || method.toLowerCase() == "put" )
                    && headers['Content-Type'].indexOf('json') > 0)
                    options.data = entry;
                else if (entry)
                    options.data = this.serialize(entry);

                var deferred = $q.defer();

                if (!uri)
                    deferred.reject({"message": "Uri is empty!"});
                else {
                    if (options.data && options.method.toLowerCase() == "get") {
                        options.url = options.url + "?" + options.data;
                    }

                    $http(options).success(function (res) {
                        if (res.error == 0 || !res.error) {
                            deferred.resolve(res);
                        } else if (res['@timestamp']) {
                            var result = handles.parseView(res);
                            deferred.resolve({"items": result});
                        } else if (res.message) {
                            deferred.reject(res);
                        } else {
                            deferred.reject({"message": "服务器异常"});
                        }
                    }).error(function (error) {
                        deferred.reject({"message": "无法连接到服务器"});
                    });
                    return deferred.promise;
                }
            },
            serialize: function (data) {
                if (!angular.isObject(data)) {
                    return ( ( data == null ) ? "" : data.toString() );
                }
                var buffer = [];
                for (var name in data) {
                    if (!data.hasOwnProperty(name)) {
                        continue;
                    }
                    var value = data[name];

                    if (angular.isDate(value) && moment) {
                        value = moment(value).format("YYYY-MM-DD HH:mm:ss");
                    }

                    buffer.push(
                        encodeURIComponent(name) + "=" + encodeURIComponent(( value == null ) ? "" : value)
                    );
                }
                var source = buffer.join("&");
                return ( source );
            },
            createDoc: function (raw) {
                if (raw && raw.properties && angular.isArray(raw.properties)) {
                    angular.forEach(raw.properties, function (props) {
                        raw[props.name] = props.value.length == 1 ? props.value[0] : props.value;
                    });
                    delete raw.properties;
                }
                return raw;
            }
        };

        var extMap = {
            'default': 'ico ico-file ico-file-1',
            xls: 'ico ico-file ico-file-2',
            xlsx: 'ico ico-file ico-file-2',
            doc: 'ico ico-file ico-file-3',
            docx: 'ico ico-file ico-file-3',
            ppt: 'ico ico-file ico-file-4',
            pptx: 'ico ico-file ico-file-4',
            rar: 'ico ico-file ico-file-6',
            zip: 'ico ico-file ico-file-7',
            html: 'ico ico-file ico-file-10',
            js: 'ico ico-file ico-file-11',
            xml: 'ico ico-file ico-file-12',
            css: 'ico ico-file ico-file-12',
            pdf: 'ico ico-file ico-file-17',
            txt: 'ico ico-file ico-file-22',
            jpg: 'ico ico-file ico-file-31',
            gif: 'ico ico-file ico-file-32',
            png: 'ico ico-file ico-file-33',
            bmp: 'ico ico-file ico-file-34'
        };

        var initMenus = function (parentId, menus) {
            return menus.filter(
                function (m) {
                    var r = (m.parent == parentId && m.type && m.type.toLowerCase() == "menu");

                    if (m.url == "#")
                        m.url = "";
                    if (r) {
                        m.subMenus = initMenus(m.uid, menus);
                    }
                    return r;
                }
            );
        };

        var buildMenuTree = function (menus) {
            var result = [];
            angular.forEach(menus, function (r) {
                var m = {label: r.name, url: r.url, parent: r.parent, uid: r.uid};
                m.parents = [];
                findParents(m, m, menus);
                m.name = m.parents.reverse().join(" > ");
                result.push(m);
            });
            return result;
        };

        var findParents = function (self, node, menus) {
            var parent = menus.filter(function (m) {
                return m.uid == node.parent;
            });

            if (self.parents.length == 0)
                self.parents.push(self.label);
            if (parent.length) {
                self.parents.push(parent[0].name);
                findParents(self, parent[0], menus);
            }
        };

        var createEvents = function () {
            var events = {};
            return {
                on: function (names, handler) {
                    names.split(' ').forEach(function (name) {
                        if (!events[name]) {
                            events[name] = [];
                        }
                        events[name].push(handler);
                    });
                    return this;
                },
                once: function (names, handler) {
                    names.split(' ').forEach(function (name) {
                        events[name] = [];
                        events[name].push(handler);
                    });
                    return this;
                },
                trigger: function (name, args) {
                    angular.forEach(events[name], function (handler) {
                        handler.call(null, args);
                    });
                    return this;
                }
            };
        };

        var __events = new createEvents();

        var findInjectServices = function (name) {
            try {
                return angular.element(document.body).injector().get(name);
            } catch (ex) {
                return null;
            }
        };

        var host = (gateway.host !== "self") ? gateway.host : (location.protocol + "//" + location.host);
        var root = host + location.pathname.substr(0, location.pathname.lastIndexOf("/"));

        var getMockResourceUrl = function (uri) {

            var arr = uri.split('/');
            if (ENV.mock && arr.length)
                return 'data/' + arr.slice(3).join('.') + ".json";

            return uri;
        };

        return {
            alert: function (msg, btnText) {
                console.log(msg, btnText);
            },
            root: root,
            host: host,
            serialize: handles.serialize,
            format: function (format) {
                var args = Array.prototype.slice.call(arguments, 1);
                if (!format)
                    return "";
                return format.replace(/{(\d+)}/g, function (match, number) {
                    return typeof args[number] != 'undefined'
                        ? args[number]
                        : match
                        ;
                });
            },
            capitalize: function (string) {
                return string.charAt(0).toUpperCase() + string.slice(1);
            },
            createEvents: function () {
                return new createEvents();
            },
            events: __events,
            initMenus: initMenus,
            buildMenuTree: buildMenuTree,
            changeTitle: function (title) {
                __events.trigger("changeTitle", title);
            }
            , currentPage: function () {
                var p = $location.search()[p];
                return parseInt(p) || 1;
            },
            async: function (method, path, options) {
                var uri = path;
                if (path.indexOf('http') == 0) {
                    uri = path;
                } else {
                    if (path.indexOf(ENV.apiPath) !== 0) {
                        uri = [ENV.apiPath, path].join('/').replace(/\/\//g, '/');
                    }
                    uri = [host, uri].join('/');
                }
                uri = getMockResourceUrl(uri);
                return handles.async(method, uri, options);
            },
            findViewConfig: function (stateName, page) {
                return findInjectServices(stateName + ".config")[page];
            },
            disableScroll: function () {
                document.body.style.overflow = "hidden";
                angular.element(window).trigger('resize');
            },
            resetScroll: function () {
                document.body.style.overflow = null;
                angular.element(window).trigger('resize');
            },
            getFileExtCss: function (fileName) {
                var re = /(?:\.([^.]+))?$/;
                var ext = re.exec(fileName)[1];
                return extMap.hasOwnProperty(ext) ? extMap[ext] : extMap.default;
            }
        };
    }]);