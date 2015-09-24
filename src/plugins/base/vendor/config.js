"use strict";
angular
    .module("app.config")
    .constant("sms.config", {
        appointment: {
            title: "发送请求",
            operation: {
                'del': true,
                'cancel': {
                    name: "撤销预约",
                    action: function (utils, toastr) {
                        var context = this;
                        var rows = context.scope.action.bulk();
                        if (rows.length) {
                            angular.forEach(rows, function (row) {
                                var json = JSON.parse(row.json);
                                json["type"] = '100';
                                if (json.transId == '')
                                    json.transId = row.transactionId;
                                utils.async('post', '../public/sms/command', json).then(function (res) {
                                        context.scope.load();
                                        toastr.success("撤销成功");
                                    },
                                    function (error) {
                                        toastr.error(error.message);
                                    });
                            });
                        } else {
                            toastr.warning("请选择要撤销预约的短信");
                        }
                    }
                }
            },
            list: {
                headers: {
                    "apid": {
                        displayName: "应用名称",
                        width: 80
                    },
                    "transactionId": {
                        displayName: "事务编号",
                        width: 70,
                        cellTemplate: '<div class="ui-grid-cell-contents"><a style="cursor: pointer;">{{row.entity.transactionId}}</a></div>'
                    },
                    "json": {
                        displayName: "短信内容",
                        minWidth: 180,
                        filter: function (columns, rootScope) {
                            var col = this;
                            col.displayName = "手机号码";
                            col.width = "100";
                            col.cellTemplate = '<div class="ui-grid-cell-contents" title="{{row.entity.json }}">{{ row.entity.json | jsonParse:"phoneNumbers" }}</div>';
                            columns.push(col);
                            var col2 = {
                                name: "json2",
                                displayName: name
                            };
                            col2.displayName = "短信内容";
                            col2.width = "280";
                            col2.cellTemplate = '<div class="ui-grid-cell-contents" title="{{row.entity.json }}">{{ row.entity.json | jsonParse:"message" }}</div>';
                            columns.push(col2);
                        }
                    },
                    "submited": {
                        displayName: "数据提交时间",
                        minWidth: 100
                    },
                    "appointment": {
                        displayName: "预约发送时间",
                        minWidth: 100
                    },
                    "status": {
                        displayName: "状态",
                        width: 100,
                        filter: function (columns, rootScope) {
                            rootScope.statusValues = {
                                100: "已接收",
                                101: "预约中",
                                200: '提交成功',
                                400: '预约失效',
                                201: '预约撤销',
                                500: '提交失败'
                            };
                            this.cellFilter = "dict:'statusValues'";
                            columns.push(this);
                        }
                    },
                    "memo": {
                        displayName: "备注",
                        width: 140
                    },
                    "apip": {
                        displayName: "调用IP",
                        width: 80,
                        visible: false
                    }
                },
                filters: [
                    {
                        type: "select",
                        name: "apid$eq",
                        label: "应用名称",
                        titleMap: [],
                        width: 200
                    }, {
                        type: "input",
                        name: "transactionId$eq",
                        label: "事务编号"
                    }, {
                        type: "input",
                        name: "phone$match",
                        label: "手机号码"
                    }, {
                        type: "input",
                        name: "message$match",
                        label: "短信内容"
                    }, {
                        type: "datetime",
                        autoclose: true,
                        name: "appointment$gte",
                        label: "发送时间起"
                    }, {
                        type: "datetime",
                        name: "appointment$lte",
                        label: "发送时间止"
                    }, {
                        type: 'datetime',
                        name: 'submited$gte',
                        label: "申请时间起"
                    }, {
                        type: "datetime",
                        name: "submited$lte",
                        label: "申请时间止"
                    }, {
                        type: "select",
                        name: "status$eq",
                        label: "状态",
                        titleMap: [{
                            value: '100',
                            name: "已接收"
                        }, {
                            value: '101',
                            name: '预约中'
                        }, {
                            value: '200',
                            name: '提交成功'
                        }, {
                            value: '400',
                            name: '预约失效'
                        }, {
                            value: '201',
                            name: '预约撤销'
                        }, {
                            value: '500',
                            name: '提交失败'
                        }]
                    }
                ],
                resolves: [function (utils, oPath) {
                    var context = this;
                    var config = oPath.find(context, ['list', 'filters', '[name:apid$eq]'], {});
                    utils.async('get', '/sms/ap?count=1000', null).then(function (res) {
                        config.titleMap = res.body.items.map(function (entry) {
                            return {
                                value: entry.aid,
                                name: entry.name
                            };
                        });
                    });
                }]
            },
            form: {
                schema: {
                    "type": "object",
                    "properties": {
                        apid: {
                            title: "应用名称",
                            type: "string"
                        },
                        appointment: {
                            title: "预约发送时间",
                            type: "string"
                        },
                        submited: {
                            title: "数据提交时间",
                            type: "string"
                        },
                        json: {
                            title: "请求内容",
                            type: "string"
                        },
                        status: {
                            title: "状态",
                            type: "number"
                        },
                        apip: {
                            title: "调用IP",
                            type: "string"
                        },
                        memo: {
                            title: "备注信息",
                            type: "string"
                        },
                        phoneNumbers: {
                            title: "手机号码",
                            type: "string"
                        },
                        transactionId: {
                            title: "事务编号",
                            type: "string"
                        }
                    }
                },
                form: [{
                    type: "group",
                    title: "基本信息",
                    items: ['apid', "phoneNumbers",
                        {
                            key: 'appointment',
                            type: 'datetimepicker'
                        }, {
                            key: 'json',
                            type: 'textarea',
                            placeholder: "请求内容"
                        }, {
                            key: 'memo',
                            type: 'textarea',
                            placeholder: "备注信息"
                        }]
                }, {
                    type: "group",
                    title: "其他信息",
                    items: [{
                        key: 'status',
                        type: 'select',
                        readonly: true,
                        titleMap: [{
                            value: '100',
                            name: "已接收"
                        }, {
                            value: '101',
                            name: '预约中'
                        }, {
                            value: '200',
                            name: '提交成功'
                        }, {
                            value: '400',
                            name: '预约失效'
                        }, {
                            value: '201',
                            name: '预约撤销'
                        }, {
                            value: '500',
                            name: '提交失败'
                        }]
                    }, {
                        key: 'transactionId',
                        readonly: true
                    }]
                }]
            }
        },
        ap: {
            title: "应用配置",
            operation: {
                'add': true,
                'del': true
                /*
                 * 'import': { "name": "导入", "action": function action(utils) {
                 * var context = this; utils.dialogUpload({ url:
                 * 'sms/ap/upload', resolve: function () { context.scope.load(); }
                 * }); } }, 'export': { "name": "导出", "action": function
                 * action(utils) { var context = this; var filter =
                 * context.scope.filter; var url =
                 * utils.getAbsUrl('sms/ap/export?' + utils.serialize(filter));
                 * window.open(url, '_blank');
                 *  } }
                 */
            },
            list: {
                headers: {
                    name: {
                        'displayName': "应用名称",
                        width: 90
                    },
                    "apiId": {
                        'displayName': "接口名称",
                        'width': 80
                    },
                    "password": {
                        'displayName': "应用密码",
                        'width': 100
                    },
                    "url": {
                        'displayName': "回调地址",
                        'width': 230
                    },
                    "storageDay": {
                        'displayName': "保存天数",
                        'width': 70
                    },
                    "policyId": {
                        'displayName': "发送策略",
                        'width': 120
                    },
                    "reply": {
                        'displayName': "是否接收回复",
                        'width': 100,
                        filter: function (columns, rootScope) {
                            rootScope.replyValue = {
                                "true": "是",
                                "false": "否"
                            }
                            this.cellFilter = "dict:'replyValue'";
                            columns.push(this);
                        }
                    },
                    "local": {
                        'displayName': "仅内部人员",
                        'width': 80,
                        filter: function (columns, rootScope) {
                            rootScope.localValue = {
                                "true": "是",
                                "false": "否"
                            }
                            this.cellFilter = "dict:'localValue'";
                            columns.push(this);
                        }
                    },
                    "ipAddress": {
                        'displayName': "IP地址",
                        'minWidth': 100
                    },
                    "state": {
                        'displayName': "状态",
                        'width': 70,
                        filter: function (columns, rootScope) {
                            rootScope.stateValue = {
                                "true": "已启用",
                                "false": "未启用"
                            }
                            this.cellFilter = "dict:'stateValue'";
                            columns.push(this);
                        }
                    },
                    "code": {
                        'displayName': "是否加密",
                        'width': 80,
                        "visible": false
                    },
                    "type": {
                        'displayName': "应用类型",
                        'width': 80,
                        'visible': false
                    },
                    "extNumber": {
                        'displayName': "尾号",
                        'width': 60,
                        'visible': false
                    },
                    "aid": {
                        'displayName': "编号",
                        'width': 80,
                        'visible': false
                    },
                },
                filters: [{
                    type: "select",
                    name: "apiId$eq",
                    label: "接口名称"
                }, {
                    type: "input",
                    name: "name$match",
                    label: "应用名称"
                }, {
                    type: "select",
                    name: "state$eq",
                    label: "状态",
                    titleMap: [{
                        value: "1",
                        name: "已启用"
                    }, {
                        value: "0",
                        name: "未启用"
                    }]
                }],
                resolves: [
                    function (utils, oPath) {
                        var context = this;
                        var config = oPath.find(context, ['list', 'filters', '[name:apiId$eq]'], {});
                        utils.async('get', '/sms/api?count=100', null).then(function (res) {
                            config.titleMap = res.body.items.map(function (entry) {
                                return {
                                    value: entry.aid,
                                    name: entry.name
                                };
                            });
                        });
                    }]
            },
            form: {
                schema: {
                    type: "object",
                    properties: {
                        aid: {
                            type: "string",
                            required: true,
                            minLength: 5,
                            title: "应用编号"
                        },
                        apiId: {
                            type: "string",
                            required: true,
                            title: "接口名称"
                        },
                        name: {
                            type: "string",
                            required: true,
                            title: "应用名称"
                        },
                        password: {
                            type: "string",
                            required: true,
                            title: "应用密码",
                            minLength: 5
                        },
                        local: {
                            type: "boolean",
                            title: "是否仅允许发送内部员工"
                        },
                        url: {
                            type: "string",
                            required: true,
                            title: "应用回调地址"
                        },
                        policyId: {
                            type: "string",
                            title: "应用策略"
                        },
                        state: {
                            type: "boolean",
                            title: "是否启用"
                        },
                        storageDay: {
                            type: "integer",
                            title: "日志保存天数",
                            'default': 40,
                            minimum: 0,
                            maximum: 120,
                            description: "最长保存120天"
                        },
                        reply: {
                            type: "boolean",
                            title: "是否支持回复",
                            description: "短信平台仅提供通道,具体业务由应用实现"
                        },
                        extNumber: {
                            type: "string",
                            title: "尾号"
                        },
                        ipAddress: {
                            type: "string",
                            title: "IP地址",
                            required: true,
                            description: "应用服务器的IP地址,可以多个"
                        },
                        code: {
                            type: "boolean",
                            title: "是否编码Encode"
                        },
                        type: {
                            type: "string",
                            title: "类型",
                            enum: ['1', '2']
                        },
                        submitSize: {
                            type: "integer",
                            title: "最大提交数"
                        },
                        messageLength: {
                            type: "integer",
                            title: "短信最大长度"
                        }
                    }
                },
                form: [{
                    "type": "group",
                    "title": "主要信息",
                    "items": [
                        {
                            key: "aid"
                        }, {
                            key: "name"

                        }, {
                            key: "apiId",
                            type: "select",
                            titleMap: []
                        }, {
                            key: "password",
                            type: "password"
                        }, {
                            key: "url",
                            placeholder: 'http://'
                        }, "storageDay", {
                            key: "policyId",
                            type: "select"
                        }, "extNumber", "ipAddress",
                        {
                            key: "type",
                            type: "select",
                            titleMap: [{
                                value: '1',
                                name: "短信"
                            }, {
                                value: '2',
                                name: "彩信"
                            }]
                        }, "submitSize", "messageLength"]
                }, {
                    "type": "group",
                    "title": "其他设置",
                    "items": ["state", "local", "reply", "code"]
                }],
                resolves: [function (utils, oPath) {
                    var context = this;
                    var config = oPath.find(context, ['form', '[title:主要信息]', 'items', '[key:apiId]'], {});
                    utils.async('get', 'sms/api?count=100', null).then(function (res) {
                        config.titleMap = res.body.items.map(function (entry) {
                            return {
                                value: entry.aid,
                                name: entry.name
                            };
                        });
                    });
                }, function (utils, oPath) {
                    var context = this;
                    var config = oPath.find(context, ['form', '[title:主要信息]', 'items', '[key:policyId]'], {});
                    utils.async('get', 'sms/policy?count=100', null).then(function (res) {
                        config.titleMap = res.body.items.map(function (entry) {
                            return {
                                value: entry.pid,
                                name: entry.name
                            };
                        });
                    });
                }]
            }
        },
        api: {
            title: "接口配置",
            operation: {
                add: true,
                del: true
            },
            list: {
                headers: {
                    aid: {
                        displayName: "接口编号",
                        minWidth: 200
                    },
                    name: {
                        displayName: "名称",
                        minWidth: 200
                    }
                },
                filters: [{
                    type: "input",
                    name: "aid$eq",
                    label: "接口编号"
                }, {
                    type: "input",
                    name: "name$match",
                    label: "名称"
                }]
            },
            form: {
                schema: {
                    "type": "object",
                    "properties": {
                        name: {
                            title: "名称",
                            type: "string",
                            required: true
                        },
                        aid: {
                            title: "接口编号",
                            type: "string",
                            required: true
                        },
                        values: {
                            title: "配置详情",
                            type: "array",
                            "items": {
                                "type": "object",
                                "title": "属性名称",
                                "properties": {
                                    "gatewayId": {
                                        "type": "string",
                                        "title": "网关"
                                    },
                                    "match": {
                                        "type": "string",
                                        "title": "号段"
                                    },
                                    "seq": {
                                        "type": "number",
                                        "title": "顺序",
                                        "minimum": 0
                                    }
                                }
                            }
                        }
                    }
                },
                form: [{
                    "type": "group",
                    "title": "主要设置",
                    "items": ["aid", "name"]
                }, {
                    "type": "list",
                    "title": "配置详情",
                    "items": [
                        {
                            "add": "添加",
                            "key": "values"
                        }
                    ]
                }],
                resolves: [
                    function (utils, oPath) {
                        var context = this;
                        context.scope.events.on('detailLoad', function (entity) {
                            if (entity && entity.uid) {
                                utils.async('get', '/sms/apigateway/?apiId$eq=' + entity.uid, null).then(function (res) {
                                    var model = oPath.get(context, 'scope.form.model', {});
                                    model.values = res.body.items;
                                });
                            }
                        });
                        context.scope.events.on('beforeSave', function (form) {
                            var values = form.model.values;
                            var api = form.model;
                            delete api.values;
                            form.model = {
                                "values": values,
                                "api": api
                            };
                        });
                    },
                    function (utils, oPath) {
                        var context = this;
                        utils.async('get', '/sms/gateway/', null).then(function (res) {
                            var model = oPath.get(context, 'scope.form.model', {});
                            model.values = res.body.items;
                        });
                    }]
            }
        },
        gateway: {
            title: "网关配置",
            operation: {
                'add': true,
                'del': true
            },
            list: {
                headers: {
                    gid: {
                        displayName: "网关编号",
                        width: 100
                    },
                    name: {
                        displayName: "网关名称",
                        width: 100
                    },
                    state: {
                        displayName: "状态",
                        width: 100,
                        filter: function (columns, rootScope) {
                            rootScope.stateValues = {
                                'true': "已启用",
                                'false': "未启用"
                            }
                            this.cellFilter = "dict:'stateValues'";
                            columns.push(this);
                        }
                    },
                    lastUse: {
                        displayName: "最后使用时间",
                        width: 200
                    },
                    mail: {
                        displayName: "邮箱",
                        width: 200,
                        visible: false
                    },
                    implClass: {
                        displayName: "实现类名",
                        minWidth: 200
                    }
                },
                filters: [{
                    type: "input",
                    name: "gid$eq",
                    label: "网关编号"
                }, {
                    type: "input",
                    name: "name$match",
                    label: "网关名称"
                }, {
                    type: "select",
                    name: "state$eq",
                    label: "状态",
                    titleMap: [{
                        value: true,
                        name: "已启用"
                    }, {
                        value: false,
                        name: "已停用"
                    }]
                }, {
                    type: "datetime",
                    name: "lastUse$gte",
                    label: "最后使用起"
                }, {
                    type: "datetime",
                    name: "lastUse$lte",
                    label: "最后使用止"
                }]
            },
            form: {
                schema: {
                    "type": "object",
                    "properties": {
                        mail: {
                            title: "邮箱",
                            type: "string",
                            required: true
                        },
                        name: {
                            title: "网关名称",
                            type: "string",
                            required: true
                        },
                        state: {
                            title: "状态",
                            type: "boolean",
                            required: true
                        },
                        gid: {
                            title: "网关编号",
                            type: "string",
                            required: true
                        },
                        lastUse: {
                            title: "最后使用时间",
                            type: "string"
                        },
                        implClass: {
                            title: "实现类名",
                            type: "string",
                            required: true
                        }
                    }
                },
                form: [{
                    type: "group",
                    title: "基本信息",
                    items: ['gid', 'name', 'mail', {
                        key: 'lastUse',
                        type: "datetimepicker"
                    }, 'implClass']
                }, {
                    type: "group",
                    title: "其他信息",
                    items: ['state']
                }]
            }
        },
        smstestapp: {
            title: "短信测试",
            operation: {
                'add': true,
                'del': true,
                'send': {
                    name: "发送",
                    action: function (utils, toastr) {
                        var context = this;
                        var rows = context.scope.action.bulk();
                        if (rows.length) {
                            angular.forEach(rows, function (row) {
                                utils.async('post', 'sms/smstestapp/' + row.uid + '/send').then(function (res) {
                                        context.scope.load();
                                        toastr.success(res.message);
                                    },
                                    function (error) {
                                        toastr.error(error.message);
                                    });
                            });
                        } else {
                            toastr.warning("请选择要发送的短信");
                        }
                    }
                }
            },
            list: {
                wrap: "default",
                headers: {
                    groups: {
                        displayName: "群组名称",
                        width: 100
                    },
                    people: {
                        displayName: "人员姓名",
                        width: 100
                    },
                    mobileNumbers: {
                        displayName: "手机号码",
                        width: 110
                    },
                    content: {
                        displayName: "短信内容",
                        minWidth: 200
                    },
                    appointment: {
                        displayName: "预约时间",
                        width: 140
                    },
                    created: {
                        displayName: "数据提交时间",
                        width: 140
                    },
                    report: {
                        displayName: "短信报告",
                        width: 100
                    },
                    type: {
                        displayName: "短信类型",
                        width: 100,
                        filter: function (columns, rootScope) {
                            rootScope.typeValues = {
                                'true': "即时发送",
                                'false': "预约发送"
                            };
                            this.cellFilter = "dict:'typeValues'";
                            columns.push(this);
                        }
                    },
                    transitionId: {
                        displayName: "发送编号",
                        width: 100,
                        visible: false
                    }
                },
                filters: [{
                    type: "input",
                    name: "groups$eq",
                    label: "群组名称"
                }, {
                    type: "input",
                    name: "people$eq",
                    label: "人员姓名"
                }, {
                    type: "input",
                    name: "mobileNumbers$match",
                    label: "手机号码"
                }, {
                    type: "input",
                    name: "content$match",
                    label: "短信内容"
                }, {
                    type: "datetime",
                    name: "appointment$gte",
                    label: "预约时间起"
                }, {
                    type: "datetime",
                    name: "appointment$lte",
                    label: "预约时间止"
                }, {
                    type: "datetime",
                    name: "created$gte",
                    label: "提交时间起"
                }, {
                    type: "datetime",
                    name: "created$lte",
                    label: "提交时间止"
                }]
            },
            form: {
                schema: {
                    type: "object",
                    properties: {
                        transitionId: {
                            title: "事务编号",
                            type: "string"
                        },
                        mobileNumbers: {
                            title: "手机号码",
                            type: "string"
                        },
                        people: {
                            title: "人员列表",
                            type: "string"
                        },
                        groups: {
                            title: "群组列表",
                            type: "string"
                        },
                        appointment: {
                            "type": "string",
                            "title": "预约时间",
                            description: "不选择则为即时发送"
                        },
                        content: {
                            title: "短信内容",
                            type: "string",
                            required: true
                        },
                        type: {
                            title: "即时发送",
                            type: "boolean",
                            'default': true
                        }
                    }
                },
                form: [{
                    type: "group",
                    title: "基本信息",
                    items: [{
                        key: 'transitionId',
                        readonly: true
                    }, {
                        key: 'mobileNumbers',
                        type: "textarea"
                    }, 'people', 'groups', {
                        key: 'appointment',
                        type: 'string'
                    }, {
                        key: 'content',
                        type: 'textarea',
                        placeholder: "请填写短信内容"
                    }, 'type']
                }]
            }
        },
        smsinfo: {
            title: "短信日志",
            operation: {
                //del: true,
                /*bulkSend: {
                 name: "批量发送",
                 action: function () {
                 console.log("bulk send...");
                 }
                 },*/
                'export': {
                    "name": "导出",
                    "action": function action(utils) {
                        var context = this;
                        var filter = context.scope.filter;
                        var url = utils.getAbsUrl('sms/smsinfo/export?' + utils.serialize(filter));
                        window.open(url, '_blank');
                    }
                }
            },
            list: {
                headers: {
                    "apid": {
                        displayName: "应用名称",
                        width: 70
                    },
                    "gatewayId": {
                        displayName: "网关名称",
                        width: 95
                    },
                    "transactionId": {
                        displayName: "事务编号",
                        width: 70
                    },
                    "groupId": {
                        displayName: "群组名称",
                        width: 70
                    },
                    "phone": {
                        displayName: "手机号码",
                        width: 100
                    },
                    "content": {
                        displayName: "短信内容",
                        minWidth: 170
                    },
                    "type": {
                        displayName: "短信类型",
                        width: 70
                    },
                    "fetchDateTime": {
                        displayName: "获取回执的时间",
                        width: 130
                    },
                    "appointmentTime": {
                        displayName: "预约发送时间",
                        width: 100
                    },
                    "status": {
                        displayName: "状态",
                        width: 60,
                        filter: function (columns, rootScope) {
                            rootScope.statusValues = {
                                100: "未提交到网关",
                                101: "已提交到网关",
                                102: "已提交到运营商成功",
                                501: "提交到运营商失败",
                                502: "提交到运营商超时",
                                200: "发送成功",
                                201: "部分成功",
                                202: "部分成功已报告到应用",
                                503: "发送失败",
                                504: "无回执",
                                505: "部分成功(超过72小时)"
                            };
                            this.cellFilter = "dict:'statusValues'";
                            columns.push(this);
                        }
                    },
                    "apiId": {
                        displayName: "接口编号",
                        width: 90
                    },
                    "resendTimes": {
                        displayName: "重新发送次数",
                        width: 100
                    },
                    "fetchTimes": {
                        displayName: "已尝试次数",
                        width: 90
                    },
                    "memo": {
                        displayName: "扩展信息",
                        width: 70,
                        visible: false
                    },
                    "implClass": {
                        displayName: "实现接口",
                        width: 70,
                        visible: false
                    },
                    "feedback": {
                        displayName: "反馈",
                        width: 70,
                        visible: false
                    },
                    "spMsgId": {
                        displayName: "服务商",
                        width: 70,
                        visible: false
                    },
                    "submissionTime": {
                        displayName: "数据提交时间",
                        width: 100,
                        visible: false
                    },
                    "personId": {
                        displayName: "人员编号",
                        width: 70,
                        visible: false
                    },
                    "smsId": {
                        displayName: "记录编号",
                        width: 90,
                        visible: false
                    },
                    "extNo": {
                        displayName: "发送尾号",
                        width: 70,
                        visible: false
                    }
                },
                filters: [{
                    type: "select",
                    name: "apid$eq",
                    label: "应用名称"
                }, {
                    type: "select",
                    name: "getewayname$eq",
                    label: "网关名称"
                }, {
                    type: "input",
                    name: "transactionId$eq",
                    label: "事务编号"
                }, {
                    type: "input",
                    name: "groups$match",
                    label: "群组名称"
                }, {
                    type: "input",
                    name: "phone$eq",
                    label: "手机号码"
                }, {
                    type: "input",
                    name: "content$match",
                    label: "短信内容"
                }, {
                    type: "datetime",
                    name: "appointment$gte",
                    label: "预约时间起"
                }, {
                    type: "datetime",
                    name: "appointment$lte",
                    label: "预约时间止"
                }, {
                    type: "select",
                    name: "status$eq",
                    label: "状态",
                    titleMap: [
                        {
                            value: "100",
                            name: "未提交到网关"
                        }, {
                            value: "101",
                            name: "已提交到网关"
                        }, {
                            value: "102",
                            name: "提交到运营商成功"
                        }, {
                            value: "501",
                            name: "提交到运营商失败"
                        }, {
                            value: "502",
                            name: "提交到运营商超时"
                        }, {
                            value: "200",
                            name: "发送成功"
                        }, {
                            value: "201",
                            name: "部分成功"
                        }, {
                            value: "202",
                            name: "部分成功已报告到应用"
                        }, {
                            value: "503",
                            name: "发送失败"
                        }, {
                            value: "504",
                            name: "无回执"
                        }, {
                            value: "505",
                            name: "部分成功(超过72小时)"
                        }]
                }],
                resolves: [
                    function (utils, oPath) {
                        var context = this;
                        var config = oPath.find(context, ['list', 'filters', '[name:apid$eq]'], {});
                        utils.async('get', '/sms/ap?count=1000', null).then(function (res) {
                            config.titleMap = res.body.items.map(function (entry) {
                                return {
                                    value: entry.aid,
                                    name: entry.name
                                };
                            });
                        });
                    },
                    function (utils, oPath) {
                        var context = this;
                        var config = oPath.find(context, ['list', 'filters', '[name:getewayname$eq]'], {});
                        utils.async('get', '/sms/gateway?count=1000', null).then(function (res) {
                            config.titleMap = res.body.items.map(function (entry) {
                                return {
                                    value: entry.name,
                                    name: entry.name
                                };
                            });
                        });
                    },
                    function (utils, oPath) {
                        var context = this;
                        var config = oPath.find(context, ['list', 'filters', '[name:apiId$eq]'], {});
                        utils.async('get', '/sms/api', null).then(function (res) {
                            config.titleMap = res.body.items.map(function (entry) {
                                return {
                                    value: entry.aid,
                                    name: entry.name
                                };
                            });
                        });
                    }]
            },
            form: {
                schema: {
                    "type": "object",
                    "properties": {
                        resendTimes: {
                            title: "重新发送次数",
                            type: "string"
                        },
                        apiId: {
                            title: "接口编号",
                            type: "string"
                        },
                        phone: {
                            title: "手机号码",
                            type: "string"
                        },
                        transactionId: {
                            title: "事务编号",
                            type: "string"
                        },
                        memo: {
                            title: "扩展信息",
                            type: "string"
                        },
                        status: {
                            title: "状态",
                            type: "string"
                        },
                        fetchDateTime: {
                            title: "获取回执的时间",
                            type: "string"
                        },
                        type: {
                            title: "短信类型",
                            type: "string"
                        },
                        implClass: {
                            title: "实现接口",
                            type: "string"
                        },
                        feedback: {
                            title: "反馈",
                            type: "string"
                        },
                        content: {
                            title: "消息内容",
                            type: "string"
                        },
                        groupId: {
                            title: "群组编号",
                            type: "string"
                        },
                        spMsgId: {
                            title: "服务商",
                            type: "string"
                        },
                        appointmentTime: {
                            title: "预约时间",
                            type: "string"
                        },
                        apid: {
                            title: "应用名称",
                            type: "string"
                        },
                        submissionTime: {
                            title: "提交时间",
                            type: "string"
                        },
                        fetchTimes: {
                            title: "已尝试次数",
                            type: "string"
                        },
                        personId: {
                            title: "人员编号",
                            type: "string"
                        },
                        smsId: {
                            title: "记录编号",
                            type: "string"
                        },
                        extNo: {
                            title: "发送尾号",
                            type: "string"
                        },
                        gatewayId: {
                            title: "网关编号",
                            type: "string"
                        }
                    }
                },
                form: [{
                    "type": "group",
                    "items": [
                        'apid', 'gatewayId', {
                            key: "transactionId",
                            readonly: true
                        }, "groupId", "phone", "content", {
                            key: "appointmentTime",
                            type: "datetimepicker",
                            readonly: true
                        }, {
                            key: "submissionTime",
                            type: "datetimepicker",
                            readonly: true
                        }, {
                            key: "status",
                            type: "select",
                            readonly: true,
                            titleMap: [
                                {
                                    value: "100",
                                    name: "未提交到网关"
                                }, {
                                    value: "101",
                                    name: "已提交到网关"
                                }, {
                                    value: "102",
                                    name: "提交到运营商成功"
                                }, {
                                    value: "501",
                                    name: "提交到运营商失败"
                                }, {
                                    value: "502",
                                    name: "提交到运营商超时"
                                }, {
                                    value: "200",
                                    name: "发送成功"
                                }, {
                                    value: "201",
                                    name: "部分成功"
                                }, {
                                    value: "202",
                                    name: "部分成功已报告到应用"
                                }, {
                                    value: "503",
                                    name: "发送失败"
                                }, {
                                    value: "504",
                                    name: "无回执"
                                }, {
                                    value: "505",
                                    name: "部分成功(超过72小时)"
                                }]
                        }, "resendTimes", {
                            key: "fetchDateTime",
                            type: "datetimepicker",
                            readonly: true
                        }, {
                            key: "type",
                            type: "select",
                            titleMap: [{
                                value: '1',
                                name: "短信"
                            }, {
                                value: '2',
                                name: "彩信"
                            }]
                        }, "spMsgId", "fetchTimes", "personId", "gatewayId", "apiId", "memo", "implClass", "feedback", "smsId", "extNo"
                    ]
                }]
            }
        },
        smsqueue: {
            title: "发送队列",
            operation: {
                del: true
                /*
                 * 'export': { "name": "导出", "action": function action(utils) {
                 * var context = this; var filter = context.scope.filter; var
                 * url = utils.getAbsUrl('sms/smsqueue/export?' +
                 * utils.serialize(filter)); window.open(url, '_blank'); } }
                 */
            },
            list: {
                headers: {
                    "apid": {
                        displayName: "应用名称",
                        width: 70
                    },
                    "gatewayId": {
                        displayName: "网关名称",
                        width: 90
                    },
                    "transactionId": {
                        displayName: "事务编号",
                        width: 70
                    },
                    "groupId": {
                        displayName: "群组名称",
                        width: 80
                    },
                    "phone": {
                        displayName: "手机号码",
                        width: 120
                    },
                    "content": {
                        displayName: "短信内容",
                        minWidth: 150
                    },
                    "appointmentTime": {
                        displayName: "预约发送时间",
                        width: 130
                    },
                    "submissionTime": {
                        displayName: "数据提交时间",
                        width: 130
                    },
                    "status": {
                        displayName: "状态",
                        width: 110,
                        filter: function (columns, rootScope) {
                            rootScope.statusValues = {
                                100: "未提交到网关",
                                101: "已提交到网关",
                                102: "提交到运营商成功",
                                201: "部门成功",
                                202: "部分成功已报告到应用"
                            };
                            this.cellFilter = "dict:'statusValues'";
                            columns.push(this);
                        }
                    },
                    "resendTimes": {
                        displayName: "重新发送次数",
                        width: 100,
                        visible: false
                    },
                    "fetchDateTime": {
                        displayName: "获取回执的时间",
                        width: 130,
                        visible: false
                    },
                    "type": {
                        displayName: "短信类型",
                        width: 70,
                        visible: false
                    },
                    "spMsgId": {
                        displayName: "服务商",
                        width: 80,
                        visible: false
                    },
                    "fetchTimes": {
                        displayName: "已尝试次数",
                        width: 85,
                        visible: false
                    },
                    "personId": {
                        displayName: "人员编号",
                        width: 70,
                        visible: false
                    },
                    "apiId": {
                        displayName: "接口编号",
                        width: 80,
                        visible: false
                    },
                    "memo": {
                        displayName: "扩展信息",
                        width: 70,
                        visible: false
                    },
                    "implClass": {
                        displayName: "实现接口",
                        width: 70,
                        visible: false
                    },
                    "feedback": {
                        displayName: "反馈",
                        width: 70,
                        visible: false
                    },
                    "smsId": {
                        displayName: "记录编号",
                        width: 70,
                        visible: false
                    },
                    "extNo": {
                        displayName: "发送尾号",
                        width: 80,
                        visible: false
                    }
                },
                filters: [
                    {
                        type: "select",
                        name: "apid$eq",
                        label: "应用名称"
                    }, {
                        type: "select",
                        name: "gatewayId$eq",
                        label: "网关名称"
                    }, {
                        type: "input",
                        name: "transactionId$eq",
                        label: "事务编号"
                    }, {
                        type: "input",
                        name: "groups$match",
                        label: "群组名称"
                    }, {
                        type: "input",
                        name: "phone$eq",
                        label: "手机号码"
                    }, {
                        type: "input",
                        name: "content$match",
                        label: "短信内容"
                    }, {
                        type: "datetime",
                        name: "appointmentTime$gte",
                        label: "预约时间起"
                    }, {
                        type: "datetime",
                        name: "appointmentTime$lte",
                        label: "预约时间止"
                    }, {
                        type: "datetime",
                        name: "submissionTime$gte",
                        label: "提交时间起"
                    }, {
                        type: "datetime",
                        name: "submissionTime$lte",
                        label: "提交时间止"
                    }, {
                        type: "select",
                        name: "status$eq",
                        label: "状态",
                        titleMap: [
                            {
                                value: "100",
                                name: "未提交到网关"
                            }, {
                                value: "101",
                                name: "已提交到网关"
                            }, {
                                value: "102",
                                name: "提交到运营商成功"
                            }, {
                                value: "201",
                                name: "部分成功"
                            }, {
                                value: "202",
                                name: "部分成功已报告到应用"
                            }]
                    }],
                resolves: [
                    function (utils, oPath) {
                        var context = this;
                        var config = oPath.find(context, ['list', 'filters', '[name:apid$eq]'], {});
                        utils.async('get', '/sms/ap?count=1000', null).then(function (res) {
                            config.titleMap = res.body.items.map(function (entry) {
                                return {
                                    value: entry.aid,
                                    name: entry.name
                                };
                            });
                        });
                    },
                    function (utils, oPath) {
                        var context = this;
                        var config = oPath.find(context, ['list', 'filters', '[name:gatewayId$eq]'], {});
                        utils.async('get', '/sms/gateway?count=1000', null).then(function (res) {
                            config.titleMap = res.body.items.map(function (entry) {
                                return {
                                    value: entry.gid,
                                    name: entry.name
                                };
                            });
                        });
                    },
                    function (utils, oPath) {
                        var context = this;
                        var config = oPath.find(context, ['list', 'filters', '[name:apiId$eq]'], {});
                        utils.async('get', '/sms/api', null).then(function (res) {
                            config.titleMap = res.body.items.map(function (entry) {
                                return {
                                    value: entry.aid,
                                    name: entry.name
                                };
                            });
                        });
                    }]
            },
            form: {
                schema: {
                    "type": "object",
                    "properties": {
                        resendTimes: {
                            title: "重新发送次数",
                            type: "string"
                        },
                        apiId: {
                            title: "接口名称",
                            type: "string"
                        },
                        phone: {
                            title: "手机号码",
                            type: "string"
                        },
                        transactionId: {
                            title: "事务编号",
                            type: "string"
                        },
                        memo: {
                            title: "扩展信息",
                            type: "string"
                        },
                        status: {
                            title: "状态",
                            type: "string"
                        },
                        fetchDateTime: {
                            title: "获取回执的时间",
                            type: "string"
                        },
                        type: {
                            title: "短信类型",
                            type: "string"
                        },
                        implClass: {
                            title: "实现接口",
                            type: "string"
                        },
                        feedback: {
                            title: "反馈",
                            type: "string"
                        },
                        content: {
                            title: "消息内容",
                            type: "string"
                        },
                        groupId: {
                            title: "群组名称",
                            type: "string"
                        },
                        spMsgId: {
                            title: "服务商",
                            type: "string"
                        },
                        appointmentTime: {
                            title: "预约时间",
                            type: "string"
                        },
                        apid: {
                            title: "应用名称",
                            type: "string"
                        },
                        submissionTime: {
                            title: "提交时间",
                            type: "string"
                        },
                        fetchTimes: {
                            title: "已尝试次数",
                            type: "string"
                        },
                        personId: {
                            title: "人员编号",
                            type: "string"
                        },
                        smsId: {
                            title: "记录编号",
                            type: "string"
                        },
                        extNo: {
                            title: "发送尾号",
                            type: "string"
                        },
                        gatewayId: {
                            title: "网关名称",
                            type: "string"
                        }
                    }
                },
                form: [{
                    "type": "group",
                    "title": "主要信息",
                    "items": [
                        {
                            key: 'apid',
                            type: "select",
                            readonly: true
                        }, {
                            key: "transactionId",
                            readonly: true
                        }, "groupId", "phone", "content", {
                            key: "appointmentTime",
                            type: "datetimepicker"
                        }, {
                            key: "submissionTime",
                            type: "datetimepicker"
                        }, {
                            key: "status",
                            type: "select",
                            readonly: true,
                            titleMap: [{
                                value: "100",
                                name: "未提交到网关"
                            }, {
                                value: "101",
                                name: "已提交到网关"
                            }, {
                                value: "102",
                                name: "提交到运营商成功"
                            }, {
                                value: "201",
                                name: "部分成功"
                            }, {
                                value: "202",
                                name: "部分成功已报告到应用"
                            }]
                        }, "resendTimes", {
                            key: "fetchDateTime",
                            type: "datetimepicker"
                        }, {
                            key: "type",
                            type: "select",
                            titleMap: [{
                                value: '1',
                                name: "短信"
                            }, {
                                value: '2',
                                name: "彩信"
                            }]
                        }, "spMsgId", "fetchTimes", "personId", {
                            key: "gatewayId",
                            type: "select",
                            readonly: true
                        }, {
                            key: "apiId",
                            type: "select",
                            readonly: true
                        }, "memo", "implClass", "feedback", "smsId", "extNo"
                    ]
                }],
                resolves: [
                    function (utils, oPath) {
                        var context = this;
                        var config = oPath.find(context, ['form', '[title:主要信息]', 'items', '[key:apid]'], {});
                        utils.async('get', '/sms/ap?count=1000', null).then(function (res) {
                            config.titleMap = res.body.items.map(function (entry) {
                                return {
                                    value: entry.aid,
                                    name: entry.name
                                };
                            });
                        });
                    },
                    function (utils, oPath) {
                        var context = this;
                        var config = oPath.find(context, ['form', '[title:主要信息]', 'items', '[key:gatewayId]'], {});
                        utils.async('get', '/sms/gateway?count=1000', null).then(function (res) {
                            config.titleMap = res.body.items.map(function (entry) {
                                return {
                                    value: entry.gid,
                                    name: entry.name
                                };
                            });
                        });
                    },
                    function (utils, oPath) {
                        var context = this;
                        var config = oPath.find(context, ['form', '[title:主要信息]', 'items', '[key:apiId]'], {});
                        utils.async('get', '/sms/api', null).then(function (res) {
                            config.titleMap = res.body.items.map(function (entry) {
                                return {
                                    value: entry.aid,
                                    name: entry.name
                                };
                            });
                        });
                    }]
            }
        },
        person: {
            title: "人员管理",
            operation: {
                'del': true,
                'add': true,
                'import': {
                    "name": "导入",
                    "action": function action(utils, toastr) {
                        var context = this;
                        utils.dialogUpload({
                            url: 'sms/person/upload',
                            resolve: function () {
                                context.scope.load();
                                var subContext = this;
                                var res = subContext.res;
                                if (res.body != "" && res.body != null) {
                                    if (confirm(res.body)) {
                                        utils.async('get', '/sms/person/cover', null).then(function (res) {
                                            toastr.warning(res.message);
                                        });
                                    }
                                }
                            }
                        });
                    }
                },
                'export': {
                    "name": "导出全部",
                    "action": function action(utils) {
                        var context = this;
                        var filter = context.scope.filter;
                        var url = utils.getAbsUrl('sms/person/export?' + utils.serialize(filter));
                        window.open(url, '_blank');
                    }
                }
            },
            list: {
                headers: {
                    "pid": {
                        displayName: "员工号",
                        width: 90
                    },
                    "name": {
                        displayName: "姓名",
                        width: 90
                    },
                    "phone": {
                        displayName: "手机号码",
                        width: 120
                    },
                    "email": {
                        displayName: "邮箱",
                        width: 150
                    },
                    "company": {
                        displayName: "所属公司",
                        minWidth: 130
                    },
                    "departmentName": {
                        displayName: "所属部门",
                        width: 120
                    },
                    "filingDate": {
                        displayName: "备案时间",
                        visible: false
                    },
                    "filing": {
                        displayName: "运营商已备案",
                        width: 100,
                        filter: function (columns, rootScope) {
                            rootScope.filingValues = {
                                "true": "已备案",
                                "false": "未备案"
                            };
                            this.cellFilter = "dict:'filingValues'";
                            columns.push(this);
                        }
                    },
                    "isInternal": {
                        displayName: "是否内部人员",
                        visible: false
                    },
                    "enabled": {
                        displayName: "状态",
                        width: 90,
                        filter: function (columns, rootScope) {
                            rootScope.enabledValues = {
                                'true': "启用",
                                'false': "禁用"
                            };
                            this.cellFilter = "dict:'enabledValues'";
                            columns.push(this);
                        }
                    }
                },
                filters: [{
                    type: "input",
                    name: "pid$eq",
                    label: "员工号"
                }, {
                    type: "input",
                    name: "name$match",
                    label: "姓名"
                }, {
                    type: "input",
                    name: "phone$eq",
                    label: "手机号码"
                }, {
                    type: "input",
                    name: "departmentName$match",
                    label: "所属部门"
                }, {
                    type: "select",
                    name: "filing$eq",
                    label: "运营商备案",
                    titleMap: [{
                        value: "1",
                        name: "已备案"
                    }, {
                        value: "0",
                        name: "未备案"
                    }]
                }, {
                    type: "select",
                    name: "enabled$eq",
                    label: "状态",
                    titleMap: [{
                        value: "1",
                        name: "已启用"
                    }, {
                        value: "0",
                        name: "未启用"
                    }]
                }],
                resolves: [function (utils, oPath) {
                    var context = this;
                    var config = oPath.find(context, ['list',
                        'filters', '[name:pid$eq]'], {});
                    utils.async('get', '/sms/group', null).then(
                        function (res) {
                            config.titleMap = res.body.items.map(function (entry) {
                                return {
                                    value: entry.name,
                                    name: entry.pid
                                };
                            });
                        }
                    );
                }]
            },
            form: {
                schema: {
                    type: "object",
                    properties: {
                        pid: {
                            type: "string",
                            title: "员工号",
                            required: "true"
                        },
                        name: {
                            type: "string",
                            title: "人员名称",
                            required: "true"
                        },
                        phone: {
                            type: "string",
                            minLength: "11",
                            required: "true",
                            title: "电话号码"
                        },
                        filingDate: {
                            type: "string",
                            title: "备案时间"
                        },
                        filing: {
                            type: "boolean",
                            title: "运营商已备案"
                        },
                        isInternal: {
                            type: "boolean",
                            title: "是否为内部人员"
                        },
                        enabled: {
                            type: "boolean",
                            title: "是否启用"
                        },
                        email: {
                            type: "string",
                            title: "邮箱"
                        },
                        company: {
                            type: "string",
                            title: "所属公司"
                        },
                        departmentId: {
                            type: "string",
                            title: "部门编号"
                        },
                        departmentName: {
                            type: "string",
                            title: "部门名称"
                        }
                    }
                },
                form: [{
                    type: "group",
                    title: "基本信息",
                    items: [
                        {
                            key: "pid",
                            placeholder: "请填写员工号"
                        }, {
                            key: "phone",
                            placeholder: "请填写电话号码"
                        }, {
                            key: "name",
                            placeholder: "请填写人员名称"
                        }, {
                            key: "filingDate",
                            type: "datetimepicker"
                        }, {
                            key: "email",
                            type: "email"
                        }, {
                            key: "company",
                            type: "select",
                            titleMap: [{
                                value: "福建中烟工业有限责任公司",
                                name: "福建中烟工业有限责任公司"
                            }, {
                                value: "龙岩烟草工业有限责任公司",
                                name: "龙岩烟草工业有限责任公司"
                            }, {
                                value: "厦门烟草工业有限责任公司",
                                name: "厦门烟草工业有限责任公司"
                            }, {
                                value: "龙岩金叶复烤有限责任公司",
                                name: "龙岩金叶复烤有限责任公司"
                            }, {
                                value: "福建金闽再造烟叶发展有限责任公司",
                                name: "福建金闽再造烟叶发展有限责任公司"
                            }, {
                                value: "福建鑫叶投资管理集团有限公司",
                                name: "福建鑫叶投资管理集团有限公司"
                            }]
                        }, "departmentId", "departmentName"
                    ]
                }, {
                    type: "group",
                    title: "其他信息",
                    items: ["filing", "isInternal", "enabled"]
                }],
                model: {}
            }
        },
        group: {
            title: "群组管理",
            operation: {
                add: true
                /*
                 * 'import': { "name": "导入", "action": function action(utils) {
                 * var context = this; utils.dialogUpload({ url:
                 * 'sms/group/upload', resolve: function () {
                 * context.scope.load(); } }); } },
                 */
                /*
                 * 'export': { "name": "导出", "action": function action(utils) {
                 * var context = this; var filter = context.scope.filter; var
                 * url = utils.getAbsUrl('sms/group/export?' +
                 * utils.serialize(filter)); window.open(url, '_blank'); } }
                 */
            },
            list: {
                headers: {
                    "gid": {
                        displayName: "群组编号",
                        width: 120
                    },
                    "name": {
                        displayName: "群组名称",
                        width: 150
                    },
                    "pname": {
                        displayName: "成员名称",
                        minWidth: 150
                    },
                    "memo": {
                        displayName: "备注",
                        minWidth: 100
                    }
                },
                filters: [{
                    type: "input",
                    name: "name$match",
                    label: "群组名称"
                }, {
                    type: "input",
                    name: "pname$match",
                    label: "成员名称"
                }]
            },
            form: {
                schema: {
                    type: "object",
                    properties: {
                        name: {
                            type: "string",
                            required: true,
                            title: "群组名称"
                        },
                        gid: {
                            type: "string",
                            required: true,
                            title: "群组编号"
                        },
                        memo: {
                            type: "string",
                            title: "备注"
                        },
                        values: {
                            title: "配置详情",
                            type: "array",
                            "items": {
                                "type": "object",
                                "title": "属性名称",
                                "properties": {
                                    "pid": {
                                        "type": "string",
                                        "title": "成员"
                                    }
                                }
                            }
                        }
                    }
                },
                form: [{
                    type: "group",
                    title: "基本信息",
                    items: [{
                        key: "gid",
                        placeholder: "请输入群组编号"
                    }, {
                        key: "name",
                        placeholder: "请输入群组名称"
                    }, "memo"]
                }, {
                    "type": "list",
                    "title": "成员信息",
                    "items": [
                        {
                            "add": "添加成员",
                            "key": "values"
                        }
                    ]
                }],
                resolves: [
                    function (utils, oPath) {
                        var context = this;
                        context.scope.events.on('detailLoad', function (entity) {
                            if (entity && entity.gid) {
                                utils.async('get', '/sms/group/?gid$eq=' + entity.gid, null).then(function (res) {
                                    var model = oPath.get(context, 'scope.form.model', {});
                                    console.log(res.body.items);
                                    model.values = res.body.items;
                                });
                            }
                        });
                        context.scope.events.on('beforeSave', function (form) {
                            var persons = form.model.values;
                            var group = form.model;
                            delete group.values;
                            form.model = {
                                "group": group,
                                "values": persons
                            };
                        });
                    }]
            }
        },
        policy: {
            title: "策略配置",
            operation: {
                add: true,
                del: true
            },
            list: {
                headers: {
                    pid: {
                        displayName: "规则编号"
                    },
                    name: {
                        displayName: "规则名称"
                    }
                },
                filters: [{
                    type: "input",
                    label: "规则编号",
                    name: "pid$eq"
                }, {
                    type: "input",
                    label: "规则名称",
                    name: "name$match"
                }]
            },
            form: {
                schema: {
                    type: "object",
                    properties: {
                        pid: {
                            type: "string",
                            title: "规则编号",
                            required: true
                        },
                        name: {
                            type: "string",
                            title: "规则名称",
                            required: true
                        },
                        values: {
                            title: "配置详情",
                            type: "array",
                            "items": {
                                "type": "object",
                                "title": "属性名称",
                                "properties": {
                                    "name": {
                                        "type": "string",
                                        "title": "名称"
                                    },
                                    "match": {
                                        "type": "string",
                                        "title": "内容匹配"
                                    },
                                    "dateF": {
                                        "type": "string",
                                        "title": "日期匹配起"
                                    },
                                    "dateT": {
                                        "type": "string",
                                        "title": "日期匹配止"
                                    },
                                    "appointmentDate": {
                                        "type": "string",
                                        "title": "预约日期"
                                    },
                                    "appointmentTime": {
                                        "type": "string",
                                        "title": "预约时间"
                                    },
                                    "timeF": {
                                        "type": "string",
                                        "title": "时间匹配起"
                                    },
                                    "timeT": {
                                        "type": "string",
                                        "title": "时间匹配止"
                                    },
                                    "seq": {
                                        "type": "number",
                                        "title": "顺序",
                                        "minimum": 0,
                                        "required": true
                                    }
                                }
                            }
                        }
                    }
                },
                form: [
                    {
                        type: "group",
                        title: "基本配置",
                        items: [{
                            key: "pid",
                            placeholder: "请输入规则编号"
                        }, {
                            key: "name",
                            placeholder: "请输入规则名称"
                        }]
                    }, {
                        "type": "list",
                        "title": "配置详情",
                        "items": [
                            {
                                "add": "添加规则",
                                "key": "values"
                            }
                        ]
                    }],
                resolves: [
                    function (utils, oPath) {
                        var context = this;
                        context.scope.events.on('detailLoad', function (entity) {
                            if (entity && entity.pid) {
                                utils.async('get', '/sms/policydetail/?pid$eq=' + entity.pid, null).then(function (res) {
                                    var model = oPath.get(context, 'scope.form.model', {});
                                    model.values = res.body.items;
                                });
                            }
                        });
                        context.scope.events.on('beforeSave', function (form) {
                            var policyDetail = form.model.values;
                            var policy = form.model;
                            delete policy.values;
                            form.model = {
                                "policyDetail": policyDetail,
                                "policy": policy
                            };
                        });
                    }]
            }
        }
    });