"use strict";
angular
    .module("app.config")
    .constant("sms.config", {
        appointments: {
            title: "短信预约",
            operation: {
                'del': true
            },
            list: {
                headers: {
                    "apid": {
                        displayName: "应用编号",
                        width: 80
                    },
                    "json": {
                        displayName: "请求内容",
                        width: 180
                    },
                    "status": {
                        displayName: "状态",
                        width: 70
                    },
                    "apip": {
                        displayName: "调用IP",
                        width: 80
                    },
                    "appointment": {
                        displayName: "预约时间",
                        width: 140
                    },
                    "transactionId": {
                        displayName: "事务编号",
                        width: 70
                    },
                    "memo": {
                        displayName: "备注信息",
                        width: 100
                    }
                },
                filters: [{
                    type: "datetime",
                    name: "appointment$gte",
                    label: "预约时间起"
                }, {
                    type: "datetime",
                    name: "appointment$lte",
                    label: "预约时间止"
                }, {
                    type: "select",
                    name: "apid$eq",
                    label: "应用",
                    titleMap: []
                }, {
                    type: "datetime",
                    name: "created$gte",
                    label: "创建时间起"
                }, {
                    type: "datetime",
                    name: "created$lte",
                    label: "创建时间止"
                }],
                resolves: function (utils, oPath) {
                    var context = this;
                    var config = oPath.find(context, ['list',
                        'filters', '[name:apid$eq]'], {});
                    utils.async('get', '/sms/ap', null).then(
                        function (res) {
                            config.titleMap = res.body.items
                                .map(function (entry) {
                                    return {
                                        value: entry.uid,
                                        name: entry.name
                                    };
                                });
                        });
                }
            },
            form: {
                schema: {
                    "type": "object",
                    "properties": [{
                        "key": "apid",
                        "title": "应用编号",
                        "type": "string"
                    }, {
                        "key": "appointment",
                        "title": "预约时间",
                        "type": "datetime"
                    }, {
                        "key": "json",
                        "title": "请求内容",
                        "type": "string"
                    }, {
                        "key": "status",
                        "title": "请求状态",
                        "type": "boolean"
                    }, {
                        "key": "apip",
                        "title": "调用IP",
                        "type": "string"
                    }, {
                        "key": "memo",
                        "title": "备注信息",
                        "type": "string"
                    }, {
                        "key": "transactionId",
                        "title": "事务编号",
                        "type": "string"
                    }]
                },
                form: [{
                    type: "group",
                    title: "基本信息",
                    items: ['apid', 'apip', {
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
                    items: ['status', 'transactionId']
                }]
            }
        },
        applications: {
            title: "应用配置",
            operation: {
                'add': true,
                'del': true
            },
            list: {
                headers: {
                    "aid": {
                        'displayName': "编号",
                        'width': 80
                    },
                    "apiId": {
                        'displayName': "接口编号",
                        'width': 80
                    },
                    name: {
                        'displayName': "名称",
                        "minWidth": 100
                    },
                    "url": {
                        'displayName': "接收Url",
                        'width': 150
                    },
                    "storageDay": {
                        'displayName': "保存天数",
                        'width': 80
                    },
                    "state": {
                        'displayName': "状态",
                        'width': 80
                    },
                    "code": {
                        'displayName': "是否加密",
                        'width': 80
                    },
                    "type": {
                        'displayName': "应用类型",
                        'width': 80
                    },
                    "password": {
                        'displayName': "密码",
                        visible: false
                    },
                    "policyId": {
                        'displayName': "发送策略",
                        visible: false
                    },
                    "reply": {
                        'displayName': "是否接受回复",
                        visible: false
                    },
                    "local": {
                        'displayName': "仅内部人员",
                        visible: false
                    },
                    "extNumber": {
                        'displayName': "尾号",
                        'width': 60
                    },
                    "ipAddress": {
                        'displayName': "IP地址",
                        'minWidth': 160
                    }
                },
                filters: [{
                    type: "input",
                    name: "aid$eq",
                    label: "编号"
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
                            title: "接口编号"
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
                            title: "应用策略",
                            enum: ['工作时间发送', '仅发送内部员工']
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
                            maximum: 200,
                            description: "最长保存120天"
                        },
                        reply: {
                            type: "boolean",
                            title: "是否支持回复",
                            description: "短信平台仅提供通道,具体业务由应用实现"
                        },
                        extNumber: {
                            type: "integer",
                            title: "子端口号"
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
                            type: "number",
                            title: "类型",
                            enum: [1, 2]
                        }
                    }
                },
                form: [
                    {
                        "type": "group",
                        "title": "主要信息",
                        "items": [
                            {
                                key: "aid",
                                placeholder: '请填写应用编号'
                            }, {
                                key: "name",
                                placeholder: '请填写应用名称'

                            }, {
                                key: "apiId",
                                type: "select",
                                placeholder: '请选择接口',
                                titleMap: []
                            }, {
                                key: "password",
                                type: "password",
                                placeholder: '请输入密码'
                            }, {
                                key: "url",
                                placeholder: 'http://'
                            }, "storageDay", "policyId",
                            "extNumber", "ipAddress", {
                                key: "type",
                                type: "select",
                                titleMap: [{
                                    value: 1,
                                    name: "短信"
                                }, {
                                    value: 2,
                                    name: "彩信"
                                }]
                            }]
                    },
                    {
                        "type": "group",
                        "title": "其他设置",
                        "items": ["state", "local", "reply",
                            "code"]
                    }],
                model: {},
                resolves: [function (utils, oPath) {
                    var context = this;
                    var config = oPath.find(context, ['form', '[title:主要信息]', 'items',
                        '[key:apiId]'], {});

                    utils.async('get', 'sms/api', null).then(
                        function (res) {
                            config.titleMap = res.body.items
                                .map(function (entry) {
                                    return {
                                        value: entry.aid,
                                        name: entry.name
                                    };
                                });
                        });
                }]
            }
        },
        apis: {
            title: "接口配置",
            operation: {
                add: true,
                del: true
            },
            list: {
                headers: {
                    name: {
                        displayName: "名称",
                        width: 200
                    },
                    aid: {
                        displayName: "接口编号"
                    }
                },
                filters: [{
                    type: "select",
                    name: "aid$eq",
                    label: "接口编号"
                }],
                resolves: function (utils, oPath) {
                    var context = this;
                    var config = oPath.find(context, ['list', 'filters',
                        '[name:aid$eq]'], {});

                    utils.async('get', 'sms/api', null).then(
                        function (res) {
                            config.titleMap = res.body.items
                                .map(function (entry) {
                                    return {
                                        value: entry.aid,
                                        name: entry.name
                                    };
                                });
                        });
                }
            },
            form: {
                schema: {
                    "type": "object",
                    "properties": [{
                        "key": "name",
                        "title": "名称",
                        "type": "string",
                        "required": true
                    }, {
                        "key": "aid",
                        "title": "接口编号",
                        "type": "string",
                        "required": true
                    }, {
                        "key": "values",
                        "title": "配置详情",
                        "type": "array",
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
                                    "title": "顺序"
                                }
                            }
                        }
                    }]
                },
                form: [{
                    "type": "group",
                    "title": "主要设置",
                    "items": ["aid", "name"]
                }, {
                    "type": "list",
                    "title": "配置详情",
                    "items": ['values']
                }],
                resolves: [
                    function (utils, oPath) {
                        var context = this;
                        context.scope.events
                            .on(
                            'detailLoad',
                            function (entity) {
                                if (entity && entity.uid) {
                                    utils
                                        .async(
                                        'get',
                                        '/sms/apigateway/?apiId$eq=' + entity.uid,
                                        null)
                                        .then(
                                        function (res) {
                                            var model = oPath
                                                .get(
                                                context,
                                                'scope.form.model', {});
                                            model.values = res.body.items;
                                        });
                                }
                            });
                    },
                    function (utils, oPath) {
                        var context = this;
                        utils
                            .async('get', '/sms/gateway/',
                            null)
                            .then(
                            function (res) {
                                var model = oPath
                                    .get(
                                    context,
                                    'scope.form.model', {});
                                model.values = res.body.items;
                            });
                    }]
            }
        },
        gateways: {
            title: "网关配置",
            operation: {
                'add': true,
                'del': true
            },
            list: {
                headers: {
                    mail: {
                        displayName: "邮箱",
                        width: 200
                    },
                    name: {
                        displayName: "名称",
                        width: 100
                    },
                    state: {
                        displayName: "状态",
                        width: 100
                    },
                    gid: {
                        displayName: "网关编号",
                        width: 100
                    },
                    lastUse: {
                        displayName: "最后使用时间",
                        width: 150
                    },
                    implClass: {
                        displayName: "实现类名",
                        minWidth: 200
                    }
                },
                filters: [
                    {
                        type: "select",
                        name: "gid$eq",
                        label: "网关名称"
                    }, {
                        type: 'input',
                        name: 'implClass$match',
                        label: '实现类'
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
                        name: "lastUse$eq",
                        label: "最后使用止"
                    }],
                resolves: function (utils, oPath) {
                    var context = this;
                    var config = oPath.find(context, ['list', 'filters',
                        '[name:gid$eq]'], {});

                    utils.async('get', 'sms/gateway', null).then(
                        function (res) {
                            config.titleMap = res.body.items
                                .map(function (entry) {
                                    return {
                                        value: entry.gid,
                                        name: entry.name
                                    };
                                });
                        });
                }
            },
            form: {
                schema: {
                    "type": "object",
                    "properties": [{
                        "key": "mail",
                        "title": "邮箱",
                        "type": "string"
                    }, {
                        "key": "name",
                        "title": "名称",
                        "type": "string",
                        required: true
                    }, {
                        "key": "state",
                        "title": "状态",
                        "type": "boolean"
                    }, {
                        "key": "gid",
                        "title": "网关编号",
                        "type": "string",
                        required: true
                    }, {
                        "key": "lastUse",
                        "title": "最后使用时间",
                        "type": "string"
                    }, {
                        "key": "implClass",
                        "title": "实现类名",
                        "type": "string"
                    }]
                },
                form: [{
                    type: "group",
                    title: "基本信息",
                    items: ['name', 'gid', 'mail', {
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
                    action: function (utils) {
                        var context = this;
                        var rows = context.scope.action.bulk();
                        angular.forEach(rows, function (row) {
                            utils.async(
                                'post',
                                'sms/smstestapp/' + row.uid + '/send').then(
                                function (res) {
                                    context.scope.load();
                                });
                        });
                    }
                }
            },
            list: {
                wrap: "default",
                headers: {
                    content: {
                        displayName: "短信内容",
                        minWidth: 200
                    },
                    transitionId: {
                        displayName: "发送编号",
                        width: 100
                    },
                    mobileNumbers: "手机列表",
                    report: {
                        displayName: "短信报告"
                    },
                    sendStatus: {
                        displayName: "发送状态",
                        width: 100
                    },
                    people: {
                        displayName: "人员列表",
                        width: 100
                    },
                    groups: {
                        displayName: "群组列表",
                        width: 100
                    },
                    appointment: {
                        displayName: "预约时间"
                    }
                },
                filters: [{
                    type: "datetime",
                    name: "appointment&gte",
                    label: "预约时间起"
                }, {
                    type: "datetime",
                    name: "appointment&lte",
                    label: "预约时间止"
                }]
            },
            form: {
                schema: {
                    "type": "object",
                    "properties": [{
                        "key": "transitionId",
                        "title": "发送编号",
                        "type": "string",
                        "required": true
                    }, {
                        "key": "mobileNumbers",
                        "title": "手机列表",
                        "type": "string"
                    }, {
                        "key": "sendStatus",
                        "title": "发送状态",
                        "type": "boolean"
                    }, {
                        "key": "people",
                        "title": "人员列表",
                        "type": "string"
                    }, {
                        "key": "groups",
                        "title": "群组列表",
                        "type": "string"
                    }, {
                        "key": "appointment",
                        "title": "预约时间",
                        "type": "datetime"
                    }, {
                        "key": "content",
                        "title": "短信内容",
                        "type": "string",
                        "required": true
                    }]
                },
                form: [
                    {
                        type: "group",
                        title: "基本信息",
                        items: [{
                            key: 'transitionId',
                            placeholder: "请填写发送编号"
                        },
                            'mobileNumbers', 'people',
                            'groups', {
                                key: 'appointment',
                                type: 'datetimepicker'
                            }, {
                                key: 'content',
                                type: 'textarea',
                                placeholder: "请填写短信内容"
                            }]
                    }, {
                        type: "group",
                        title: "其他信息",
                        items: ['sendStatus']
                    }]
            }
        },
        smsinfo: {
            title: "短信日志",
            operation: {
                del: true,
                bulkSend: {
                    name: "批量发送",
                    action: function () {
                        console.log("bulk send...");
                    }
                }
            },
            list: {
                headers: {
                    "apid": {
                        displayName: "应用编号",
                        width: 70
                    },
                    "resendTimes": {
                        displayName: "重新发送次数",
                        width: 70,
                        visible: false
                    },
                    "apiId": {
                        displayName: "接口编号",
                        width: 90
                    },
                    "phone": {
                        displayName: "手机号码",
                        width: 120,
                        visible: true
                    },
                    "transactionId": {
                        displayName: "事务编号",
                        width: 70,
                        visible: false
                    },
                    "memo": {
                        displayName: "扩展信息",
                        width: 70,
                        visible: false
                    },
                    "status": {
                        displayName: "状态",
                        width: 70,
                        visible: true
                    },
                    "fetchDateTime": {
                        displayName: "获取回执的时间",
                        width: 70,
                        visible: false
                    },
                    "type": {
                        displayName: "短信类型",
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
                    "content": {
                        displayName: "消息内容",
                        minWidth: 170,
                        visible: true
                    },
                    "groupId": {
                        displayName: "群组编号",
                        width: 70,
                        visible: false
                    },
                    "spMsgId": {
                        displayName: "服务商编号",
                        width: 70,
                        visible: false
                    },
                    "appointmentTime": {
                        displayName: "预约时间",
                        width: 120,
                        visible: true
                    },
                    "submissionTime": {
                        displayName: "提交时间",
                        width: 120,
                        visible: true
                    },
                    "fetchTimes": {
                        displayName: "已尝试次数",
                        width: 70,
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
                        visible: true
                    },
                    "extNo": {
                        displayName: "发送尾号",
                        width: 70,
                        visible: false
                    },
                    "gatewayId": {
                        displayName: "网关编号",
                        width: 95,
                        visible: true
                    }
                },
                filters: [{
                    type: "datetime",
                    name: "appointment&gte",
                    label: "预约时间起"
                }, {
                    type: "datetime",
                    name: "appointment&lte",
                    label: "预约时间止"
                }, {
                    type: "input",
                    name: "smsId$eq",
                    label: "短信编号"
                }, {
                    type: "select",
                    name: "apid$eq",
                    label: "应用"
                }, {
                    type: "select",
                    name: "apiId$eq",
                    label: "接口"
                }],
                resolves: [
                    function (utils, oPath) {
                        var context = this;
                        var config = oPath.find(context, [
                            'list', 'filters',
                            '[name:apid$eq]'], {});
                        utils
                            .async('get', '/sms/ap', null)
                            .then(
                            function (res) {
                                config.titleMap = res.body.items
                                    .map(function (entry) {
                                        return {
                                            value: entry.uid,
                                            name: entry.name
                                        };
                                    });
                            });
                    },
                    function (utils, oPath) {
                        var context = this;
                        var config = oPath.find(context, [
                            'list', 'filters',
                            '[name:apiId$eq]'], {});
                        utils
                            .async('get', '/sms/api', null)
                            .then(
                            function (res) {
                                config.titleMap = res.body.items
                                    .map(function (entry) {
                                        return {
                                            value: entry.uid,
                                            name: entry.name
                                        };
                                    });
                            });
                    }]
            },
            form: {
                schema: {
                    "type": "object",
                    "properties": [{
                        "key": "resendTimes",
                        "title": "重新发送次数",
                        "type": "string"
                    }, {
                        "key": "apiId",
                        "title": "接口编号",
                        "type": "string"
                    }, {
                        "key": "phone",
                        "title": "手机号码",
                        "type": "string"
                    }, {
                        "key": "transactionId",
                        "title": "事务编号",
                        "type": "string"
                    }, {
                        "key": "memo",
                        "title": "扩展信息",
                        "type": "string"
                    }, {
                        "key": "status",
                        "title": "状态",
                        "type": "string"
                    }, {
                        "key": "fetchDateTime",
                        "title": "获取回执的时间",
                        "type": "string"
                    }, {
                        "key": "type",
                        "title": "短信类型",
                        "type": "string"
                    }, {
                        "key": "implClass",
                        "title": "实现接口",
                        "type": "string"
                    }, {
                        "key": "feedback",
                        "title": "反馈",
                        "type": "string"
                    }, {
                        "key": "content",
                        "title": "消息内容",
                        "type": "string"
                    }, {
                        "key": "groupId",
                        "title": "群组编号",
                        "type": "string"
                    }, {
                        "key": "spMsgId",
                        "title": "服务商编号",
                        "type": "string"
                    }, {
                        "key": "appointmentTime",
                        "title": "预约时间",
                        "type": "string"
                    }, {
                        "key": "apid",
                        "title": "应用编号",
                        "type": "string"
                    }, {
                        "key": "submissionTime",
                        "title": "提交时间",
                        "type": "string"
                    }, {
                        "key": "fetchTimes",
                        "title": "已尝试次数",
                        "type": "string"
                    }, {
                        "key": "personId",
                        "title": "人员编号",
                        "type": "string"
                    }, {
                        "key": "smsId",
                        "title": "记录编号",
                        "type": "string"
                    }, {
                        "key": "extNo",
                        "title": "发送尾号",
                        "type": "string"
                    }, {
                        "key": "gatewayId",
                        "title": "网关编号",
                        "type": "string"
                    }]
                },
                form: ['*']
            }
        },
        smsqueue: {
            title: "短信队列",
            operation: {
                del: true
            },
            list: {
                headers: {
                    "apid": {
                        displayName: "应用编号",
                        width: 70
                    },
                    "resendTimes": {
                        displayName: "重新发送次数",
                        width: 70,
                        visible: false
                    },
                    "apiId": {
                        displayName: "接口编号",
                        width: 90
                    },
                    "phone": {
                        displayName: "手机号码",
                        width: 120,
                        visible: true
                    },
                    "transactionId": {
                        displayName: "事务编号",
                        width: 70,
                        visible: false
                    },
                    "memo": {
                        displayName: "扩展信息",
                        width: 70,
                        visible: false
                    },
                    "status": {
                        displayName: "状态",
                        width: 70,
                        visible: true
                    },
                    "fetchDateTime": {
                        displayName: "获取回执的时间",
                        width: 70,
                        visible: false
                    },
                    "type": {
                        displayName: "短信类型",
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
                    "content": {
                        displayName: "消息内容",
                        minWidth: 170,
                        visible: true
                    },
                    "groupId": {
                        displayName: "群组编号",
                        width: 70,
                        visible: false
                    },
                    "spMsgId": {
                        displayName: "服务商编号",
                        width: 70,
                        visible: false
                    },
                    "appointmentTime": {
                        displayName: "预约时间",
                        width: 120,
                        visible: true
                    },
                    "submissionTime": {
                        displayName: "提交时间",
                        width: 120,
                        visible: true
                    },
                    "fetchTimes": {
                        displayName: "已尝试次数",
                        width: 70,
                        visible: false
                    },
                    "personId": {
                        displayName: "人员编号",
                        width: 70,
                        visible: false
                    },
                    "smsId": {
                        displayName: "记录编号",
                        width: 70,
                        visible: true
                    },
                    "extNo": {
                        displayName: "发送尾号",
                        width: 80,
                        visible: false
                    },
                    "gatewayId": {
                        displayName: "网关编号",
                        width: 90,
                        visible: true
                    }
                },
                filters: [{
                    type: "input",
                    name: "content$match",
                    label: "消息内容"
                }, {
                    type: "input",
                    name: "phone$eq",
                    label: "手机号码"
                }]
            },
            form: {
                schema: {
                    "type": "object",
                    "properties": [{
                        "key": "resendTimes",
                        "title": "重新发送次数",
                        "type": "string"
                    }, {
                        "key": "apiId",
                        "title": "接口编号",
                        "type": "string"
                    }, {
                        "key": "phone",
                        "title": "手机号码",
                        "type": "string"
                    }, {
                        "key": "transactionId",
                        "title": "事务编号",
                        "type": "string"
                    }, {
                        "key": "memo",
                        "title": "扩展信息",
                        "type": "string"
                    }, {
                        "key": "status",
                        "title": "状态",
                        "type": "string"
                    }, {
                        "key": "fetchDateTime",
                        "title": "获取回执的时间",
                        "type": "string"
                    }, {
                        "key": "type",
                        "title": "短信类型",
                        "type": "string"
                    }, {
                        "key": "implClass",
                        "title": "实现接口",
                        "type": "string"
                    }, {
                        "key": "feedback",
                        "title": "反馈",
                        "type": "string"
                    }, {
                        "key": "content",
                        "title": "消息内容",
                        "type": "string"
                    }, {
                        "key": "groupId",
                        "title": "群组编号",
                        "type": "string"
                    }, {
                        "key": "spMsgId",
                        "title": "服务商编号",
                        "type": "string"
                    }, {
                        "key": "appointmentTime",
                        "title": "预约时间",
                        "type": "string"
                    }, {
                        "key": "apid",
                        "title": "应用编号",
                        "type": "string"
                    }, {
                        "key": "submissionTime",
                        "title": "提交时间",
                        "type": "string"
                    }, {
                        "key": "fetchTimes",
                        "title": "已尝试次数",
                        "type": "string"
                    }, {
                        "key": "personId",
                        "title": "人员编号",
                        "type": "string"
                    }, {
                        "key": "smsId",
                        "title": "记录编号",
                        "type": "string"
                    }, {
                        "key": "extNo",
                        "title": "发送尾号",
                        "type": "string"
                    }, {
                        "key": "gatewayId",
                        "title": "网关编号",
                        "type": "string"
                    }]
                },
                form: ["*"]
            }
        },
        person: {
            title: "人员管理",
            operation: {
                'del': true,
                'add': true
            },
            list: {
                headers: {
                    "phone": {
                        displayName: "手机号码"
                    },
                    "name": {
                        displayName: "人员名称"
                    },
                    "filingDate": {
                        displayName: "备案时间"
                    },
                    "pid": {
                        displayName: "人员编号"
                    },
                    "filing": {
                        displayName: "运营商已备案",
                        width: 150
                    }
                },
                filters: [{
                    type: "input",
                    name: "pid$eq",
                    label: "人员编号"
                }]
            },
            form: {
                schema: {
                    type: "object",
                    properties: {
                        uid: {
                            type: "string",
                            title: "人员编号",
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
                        }
                    }
                },
                form: [{
                    type: "group",
                    title: "基本信息",
                    items: [

                        {
                            key: "uid",
                            placeholder: "请填写人员编号"
                        }, {
                            key: "phone",
                            placeholder: "请填写手机号码"
                        }, {
                            key: "name",
                            placeholder: "请填写人员名称"
                        },

                        {
                            key: "filingDate",
                            type: "datetimepicker"
                        },

                    ]
                }, {
                    type: "group",
                    title: "其他信息",
                    items: ["filing"]
                }],
                model: {}
            }
        },
        group: {
            title: "群组管理",
            operation: {
                del: true,
                add: true

            },
            list: {
                headers: {
                    "name": {
                        displayName: "群组名称"
                    },
                    "gid": {
                        displayName: "群组编号"
                    },
                    "pid": {
                        displayName: "人员编号"
                    }
                },
                filters: [{
                    type: "input",
                    name: "gid$eq",
                    label: "群组编号"
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
                        pid: {
                            type: "string",
                            title: "人员编号"
                        }
                    }
                },
                form: [{
                    type: "group",
                    title: "基本信息",
                    items: [{
                        key: "name",
                        placeholder: "请输入群组名称"
                    }, {
                        key: "gid",
                        placeholder: "请输入群组编号"
                    }, "pid"

                    ]
                }],
                model: {}
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
                    defaultPass: {
                        displayName: "默认通过",
                        width: 200
                    },
                    name: {
                        displayName: "名称",
                        width: 250
                    },
                    pid: {
                        displayName: "编号"
                    }
                },
                filters: [{
                    type: "input",
                    label: "名称",
                    name: "name$eq"
                }]
            },
            form: {
                schema: {
                    type: "object",
                    properties: {

                        name: {
                            type: "string",
                            title: "名称",
                            required: true
                        },
                        pid: {
                            type: "string",
                            title: "编号",
                            required: true
                        },
                        defaultPass: {
                            type: "boolean",
                            title: "默认通过"
                        }
                    }
                },
                form: [{
                    type: "group",
                    title: "基本配置",
                    items: [{
                        key: "name",
                        placeholder: "请输入名称"
                    }, {
                        key: "pid",
                        placeholder: "请输入编号"
                    }]
                },
                    {
                        type: "group",
                        title: "其他配置",
                        items: ['defaultPass']
                    }]
            }
        }
    });