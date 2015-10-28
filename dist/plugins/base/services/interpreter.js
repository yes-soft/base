angular.module('yes.utils').factory('interpreter', ["$stateParams", "oPath", "utils",
    function ($stateParams, oPath, utils) {

        var settings = utils.settings;
        var injector = angular.element('body').injector();

        var getConfig = function (name, pageName) {
            var service = name + ".config";
            if (injector.has(service)) {

                var config = injector.get(service);
                if (config.hasOwnProperty(pageName))
                    return config[pageName];
            }
            return null;
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

            var ops = oPath.get(config, 'operation', {});

            var operations = [];

            var defaults = {
                add: {
                    'name': '新建',
                    'icon': 'fa-plus',
                    'action': scope.action.create
                },
                del: {
                    'name': '删除',
                    'icon': 'fa-remove',
                    'action': scope.action.del
                }
            };

            var context = {scope: scope};

            angular.forEach(ops, function (op, key) {
                    if (op) {
                        var entry = defaults[key] || {
                                'name': op.name, action: op.action, 'icon': op.icon
                            };

                        if (angular.isFunction(op.action)) {
                            entry.action = function () {
                                injector.invoke(op.action, context);
                            };
                        }
                        operations.push(entry);
                    }
                }
            )
            ;
            config.operations = operations;
            return config;
        };

        var explainFormOperations = function (config, scope) {
            var ops = oPath.get(config, 'operation', {});

            var operations = [];
            var defaults = {
                save: {
                    'name': '保存',
                    'action': scope.action.save,
                    'type': 'submit',
                    'icon': 'fa-save'
                },
                cancel: {
                    'name': '重置',
                    'action': scope.action.cancel,
                    'type': 'button',
                    'icon': 'fa-undo'
                },
                close: {
                    'name': '返回',
                    'action': scope.action.close,
                    'type': 'button',
                    'icon': 'fa-close'
                }
            };
            var context = {scope: scope};

            angular.forEach(defaults, function (value, key) {
                if (!ops.hasOwnProperty(key) || ops[key]) {
                    ops[key] = true;
                }
            });

            angular.forEach(ops, function (op, key) {
                if (op) {

                    var entry = defaults[key] || {'name': op.name, action: op.action, icon: op.icon, type: op.type};

                    if (angular.isFunction(op.action)) {
                        entry.action = function (form) {
                            if (op.type == "submit" && angular.isDefined(form)) {
                                scope.$broadcast('schemaFormValidate');
                                if (form.$valid) {
                                    injector.invoke(op.action, context);
                                }
                            } else {
                                injector.invoke(op.action, context);
                            }
                        };
                    }
                    entry.type = entry.type || 'button';
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

        var overrideDefault = function (config, property, defaultValue) {
            if (config) {
                config[property] = config[property] || angular.copy(defaultValue);
            }
        };

        var overrideProperties = function (target, defaults) {
            if (!target)
                throw ('can not override properties with null');
            for (var prop in defaults) {
                if (defaults.hasOwnProperty(prop)) {
                    overrideDefault(target, prop, defaults[prop]);
                }
            }
        };

        var explainForm = function (config, scope) {

            var properties = oPath.get(config, 'schema.properties', {});
            if (angular.isArray(properties)) {
                config.schema.properties = utils.array2Object(properties, 'key');
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

        var getFullTemplatePath = function (path) {

            if (angular.isUndefined(path))
                return;

            if (path.indexOf('http') == 0 || path.indexOf('plugins') > -1)
                return path;

            var template = [settings.pluginFolder, $stateParams.name, 'templates', path].join('/').replace(/\/\//g, '/');

            return [utils.root, template].join('/');
        };

        var getDefaultSettings = function () {
            var defaults = getConfig($stateParams.name, 'defaults') || {};
            defaults = angular.extend({list: {}, form: {}}, defaults);
            overrideDefault(defaults.form, 'template', [utils.root, settings.templates.detail].join('/'));
            overrideDefault(defaults.list, 'template', [utils.root, settings.templates.list].join('/'));
            overrideDefault(defaults.list, 'pageSize', settings.pageSize['defaults']);
            return defaults;
        };

        return {
            configuration: function (scope) {
                var defaultSettings = getDefaultSettings();
                var config = getConfig($stateParams.name, $stateParams.page) || {};

                overrideDefault(config, 'form', {});
                overrideDefault(config, 'list', {});

                overrideProperties(config.form, defaultSettings.form);
                overrideProperties(config.list, defaultSettings.list);

                config.list.template = getFullTemplatePath(config.list.template);
                config.form.template = getFullTemplatePath(config.form.template);

                config = explainOperations(config, scope);

                config.form = explainOperations(config.form, scope);
                //validateAuthority(config.form.operations);
                //validateAuthority(config.list.operations);

                config = explainList(config, scope);
                config.form = explainForm(config.form, scope);
                config.form = explainFormOperations(config.form, scope);

                return config
            }
        };

    }])
;