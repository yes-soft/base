"use strict";
angular.module("app.config")
    .constant("xy.config",
    		{
        notice: {
            title: "公告",
            operation: {
                add:true,
                del:true
            },
            list: {
                headers: {
                    title: {
                        displayName: "标题",
                        width: 250
                    },
                    content: {
                        displayName: "内容",
                        minWidth: 200
                    },
                    noticeobj: {
                        displayName: "公告对象",
                        minWidth: 100
                    },
                    created: {
                        displayName: "创建时间",
                        minWidth: 110
                    },
                    publishDate: {
                        displayName: "发布时间",
                        minWidth: 110
                    },
                    status:{
                    	displayName : "状态",
                    	width:90
                    }

                },
                filters: [{
                    type:"datetime",
                    name:"publishDate$gte",
                    label:"公告时间起"
                },{
                    type:"datetime",
                    name:"publishDate$lte",
                    label:"公告时间止"
                },{
                    type: "input",
                    name: "title$match",
                    label: "公告标题"
                },{
                    type: "select",
                    name: "state$eq",
                    label: "状态",
                    titleMap: [{
                        value: "10",
                        name: "未发布"
                }, {
                        value: "90",
                        name: "已发布"
                }]
            }]
            },
            form: {
                schema: {
                    "type": "object",
                    "properties": {
                        'title':{
                        "title": "标题",
                        "required": true,
                        "type" :"string"
                    }, 
                    'content':{ 
                        "title": "内容",
                        "required": true,
                        "type" :"string"
                    },
                    'noticeobj':{
                         "title": "接收用户类型",
                         "type" :"string"
                    },
                    'publishDate':{
                   	 	"title": "发布时间",
                   	 	"type": "datetimepicker"
                    }}
                },
                form: [{
                    type: "group",
                    title: "基本信息",
                    items: [{
                        key: 'title',
                        placeholder:'标题'
                    }, {
                    	key: 'content',
                        type: 'textarea',
                        placeholder:'内容'
                    },{
                    	key: 'noticeobj',
                        type: 'select',
                        placeholder:'接收用户类型',
                        titleMap: [
                            {
                                value: "所有用户",
                                name: "所有用户"
                            }, {
                                value: "旭盈用户",
                                name: "旭盈用户"
                            },{
                            	 value: "普通用户",
                                 name: "普通用户"
                            },{
                            	value: "认证用户",
                                name: "认证用户"
                            }
                       ]
                    },{
                    	key: 'publishDate',
                        type: 'datetimepicker',
                        placeholder:'发布时间'
                    }]
                }],
                resolves: [
                    function (utils, oPath) {
                        var context = this;
                        
                        
                    },
                    function (utils, oPath) {
                        var context = this;
                       
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
                        displayName: "名称",
                        width: 100
                    },
                    state: {
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
                        label: "名称"
                },
                    {
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
                resolves: function (utils, oPath) {
                    var context = this;
                    var config = oPath.find(context, ['list',
                        'filters', '[name:gid$eq]'], {});

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
                        }
                        else{
                            toastr.warning("请选择要发送的短信");
                        }

                    }
                }
            },
            list: {
                wrap: "default",
                headers: {
                    groups: {
                        displayName: "群组列表",
                        width: 100
                    },
                    people: {
                        displayName: "人员列表",
                        width: 100
                    },
                    mobileNumbers: {
                        displayName: "手机列表",
                        width: 150
                    },
                    appointment: {
                        displayName: "预约时间",
                        width: 120
                    },
                    content: {
                        displayName: "短信内容",
                        minWidth: 200
                    },
                    report: {
                        displayName: "短信报告",
                        width: 100
                    },
                    sendStatus: {
                        displayName: "发送状态",
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
                        label: "群组"
                },
                    {
                        type: "input",
                        name: "people$eq",
                        label: "人员"
                }, {
                        type: "input",
                        name: "mobileNumbers$match",
                        label: "手机号码"
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
                        name: "sendStatus$eq",
                        label: "发送状态",
                        titleMap: [
                            {
                                value: true,
                                name: "已发送"
                        }
                        , {
                                value: false,
                                name: "未发送"
                        }
                    ]
                }]
            },
            form: {
                schema: {
                    "type": "object",
                    "properties": [{
                        "key": "transitionId",
                        "title": "发送编号",
                        "type": "string"
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
                form: [{
                    type: "group",
                    title: "基本信息",
                    items: [{
                        key: 'transitionId',
                        placeholder: "请填写发送编号"
                    }, 'mobileNumbers', 'people', 'groups', {
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
                    "resendTimes": {
                        displayName: "重新发送次数",
                        width: 100
                    },
                    "apiId": {
                        displayName: "接口编号",
                        width: 90,
                        visible: false
                    },
                    "phone": {
                        displayName: "手机号码",
                        width: 100,
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
                        width: 60,
                        visible: true
                    },
                    "fetchDateTime": {
                        displayName: "获取回执的时间",
                        width: 130
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
                        displayName: "服务商",
                        width: 70
                    },
                    "appointmentTime": {
                        displayName: "预约时间",
                        width: 100,
                        visible: true
                    },
                    "submissionTime": {
                        displayName: "提交时间",
                        width: 100,
                        visible: true
                    },
                    "fetchTimes": {
                        displayName: "已尝试次数",
                        width: 90
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
                    },
                    "gatewayId": {
                        displayName: "网关编号",
                        width: 95,
                        visible: true
                    }
                },
                filters: [{
                    type: "select",
                    name: "apid$eq",
                    label: "应用名称"
                }, {
                    type: "input",
                    name: "phone",
                    label: "手机号码"
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
                            name: "发送失败"
        	           }, {
                            value: "50",
                            name: "发送成功"
        	           }, {
                            value: "60",
                            name: "60"
        	           }]
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
                }, {
                    type: "datetime",
                    name: "submissionTime$lte",
                    label: "提交时间止"
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
                form: ['*']
            }
        },
        smsqueue: {
            title: "短信队列",
            operation: {
                del: true,
                'export': {
                    "name": "导出",
                    "action": function action(utils) {
                        var context = this;
                        var filter = context.scope.filter;
                        var url = utils.getAbsUrl('sms/smsqueue/export?' + utils.serialize(filter));
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
                    "resendTimes": {
                        displayName: "重新发送次数",
                        width: 100
                    },
                    "phone": {
                        displayName: "手机号码",
                        width: 100
                    },
                    "status": {
                        displayName: "状态",
                        width: 60,
                        visible: true
                    },
                    "fetchDateTime": {
                        displayName: "获取回执的时间",
                        width: 130
                    },
                    "type": {
                        displayName: "短信类型",
                        width: 70
                    },
                    "content": {
                        displayName: "消息内容",
                        minWidth: 150,
                        visible: true
                    },
                    "groupId": {
                        displayName: "群组名称",
                        width: 80
                    },

                    "spMsgId": {
                        displayName: "服务商",
                        width: 80
                    },
                    "appointmentTime": {
                        displayName: "预约时间",
                        width: 100,
                        visible: true
                    },
                    "submissionTime": {
                        displayName: "提交时间",
                        width: 100,
                        visible: true
                    },

                    "fetchTimes": {
                        displayName: "已尝试次数",
                        width: 85
                    },
                    "personId": {
                        displayName: "人员编号",
                        width: 70
                    },
                    "gatewayId": {
                        displayName: "网关编号",
                        width: 90
                    },
                    "apiId": {
                        displayName: "接口编号",
                        width: 80,
                        visible: false
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
                        type: "input",
                        name: "phone$eq",
                        label: "手机号码"
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
                                name: "发送失败"
        	           }, {
                                value: "50",
                                name: "发送成功"
        	           }, {
                                value: "60",
                                name: "60"
        	           }]
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
                }, {
                        type: "datetime",
                        name: "submissionTime$lte",
                        label: "提交时间止"
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
                'add': true,
                'import': {
                    "name": "导入",
                    "action": function action(utils) {
                        var context = this;
                        utils.dialogUpload({
                            url: 'sms/person/upload',
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
                        var url = utils.getAbsUrl('sms/person/export?' + utils.serialize(filter));
                        window.open(url, '_blank');
                    }
                }
            },
            list: {
                headers: {
                    "pid": {
                        displayName: "员工号",
                        width: 70
                    },
                    "name": {
                        displayName: "姓名",
                        width: 70
                    },
                    "phone": {
                        displayName: "手机号码",
                        width: 120
                    },
                    "email": {
                        displayName: "邮箱",
                        minWidth: 120
                    },
                    "company": {
                        displayName: "所属公司",
                        minWidth: 100
                    },
                    "departmentName": {
                        displayName: "所属部门",
                        minWidth: 100
                    },
                    "filingDate": {
                        displayName: "备案时间",
                        visible: false
                    },

                    "filing": {
                        displayName: "运营商已备案",
                        width: 50,
                        visible: false
                    },
                    "isInternal": {
                        displayName: "是否内部人员",
                        visible: false
                    },
                    "enabled": {
                        displayName: "状态",
                        width: 90
                    }
                },
                filters: [{
                        type: "input",
                        name: "pid$eq",
                        label: "员工号"
                },
                    {
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
                },
                    {
                        type: "select",
                        name: "enabled$eq",
                        label: "状态",
                        titleMap: [
                            {
                                value: "1",
                                name: "已启用"
                            }, {
                                value: "0",
                                name: "未启用"
                            }
                        ]
                         }],
                resolves: [function (utils, oPath) {
                    var context = this;
                    var config = oPath.find(context, ['list',
          'filters', '[name:pid$eq]'], {});
                    utils.async('get', '/sms/group', null).then(
                        function (res) {
                            config.titleMap = res.body.items
                                .map(function (entry) {
                                    return {
                                        value: entry.name,
                                        name: entry.pid
                                    };
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
                        }, {
                            key: "email",
                            type: "email"
                           }, "company", "departmentId", "departmentName"
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
                del: true,
                add: true,
                'import': {
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
                },
                'export': {
                    "name": "导出",
                    "action": function action(utils) {
                        var context = this;
                        var filter = context.scope.filter;
                        var url = utils.getAbsUrl('sms/group/export?' + utils.serialize(filter));
                        window.open(url, '_blank');

                    }
                }

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
                        displayName: "成员编号",
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
                            title: "成员名称"
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
                        displayName: "规则名称",
                        width: 100
                    },
                    name: {
                        displayName: "应用名称",
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
                    label: "规则名称",
                    name: "pid$eq"
                }, {
                    type: "input",
                    label: "应用名称",
                    name: "name$match"
                }],
                resolves: function (utils, oPath) {
                    var context = this;
                    var config = oPath.find(context, ['list',
                        'filters', '[name$match]'], {});
                    utils.async('get', 'sms/ap?count=1000', null).then(
                        function (res) {
                            config.titleMap = res.body.items
                                .map(function (entry) {
                                    return {
                                        value: entry.name,
                                        name: entry.name
                                    };
                                });
                        });
                }
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
                            title: "发送规则编号",
                            required: true
                        },
                        seq: {
                            type: "integer",
                            title: "顺序",
                            required: true
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
                            placeholder: "请输入名称",
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