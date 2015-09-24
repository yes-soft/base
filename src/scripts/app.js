'use strict';
angular.module('app', [
    'ngAnimate',
    'ngResource',
    'ngSanitize',
    'ngTouch',
    'angularMoment',
    'oc.lazyLoad',
    'ui.router',
    'app.config',
    'ui.bootstrap',
    'ui.bootstrap.datetimepicker',
    'schemaForm',
    'toastr',
    'ngDialog',
    'ui.grid.selection',
    'ui.grid.resizeColumns',
    'ui.grid.pagination',
    'ui.grid.autoResize',
    'ui.grid.exporter',
    'app.controllers'])
    .run(['$log', '$timeout', '$state', '$rootScope', 'amMoment', 'i18nService',
        function ($log, $timeout, $state, $rootScope, amMoment, i18nService) {
            i18nService.setCurrentLang('zh-cn');
            amMoment.changeLocale('zh-cn');
        }]);
angular.module('test', [
    'ui.grid.pagination'])
    .run(['$log', '$timeout', '$state', '$rootScope', 'amMoment', 'i18nService',
        function ($log, $timeout, $state, $rootScope, amMoment, i18nService) {
            i18nService.setCurrentLang('zh-cn');
            amMoment.changeLocale('zh-cn');
        }])
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
                    var uri = $location.path().split('/').slice(1);
                    if (uri[0] === 'dashboard') {
                        $scope.menus[0].expanded = true;
                    }
                    else {
                        $scope.menus.forEach(function (menu) {
                            if (menu.tag == uri[0]) {
                                menu.expanded = true;
                            }
                            else if(menu.expanded==true){
                                menu.expanded=false;
                            }
                        });
                    }
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