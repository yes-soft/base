'use strict';

angular.module('app').factory('explain', ["$stateParams", "oPath", "ENV", "plugins",
    function ($stateParams, oPath, ENV, plugins) {

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

        var getDefaultSettings = function () {
            var __default = getConfig($stateParams.name, '__default') || {};
            __default = angular.extend({list: {}, form: {}}, __default);
            __default.list.pageSize = __default.list.pageSize || ENV.pageSize['default'];

            if (__default.form.template) {
                __default.form.template = ENV.pluginFolder + "/" + $stateParams.name + "/templates/" + __default.form.template;
            }
            __default.form.template = __default.form.template || plugins.templates.detail;

            if (__default.list.template) {
                __default.list.template = ENV.pluginFolder + "/" + $stateParams.name + "/templates/" + __default.list.template;
            }
            __default.list.template = __default.list.template || plugins.templates.list;

            return __default;
        };

        return {
            configuration: function (scope) {
                var defaultSettings = getDefaultSettings();
                var config = getConfig($stateParams.name, $stateParams.page) || defaultSettings;
                config.form = config.form || defaultSettings.form;
                config.list = config.list || defaultSettings.list;
                config.form.template = config.form.template || defaultSettings.form.template;
                config.list.template = config.list.template || defaultSettings.list.template;
                config.list.pageSize = config.list.pageSize || defaultSettings.list.pageSize;
                config.form.operations = config.form.operations || defaultFormOperations;
                config.form.tabs = config.form.tabs || defaultSettings.form.tabs;
                config = explainOperations(config, scope);
                //验证按钮权限. TODO
                config = explainList(config, scope);
                config.form = explainForm(config.form, scope);
                return config
            }
        }
    }]);