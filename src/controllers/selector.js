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