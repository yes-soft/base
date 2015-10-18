"use strict";
angular.module("app.config").constant(
    "base.config",
    {
        defaults: {
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
            }
        },
        account: {
            title: "帐号管理",
            operation: {
                add: true,
                del: true
            },
            list: {
                editable: true,
                wrap: "default",
                headers: {
                    "name": {
                        displayName: "名称",
                        minWidth: 100
                    },
                    "aid": {
                        displayName: "帐号",
                        width: 70
                    },
                    "mail": {
                        displayName: "电子邮箱",
                        minWidth: 150
                    },
                    "lastLogin": {
                        displayName: "最后登入时间",
                        width: 130
                    },
                    "enable": {
                        displayName: "已启用",
                        width: 70
                    },
                    "parent": {
                        displayName: "主帐号",
                        width: 100
                    },
                    "matrixNo": {
                        displayName: "关联编号",
                        width: 100
                    },
                    "type": {
                        displayName: "类型",
                        width: 70
                    },
                    "password": {
                        displayName: "密码",
                        width: 120,
                        visible: false
                    },
                    "master": {
                        displayName: "是否主帐号",
                        width: 120
                    },
                    "mobile": {
                        displayName: "手机号码",
                        minWidth: 150
                    }
                },
                filters: [
					{
					    type: "input",
					    name: "name$match",
					    label: "名称"
					}, {
					    type: "input",
					    name: "aid$match",
					    label: "账号"
					}, {
                        type: "input",
                        name: "mail$match",
                        label: "电子邮箱"
                    }, {
                        type: "input",
                        name: "mobile$eq",
                        label: "手机号码"
                    }, {
                        type: "select",
                        name: "enable$eq",
                        label: "状态",
                        titleMap: [{
                            value: '1',
                            name: "已启用"
                        }, {
                            value: '0',
                            name: "未启用"
                        }]
                    }, {
                        type: "select",
                        name: "type$eq",
                        label: "帐号类型",
                        titleMap: [{
                            value: "admin",
                            name: "管理员"
                        }, {
                            value: "user",
                            name: "用户"
                        }]
                    }
                ]
            },
            form: {
                schema: {
                    type: "object",
                    properties: {
                        mail: {
                            title: "电子邮箱",
                            type: "string"
                        },
                        name: {
                            title: "名称",
                            type: "string",
                            required: true
                        },
                        enable: {
                            title: "是否启用",
                            type: "boolean"
                        },
                        matrixNo: {
                            title: "关联编号",
                            type: "string"
                        },
                        aid: {
                            title: "帐号",
                            type: "string",
                            required: true
                        },
                        type: {
                            title: "类型",
                            type: "string",
                            required: true
                        },
                        password: {
                            title: "密码",
                            type: "string",
                            required: true
                        },
                        mobile: {
                            title: "手机号码",
                            type: "string"
                        },
                        "tname": {
                            "type": "string",
                            "title": "名称",
                            required: true
                        },
                        "match": {
                            "type": "string",
                            "title": "内容匹配"
                        }
                    }
                },
                form: [
                    {
                        type: "group",
                        title: "主要信息",
                        items: [
                            {
                                key: 'aid',
                                placeholder: "请输入帐号"
                            }, {
                                key: 'name',
                                placeholder: "请输入名称"
                            },
                            'mail',
                            {
                                key: 'type',
                                type: "select",
                                titleMap: [{
                                    value: "admin",
                                    name: "admin"
                                }, {
                                    value: "user",
                                    name: "user"
                                }]
                            },
                            {
                                key: "password",
                                type: "password"
                            },
                            'mobile',
                            'enable'
                        ]
                    },
                    {
                        type: "group",
                        title: "权限管理",
                        items: [ 'matrixNo']
                    }
                ],
                initEdit: function (self, watch) {
                	if(self.detailUid){//如果是编辑
                		findByFormKey(self.form.form, "aid").readonly = true;
                	}else{
                		self.form.model.enable = true;
                        findByFormKey(self.form.form, "aid").readonly = false;
                    }
                }
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
                wrap: "default",
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
                        displayName: "远程IP",
                        width: 100
                    },
                    "remote": {
                        displayName: "远程记录",
                        width: 80,
                        filter: function (columns, rootScope) {
                            rootScope.remoteValues = {
                                "true": "是",
                                "false": "否"
                            };
                            this.cellFilter = "dict:'remoteValues'";
                            columns.push(this);
                        }

                    },
                    "user": {
                        displayName: "操作用户",
                        width: 80,
                        filter: function (columns, rootScope) {
                            rootScope.userValues = {
                                "admin": "管理员",
                                "user": "用户"
                            };
                            this.cellFilter = "dict:'userValues'";
                            columns.push(this);
                        }
                    },
                    "info": {
                        displayName: "事件信息",
                        minWidth: 200
                    },
                    "localIp": {
                        displayName: "本地IP",
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
                }, {
                    type: "input",
                    name: "moduleId$eq",
                    label: "模块编号"
                }, {
                    type: "input",
                    name: "user$eq",
                    label: "操作用户"
                }, {
                    type: "input",
                    name: "remoteIp$match",
                    label: "远程IP"
                }, {
                    type: "input",
                    name: "localIp$match",
                    label: "本地IP"
                }, {
                    type: "dateTimePicker",
                    name: "updated$gte",
                    label: "操作时间起"
                }, {
                    type: "dateTimePicker",
                    name: "updated$lte",
                    label: "操作时间止"
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
                        displayName: "主帐号",
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
                }, {
                    type: "input",
                    name: "name$match",
                    label: "名称"
                }, {
                    type: "input",
                    name: "describe$match",
                    label: "描述"
                }]
            },
            form: {
                schema: {
                    type: "object",
                    properties: {
                        rid: {
                            title: "编号",
                            type: "string",
                            required: true,

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
                        key: 'rid',
                        placeholder: "请填写编号"
                    }, 'describe', 'name']
                }

                ],
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
                }, {
                    type: "input",
                    name: "data$match",
                    label: "消息内容"
                }, {
                    type: "input",
                    name: "seq$eq",
                    label: "消息序列"
                }, {
                    type: "input",
                    name: "errorCount$eq",
                    label: "失败次数"
                }, {
                    type: "dateTimePicker",
                    name: "lastScheduler$gte",
                    label: "最后调度"
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
                        width: 70
                    },
                    "url": {
                        displayName: "URL 地址"
                    },
                    "order": {
                        displayName: "顺序号",
                        width: 80
                    },
                    "color": {
                        displayName: "颜色",
                        width: 90
                    },

                    "mid": {
                        displayName: "编号"
                    }
                },
                filters: [{
                    type: "input",
                    name: "name$match",
                    label: "名称"
                }, {
                    type: "input",
                    name: "type$eq",
                    label: "类别"
                }, {
                    type: "input",
                    name: "mid$eq",
                    label: "编号"
                }, {
                    type: "input",
                    name: "pid$eq",
                    label: "上级编号"
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
                form: [
                    {
                        type: "group",
                        title: "基本配置",
                        items: ['name', 'mid', 'icon',
                            'type', 'order', 'color',
                            'pid', 'url', 'tip']
                    },
                    {
                        type: "group",
                        title: "其他配置",
                        items: ['enable', 'blank', 'home',
                            'expanded']
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
                        width: 70,
                        filter: function (columns, rootScope) {
                            rootScope.enableValues = {
                                "true": "已启动",
                                "false": "未启动"
                            }
                            this.cellFilter = "dict:'enableValues'";
                            columns.push(this);
                        }
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
                }, {
                    type: "input",
                    name: "name$match",
                    label: "名称"
                }, {
                    type: "input",
                    name: "type$eq",
                    label: "类型"
                }, {
                    type: "select",
                    name: "enable$eq",
                    label: "是否启动",
                    titleMap: [{
                        value: '1',
                        name: "已启动"
                    }, {
                        value: '0',
                        name: "未启动"
                    }]
                }, {
                    type: "dateTimePicker",
                    name: "lastScheduler$gte",
                    label: "最后调度起"
                }, {
                    type: "dateTimePicker",
                    name: "lastScheduler$lte",
                    label: "最后调度止"
                }, {
                    type: "input",
                    name: "ipAddress",
                    label: "IP地址"
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
                form: [
                    {
                        type: "group",
                        title: "主要配置",
                        items: ['name', 'moduleId',
                            'storageDay', 'type', {
                                key: "lastScheduler",
                                type: "dateTimePicker"
                            }, 'category', 'config',
                            'lastState', 'ipAddress',
                            'storage']
                    }, {
                        type: "group",
                        title: "其他配置",
                        items: ['enable']
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
                    type: "select",
                    name: "mId$eq",
                    label: "模块编号"
                }, {
                    type: "input",
                    name: "name$match",
                    label: "名称"
                }],
                resolves: [function (utils, oPath) {
                    var context = this;
                    var config = oPath.find(context, ['list',
                        'filters', '[name:mId$eq]'], {});
                    utils
                        .async('get', '/base/logmodule', null)
                        .then(
                        function (res) {
                            config.titleMap = res.body.items
                                .map(function (entry) {
                                    return {
                                        value: entry.uid,
                                        name: entry.uid
                                    };
                                });
                        });
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
                    items: ["mId", 'storageDay', 'name']
                }, {
                    type: "group",
                    title: "其他配置",
                    items: ['enable']
                }]
            }
        },
        enterprise: {
            title: "企业管理",
            operation: {
                add: true,
                del: true,
                'createManager': {
                    name: "创建管理员帐号",
                    action: function (utils, toastr, ngDialog) {
                        var context = this;
                        var rows = context.scope.action.bulk();
                        if (rows.length > 1) {
                            toastr.warning("每次只能为一家企业创建管理员帐号");
                            return;
                        }
                        if (rows.length == 0) {
                            toastr.warning("请选择要添加管理员帐号的企业");
                        } else {
                        	var model = rows[0];
                        	utils.async("get", "/base/account/getEnterpriseManger/"+model.eid).then(
                                function (res) {
                                	ngDialog.open({
        	                            template: "plugins/base/pages/account.add.html",
        	                            controller: function ($scope) {
        	                                $scope.model = {
        	                                	"aid": model.no,
        	                                	"name": model.cname,
        	                                	"mobile": model.tel,
        	                                	"eid": model.eid,
        	                                	"password": "123456",
        	                                	"enable": true,
        	                                	"type": "enterprise"
        	                                };
        	                                $scope.save = function (form) {
        	                                    utils.async("post", "/base/account", $scope.model).then(
        	                                        function (res) {
        	                                            toastr.success("企业管理员创建成功");
        	                                            ngDialog.closeAll();
        	                                        },
        	                                        function (error) {
        	                                            toastr.error(error.message);
        	                                        }
        	                                    );
        	                                }
        	                            }
        	                        });
                                },
                                function (error) {
                                    toastr.error(error.message);
                                }
                            );
                        }
                    }
                }
            },
            list: {
                headers: {
                    "no": {
                        displayName: "编号"
                    },
                    "cname": {
                        displayName: "企业名称"
                    },
                    "taxNo": {
                        displayName: "税号"
                    },
                    "legalPerson": {
                        displayName: "法定代表人"
                    },
                    "regCapital": {
                        displayName: "注册资本"
                    },
                    "regProvince": {
                        displayName: "注册省"
                    },
                    "contact": {
                        displayName: "联系人"
                    },
                    "tel": {
                        displayName: "联系电话"
                    },
                    "enable": {
                        displayName: "状态"
                    }
                },
                filters: [
                    {
                        type: "input",
                        name: "cname$match",
                        label: "名称"
                    }, {
                        type: "select",
                        name: "enable$eq",
                        label: "状态",
                        titleMap: [{
                            value: '1',
                            name: '启用'
                        }, {
                            value: '0',
                            name: '停用'
                        }]
                    }]
            },
            form: {
                schema: {
                    type: "object",
                    properties: {
                        no: {
                            title: "编号",
                            type: "string"
                        },
                        cname: {
                            title: "中文名称",
                            type: "string",
                            required: true
                        },
                        ename: {
                            title: "英文名称",
                            type: "string"
                        },
                        cshortName: {
                            title: "中文简称",
                            type: "string"
                        },
                        orgCode: {
                            title: "组织机构代码",
                            type: "string"
                        },
                        attachment: {
                            title: "企业营业执照",
                            type: "string"
                        },
                        registrationNo: {
                            title: "营业执照注册号",
                            type: "string"
                        },
                        regProvince: {
                            title: "注册地（省）",
                            type: "string"
                        },
                        regCity: {
                            title: "注册地（市）",
                            type: "string"
                        },
                        regDistrict: {
                            title: "注册地（区）",
                            type: "string"
                        },
                        regaddr: {
                            title: "注册地址",
                            type: "string"
                        },
                        website: {
                            title: "公司网址",
                            type: "string"
                        },
                        taxNo: {
                            title: "税号",
                            type: "string"
                        },
                        legalPerson: {
                            title: "法定代表人",
                            type: "string"
                        },
                        regdate: {
                            title: "注册时间",
                            type: "string"
                        },
                        regTel: {
                            title: "注册电话",
                            type: "string"
                        },
                        regCapital: {
                            title: "注册资本(万元)",
                            type: "string"
                        },
                        contact: {
                            title: "联系人",
                            type: "string"
                        },
                        tel: {
                            title: "联系电话",
                            type: "string"
                        },
                        enable: {
                            title: "是否启用",
                            type: "boolean",
                            'default': true
                        },
                        memo: {
                            title: "备注",
                            type: "string"
                        },
                        type: {
                            title: "类型",
                            'default': "1",
                            visible: true
                        }
                    }
                },
                form: [
                    {
                        type: "group",
                        title: "基本信息",
                        items: [
                            {
                            	key: 'no',
                            	readonly: true
                            }, 'cname', 'ename', 'cshortName', 'orgCode'
                        ]
                    },
                    {
                        type: "group",
                        title: "详细信息",
                        items: [
                             {
                                key: "attachment",
                                type: "uploader",
                                singleLine: true,
                                options: {
                                    multiple: 1,
                                    maxMB: 20
                                }
                            }, 'registrationNo', 'regProvince', 'regCity', 'regDistrict', 'regaddr', 'website', 'taxNo', 'legalPerson',
                            {
                                key: "regdate",
                                type: "dateTimePicker"
                            }, 'regTel', 'regCapital', 'contact', 'tel',
                            {
                                key: 'memo',
                                type: 'textarea',
                                singleLine: true
                            }, 'enable'
                        ]
                    }
                ],
	            resolves: [function (utils, oPath, ngDialog, toastr) {
                    var context = this;
                    
                    context.scope.events.on('entrySaved', function (model) {
                    	if(model.isNew){
	                    	ngDialog.open({
	                            template: "plugins/base/pages/account.add.html",
	                            controller: function ($scope) {
	                                $scope.model = {
	                                	"aid": model.no,
	                                	"name": model.cname,
	                                	"mobile": model.tel,
	                                	"eid": model.eid,
	                                	"password": "123456",
	                                	"enable": true,
	                                	"type": "enterprise"
	                                };
	                                $scope.save = function (form) {
	                                    utils.async("post", "/base/account", $scope.model).then(
	                                        function (res) {
	                                            toastr.success("企业管理员创建成功");
	                                            ngDialog.closeAll();
	                                        },
	                                        function (error) {
	                                            toastr.error(error.message);
	                                        }
	                                    );
	                                }
	                            }
	                        });
                    	}
                    });
                    
                }],
                model: {}
            }
        },
        enterpriseTwo: {
            title: "二级企业",
            operation: {
                add: true,
                del: true,
                'createManager': {
                    name: "创建管理员帐号",
                    action: function (utils, toastr, ngDialog) {
                        var context = this;
                        var rows = context.scope.action.bulk();
                        if (rows.length > 1) {
                            toastr.warning("最多只能为一家企业创建管理员帐号");
                            return;
                        }
                        if (rows.length == 0) {
                            toastr.warning("请选择要添加帐号的企业");
                        } else {
                            ngDialog.open({
                                template: "plugins/base/pages/account.add.html",
                                controller: function ($scope) {
                                    $scope.model = {};
                                    utils.async("get", "/base/account/" + rows[0]["adminid"], null).then(
                                        function (res) {
                                            $scope.model = res.body;
                                        }
                                    );
                                    $scope.uid = rows[0]["uid"];
                                    $scope.save = function (form) {
                                        $scope.model.matrixNo = rows[0]["id"];
                                        utils.async("post", "/base/account", $scope.model).then(
                                            function (res) {
                                                toastr.success("创建成功");
                                                ngDialog.closeAll();
                                            },
                                            function (error) {
                                                toastr.error(error.message);
                                            }
                                        );
                                    }
                                }
                            });
                        }
                    }
                }
            },
            list: {
                headers: {
                    "id": {
                        displayName: "编号"
                    },
                    "cname": {
                        displayName: "企业名称"
                    },
                    "taxNo": {
                        displayName: "税号"
                    },
                    "legalPerson": {
                        displayName: "法定代表人"
                    },
                    "regCapital": {
                        displayName: "注册资本"
                    },
                    "regProvince": {
                        displayName: "注册省"
                    },
                    "contact": {
                        displayName: "联系人"
                    },
                    "tel": {
                        displayName: "联系电话"
                    },
                    "enable": {
                        displayName: "状态"
                    }
                },
                filters: [
                    {
                        type: "input",
                        name: "cname$match",
                        label: "名称"
                    }, {
                        type: "select",
                        name: "enable$eq",
                        label: "状态",
                        titleMap: [{
                            value: '1',
                            name: '启用'
                        }, {
                            value: '0',
                            name: '停用'
                        }]
                    }]
            },
            form: {
                schema: {
                    type: "object",
                    properties: {
                        id: {
                            title: "编号",
                            type: "string",
                            required: true
                        },
                        cname: {
                            title: "中文名称",
                            type: "string",
                            required: true
                        },
                        ename: {
                            title: "英文名称",
                            type: "string"
                        },
                        cshortName: {
                            title: "中文简称",
                            type: "string"
                        },
                        orgCode: {
                            title: "组织机构代码",
                            type: "string"
                        },
                        from: {
                            title: "所属企业",
                            type: "string",
                            required: true
                        },
                        file: {
                            title: "企业营业执照",
                            type: "string"
                        },
                        registrationNo: {
                            title: "营业执照注册号",
                            type: "string"
                        },
                        regProvince: {
                            title: "注册地（省）",
                            type: "string"
                        },
                        regCity: {
                            title: "注册地（市）",
                            type: "string"
                        },
                        regDistrict: {
                            title: "注册地（区）",
                            type: "string"
                        },
                        regaddr: {
                            title: "注册地址",
                            type: "string"
                        },
                        website: {
                            title: "公司网址",
                            type: "string"
                        },
                        taxNo: {
                            title: "税号",
                            type: "string"
                        },
                        legalPerson: {
                            title: "法定代表人",
                            type: "string"
                        },
                        regdate: {
                            title: "注册时间",
                            type: "string"
                        },
                        regTel: {
                            title: "注册电话",
                            type: "string"
                        },
                        regCapital: {
                            title: "注册资本(万元)",
                            type: "string"
                        },
                        contact: {
                            title: "联系人",
                            type: "string"
                        },
                        tel: {
                            title: "联系电话",
                            type: "string"
                        },
                        enable: {
                            title: "是否启用",
                            type: "boolean",
                            'default': true
                        },
                        memo: {
                            title: "备注",
                            type: "string"
                        },
                        type: {
                            title: "类型",
                            'default': "2",
                            visible: true
                        }
                    }
                },
                form: [
                    {
                        type: "group",
                        title: "基本信息",
                        items: [
                            'id', 'cname', 'ename', 'cshortName', 'orgCode',
                            {
                                key: 'from',
                                type: 'select',
                                titleMap: []
                            }
                        ]
                    },
                    {
                        type: "group",
                        title: "详细信息",
                        items: [
                            'file', 'registrationNo', 'regProvince', 'regCity', 'regDistrict', 'regaddr', 'website', 'taxNo', 'legalPerson',
                            {
                                key: "regdate",
                                type: "dateTimePicker"
                            }, 'regTel', 'regCapital', 'contact', 'tel',
                            {
                                key: 'memo',
                                type: 'textarea',
                                singleLine: true
                            }, 'enable'
                        ]
                    }
                ],
                resolves: [function (utils, oPath) {
                    var context = this;
                    context.scope.events.on('detailLoad', function (entity) {
                        utils.async('get', '/base/enterprise', null).then(function (res) {
                            var model = oPath.find(context, ["form", '[title:基本信息]', 'items', '[key:from]'], {});
                            model.titleMap = res.body.items.map(function (entry) {
                                return {
                                    value: entry.id,
                                    name: entry.cname
                                };
                            });
                        });
                        if (entity && entity.id) {
                            utils.async('get', '/base/enterprisers/getFromByTo?to=' + entity.id, null).then(function (res) {
                                var model = oPath.find(context, ["form", '[title:基本信息]', 'items', '[key:from]'], {});
                                model.value = res.body.items;
                            });
                        }
                    });
                    context.scope.events.on('beforeSave', function (form) {
                        var from = form.model.from;
                        var enterprise = form.model;
                        delete enterprise.from;
                        form.model = {
                            "enterprise": enterprise,
                            "from": from
                        };
                    });
                }],
                model: {}
            }
        }
    });
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