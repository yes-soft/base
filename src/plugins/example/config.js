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
                        "key": "radio",
                        "title": "单选示例",
                        "type": "number"
                    }, {
                        "key": "checkboxes",
                        "title": "多选示例",
                        "type": "string",
                        required: true
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
                        placeholder: '名称'
                    }, {
                        key: 'radio',
                        type: 'radio',
                        placeholder: '单选示例'
                    }, {
                        key: 'textarea',
                        type: 'textarea'
                    }, {
                        key: 'select2',
                        type: 'select2',
                        placeholder: '选择示例'
                    }, {
                        key: 'editor',
                        type: 'editor',
                        placeholder: '富文本编辑'
                    }]
                }]
            }
        }
    });