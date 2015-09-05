'use strict';
(function () {
    angular.module('yes.ui')
        .run(function ($templateCache) {

        }).directive('yesRoleTree', function ($compile, $templateCache, $http) {

            var walkChildren = function (tree, state) {
                angular.forEach(tree, function (node) {
                    node.selected = state;
                    if (node.subMenus) {
                        walkChildren(node.subMenus, state);
                    }
                });
            };

            var walkParent = function (node, state) {
                if (node && node.parentNode && state) {
                    node.parentNode.selected = state;
                    walkParent(node.parentNode, state);
                }
            };

            return {
                restrict: 'EA',
                scope: {
                    nodes: "="
                },
                //templateUrl: 'plugins/base/templates/role-tree.html',
                //replace: true,
                link: function (scope, element, attrs) {
                    $http.get("plugins/base/templates/role-tree.html", {cache: $templateCache})
                        .success(function (html) {
                            scope.selectChanged = scope.selectChanged || function (node) {
                                    walkChildren(node.subMenus, node.selected);
                                    walkParent(node, node.selected);
                                };
                            element.html('').append($compile(html)(scope));
                        });
                }
            };
        })
})();