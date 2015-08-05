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
                                    $self.toggleClass("open");
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
                            'click', '#sidebar-collapse', function () {
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
                restrict: 'A', /* optional */
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
                    scope.changeItemsPerPage = function () {
                    };

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
        })
    ;


})();
