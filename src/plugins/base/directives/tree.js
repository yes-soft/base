'use strict';
(function () {
    angular.module('yes.ui')
        .run(function ($templateCache) {
            // console.log($templateCache);
            //  $templateCache.put('scaffold-template.html', '<h1>scaffold {{world}}</h1>');
        }).directive('treeView', ['$location', 'sfBuilder', '$compile', 'settings',
            function ($location, sfBuilder, $compile, settings) {
                return {
                    restrict: 'EA',
                    replace: true,
                    scope: {
                        options: "=",
                        source: "=resource"
                    },
                    link: function (scope, element, attrs) {

                        console.log('link ......');
                        var df = document.createDocumentFragment();
                        var render = function (source) {
                            walk(source);
                            element[0].appendChild(df);
                            $compile(element.children())(scope);
                        };

                        scope.$watch('source', function (source) {
                            if (source)
                                render(source);
                        });

                        var depth = 0;
                        var decorator = {
                            example: {template: 'plugins/base/templates/tree-node.html', replace: true, builder: []}
                        };

                       // var fg = sfBuilder.build({}, decorator);

                        var walk = function (tree) {
                            angular.forEach(tree, function (node) {
                                var div = document.createElement("div");
                                var name = '-----------------------'.substring(0, depth * 4) + node.name + node.type;
                                var txt = document.createTextNode(name);
                                var current = depth;


                                //  div.appendChild(fg);
                                div.appendChild(txt);
                                df.appendChild(div);
                                if (node.subMenus) {
                                    depth++;
                                    walk(node.subMenus);
                                }
                                depth = current;
                            });
                        };

                    }
                }
            }]);
})();