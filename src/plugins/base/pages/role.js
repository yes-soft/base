define(['base/directives/tree.view'], function () {
    "use strict";
    angular.module('app')
        .controller('app.page.role', ['$scope', '$stateParams', 'ngDialog', '$location', '$http', 'utils',
            function ($scope, $stateParams, ngDialog, $location, $http, utils) {

                var self = $scope;
                self.result = [];
                self.title = "角色权限";

                $http.get('data/menus.json?').success(function (data) {
                    var menus = utils.menus.initMenus(null, data.body.items);
                    self.node = {"subMenus": menus};
                });

                self.loadRoleRight = function (uid) {
                    $http.get('data/right-' + uid + '.json?id=' + 10000 * Math.random()).success(function (data) {
                        self.currentRights = {};
                        angular.forEach(data.body.items, function (item) {
                            self.currentRights[item.menuId] = true;
                        });
                        walkTree(self.node.subMenus);
                    });
                };

                var walkTree = function (tree) {
                    angular.forEach(tree, function (node) {
                        node.selected = self.currentRights[node.uid] || false;
                        if (node.subMenus) {
                            walkTree(node.subMenus);
                        }
                    });
                };

                $http.get('data/roles.json').success(function (data) {
                    self.roles = data.body.items;
                });

                var getResult = function (tree) {
                    angular.forEach(tree, function (node) {
                        if (node.selected)
                            self.result.push(node.uid);
                        if (node.subMenus) {
                            getResult(node.subMenus);
                        }
                    });
                };

                self.action = {
                    selectRole: function (role) {
                        self.currentRole = role;
                        self.loadRoleRight(role.uid);
                    },
                    copyAuthority: function () {
                        ngDialog.open(
                            {
                                template: "plugins/base/pages/role.copy.html",
                                controller: function ($scope) {
                                    $scope.roles = self.roles;
                                    $scope.copy = function () {
                                        if ($scope.currentRole)
                                            self.loadRoleRight($scope.currentRole);
                                    }
                                }
                            }
                        );
                    },
                    save: function () {
                        self.result = [];
                        getResult(self.node.subMenus);
                    },
                    removeRole: function (role) {
                        self.currentRole = null;  //TODO
                        self.loadRoleRight(role.uid);
                    },
                    addRole: function () {
                        ngDialog.open(
                            {
                                template: "plugins/base/pages/role.add.html",
                                controller: function ($scope) {
                                    //$scope.roles = self.roles;
                                    //$scope.copy = function () {
                                    //    if ($scope.currentRole)
                                    //        self.loadRoleRight($scope.currentRole);
                                    //}
                                }
                            }
                        );
                    }
                }

            }
        ]);
});