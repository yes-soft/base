"use strict";
angular.module("app.config")
    .constant("example.config",
    {
        demo: {
            title: "配置示例",
            operation: {
                add: true,
                del: true
            },
            list: {
                mock: true,
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
                        type: 'select2',
                        fieldAddonRight: '<button class="btn btn-default" type="button">添加</button>'
                    }, {
                        key: 'radio',
                        type: 'radios-inline',
                        placeholder: '单选示例',
                        singleLine: true,
                        titleMap: [{value: "1", name: "示例1"}, {value: "2", name: "示例2"},
                        ],
                        refresh: function (arg) {
                            console.log(arg)
                        }
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
                        key: 'select2',
                        type: 'select2',
                        placeholder: '选择示例',
                        titleMap: [{value: "1", name: "示例1"}, {value: "2", name: "示例2"}]
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