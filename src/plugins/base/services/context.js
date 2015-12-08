define([], function () {

    return function (scope, editable) {

        var _readOnly = false;
        if (editable === true)
            _readOnly = true;

        var watchContainer = [];

        function Watcher(name) {
            this.name = name;

            this.when = function (condition, callback) {
                var watchItem = scope.$watchCollection(name, function (newValue, oldValue) {
                    if (condition == true || scope.$eval(condition)) {

                        if (angular.isFunction(callback))
                            callback.call(null, newValue);
                    }
                });
                watchContainer.push(watchItem);
            };

            this.change = function (callback) {
                this.when(true, callback);
            };
        }

        function findByFormKey(form, key) {
            for (var i = 0, size = form.length; i < size; i++) {
                var cnf = form[i];
                if (angular.isObject(cnf)) {
                    if (cnf.type == "group" || cnf.type == "list") {
                        var rs = findByFormKey(cnf.items, key);
                        if (rs) {
                            return rs;
                        }
                    } else if (cnf.key == key) {
                        return cnf;
                    }
                } else if (key == cnf) {
                    return cnf;
                }
            }
        }


        this.enableSetValue = function () {
            _readOnly = false;
        };

        this.destroyWatches = function () {
            angular.forEach(watchContainer, function (item) {
                if (angular.isFunction(item))
                    item();
            })
        };

        this.watch = function (name) {
            name = "form.model['" + name + "']";
            return new Watcher(name);
        };

        this.setValue = function (key, valueMap, value) {

            if (_readOnly)
                return;

            if (!angular.isUndefined(scope.form.model) && valueMap && valueMap.hasOwnProperty(value))
                scope.form.model[key] = valueMap[value];
            else if (value == "") {
                scope.form.model[key] = "";
            }
        };

        this.setValue2 = function setValue2(key, valueMap, value) {
            if (!angular.isUndefined(key) && valueMap && !angular.isUndefined(value)) {
                angular.forEach(key, function (entry) {
                    if (entry.partNo && valueMap.hasOwnProperty(entry.partNo)) {
                        entry.partqty = valueMap[entry.partNo];
                    }
                });
            } else if (value == "") {
                angular.forEach(key, function (entry) {
                    entry.partqty = 1;
                });
            }
        };

        this.setStatus = function (key, attr, status) {
            if (!angular.isUndefined(scope.form.form)) {
                var form = findByFormKey(scope.form.form, key);
                form = form || {};
                if (attr == "visible") {
                    if (status === false || status === "false") {
                        form.hide = true;
                    }
                } else {
                    form[attr] = status;
                }
            }
        };

        this.getValue = function (key) {
            if (scope.form.model && scope.form.model.hasOwnProperty(key))
                return scope.form.model[key];
        };

        function findElementSetAttr(key, value, attr, status, times) {
            var ele = angular.element("input[name='" + key + "'").filter(function () {
                return this.value == value;
            });

            if (ele.length) {
                if (attr == 'visible') {
                    if (status == true) {
                        ele.parent().show();
                    } else {
                        ele.parent().hide();
                    }
                } else {
                    ele.attr(attr, status);
                }
            } else if (times > 0) {
                setTimeout(function () {
                    times--;
                    findElementSetAttr(key, value, attr, status, times)
                }, 500);
            }
        }


        /**
         * 设置项目的子项目
         * @param key 项目编号
         * @param value 项目选项值
         * @param attr 属性 "visible", "readonly"
         * @param status 值选项状态 true, false
         */
        this.setOptionStatus = function (key, value, attr, status) {

            var times = 3;
            findElementSetAttr(key, value, attr, status, times);
        }
    };
});