'use strict';
angular.module('app').factory('utils', ["$http", "$q", "$location", "$stateParams", "ENV", 'gateway',
    function ($http, $q, $location, $stateParams, ENV, gateway) {
        var headers = ENV.headers;
        var cacheContainer = {};
        var __menus = {};
        var handles = {
            async: function (method, uri, entry, _headers) {
                var options = {
                    "method": method,
                    "url": uri,
                    "cache": false,
                    "headers": _headers || headers
                };

                if (entry) {
                    angular.forEach(entry, function (raw, key) {
                        if (raw == "") {
                            delete entry[key];
                        }
                    });
                }

                if (entry
                    && (method.toLowerCase() == "post" || method.toLowerCase() == "put" )
                    && headers['Content-Type'].indexOf('json') > 0)
                    options.data = entry;
                else if (entry)
                    options.data = this.serialize(entry);

                var deferred = $q.defer();

                if (!uri)
                    deferred.reject({"message": "Uri is empty!"});
                else {
                    if (options.data && options.method.toLowerCase() == "get") {
                        options.url = options.url + "?" + options.data;
                    }

                    $http(options).success(function (res) {
                        if (res.error == 0 || !res.error) {
                            deferred.resolve(res);
                        } else if (res['@timestamp']) {
                            var result = handles.parseView(res);
                            deferred.resolve({"items": result});
                        } else if (res.message) {
                            deferred.reject(res);
                        } else {
                            deferred.reject({"message": "服务器异常"});
                        }
                    }).error(function (error) {
                        deferred.reject({"message": "无法连接到服务器"});
                    });
                    return deferred.promise;
                }
            },
            serialize: function (data) {
                if (!angular.isObject(data)) {
                    return ( ( data == null ) ? "" : data.toString() );
                }
                var buffer = [];
                for (var name in data) {
                    if (!data.hasOwnProperty(name)) {
                        continue;
                    }
                    var value = data[name];

                    if (angular.isDate(value) && moment) {
                        value = moment(value).format("YYYY-MM-DD HH:mm:ss");
                    }

                    buffer.push(
                        encodeURIComponent(name) + "=" + encodeURIComponent(( value == null ) ? "" : value)
                    );
                }
                var source = buffer.join("&");
                return ( source );
            },
            createDoc: function (raw) {
                if (raw && raw.properties && angular.isArray(raw.properties)) {
                    angular.forEach(raw.properties, function (props) {
                        raw[props.name] = props.value.length == 1 ? props.value[0] : props.value;
                    });
                    delete raw.properties;
                }
                return raw;
            }
        };

        var extMap = {
            'default': 'ico ico-file ico-file-1',
            xls: 'ico ico-file ico-file-2',
            xlsx: 'ico ico-file ico-file-2',
            doc: 'ico ico-file ico-file-3',
            docx: 'ico ico-file ico-file-3',
            ppt: 'ico ico-file ico-file-4',
            pptx: 'ico ico-file ico-file-4',
            rar: 'ico ico-file ico-file-6',
            zip: 'ico ico-file ico-file-7',
            html: 'ico ico-file ico-file-10',
            js: 'ico ico-file ico-file-11',
            xml: 'ico ico-file ico-file-12',
            css: 'ico ico-file ico-file-12',
            pdf: 'ico ico-file ico-file-17',
            txt: 'ico ico-file ico-file-22',
            jpg: 'ico ico-file ico-file-31',
            gif: 'ico ico-file ico-file-32',
            png: 'ico ico-file ico-file-33',
            bmp: 'ico ico-file ico-file-34'
        };

        var initMenus = function (parentId, menus) {
            return menus.filter(
                function (m) {
                    var r = (m.parent == parentId && m.type && m.type.toLowerCase() == "menu");

                    if (m.url == "#")
                        m.url = "";
                    if (r) {
                        m.subMenus = initMenus(m.uid, menus);
                    }
                    return r;
                }
            );
        };

        var buildMenuTree = function (menus) {
            var result = [];
            angular.forEach(menus, function (r) {
                var m = {label: r.name, url: r.url, parent: r.parent, uid: r.uid};
                m.parents = [];
                findParents(m, m, menus);
                m.name = m.parents.reverse().join(" > ");
                result.push(m);
            });
            return result;
        };

        var findParents = function (self, node, menus) {
            var parent = menus.filter(function (m) {
                return m.uid == node.parent;
            });

            if (self.parents.length == 0)
                self.parents.push(self.label);
            if (parent.length) {
                self.parents.push(parent[0].name);
                findParents(self, parent[0], menus);
            }
        };

        var createEvents = function () {
            var events = {};
            return {
                on: function (names, handler) {
                    names.split(' ').forEach(function (name) {
                        if (!events[name]) {
                            events[name] = [];
                        }
                        events[name].push(handler);
                    });
                    return this;
                },
                once: function (names, handler) {
                    names.split(' ').forEach(function (name) {
                        events[name] = [];
                        events[name].push(handler);
                    });
                    return this;
                },
                trigger: function (name, args) {
                    angular.forEach(events[name], function (handler) {
                        handler.call(null, args);
                    });
                    return this;
                }
            };
        };

        var __events = new createEvents();

        var findInjectServices = function (name) {
            try {
                return angular.element(document.body).injector().get(name);
            } catch (ex) {
                return null;
            }
        };

        return {
            alert: function (msg, btnText) {
                console.log(msg, btnText);
            },
            getHost: function (gateway) {
                if (gateway.host == "self") {
                    var rootPath = location.pathname.substr(0, location.pathname.lastIndexOf("/"));
                    return location.protocol + "//" + location.host;
                } else {
                    return gateway.host + gateway.path;
                }
            },
            serialize: handles.serialize,
            format: function (format) {
                var args = Array.prototype.slice.call(arguments, 1);
                if (!format)
                    return "";
                return format.replace(/{(\d+)}/g, function (match, number) {
                    return typeof args[number] != 'undefined'
                        ? args[number]
                        : match
                        ;
                });
            },
            capitalize: function (string) {
                return string.charAt(0).toUpperCase() + string.slice(1);
            },
            createEvents: function () {
                return new createEvents();
            },
            events: __events,
            initMenus: initMenus,
            buildMenuTree: buildMenuTree,
            changeTitle: function (title) {
                __events.trigger("changeTitle", title);
            }
            , currentPage: function () {
                var p = $location.search()[p];
                return parseInt(p) || 1;
            },
            dynamicApi: function (method, namespace, options) {
                var apiPath = ENV.apiPath;
                if (gateway.host != "self")
                    apiPath = gateway.host + ENV.apiPath;
                return handles.async(method, apiPath + "/" + namespace, options);
            },
            async: function (method, path, options) {

                var uri = ENV.apiPath;
                if (gateway.host != "self")
                    uri = gateway.host + ENV.apiPath + '/' + path;
                else if (path.indexOf(ENV.apiPath) == 0) {
                    uri = path;
                } else {
                    uri = ENV.apiPath + '/' + path;
                }

                return handles.async(method, uri, options);
            },
            findViewConfig: function (stateName, page) {
                return findInjectServices(stateName + ".config")[page];
            },
            disableScroll: function () {
                document.body.style.overflow = "hidden";
                angular.element(window).trigger('resize');
            },
            resetScroll: function () {
                document.body.style.overflow = null;
                angular.element(window).trigger('resize');
            },
            getFileExtCss: function (fileName) {
                var re = /(?:\.([^.]+))?$/;
                var ext = re.exec(fileName)[1];
                return extMap.hasOwnProperty(ext) ? extMap[ext] : extMap.default;
            }
        };
    }]);