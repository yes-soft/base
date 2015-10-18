define([], function () {
    "use strict";
    angular
        .module("app.config")
        .constant("sms.config", {
            appointment: {
                title: "发送请求",
                operation: {
                    'del': true,
                    'add': true,
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
                                    utils.async(
                                        'post',
                                        '../public/sms/command', json).then(
                                        function (res) {
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
                            width: 70
                        },
                        "json": {
                            displayName: "短信内容",
                            minWidth: 180
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
                            width: 70,
                            visible: false
                        },
                        "statusLabel": {
                            displayName: "状态",
                            width: 100
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
                        },
                        {
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
                            titleMap: [
                                {
                                    value: '0',
                                    name: "待提交到队列"
                                },
                                {
                                    value: '1',
                                    name: '提交到队列成功'
                                },
                                {
                                    value: '2',
                                    name: '提交到队列失败'
                                },
                                {
                                    value: '3',
                                    name: '申请已撤销'
                                }]
                        }],
                    resolves: [function (utils, oPath) {
                        var context = this;
                        var config = oPath.find(context, ['list',
                            'filters', '[name:apid$eq]'], {});
                        utils.async('get', '/sms/ap?count=1000', null).then(
                            function (res) {
                                config.titleMap = res.body.items
                                    .map(function (entry) {
                                        return {
                                            value: entry.aid,
                                            name: entry.aid
                                        };
                                    });
                            });
                    }, function (utils) {
                        var context = this;
                        context.scope.events
                            .on(
                            'listLoaded',
                            function () {
                                var names = {
                                    0: "待提交到队列",
                                    1: '提交到队列成功',
                                    2: '提交到队列失败',
                                    3: '申请已撤销'
                                };
                                angular.forEach(context.scope.entries, function (entry) {
                                    entry.statusLabel = names[entry.status];
                                });
                            });
                    }]
                },
                form: {
                    schema: {
                        "type": "object",
                        "properties": [{
                            "key": "apid",
                            "title": "应用名称",
                            "type": "string"
                        }, {
                            "key": "appointment",
                            "title": "预约发送时间",
                            "type": "datetime"
                        }, {
                            "key": "submited",
                            "title": "数据提交时间",
                            "type": "datetime"
                        }, {
                            "key": "json",
                            "title": "请求内容",
                            "type": "string"
                        }, {
                            "key": "status",
                            "title": "状态",
                            "type": "number"
                        }, {
                            "key": "apip",
                            "title": "调用IP",
                            "type": "string"
                        }, {
                            "key": "memo",
                            "title": "备注信息",
                            "type": "string"
                        }, {
                            "key": "phoneNumbers",
                            "title": "预约的手机号码",
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
                            titleMap: [
                                {
                                    value: 0,
                                    name: "待提交到队列"
                                },
                                {
                                    value: 1,
                                    name: '提交到队列成功'
                                },
                                {
                                    value: 2,
                                    name: '提交到队列失败'
                                },
                                {
                                    value: 3,
                                    name: '申请已撤销'
                                }]
                        }, {
                            key: 'transactionId',
                            readonly: true
                        }]
                    }],
                    resolves: [function (utils) {
                        var context = this;
                        context.scope.events
                            .on('beforeSave', function () {
                                angular.forEach(context.scope.entries, function (entry) {
                                    delete entry.statusLabel;
                                });
                            });
                    }]
                }
            },
            ap: {
                title: "应用配置",
                operation: {
                    'add': true,
                    'del': true
                    /*'import': {
                     "name": "导入",
                     "action": function action(utils) {
                     var context = this;
                     utils.dialogUpload({
                     url: 'sms/ap/upload',
                     resolve: function () {
                     context.scope.load();
                     }
                     });
                     }
                     },
                     'export': {
                     "name": "导出",
                     "action": function action(utils) {
                     var context = this;
                     var filter = context.scope.filter;
                     var url = utils.getAbsUrl('sms/ap/export?' + utils.serialize(filter));
                     window.open(url, '_blank');

                     }
                     }*/
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
                            'width': 280
                        },
                        "storageDay": {
                            'displayName': "保存天数",
                            'width': 70
                        },
                        "policyId": {
                            'displayName': "发送策略",
                            'width': 70
                        },
                        "replyLabel": {
                            'displayName': "是否接受回复",
                            'width': 100
                        },
                        "localLabel": {
                            'displayName': "仅内部人员",
                            'width': 80
                        },
                        "ipAddress": {
                            'displayName': "IP地址",
                            'minWidth': 100
                        },
                        "stateLabel": {
                            'displayName': "状态",
                            'width': 70
                        },
                        "reply": {
                            'displayName': "是否接受回复",
                            'width': 100,
                            visible: false
                        },
                        "state": {
                            'displayName': "状态",
                            'width': 70,
                            visible: false
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


                        "local": {
                            'displayName': "仅内部人员",
                            'width': 100,
                            visible: false
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
                        }
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
                            utils.async('get', '/sms/api?count=100', null).then(
                                function (res) {
                                    config.titleMap = res.body.items
                                        .map(function (entry) {
                                            return {
                                                value: entry.name,
                                                name: entry.name
                                            };
                                        });
                                });
                        },
                        function (utils) {
                            var context = this;
                            context.scope.events
                                .on(
                                'listLoaded',
                                function () {
                                    var names = {
                                        "true": "已启用",
                                        "false": "未启用"
                                    };
                                    var reply = {
                                        "true": '是',
                                        "false": '否'
                                    };
                                    angular.forEach(context.scope.entries, function (entry) {
                                        entry.stateLabel = names[entry.state];
                                        entry.replyLabel = reply[entry.reply];
                                        entry.localLabel = reply[entry.local]
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
                                maximum: 120,
                                description: "最长保存120天"
                            },
                            reply: {
                                type: "boolean",
                                title: "是否支持回复",
                                description: "短信平台仅提供通道,具体业务由应用实现"
                            },
                            extNumber: {
                                type: "integer",
                                title: "尾号",
                                minimum: 0
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
                            }
                        }
                    },
                    form: [
                        {
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
                                }, "storageDay", "policyId",
                                "extNumber", "ipAddress", {
                                    key: "type",
                                    type: "select",
                                    titleMap: [{
                                        value: '1',
                                        name: "短信"
                                    }, {
                                        value: '2',
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
                    },
                        function (utils) {
                            var context = this;
                            context.scope.events
                                .on(
                                'beforeSave',
                                function () {

                                    angular.forEach(context.scope.entries, function (entry) {
                                        delete entry.stateLabel;
                                        delete entry.replyLabel;
                                        delete entry.localLabel;
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
                                        "title": "顺序",
                                        "minimum": 0
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
                            visible: false
                        },
                        stateLabel: {
                            displayName: "状态",
                            width: 100
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
                        type: "select",
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
                    }],
                    resolves: [function (utils, oPath) {
                        var context = this;
                        var config = oPath.find(context, ['list', 'filters', '[name:gid$eq]'], {});
                        utils.async('get', 'sms/gateway', null).then(
                            function (res) {
                                config.titleMap = res.body.items
                                    .map(function (entry) {
                                        return {
                                            value: entry.gid,
                                            name: entry.gid
                                        };
                                    });
                            });
                    },
                        function (utils) {
                            var context = this;
                            context.scope.events
                                .on(
                                'listLoaded',
                                function () {
                                    var names = {
                                        true: "已启用",
                                        false: "未启用"
                                    };
                                    angular.forEach(context.scope.entries, function (entry) {
                                        entry.stateLabel = names[entry.state];
                                    });
                                }
                            );

                        }]
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
                            "title": "网关名称",
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
                    }],
                    resolves: [function (utils) {
                        var context = this;
                        context.scope.events
                            .on(
                            'beforeSave',
                            function () {

                                angular.forEach(context.scope.entries, function (entry) {
                                    delete entry.stateLabel;
                                });
                            }
                        );

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
                                    utils.async(
                                        'post',
                                        'sms/smstestapp/' + row.uid + '/send').then(
                                        function (res) {
                                            context.scope.load();
                                            toastr.success("发送成功");
                                        },
                                        function () {
                                            toastr.error("发送失败");
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
                            width: 150
                        },
                        content: {
                            displayName: "短信内容",
                            minWidth: 200
                        },
                        appointment: {
                            displayName: "预约时间",
                            width: 140
                        },
                        "submissionTime": {
                            displayName: "提交时间",
                            width: 140
                        },
                        report: {
                            displayName: "短信报告",
                            width: 100
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
                    },
                        {
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
                            name: "submissionTime$gte",
                            label: "提交时间起"
                        },
                        {
                            type: "datetime",
                            name: "submissionTime$lte",
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
                            "appointment": {
                                "type": "datetime",
                                "title": "预约时间"
                            },
                            content: {
                                title: "短信内容",
                                type: "string",
                                required: true
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
                            type: 'datetimepicker',
                            "description": "不选择则为即时发送"

                        }, {
                            key: 'content',
                            type: 'textarea',
                            placeholder: "请填写短信内容"
                        }]
                    }],
                    resoleves: []
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
                    },
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
                        "statusLabel": {
                            displayName: "状态",
                            width: 60
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
                        "status": {
                            displayName: "状态",
                            width: 60,
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
                            displayName: "提交时间",
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
                    },
                        {
                            type: "select",
                            name: "getewayname$eq",
                            label: "网关名称"
                        },
                        {
                            type: "input",
                            name: "transactionId$eq",
                            label: "事务编号"
                        },
                        {
                            type: "input",
                            name: "groups$match",
                            label: "群组名称"
                        },

                        {
                            type: "input",
                            name: "phone$eq",
                            label: "手机号码"
                        },
                        {
                            type: "input",
                            name: "content$match",
                            label: "短信内容"
                        },
                        {
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
                                    value: "10",
                                    name: "创建"
                                }, {
                                    value: "20",
                                    name: "已提交到队列"
                                }, {
                                    value: "30",
                                    name: "已提交到运营商"
                                }, {
                                    value: "40",
                                    name: "提交失败"
                                }, {
                                    value: "50",
                                    name: "接收成功"
                                }, {
                                    value: '60',
                                    name: "接收失败"
                                }]
                        }],
                    resolves: [
                        function (utils, oPath) {
                            var context = this;
                            var config = oPath.find(context, [
                                'list', 'filters',
                                '[name:apid$eq]'], {});
                            utils
                                .async('get', '/sms/ap?count=1000', null)
                                .then(
                                function (res) {
                                    config.titleMap = res.body.items
                                        .map(function (entry) {
                                            return {
                                                value: entry.aid,
                                                name: entry.aid
                                            };
                                        });
                                });
                        },
                        function (utils, oPath) {
                            var context = this;
                            var config = oPath.find(context, [
                                'list', 'filters',
                                '[name:getewayname$eq]'], {});
                            utils
                                .async('get', '/sms/gateway?count=1000', null)
                                .then(
                                function (res) {
                                    config.titleMap = res.body.items
                                        .map(function (entry) {
                                            return {
                                                value: entry.name,
                                                name: entry.name
                                            };
                                        });
                                });
                        },
                        function (utils, oPath) {
                            var context = this;
                            var config = oPath.find(context, ['list', 'filters',
                                '[name:apiId$eq]'], {});
                            utils.async('get', '/sms/api', null).then(
                                function (res) {
                                    config.titleMap = res.body.items
                                        .map(function (entry) {
                                            return {
                                                value: entry.aid,
                                                name: entry.name
                                            };
                                        });
                                });
                        },
                        function (utils) {
                            var context = this;
                            context.scope.events
                                .on(
                                'listLoaded',
                                function () {
                                    var names = {
                                        10: "创建",
                                        20: "已提交到队列",
                                        30: "已提交到运营商",
                                        40: "提交失败",
                                        50: "接收成功",
                                        60: "接收失败"
                                    };
                                    angular.forEach(context.scope.entries, function (entry) {
                                        entry.statusLabel = names[entry.status];
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
                            "title": "服务商",
                            "type": "string"
                        }, {
                            "key": "appointmentTime",
                            "title": "预约时间",
                            "type": "string"
                        }, {
                            "key": "apid",
                            "title": "应用名称",
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
                    form: ['*'],
                    resolves: [function (utils) {
                        var context = this;
                        context.scope.events
                            .on(
                            'beforeSave',
                            function () {

                                angular.forEach(context.scope.entries, function (entry) {
                                    delete entry.statusLabel;
                                });
                            });

                    }]
                }
            },
            smsqueue: {
                title: "发送队列",
                operation: {
                    del: true
                    /*'export': {
                     "name": "导出",
                     "action": function action(utils) {
                     var context = this;
                     var filter = context.scope.filter;
                     var url = utils.getAbsUrl('sms/smsqueue/export?' + utils.serialize(filter));
                     window.open(url, '_blank');
                     }
                     }*/
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
                            width: 150
                        },
                        "submissionTime": {
                            displayName: "数据提交时间",
                            width: 150
                        },
                        "statusLabel": {
                            displayName: "状态",
                            width: 80
                        },
                        "resendTimes": {
                            displayName: "重新发送次数",
                            width: 100,
                            visible: false,
                            filter: function () {

                            }
                        },
                        "status": {
                            displayName: "状态",
                            width: 60,
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
                        },
                        {
                            type: "select",
                            name: "getewayname$eq",
                            label: "网关名称"
                        },
                        {
                            type: "input",
                            name: "transactionId$eq",
                            label: "事务编号"
                        },
                        {
                            type: "input",
                            name: "groups$match",
                            label: "群组名称"
                        },

                        {
                            type: "input",
                            name: "phone$eq",
                            label: "手机号码"
                        },
                        {
                            type: "input",
                            name: "content$match",
                            label: "短信内容"
                        },
                        {
                            type: "datetime",
                            name: "appointment$gte",
                            label: "预约时间起"
                        }, {
                            type: "datetime",
                            name: "appointment$lte",
                            label: "预约时间止"
                        },
                        {
                            type: "datetime",
                            name: "submissionTime$gte",
                            label: "提交时间起"
                        }, {
                            type: "datetime",
                            name: "submissionTime$lte",
                            label: "提交时间止"
                        },
                        {
                            type: "select",
                            name: "status$eq",
                            label: "状态",
                            titleMap: [
                                {
                                    value: "10",
                                    name: "创建"
                                }, {
                                    value: "20",
                                    name: "已提交到队列"
                                }, {
                                    value: "30",
                                    name: "已提交到运营商"
                                }, {
                                    value: "40",
                                    name: "提交失败"
                                }, {
                                    value: "50",
                                    name: "接收成功"
                                }, {
                                    value: '60',
                                    name: "接收失败"
                                }]
                        }],
                    resolves: [
                        function (utils, oPath) {
                            var context = this;
                            var config = oPath.find(context, [
                                'list', 'filters',
                                '[name:apid$eq]'], {});
                            utils
                                .async('get', '/sms/ap?count=1000', null)
                                .then(
                                function (res) {
                                    config.titleMap = res.body.items
                                        .map(function (entry) {
                                            return {
                                                value: entry.name,
                                                name: entry.name
                                            };
                                        });
                                });
                        },
                        function (utils, oPath) {
                            var context = this;
                            var config = oPath.find(context, [
                                'list', 'filters',
                                '[name:getewayname$eq]'], {});
                            utils
                                .async('get', '/sms/gateway?count=1000', null)
                                .then(
                                function (res) {
                                    config.titleMap = res.body.items
                                        .map(function (entry) {
                                            return {
                                                value: entry.name,
                                                name: entry.name
                                            };
                                        });
                                });
                        },
                        function (utils, oPath) {
                            var context = this;
                            var config = oPath.find(context, ['list', 'filters',
                                '[name:apiId$eq]'], {});
                            utils.async('get', '/sms/api', null).then(
                                function (res) {
                                    config.titleMap = res.body.items
                                        .map(function (entry) {
                                            return {
                                                value: entry.aid,
                                                name: entry.name
                                            };
                                        });
                                });
                        },
                        function (utils) {
                            var context = this;
                            context.scope.events
                                .on(
                                'listLoaded',
                                function () {
                                    var names = {
                                        10: "创建",
                                        20: "已提交到队列",
                                        30: "已提交到运营商",
                                        40: "提交失败",
                                        50: "接收成功",
                                        60: "接收失败"
                                    };
                                    angular.forEach(context.scope.entries, function (entry) {
                                        entry.statusLabel = names[entry.status];
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
                            "title": "接口名称",
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
                        },
                            {
                                "key": "statusLabel",
                                "title": "状态",
                                "type": "string"
                            },
                            {
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
                                "title": "群组名称",
                                "type": "string"
                            }, {
                                "key": "spMsgId",
                                "title": "服务商",
                                "type": "string"
                            }, {
                                "key": "appointmentTime",
                                "title": "预约时间",
                                "type": "string"
                            }, {
                                "key": "apid",
                                "title": "应用名称",
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
                                "title": "网关名称",
                                "type": "string"
                            }]
                    },
                    form: [{
                        "type": "group",
                        "items": [
                            'apid', 'gatewayId', {
                                key: "transactionId",
                                readonly: true
                            }, "groupId", "phone", "content", "appointmentTime"
                            , "submissionTime", "statusLabel", "resendTimes", "fetchDateTime", {
                                key: "type",
                                type: "select",
                                titleMap: [{
                                    value: '1',
                                    name: "短信"
                                }, {
                                    value: '2',
                                    name: "彩信"
                                }]
                            }, "spMsgId", "fetchTimes", "personId", "gatewayId", "apiId", "memo", "implClass"
                            , "feedback", "smsId", "extNo"
                        ]
                    }],
                    resolves: [function (utils) {
                        var context = this;
                        context.scope.events
                            .on('beforeSave', function () {
                                angular.forEach(context.scope.entries, function (entry) {
                                    delete entry.statusLabel;
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
                                    if (confirm(res.body)) {
                                        utils.async('get', '/sms/person/cover', null).then(function (res) {
                                            toastr.warning(res.message);
                                        });
                                    }
                                }
                            });
                        }
                    },
                    'export': {
                        "name": "导出",
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
                            visible: false
                        },
                        "filingLabel": {
                            displayName: "运营商已备案",
                            width: 100
                        },
                        "isInternal": {
                            displayName: "是否内部人员",
                            visible: false
                        },
                        "enabled": {
                            displayName: "状态",
                            width: 90,
                            visible: false
                        },
                        "enabledLabel": {
                            displayName: "状态",
                            width: 90
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
                    },
                        function (utils) {
                            var context = this;
                            context.scope.events.on('listLoaded', function () {
                                var names = {
                                    "true": "已启用",
                                    "false": "未启用"
                                };
                                var filings = {
                                    "true": "已备案",
                                    "false": "未备案"
                                };
                                angular.forEach(context.scope.entries, function (entry) {
                                    entry.enabledLabel = names[entry.enabled];
                                    entry.filingLabel = filings[entry.filing]
                                });
                            });

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
                    resoleves: [function (utils) {
                        var context = this;
                        context.scope.events.on('beforeSave', function () {
                            angular.forEach(context.scope.entries, function (entry) {
                                delete entry.enabledLabel;
                                delete entry.filingLabel;
                            });
                        });
                    }],
                    model: {}
                }
            },
            group: {
                title: "群组管理",
                operation: {
                    add: true
                    /*'import': {
                     "name": "导入",
                     "action": function action(utils) {
                     var context = this;
                     utils.dialogUpload({
                     url: 'sms/group/upload',
                     resolve: function () {
                     context.scope.load();
                     }
                     });
                     }
                     },*/
                    /*'export': {
                     "name": "导出",
                     "action": function action(utils) {
                     var context = this;
                     var filter = context.scope.filter;
                     var url = utils.getAbsUrl('sms/group/export?' + utils.serialize(filter));
                     window.open(url, '_blank');
                     }
                     }*/
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
                        "pid": {
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
                            pid: {
                                type: "string",
                                required: true,
                                title: "成员"
                            },
                            memo: {
                                type: "string",
                                title: "备注"
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
                        }, "pid", "memo"

                        ]
                    }],
                    model: {}
                }
            },
            policydetail: {
                title: "策略配置",
                operation: {
                    add: true,
                    del: true,
                    'addPolicy': {
                        "name": "创建策略",
                        "action": function action(utils) {
                            var context = this;
                            utils.dialogUpload({
                                url: 'sms/ap/upload',
                                resolve: function () {
                                    context.scope.load();
                                }
                            });
                        }
                    }
                },
                list: {
                    headers: {
                        pid: {
                            displayName: "规则编号",
                            width: 100
                        },
                        name: {
                            displayName: "规则名称",
                            width: 100
                        },
                        seq: {
                            displayName: "顺序",
                            visible: false
                        },
                        match: {
                            displayName: "短信内容",
                            minWidth: 150
                        },
                        action: {
                            displayName: "操作",
                            visible: false
                        },
                        appointmentDate: {
                            displayName: "预约日期",
                            visible: false
                        },

                        timeF: {
                            displayName: "时间起",
                            width: 150
                        },
                        timeT: {
                            displayName: "时间止",
                            width: 150
                        },
                        appointmentTime: {
                            displayName: "预约时间",
                            width: 150
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
                            name: {
                                type: "string",
                                title: "规则名称",
                                required: true
                            },
                            pid: {
                                type: "string",
                                title: "规则编号",
                                required: true
                            },
                            seq: {
                                type: "integer",
                                title: "顺序",
                                required: true,
                                minimum: 0
                            },
                            dateF: {
                                type: "string",
                                title: "日期匹配起"
                            },
                            dateT: {
                                type: "string",
                                title: "日期匹配至"
                            },
                            timeF: {
                                type: "string",
                                title: "时间匹配起"
                            },
                            timeT: {
                                type: "string",
                                title: "时间匹配至"
                            },
                            match: {
                                type: "string",
                                title: "内容匹配"
                            },
                            action: {
                                type: "string",
                                title: "操作"
                            },
                            appointmentDate: {
                                type: "string",
                                title: "预约日期"
                            },
                            appointmentTime: {
                                type: "string",
                                title: "预约时间"
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
                        },
                            "match", {
                                key: "dateF",
                                type: "datetimepicker"
                            }, {
                                key: "dateT",
                                type: "datetimepicker"
                            }, {
                                key: "timeF",
                                type: "datetimepicker"
                            }, {
                                key: "timeT",
                                type: "datetimepicker"
                            }, {
                                key: "appointmentDate",
                                type: "datetimepicker"
                            }, {
                                key: "appointmentTime",
                                type: "datetimepicker"
                            }]
                    }, {
                        type: "group",
                        title: "其他配置",
                        items: ["seq", "action"]
                    }]
                }
            }
        });
});