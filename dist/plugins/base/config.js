define([],
    function () {
        "use strict";
        angular.module("app.config").constant("base.config", {
            defaults: {
                list: {
                    operations: {
                        "search": {
                            name: "search",
                            action: function action(utils, ngDialog) {

                            }
                        }
                    }
                },
                form: {
                    operations: {
                        reject: {
                            name: "退回",
                            action: function action() {

                            }
                        },
                        save: true
                    },
                    template: "detail.html"
                }
            },
            accounts: {
                title: "账号管理",
                operation: {
                    add: true,
                    role: {
                        "name": "导入",
                        "action": function action(utils) {
                            utils.dialogUpload({
                                url: '/upload',
                                resolve: function () {
                                    //this.onSuccessItem = function (item, res, status, headers) {
                                    //}
                                }
                            });
                        }
                    }
                },
                list: {
                    headers: {
                        "name": {
                            displayName: "名称",
                            minWidth: 100,
                            filter: function () {

                            }
                        },
                        "mail": {
                            displayName: "电子邮箱",
                            minWidth: 150
                        },
                        "lastLogin": {
                            displayName: "最后登入时间",
                            width: 130,
                            cellFilter: "time:'YYYY年MM月DD日'"
                        },
                        "enable": {
                            displayName: "已启用",
                            width: 70,
                            filter: function (columns, rootScope) {
                                rootScope.enableValues = {
                                    'true': "启用",
                                    'false': "禁用"
                                };
                                this.cellFilter = "dict:'enableValues'";
                                columns.push(this);
                            }
                        },
                        "parent": {
                            displayName: "主账号",
                            width: 100
                        },
                        "matrixNo": {
                            displayName: "关联编号",
                            width: 100
                        },
                        "aid": {
                            displayName: "账号",
                            width: 70
                        },
                        "type": {
                            displayName: "类型",
                            width: 70,
                            filter: function (columns, rootScope) {
                                rootScope.typeValues = {
                                    'admin': '管理员',
                                    'user': '用户',
                                    'seller': '卖家'
                                };
                                this.cellFilter = "dict:'typeValues'";
                                columns.push(this);
                            }
                        },
                        "password": {
                            displayName: "密码",
                            width: 120,
                            visible: false
                        },
                        "master": {
                            displayName: "是否主账号",
                            width: 120
                        },
                        "mobile": {
                            displayName: "手机号码",
                            minWidth: 150
                        }
                    },
                    filters: [{
                        type: "select",
                        refresh: function (utils, search) {
                            //utils.async().then(function () {
                            //
                            //});
                        },
                        name: "type$eq",
                        label: "帐号类型",
                        titleMap: [{
                            value: "admin",
                            name: "管理员"
                        }, {
                            value: "user",
                            name: "用户"
                        }]
                    }],
                    resolves: function (utils) {
                        var context = this;
                        context.scope.events.on("listLoaded", function () {

                        });
                    }
                },
                form: {
                    operation: {
                        publish: {
                            name: '发布',
                            icon: 'fa fa-remove',
                            type: 'submit',
                            action: function (utils, toastr) {
                                var context = this;
                                var data = context.scope.form.model;
                                data.cmd = 'publish';
                                utils.async('post', 'xy/api', data).then(function (res) {
                                    toastr.success(res.message);
                                }, function (res) {
                                    toastr.error(res.message);
                                });
                            }
                        }
                    },
                    schema: {
                        type: "object",
                        properties: {
                            mail: {
                                title: "电子邮箱",
                                type: "string"
                            },
                            lastLogin: {
                                title: "最后登入时间",
                                type: "string"
                            },
                            name: {
                                title: "名称",
                                type: "string",
                                required: true
                            },
                            enable: {
                                title: "已启用",
                                type: "boolean"
                            },
                            parent: {
                                title: "主账号",
                                type: "string"
                            },
                            matrixNo: {
                                title: "关联编号",
                                type: "string"
                            },
                            aid: {
                                title: "账号",
                                type: "string",
                                required: true
                            },
                            type: {
                                title: "类型",
                                type: "string"
                            },
                            password: {
                                title: "密码",
                                type: "string"
                            },
                            master: {
                                title: "是否主账号",
                                type: "boolean"
                            },
                            mobile: {
                                title: "手机号码",
                                type: "string"
                            },
                            picture: {
                                title: "头像",
                                type: "string"
                            }
                        }
                    },
                    form: [{
                        type: "group",
                        title: "主要信息",
                        items: [{
                            key: "aid",
                            placeholder: "请输入帐号"
                        }, {
                            key: "name",
                            placeholder: "请输入名称"
                        }, "mail", {
                            key: "lastLogin",
                            type: "datetimepicker"
                        }, "parent", "matrixNo", {
                            key: "type",
                            type: "select2",
                            options: {
                                type: 'images',
                                multiple: true
                            },
                            titleMap: [{
                                value: "admin",
                                name: "admin"
                            }, {
                                value: "user",
                                name: "user"
                            }]
                        }, {
                            key: "password",
                            type: "password"
                        }, "mobile", {
                            key: "picture",
                            type: "uploader"
                        }]
                    }, {
                        type: "group",
                        title: "其他信息",
                        items: ["master", "enable"]
                    }],
                    resolves: [
                        function () {
                            console.log("test ......");
                        }
                    ]
                }
            },
            log: {
                title: "系统日志",
                operations: {
                    add: false,
                    remove: true,
                    edit: false
                },
                list: {
                    headers: {
                        "updated": {
                            displayName: "操作时间",
                            width: 150
                        },
                        "moduleId": {
                            displayName: "模块编号",
                            width: 100
                        },
                        "eventId": {
                            displayName: "事件编号",
                            width: 160
                        },
                        "remoteIp": {
                            displayName: "远程Ip",
                            width: 100
                        },
                        "remote": {
                            displayName: "远程记录",
                            width: 80
                        },
                        "user": {
                            displayName: "操作用户",
                            width: 80
                        },
                        "info": {
                            displayName: "事件信息",
                            minWidth: 200
                        },
                        "localIp": {
                            displayName: "本地Ip",
                            width: 120
                        }
                    },
                    filters: [{
                        type: "select",
                        name: "user$eq",
                        label: "帐号类型",
                        titleMap: [{
                            value: "admin",
                            name: "管理员"
                        }, {
                            value: "user",
                            name: "用户"
                        }]
                    }]
                }
            },
            role: {
                title: "角色权限",
                operation: {
                    add: true,
                    del: true
                },
                list: {
                    headers: {
                        "created": {
                            displayName: "创建日期",
                            width: 150
                        },
                        "updated": {
                            displayName: "更新日期",
                            width: 150
                        },
                        "rid": {
                            displayName: "主账号",
                            width: 150
                        },
                        "name": {
                            displayName: "名称",
                            width: 150
                        },
                        "describe": {
                            displayName: "描述",
                            minWidth: 250
                        }
                    },
                    filters: [{
                        type: "input",
                        name: "rid$eq",
                        label: "主帐号"
                    }]
                },
                form: {
                    schema: {
                        type: "object",
                        properties: {
                            uid: {
                                title: "编号",
                                type: "string",
                                required: true

                            },
                            describe: {
                                title: "描述",
                                type: "string",
                                placeholder: "请填写描述"
                            },
                            name: {
                                title: "名称",
                                type: "string",
                                placeholder: "请填写名称"
                            }
                        }
                    },
                    form: [{
                        type: "group",
                        title: "基本信息",
                        items: [{
                            key: "uid",
                            placeholder: "请填写编号"
                        }, "describe", "name"]
                    }],
                    model: {}
                }
            },
            mqueue: {
                title: "消息队列",
                operation: {
                    del: true
                },
                list: {
                    headers: {
                        state: {
                            displayName: "状态",
                            width: 70
                        },
                        data: {
                            displayName: "消息内容"
                        },
                        seq: {
                            displayName: "消息序列",
                            width: 80
                        },
                        qid: {
                            displayName: "队列编号",
                            width: 100
                        },
                        lastMessage: {
                            displayName: "最后调度信息"
                        },
                        errorCount: {
                            displayName: "已经失败次数",
                            width: 100
                        },
                        attachments: {
                            displayName: "附件"
                        },
                        lastScheduler: {
                            displayName: "最后调度时间"
                        },
                        ipAddress: {
                            displayName: "消息原地址"
                        }
                    },
                    filters: [{
                        type: "input",
                        label: "队列编号",
                        name: "qid$eq"
                    }]
                }
            },
            menu: {
                title: "菜单配置",
                operation: {},
                list: {
                    headers: {
                        "name": {
                            displayName: "名称"
                        },
                        icon: {
                            displayName: "图标"
                        },
                        "home": {
                            displayName: "首页链接",
                            width: 80
                        },
                        "blank": {
                            displayName: "新窗口开启",
                            width: 100
                        },
                        "memo": {
                            displayName: "备注",
                            visible: false
                        },
                        "tag": {
                            displayName: "标签",
                            visible: false
                        },
                        "enable": {
                            displayName: "已启用",
                            width: 70
                        },
                        "pid": {
                            displayName: "上级编号",
                            width: 90
                        },
                        "expanded": {
                            displayName: "自动展开",
                            visible: false
                        },
                        "type": {
                            displayName: "类别",
                            width: 90
                        },
                        "url": {
                            displayName: "URL 地址"
                        },
                        "order": {
                            displayName: "顺序号",
                            width: 80
                        },
                        "color": {
                            displayName: "颜色"
                        },

                        "mid": {
                            displayName: "编号"
                        }
                    },
                    filters: [{
                        type: "input",
                        name: "name$eq",
                        label: "名称"
                    }]
                },
                form: {
                    schema: {
                        type: "object",
                        properties: {
                            icon: {
                                type: "string",
                                title: "图标"
                            },
                            home: {
                                type: "boolean",
                                title: "首页链接"
                            },
                            blank: {
                                type: "boolean",
                                title: "新窗口开启"
                            },
                            enable: {
                                type: "boolean",
                                title: "已启用"
                            },
                            pid: {
                                type: "string",
                                title: "上级编号"
                            },
                            type: {
                                type: "string",
                                title: "类别"
                            },
                            tip: {
                                type: "string",
                                title: "提示"
                            },
                            order: {
                                type: "number",
                                title: "顺序号"
                            },
                            color: {
                                type: "string",
                                title: "颜色"
                            },
                            name: {
                                type: "string",
                                title: "名称",
                                required: true
                            },
                            mid: {
                                type: "string",
                                title: "编号",
                                required: true
                            },
                            expanded: {
                                type: "boolean",
                                title: "自动展开"
                            },
                            url: {
                                type: "string",
                                title: "URL地址"
                            }
                        }
                    },
                    form: [{
                        type: "group",
                        title: "基本配置",
                        items: ["name", "mid", "icon", "type", "order", "color", "pid", "url", "tip"]
                    }, {
                        type: "group",
                        title: "其他配置",
                        items: ["enable", "blank", "home", "expanded"]
                    }]
                }
            },
            mqueuecfg: {
                title: "队列配置",
                list: {
                    headers: {
                        "moduleId": {
                            displayName: "模块编号",
                            width: 75
                        },
                        "storageDay": {
                            displayName: "保存天数",
                            width: 75
                        },
                        "qid": {
                            displayName: "队列编号",
                            width: 100
                        },
                        "enable": {
                            displayName: "已启动",
                            width: 70
                        },
                        "type": {
                            displayName: "类型",
                            width: 70
                        },
                        "lastScheduler": {
                            displayName: "最后调度时间"
                        },
                        "category": {
                            displayName: "分类",
                            visible: false
                        },
                        "name": {
                            displayName: "名称"
                        },
                        "lastMessage": {
                            displayName: "最后调度信息"
                        },
                        "config": {
                            displayName: "配置参数",
                            visible: false
                        },
                        "lastState": {
                            displayName: "最后调度状态",
                            width: 100
                        },
                        "ipAddress": {
                            displayName: "IP地址"
                        },
                        "storage": {
                            displayName: "存储库",
                            width: 90
                        }
                    },
                    filters: [{
                        type: "input",
                        name: "qid$eq",
                        label: "队列编号"
                    }]
                },
                form: {
                    schema: {
                        type: "object",
                        properties: {
                            moduleId: {
                                title: "模块编号",
                                type: "string"
                            },
                            storageDay: {
                                title: "保存天数",
                                type: "number"
                            },
                            qid: {
                                title: "队列编号",
                                type: "string"
                            },
                            enable: {
                                title: "已启动",
                                type: "boolean"
                            },
                            type: {
                                title: "类型",
                                type: "number"
                            },
                            lastScheduler: {
                                title: "最后调度时间",
                                type: "string"
                            },
                            category: {
                                title: "分类",
                                type: "string"
                            },
                            name: {
                                title: "名称",
                                type: "string"
                            },
                            lastMessage: {
                                title: "最后调度信息",
                                type: "string"
                            },
                            config: {
                                title: "配置参数",
                                type: "string"
                            },
                            lastState: {
                                title: "最后调度状态",
                                type: "string"
                            },
                            ipAddress: {
                                title: "IP地址",
                                type: "string"
                            },
                            storage: {
                                title: "存储库",
                                type: "string"
                            }
                        }
                    },
                    form: [{
                        type: "group",
                        title: "主要配置",
                        items: ["name", "moduleId", "storageDay", "type", {
                            key: "lastScheduler",
                            type: "datetimepicker"
                        }, "category", "config", "lastState", "ipAddress", "storage"]
                    }, {
                        type: "group",
                        title: "其他配置",
                        items: ["enable"]
                    }]
                }
            },
            logmodule: {
                title: "日志配置",
                list: {
                    headers: {
                        mId: {
                            displayName: "模块编号",
                            width: 150
                        },
                        memo: {
                            displayName: "描述"
                        },
                        storageDay: {
                            displayName: "保存天数",
                            width: 150
                        },
                        name: {
                            displayName: "名称",
                            width: 200
                        },
                        enable: {
                            displayName: "已启动",
                            width: 150
                        }
                    },
                    filters: [{
                        type: "input",
                        name: "mId$eq",
                        label: "模块编号"
                    }]
                },
                form: {
                    schema: {
                        type: "object",
                        properties: {
                            mId: {
                                title: "模块编号",
                                type: "string"
                            },
                            storageDay: {
                                title: "保存天数",
                                type: "number"
                            },
                            name: {
                                title: "名称",
                                type: "string"
                            },
                            enable: {
                                title: "已启动",
                                type: "boolean"
                            }
                        }

                    },
                    form: [{
                        type: "group",
                        title: "主要配置",
                        items: ["mId", "storageDay", "name"]
                    }, {
                        type: "group",
                        title: "其他配置",
                        items: ["enable"]
                    }]
                }
            }
        });
    });