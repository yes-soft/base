angular.module('app')
    .controller('app.layout', ['$scope', '$stateParams', '$location', 'settings', 'utils', 'ngDialog', 'toastr',
        function ($scope, $stateParams, $location, settings, utils, ngDialog, toastr) {

            var self = $scope;
            utils.async("GET", settings.menuApi, {}).then(function (res) {

                var data = res.body;
                if (!angular.isArray(data)) {
                    data = data.items;
                }

                var menus = data.sort(function (a, b) {
                    return a.order - b.order;
                });

                self.rawMenus = menus;

                $scope.menus = utils.menus.initMenus(settings.menuRoot, menus);

                $scope.menusCache = utils.menus.buildMenuTree(menus);

                findMenuByUrl(self.rawMenus);

            });

            function walkParents(menu) {
                if (menu.parentNode) {
                    menu.parentNode.active = true;
                    walkParents(menu.parentNode);
                }
            }

            function findMenuByUrl(menus) {
                var uri = $location.path().substring(1);
                var menuContainer = {};
                for (var i = 0; i < menus.length; i++) {
                    var result = menus[i].url.match(uri + "$");
                    if (result != null) {
                        menuContainer.found = menus[i];
                        menus[i].active = true;
                    } else {
                        menus[i].active = false;
                    }
                }

                if (menuContainer.found) {
                    walkParents(menuContainer.found);
                }
            }


            $scope.onSelect = function ($item, $model, $label) {
                //var hash = $item.url;
                location.hash = $item.url;
                $scope.select = "";
                // jQuery("a href=" + $item.url).click();
            };

            $scope.$on("$locationChangeSuccess", function () {
                if (self.rawMenus)
                    findMenuByUrl(self.rawMenus);
            });

            $scope.getMenus = function (value) {

                return $scope.menusCache.filter(function (raw) {
                    return raw.label.contains(value);
                });
            };

            $scope.displayName = localStorage.getItem("displayName");
            var logout = function () {
                utils.async("GET", "logout").then(function (res) {
                    localStorage.removeItem("displayName");
                    location.reload();
                }, function (error) {
                    location.reload();
                });
            };
            $scope.action = {
                logout: logout,
                updatePassword: function () {
                    ngDialog.open({
                        template: "plugins/base/pages/updatePassword.html",
                        controller: function ($scope) {
                            $scope.save = function (form) {
                                utils.async("post", "setpassword", $scope.model).then(function (res) {
                                        ngDialog.closeAll();
                                        toastr.success("密码修改成功,3秒后自动退出...");
                                        setTimeout(function () {
                                            logout();
                                        }, 2000);
                                    },
                                    function (error) {
                                        toastr.error(error.message);
                                    });
                            }
                        }
                    });
                },
                changeLanguage: function () {
                    ngDialog.open({
                        template: "plugins/base/pages/change.language.html",
                        controller: function ($scope, $translate) {
                            $scope.changeLang = function (lang) {
                                //$translate.use(lang);如果使用这个 javascript翻译的部分会有问题
                                //ngDialog.closeAll();
                                localStorage.language = lang;
                                window.location.reload();
                            };
                            /*$scope.save = function (form) {
                             utils.async("post", "setpassword", $scope.model).then(function (res) {
                             ngDialog.closeAll();
                             toastr.success("密码修改成功,3秒后自动退出...");
                             setTimeout(function () {
                             logout();
                             }, 2000);
                             },
                             function (error) {
                             toastr.error(error.message);
                             });
                             }*/
                        }
                    });
                }
            };


        }]);

