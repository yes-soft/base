"use strict";
angular.module("app.config")
    .constant("demo.config",
    {
        examples: {
            title: "配置示例",
            operation: {
                add: true,
                del: true,
                custom: {
                    name: "示例",
                    icon: "fa-plus",
                    action: function (toastr) {
                        var context = this;
                        console.log(context.scope);
                        //context.scope.load();
                        toastr.success("hello");
                    }
                }
            },
            list: {
                mock: false,
                headers: {
                    uid: {
                        displayName: '用户编号',
                        visible: false
                    },
                    username: {
                        displayName: "用户名",
                        width: 90
                    },
                    mobile: {
                        displayName: '手机',
                        enableSorting: false
                    },
                    email: {
                        displayName: '邮件地址',
                        enableSorting: false,
                        hide:'phone,tablet'
                    },
                    lastLogin: {
                        displayName: '最后登录时间',
                        hide:'phone,tablet'
                    },
                    displayName: {
                        displayName: '昵称'
                    },
                    gender: {
                        displayName: '性别',
                        cellFilter: "translatePrefix:'gender'",
                        width: 40,
                        hide:'phone,tablet'
                    },
                    active: {
                        displayName: '激活',
                        cellFilter: "translate",
                        hide:'phone,tablet',
                        width: 40
                    },
                    createdAt: {
                        displayName: '创建日期',
                        cellFilter: "time:'YYYY-MM-DD'",
                        hide:'phone,tablet'
                    },
                    type: {
                        displayName: '类型',
                        cellFilter: 'translate',
                        hide:'phone,tablet'
                    },
                    frozenMoney: {
                        displayName: '冻结资金',
                        visible: false,
                        hide:'phone,tablet'
                    }
                },
                filters: [
                    {
                        type: "input",
                        name: "username$match",
                        label: "用户名"
                    },
                    {
                        type: "select",
                        name: "type$match",
                        label: "账号类型",
                        titleMap: [{name: 'admin', value: 'admin'}, {name: '普通用户', value: 'user'}]
                    },
                    {
                        type: "dateRangePicker",
                        name: "createdAtRang",
                        from: "createdAt$gte",
                        to: "createdAt$lte",
                        label: "创建日期"
                    },
                    {
                        type: "input",
                        name: "mobile$match",
                        label: "手机号码"
                    }],
                resolves: function (utils, oPath, $timeout) {
                    var context = this;
                    var titleMap = oPath.find(context, ['list', 'filters', '[name:type$match]', 'titleMap'], []);
                    $timeout(function () {
                        titleMap.push({name: '示例脚本', value: '----'});
                    }, 3000);
                }
            },
            form: {
                fullScreen: false,
                schema: {
                    type: "object",
                    "properties": [
                        {
                            key: "uid",
                            type: "string"
                        },
                        {
                            key: "username",
                            title: "用户名称",
                            type: "string",
                            required: true
                        },
                        {
                            key: "mobile",
                            title: "手机",
                            pattern: "^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$",
                            type: "string"
                        },
                        {
                            key: "email",
                            title: "电子邮箱",
                            pattern: "^\\S+@\\S+$",
                            type: "string"
                        },
                        {
                            key: "password",
                            title: "密码",
                            type: "string",
                            required: true
                        },
                        {
                            key: "lastLogin",
                            title: "最后登录时间",
                            readonly: true
                        },
                        {
                            key: "displayName",
                            title: "昵称",
                            type: "string"
                        },
                        {
                            key: "gender",
                            title: "性别",
                            type: 'number'
                        },
                        {
                            key: "activeCode",
                            title: "激活码"
                        },
                        {
                            key: "type",
                            title: "类型",
                            type: "string"
                        },
                        {
                            key: "frozenMoney",
                            title: "冻结资金",
                            type: "number"
                        },
                        {
                            key: "about",
                            title: "介绍",
                            type: "string"
                        },
                        {
                            key: "photo",
                            title: "照片",
                            type: "string"
                        },
                        {
                            key: "images",
                            title: "照片",
                            type: "string"
                        },
                        {
                            key: "files",
                            title: "附件示例",
                            type: "string"
                        }, {
                            key: 'active',
                            title: "账号状态",
                            type: "boolean"
                        }]
                },
                form: [{
                    type: "group",
                    title: "基本信息",
                    items: [{
                        key: 'uid',
                        title: '编号',
                        placeholder: "编号"
                    },
                        {
                            key: 'username',
                            placeholder: '请输入用户名',
                            title: '用户名'
                        }, {
                            key: 'mobile',
                            required: true
                        }, {
                            key: 'email',
                            placeholder: '请输入电子邮箱',
                            title: '电子邮箱'
                        }, {
                            key: 'password',
                            type: 'password'
                        }]
                },
                    {
                        type: "group",
                        title: "扩展信息",
                        items: [{
                            key: 'activeCode',
                            title: '激活码'
                        }, {
                            key: 'type',
                            placeholder: '请输入用户名',
                            titleMap: [{name: '管理员', value: 'admin'}, {name: '普通用户', value: 'user'}],
                            title: '账号类型',
                            type: 'select2',
                            fieldAddonRight: 'fa-plus',
                            dialog: function (cfg, parent) {
                                var injector = angular.element(document).injector();
                                var dialog = injector.get('ngDialog');
                                var key = 'type';
                                var model = parent.model;
                                var utils = injector.get('ngDialog');
                                var toastr = injector.get('toastr');
                                var $timeout = injector.get('$timeout');
                                dialog.open(
                                    {
                                        template: 'plugins/demo/templates/test.html',
                                        controller: function ($scope) {
                                            $scope.save = function () {
                                                $timeout(function () {
                                                    model[key] = model[key] || {};
                                                    model[key].name = $scope.test;
                                                    model[key].value = $scope.test;
                                                    cfg.titleMap = cfg.titleMap || [];
                                                    cfg.titleMap.push(model[key]);
                                                    $scope.closeThisDialog();
                                                }, 200);
                                            };
                                        }
                                    }
                                );
                            },
                            refresh: function (cfg, value) {
                                var utils = angular.element('body').injector().get('utils');
                                utils.async('get', 'base/accounts', {displayName$match: value}).then(
                                    function (res) {
                                        cfg.titleMap = res.body.items.map(function (entry) {
                                            return {
                                                value: entry.uid,
                                                name: entry.displayName
                                            };
                                        });
                                    }
                                );
                            },
                            small: true
                        }, {
                            key: 'frozenMoney',
                            title: '冻结资金'
                        }, {
                            key: 'images',
                            singleLine: true,
                            title: '照片',
                            type: 'gallery'
                        }, {
                            key: 'files',
                            singleLine: true,
                            title: '文件',
                            type: 'uploader'
                        }, {
                            key: 'about',
                            singleLine: true,
                            type: 'editor'
                        }]
                    }, {
                        type: "group",
                        title: "其他信息",
                        items: [
                            {
                                key: 'active',
                                title: '账户状态',
                                type: "checkbox"
                            },
                            {
                                key: 'lastLogin',
                                title: '最后登录',
                                type: "label"
                            }]
                    }]
            }
        },
        configurations: {
            title: "产品配置",
            operation: {add: true, del: true},
            list: {
                mock: false,
                filters: [],
                resolves: function (utils, $http) {
                    //var url = "http://localhost:3000/src/plugins/demo/jsonp/script.js";
                    //$http.jsonp(url)
                    //    .success(function (data) {
                    //        data.found();
                    //    });
                }
            },
            form: {
                fullScreen: false,
                schema: {
                    type: "object",
                    "properties": [{
                        key: "id",
                        title: "编号",
                        type: "string",
                        required: true
                    }, {
                        key: "name",
                        title: "名称",
                        type: "string",
                        required: true
                    }, {
                        key: "slash",
                        title: "标识",
                        type: "string",
                        required: true
                    }, {
                        key: "configScript",
                        title: "配置计算脚本",
                        singleLine: true,
                        required: true,
                        type: "textarea"
                    }, {
                        key: "modelScript",
                        title: "型号计算脚本",
                        singleLine: true,
                        type: "textarea",
                        required: true
                    }, {
                        key: "partScript",
                        singleLine: true,
                        title: "标准配件数量计算脚本"
                    }]
                },
                form: [{
                    type: "group",
                    title: "扩展信息",
                    items: [{
                        key: 'name',
                        title: '名称'
                    }, {
                        key: 'slash',
                        title: '标识'
                    }, {
                        key: 'configScript',
                        title: '配置计算脚本',
                        singleLine: true,
                        type: "textarea"
                    }, {
                        key: 'modelScript',
                        title: '型号计算脚本',
                        singleLine: true,
                        type: "textarea"
                    }, {
                        key: 'partScript',
                        title: '标准配件数量计算脚本',
                        singleLine: true,
                        type: "textarea"
                    }]
                }]
            }
        },
        components: {
            title: '组件示例',
            operation: {
                add: true,
                del: true
            },
            list: {
                mock: false,
                headers: {
                    id: {
                        displayName: "编号",
                        width: 80
                    },
                    username: {
                        displayName: "用户名",
                        width: 90,
                        cellFilter: 'translate'
                    },
                    name: {
                        displayName: "名称",
                        minWidth: 180
                    },
                    radio: {
                        displayName: "单选示例",
                        width: 90
                    },
                    checkboxes: {
                        displayName: "多选示例",
                        width: 90
                    },
                    calendar: {
                        displayName: "日期选择器",
                        width: 90
                    },
                    textarea: {
                        displayName: "大文本示例",
                        width: 90
                    },
                    select2: {
                        displayName: "选择示例",
                        width: 90
                    },
                    editor: {
                        displayName: "富文本编辑",
                        width: 90
                    },
                    images: {
                        displayName: "多图示例",
                        width: 90
                    },
                    attachments: {
                        displayName: "附件示例",
                        width: 90
                    }
                },
                filters: [
                    {
                        type: "input",
                        name: "name$match",
                        label: "名称查询"
                    },
                    {
                        type: "select",
                        name: "type$match",
                        label: "类型",
                        titleMap: [{name: '管理员', value: 'admin'}, {name: '用户', value: 'user'}]
                    },
                    {
                        type: "datePicker",
                        name: "calendar$gte",
                        label: "时间开始"
                    },
                    {
                        type: "input",
                        name: "mobile$match",
                        label: "手机号码"
                    }],
                resolves: function (utils, oPath) {

                }
            },
            form: {
                schema: {
                    type: "object",
                    "properties": [{
                        key: "id",
                        title: "编号",
                        type: "string",
                        required: true
                    }, {
                        key: "name",
                        title: "名称",
                        type: "string",
                        required: true
                    }, {
                        key: "number",
                        title: "数字示例",
                        type: "number"
                    }, {
                        key: "cn.name1",
                        title: "名称2",
                        type: "string",
                        required: true
                    }, {
                        key: "radio",
                        title: "单选示例",
                        type: "string"
                    }, {
                        key: "checkboxes",
                        title: "多选示例"
                    }, {
                        key: "textarea",
                        title: "大文本示例",
                        type: "string"
                    }, {
                        key: "select2",
                        title: "选择示例",
                        type: "string"
                    }, {
                        key: "select2.value",
                        title: "选择示例",
                        type: "string"
                    }, {
                        key: "editor",
                        title: "富文本编辑",
                        type: "string"
                    }, {
                        key: "images",
                        title: "多图示例",
                        type: "string"
                    }, {
                        key: "attachments",
                        title: "附件示例",
                        type: "string"
                    }, {
                        key: 'myselect2',
                        title: "测试select2",
                        type: 'string'
                    },
                        {
                            key: "cn.name",
                            title: "中文名称",
                            type: "string"
                        },
                        {
                            key: "en.name",
                            title: "英文名称",
                            type: "string"
                        }]
                },
                form: [{
                    type: "group",
                    title: "基本信息",
                    items: [{
                        key: 'id',
                        placeholder: "编号"
                    }, {
                        key: 'name',
                        placeholder: '名称',
                        title: '名称很长很长很长'
                    }, {
                        key: 'cn.name',
                        placeholder: '中文名称',
                        title: '中文名称'
                    }, {
                        key: 'en.name',
                        placeholder: '英文名称',
                        title: '英文名称'
                    }, {
                        key: 'cn.name1',
                        title: '英文名称2'
                    }, {
                        key: 'number',
                        title: '数字示例',
                        type: 'number'
                    }, {
                        key: 'radio',
                        type: 'radios-inline',
                        placeholder: '单选示例',
                        singleLine: true,
                        titleMap: [{value: "1", name: "示例1"}, {value: "2", name: "示例2"}]
                    }, {
                        key: 'checkboxes',
                        type: 'checkboxes-inline',
                        placeholder: '多选示例',
                        title: '多选示例标题很长很长',
                        singleLine: true,
                        titleMap: [{value: "ABC", name: "示例1"}, {value: "egf", name: "示例2"}]
                    }, {
                        key: 'textarea',
                        type: 'textarea',
                        singleLine: true
                    }, {
                        key: 'myselect2',
                        title: 'test select2',
                        type: 'select2',
                        titleMap: [{value: "ABC", name: "示例1"}, {value: "egf", name: "示例2"}],
                        singleLine: true
                    }, {
                        key: 'select2',
                        type: 'select2',
                        placeholder: '选择示例',
                        htmlClass: 'value-select2',
                        titleMap: [{value: "1", name: "示例1"}, {value: "2", name: "示例2"}],
                        fieldAddonRight: 'fa-plus',
                        dialog: function (cfg, parent) {
                            var dialog = angular.element('body').injector().get('ngDialog');
                            var key = 'select2';
                            var model = parent.model;
                            var utils = angular.element('body').injector().get('utils');
                            var toastr = angular.element('body').injector().get('toastr');
                            dialog.open(
                                {
                                    template: 'plugins/demo/templates/test.html',
                                    controller: function ($scope) {
                                        $scope.save = function () {
                                            utils.async('post', 'base/accounts', {"name": $scope.test}).then(
                                                function (res) {
                                                    model[key] = model[key] || {};
                                                    model[key].name = res.body.name;
                                                    model[key].value = res.body.value;
                                                    cfg.titleMap = cfg.titleMap || [];
                                                    cfg.titleMap.push(model[key]);
                                                    $scope.closeThisDialog();
                                                }, function (error) {
                                                    // toastr.error("message");
                                                }
                                            );
                                        };
                                    }
                                }
                            );
                        },
                        refresh: function (cfg, value) {
                            var utils = angular.element('body').injector().get('utils');
                            utils.async('get', 'base/accounts', {displayName$match: value}).then(
                                function (res) {
                                    cfg.titleMap = res.body.items.map(function (entry) {
                                        return {
                                            value: entry.uid,
                                            name: entry.displayName
                                        };
                                    });
                                }
                            );
                        },
                        small: true
                    }, {
                        key: 'select2.value',
                        title: '绑定',
                        readOnly: true
                    }, {
                        key: 'editor',
                        type: 'editor',
                        placeholder: '富文本编辑',
                        singleLine: true
                    }]
                }]
            }
        }
    });