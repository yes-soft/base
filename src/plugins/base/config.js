"use strict";
angular.module("app.config")
    .constant("base.config",
    {
        __default: {
            list: {
                operations: {
                    'search': {
                        name: 'search',
                        action: function (scope) {
                            scope.load();
                        }
                    }
                }
            },
            form: {
                operations: {
                    reject: {
                        name: '退回',
                        action: function () {

                        }
                    },
                    save: true
                },
                template: 'detail.html',
                tabs: {
                    paper: {
                        icon: "fa fa-credit-card red",
                        name: " 稿　纸",
                        page: "d.paper"
                    },
                    content: {
                        icon: "fa yellow fa-flag",
                        name: " 正　文",
                        page: "d.content"
                    },
                    flows: {
                        icon: "fa pink fa-rocket",
                        name: " 流　程",
                        page: "d.flows"
                    },
                    countersign: {
                        icon: "fa blue fa-check",
                        name: " 会　签",
                        page: "d.countersign"
                    },
                    checked: {
                        icon: "fa purple fa-edit",
                        name: " 签　阅",
                        page: "d.checked"
                    },
                    relevance: {
                        icon: "fa green fa-exchange",
                        name: " 关　联",
                        page: "d.relevance"
                    },
                    interface: {
                        icon: "fa green fa-exchange",
                        name: " 接　口",
                        page: "d.interface"
                    }
                }
            }
        },
        account: {
            title: "账号管理",
            operation: {
                'add': true,
                'del': true,
                'role': {
                    name: '批量修改',
                    action: function () {
                      console.log('test ...');
                    }
                }
            },
            list: {
                wrap: "default",
                headers: {
                    "name": {displayName: "名称", minWidth: 100},
                    "mail": {displayName: "电子邮箱", minWidth: 150},
                    "lastLogin": {displayName: "最后登入时间", width: 130},
                    "enable": {displayName: "已启用", width: 70},
                    "parent": {displayName: "主账号", width: 100},
                    "matrixNo": {displayName: "关联编号", width: 100},
                    "aid": {displayName: "账号", width: 70},
                    "type": {displayName: "类型", width: 70},
                    "password": {displayName: "密码", width: 120, visible: false},
                    "master": {displayName: "是否主账号", width: 70, visible: false},
                    "mobile": {displayName: "手机号码", minWidth: 150}
                },
                filters: [
                    {
                        type: "select",
                        name: "type$eq",
                        label: "帐号类型",
                        titleMap: [
                            {
                                value: "admin",
                                name: "管理员"
                            },
                            {
                                value: "user",
                                name: "用户"
                            }
                        ]
                    }
                ]
            },
            form: {
                schema: {
                    "type": "object",
                    "properties": [
                        {"title": "电子邮箱", "key": "mail", "type": "string"},
                        {"title": "最后登入时间", "key": "lastLogin", "type": "string"},
                        {"title": "名称", "key": "name", "type": "string", "required": true},
                        {"title": "已启用", "key": "enable", "type": "boolean"},
                        {"title": "主账号", "key": "parent", "type": "string"},
                        {"title": "关联编号", "key": "matrixNo", "type": "string"},
                        {"title": "账号", "key": "aid", "type": "string", "required": true},
                        {"title": "类型", "key": "type", "type": "string"},
                        {"title": "密码", "key": "password", "type": "string"},
                        {"title": "是否主账号", "key": "master", "type": "boolean"},
                        {"title": "手机号码", "key": "mobile", "type": "string"}
                    ]
                },
                form: [
                    {
                        type: "group",
                        title: "主要信息",
                        items: [
                            'aid',
                            'name',
                            'mail',
                            'lastLogin',
                            'parent',
                            'matrixNo',
                            'type',
                            {key: "password", type: "password"},
                            'mobile'
                        ]
                    },
                    {
                        type: "group",
                        title: "其他信息",
                        items: [
                            'master',
                            'enable'
                        ]
                    }
                ],
                model: {}
            }
        },
        log: {
            title: "日志管理",
            operations: {
                add: false,
                remove: true,
                edit: false
            },
            list: {
                wrap: "default",
                headers: {
                    "updated": {displayName: "操作时间", width: 150},
                    "moduleId": {displayName: "模块编号", width: 100},
                    "eventId": {displayName: "事件编号", width: 160},
                    "remoteIp": {displayName: "远程Ip", width: 100},
                    "remote": {displayName: "远程记录", width: 80},
                    "user": {displayName: "操作用户", width: 80},
                    "info": {displayName: "事件信息", minWidth: 200},
                    "localIp": {displayName: "本地Ip", width: 120}
                },
                filters: [
                    {
                        type: "select",
                        name: "user$eq",
                        label: "帐号类型",
                        titleMap: [
                            {
                                value: "admin",
                                name: "管理员"
                            },
                            {
                                value: "user",
                                name: "用户"
                            }
                        ]
                    }
                ]
            }
        },
        role: {
            title: "角色权限",
            list: {
                headers: {
                    "uid": {displayName: "编号"},
                    "created": {displayName: "创建日期"},
                    "updated": {displayName: "更新日期"},
                    "rid": {displayName: "主账号"},
                    "name": {displayName: "名称"},
                    "describe": {displayName: "描述", minWidth: 250}
                },
                filters: [
                    {
                        type: "input",
                        name: "uid$eq",
                        label: "编号"
                    }]
            },

            form: {
                schema: {
                    "type": "object",
                    "properties": [
                        {
                            "title": "编号",
                            "key": "uid",
                            "type": "string",
                            "required": true,
                            "placeholder": "请填写编号"
                        }, {
                            "title": "描述",
                            "key": "describe",
                            "type": "string",
                            "placeholder": "请填写描述"
                        },
                        {
                            "title": "名称",
                            "key": "name",
                            "type": "string",
                            "placeholder": "请填写名称"
                        }]
                }
                ,
                form: [
                    {
                        "type": "group",
                        "title": "基本信息",
                        "items": [
                            'uid', 'describe', 'name'
                        ]
                    }

                ],
                model: {}
            }
        }
    });