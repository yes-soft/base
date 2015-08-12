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
    'toastr',
    'ngDialog',
    'ui.grid.exporter',
    'angularFileUpload',
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
                    var uri = $location.path().split('/').slice(1);
                    $scope.menus.forEach(function (menu) {
                        if (menu.tag == uri[0]) {
                            menu.expanded = true;
                        }
                        else if (uri[0] == 'dashboard') {
                            menus[0].expanded = true;
                        }

                    });
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