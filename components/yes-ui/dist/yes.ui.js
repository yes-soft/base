angular.module('yes.ui',
    ['ui.bootstrap', 'toastr', 'schemaForm', 'ui.grid.selection',
        'ui.grid.resizeColumns', 'ui.grid.pagination', 'ui.grid.autoResize',
        'ui.grid.exporter']);
angular.module('yes.ui')
    .directive('changeTab', ['$timeout', function ($timeout) {
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
    }])
    .directive('boxChangeShowHide', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                angular.element(element).click(function (event) {
                    var ion = angular.element(this).children();
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
    .directive('onDomReady', ['$timeout', function ($timeout) {
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
    }])
    .directive('onFinishRender', ['$timeout', function ($timeout) {
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
    }])
    .directive('onMenuRender', ['$timeout', '$stateParams', function ($timeout, $stateParams) {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                if (scope.$last === true) {
                    $timeout(function () {
                        var page = $stateParams.page,
                            pages = $("a[href$=" + page + "]");
                        pages.parent().addClass('active');
                        if (pages.parent().hasClass('last-menu')) {
                            pages.parents('li.ng-scope').addClass('open');
                        }

                        element.parent().on(
                            'click', 'li',
                            function (event) {
                                var $self = angular.element(this);
                                if ($self.hasClass("last-menu")) {
                                    $self.parents('li').siblings().removeClass("active");
                                    $('.last-menu').not(this).removeClass('active');
                                }

                                if ($self.children().children().hasClass('last-menu')) {
                                    $self.toggleClass("open");
                                } else {
                                    if ($self.hasClass("last-menu")) {
                                        $self.addClass("active").siblings().removeClass('active');
                                    } else {
                                        $self.addClass("active").siblings().removeClass('active');
                                        $('.last-menu').removeClass('active');
                                    }
                                }

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
    }])
    .directive('onSideBarRender', ['$timeout', function ($timeout) {
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
    }])
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
    .directive('searchCommon', ['settings', function (settings) {
        return {
            restrict: 'EA',
            templateUrl: settings.templates.searchCommon,
            replace: true,
            scope: {
                filtersConf: "=",
                filter: "=",
                onSearch: "&",
                operations: "="
            },
            link: function (scope, element, attrs) {
            },
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
    }]);


angular.module('yes.ui')
    .directive('yesDetail', function ($timeout) {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
            }
        }
    });


angular.module('yes.ui').config(['schemaFormDecoratorsProvider', function (decoratorsProvider) {
    var base = 'plugins/base/templates/forms/';

    decoratorsProvider.defineDecorator('bootstrapDecorator', {
        textarea: {template: base + 'textarea.html', replace: false},
        fieldset: {template: base + 'fieldset.html', replace: false},
        /*fieldset: {template: base + 'fieldset.html', replace: true, builder: function(args) {
         var children = args.build(args.form.items, args.path + '.items');
         console.log('fieldset children frag', children.childNodes)
         args.fieldFrag.childNode.appendChild(children);
         }},*/
        array: {template: base + 'array.html', replace: false},
        tabarray: {template: base + 'tabarray.html', replace: false},
        tabs: {template: base + 'tabs.html', replace: false},
        section: {template: base + 'section.html', replace: false},
        conditional: {template: base + 'section.html', replace: false},
        actions: {template: base + 'actions.html', replace: false},
        select: {template: base + 'select.html', replace: false},
        checkbox: {template: base + 'checkbox.html', replace: false},
        checkboxes: {template: base + 'checkboxes.html', replace: false},
        number: {template: base + 'default.html', replace: false},
        password: {template: base + 'default.html', replace: false},
        submit: {template: base + 'submit.html', replace: false},
        button: {template: base + 'submit.html', replace: false},
        radios: {template: base + 'radios.html', replace: false},
        'radios-inline': {template: base + 'radios-inline.html', replace: false},
        radiobuttons: {template: base + 'radio-buttons.html', replace: false},
        help: {template: base + 'help.html', replace: false},
        'default': {template: base + 'default.html', replace: false}
    }, []);

    //manual use directives
    decoratorsProvider.createDirectives({
        textarea: base + 'textarea.html',
        select: base + 'select.html',
        checkbox: base + 'checkbox.html',
        checkboxes: base + 'checkboxes.html',
        number: base + 'default.html',
        submit: base + 'submit.html',
        button: base + 'submit.html',
        text: base + 'default.html',
        date: base + 'default.html',
        password: base + 'default.html',
        datepicker: base + 'datepicker.html',
        input: base + 'default.html',
        radios: base + 'radios.html',
        'radios-inline': base + 'radios-inline.html',
        radiobuttons: base + 'radio-buttons.html'
    });

}]).directive('sfFieldset', function () {
    return {
        transclude: true,
        scope: true,
        templateUrl: 'directives/decorators/bootstrap/fieldset-trcl.html',
        link: function (scope, element, attrs) {
            scope.title = scope.$eval(attrs.title);
        }
    };
});

angular.module('yes.ui').config(
    ['schemaFormProvider', 'schemaFormDecoratorsProvider', 'sfPathProvider',
        function (schemaFormProvider, schemaFormDecoratorsProvider, sfPathProvider) {

            schemaFormDecoratorsProvider.addMapping(
                'bootstrapDecorator',
                'group',
                "plugins/base/templates/forms/group.html"
            );
            schemaFormDecoratorsProvider.createDirective(
                'group',
                "plugins/base/templates/forms/group.html"
            );
        }
    ]);

angular.module('yes.ui').config(
    ['schemaFormProvider', 'schemaFormDecoratorsProvider', 'sfPathProvider',
        function (schemaFormProvider, schemaFormDecoratorsProvider, sfPathProvider) {


            var datetimepicker = function (name, schema, options) {
                if (schema.type === 'string' && (schema.format === 'date' || schema.format === 'date-time')) {
                    var f = schemaFormProvider.stdFormObj(name, schema, options);
                    f.key = options.path;
                    f.type = 'datetimepicker';
                    options.lookup[sfPathProvider.stringify(options.path)] = f;
                    return f;
                }
            };

            schemaFormProvider.defaults.string.unshift(datetimepicker);


            schemaFormDecoratorsProvider.addMapping(
                'bootstrapDecorator',
                'datetimepicker',
                "plugins/base/templates/forms/datetimepicker.html"
            );
            schemaFormDecoratorsProvider.createDirective(
                'datetimepicker',
                "plugins/base/templates/forms/datetimepicker.html"
            );
        }
    ]);
(function () {
    'use strict';
    angular.module('yes.ui')
        .directive('importUploader', ['$location', 'utils', 'settings', 'FileUploader',
            function ($location, utils, settings, FileUploader) {
                return {
                    restrict: 'EA',
                    templateUrl: settings.templates.import,
                    replace: true,
                    scope: {
                        options: "="
                    },
                    controller: ['$scope', '$attrs', '$element',
                        function ($scope, $attrs, $element) {
                            var options = $scope.options || {};

                            $scope.title = options.title;

                            var url = options.url || "/upload";
                            url = utils.getAbsUrl(url);

                            var uploader = $scope.uploader = new FileUploader({
                                url: url
                            });


                            uploader.filters.push({
                                name: 'customFilter',
                                fn: function (item, options) {
                                    return this.queue.length < 10;
                                }
                            });

                            uploader.onSuccessItem = function (item, res, status, headers) {
                                $scope.message = res.message;
                                if (angular.isFunction(options.resolve)) {
                                    options.resolve.apply();
                                }
                            };
                        }]
                };
            }]);
})();
angular.module('yes.ui.list', ['ui.grid', ''])
    .directive('yesList', function ($timeout) {
        return {
            restrict: 'EA',
            template: '',
            link: function (scope, element, attr) {


            }
        }
    });
angular.module('yes.ui')
    .directive('yesMenu', function ($timeout) {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
            }
        }
    });
angular.module('yes.ui')
    .directive('yesPage', function ($timeout) {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
            }
        }
    });
angular.module('yes.ui')
    .directive('yesSearchBar', function ($timeout) {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
            }
        }
    });
angular.module('yes.ui.list', ['ui.grid', ''])
    .directive('yesList', function ($timeout) {
        return {
            restrict: 'EA',
            template: '',
            link: function (scope, element, attr) {


            }
        }
    });
angular.module('yes.ui')
    .directive('yesTreeView', function ($compile, $templateCache, $http) {
        return {
            link: function (scope, element, attrs) {
                $http.get("plugins/base/templates/tree-view.html", {cache: $templateCache})
                    .success(function (html) {
                        element.html('').append($compile(html)(scope));
                    });
            }
        };
    });
(function () {
    'use strict';
    angular.module('yes.ui')
        .directive('uploaderContainer', ['$location', 'utils', 'settings',
            function ($location, utils, settings) {
                return {
                    restrict: 'EA',
                    templateUrl: settings.templates.uploader, //'base/templates/uploader-container.html',
                    replace: true,
                    scope: {
                        options: "="
                    },
                    controller: ['$scope', '$attrs', '$element',
                        function ($scope, $attrs, $element) {
                            var options = $scope.options;

                            var url = options.url || "/upload";
                            url = utils.getAbsUrl(url);

                            var uploader = $scope.uploader = new FileUploader({
                                url: url
                            });

                            uploader.filters.push({
                                name: 'customFilter',
                                fn: function (item /*{File|FileLikeObject}*/, options) {
                                    return this.queue.length < 10;
                                }
                            });

                            if (angular.isFunction(options.resolve)) {
                                options.resolve.apply(uploader);
                            }
                        }]
                };
            }]);
})();