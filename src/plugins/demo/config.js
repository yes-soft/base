"use strict";
angular.module("app.config")
    .constant("demo.config",
    {
        examples: {
            title: "配置示例",
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
                        type: "datePicker",
                        name: "calendar$gte",
                        label: "时间开始"
                    },
                    {
                        type: "dateRangePicker",
                        name: "calendar$range",
                        label: "范围查询"
                    }],
                resolves: function (utils, oPath) {

                }
            },
            form: {
                schema: {
                    "type": "object",
                    "properties": [{
                        "key": "id",
                        "title": "编号",
                        "type": "string",
                        required: true
                    }, {
                        "key": "name",
                        "title": "名称",
                        "type": "string",
                        required: true
                    }, {
                        "key": "number",
                        "title": "数字示例",
                        "type": "number"
                    }, {
                        "key": "cn.name1",
                        "title": "名称2",
                        "type": "string",
                        required: true
                    }, {
                        "key": "radio",
                        "title": "单选示例",
                        "type": "string"
                    }, {
                        "key": "checkboxes",
                        "title": "多选示例"
                    }, {
                        "key": "textarea",
                        "title": "大文本示例",
                        "type": "string"
                    }, {
                        "key": "select2",
                        "title": "选择示例",
                        "type": "string"
                    }, {
                        "key": "select2.value",
                        "title": "选择示例",
                        "type": "string"
                    }, {
                        "key": "editor",
                        "title": "富文本编辑",
                        "type": "string"
                    }, {
                        "key": "images",
                        "title": "多图示例",
                        "type": "string"
                    }, {
                        "key": "attachments",
                        "title": "附件示例",
                        "type": "string"
                    }, {
                        key: 'myselect2',
                        title: "测试select2",
                        type: 'string'
                    },
                        {
                            "key": "cn.name",
                            "title": "中文名称",
                            "type": "string"
                        },
                        {
                            "key": "en.name",
                            "title": "英文名称",
                            "type": "string"
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
                        dialog: function (parent) {
                            var dialog = angular.element('body').injector().get('ngDialog');
                            var key = 'select2';
                            var model = parent.model;
                            var utils = angular.element('body').injector().get('utils');
                            var toastr = angular.element('body').injector().get('toastr');
                            dialog.open(
                                {
                                    template: 'plugins/example/templates/test.html',
                                    controller: function ($scope) {
                                        $scope.save = function () {
                                            utils.async('post', 'base/accounts', {"name": $scope.test}).then(
                                                function (res) {
                                                    model[key] = model[key] || {};
                                                    model[key].name = res.body.name;
                                                    model[key].value = res.body.value;
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