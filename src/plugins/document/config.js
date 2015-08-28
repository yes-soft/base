"use strict";
angular.module("app.config").constant("document.config", {
    _default: {
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
            template: "detail.html",
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
                "interface": {
                    icon: "fa green fa-exchange",
                    name: " 接　口",
                    page: "d.interface"
                }
            }
        }
    },
    backlogs: {
        list: {
            title: "公文管理",
            wrap: "default",
            filters: [
                {
                    type: "input",
                    name: "gtitle",
                    label: "标题"
                },
                {
                    type: "select",
                    name: "form$eq",
                    label: "待办类型",
                    options: [
                        {
                            value: "",
                            name: "请选择待办类型"
                        },
                        {
                            value: "shouwen",
                            name: "收文"
                        },
                        {
                            value: "gongwen",
                            name: "发文"
                        }
                    ]
                }
            ]
        }
    },
    swbynohandout: {
        list: {
            title: "公文管理",
            wrap: "default",
            filters: [
                {
                    type: "input",
                    name: "gtitle",
                    label: "标题"
                },
                {
                    type: "input",
                    name: "yes_state",
                    label: "状态"
                },
                {
                    type: "input",
                    name: "yes_allassignee_name",
                    label: "处理人"
                }
            ]
        }
    },
    swbynottransferred: {
        list: {
            title: "公文管理",
            wrap: "default",
            filters: [
                {
                    type: "input",
                    name: "gtitle",
                    label: "标题"
                },
                {
                    type: "date",
                    name: "lwdate$gte",
                    placeholder: "请选择开始时间",
                    name2: "lwdate$lte",
                    placeholder2: "请选择结束时间",
                    label: "来文日期"
                }
            ]
        }
    },
    dispatches: {
        list: {
            title: "公文管理",
            wrap: "default",
            filters: [
                {
                    type: "input",
                    name: "gtitle",
                    label: "标题"
                },
                {
                    type: "date",
                    name: "lwdate$gte",
                    placeholder: "请选择开始时间",
                    name2: "lwdate$lte",
                    placeholder2: "请选择结束时间",
                    label: "来文日期"
                }
            ]
        }
    },
    docsearch: {
        list: {
            title: "公文管理",
            wrap: "default",
            filters: [
                {
                    type: "input",
                    name: "gtitle",
                    label: "标题"
                },
                {
                    type: "select",
                    name: "form$eq",
                    label: "公文类型",
                    options: [
                        {
                            value: "",
                            name: "请选择公文类型",
                            hideKeys: "dperson,dunits$eq,signdate$gte,dunit$eq,lwdate$gte"
                        },
                        {
                            value: "gongwen",
                            name: "发文",
                            hideKeys: "yes_create_time$gte,dunit$eq,lwdate$gte"
                        },
                        {
                            value: "deptshouwen",
                            name: "中心发文",
                            hideKeys: "yes_create_time$gte,dunit$eq,lwdate$gte"
                        },
                        {
                            value: "shouwen",
                            name: "收文",
                            hideKeys: "yes_create_time$gte,dperson,dunits$eq,signdate$gte"
                        }
                    ]
                },
                {
                    type: "date",
                    name: "yes_create_time$gte",
                    placeholder: "请选择开始时间",
                    name2: "yes_create_time$lte",
                    placeholder2: "请选择结束时间",
                    label: "日期"
                },
                {
                    type: "input",
                    name: "dperson",
                    label: "拟稿人"
                },
                {
                    type: "department",
                    name: "dunits$eq",
                    radio: false,
                    label: "拟稿部门",
                    placeholder: "请选择拟稿部门"
                },
                {
                    type: "date",
                    name: "signdate$gte",
                    placeholder: "请选择开始时间",
                    name2: "signdate$lte",
                    placeholder2: "请选择结束时间",
                    label: "签发日期"
                },
                {
                    type: "input",
                    name: "dunit$eq",
                    label: "来文单位"
                },
                {
                    type: "date",
                    name: "lwdate$gte",
                    placeholder: "请选择开始时间",
                    name2: "lwdate$lte",
                    placeholder2: "请选择结束时间",
                    label: "来文日期"
                }
            ]
        }
    },
    mypending: {
        list: {
            title: "公文管理",
            wrap: "default",
            filters: [
                {
                    type: "input",
                    name: "gtitle",
                    label: "标题"
                }
            ]
        }
    },
    mypendinggw: {
        list: {
            title: "公文管理",
            wrap: "default",
            filters: [
                {
                    type: "input",
                    name: "gtitle",
                    label: "标题"
                },
                {
                    type: "datetime",
                    autoclose: true,
                    name: "yes_create_time$gte",
                    placeholder: "请选择开始时间",
                    name2: "yes_create_time$lte",
                    placeholder2: "请选择结束时间",
                    label: "日期"
                },
                {
                    type: "input",
                    name: "dperson",
                    label: "拟稿人"
                },
                {
                    type: "department",
                    name: "dunits$eq",
                    radio: false,
                    label: "拟稿部门",
                    placeholder: "请选择拟稿部门"
                }
            ]
        }
    },
    mypendingsw: {
        list: {
            title: "公文管理",
            wrap: "default",

            filters: [
                {
                    type: "input",
                    name: "gtitle",
                    label: "标题"
                },
                {
                    type: "input",
                    name: "dunit$eq",
                    label: "来文单位"
                },
                {
                    type: "date",
                    name: "lwdate$gte",
                    placeholder: "请选择开始时间",
                    name2: "lwdate$lte",
                    placeholder2: "请选择结束时间",
                    label: "来文日期"
                }
            ]
        }
    },
    havebyname: {
        list: {
            title: "公文管理",
            wrap: "default",

            filters: [
                {
                    type: "input",
                    name: "gtitle",
                    label: "标题"
                },
                {
                    type: "select",
                    name: "form$eq",
                    label: "公文类型",
                    options: [
                        {
                            value: "",
                            name: "请选择公文类型"
                        },
                        {
                            value: "gongwen",
                            name: "发文"
                        },
                        {
                            value: "deptshouwen",
                            name: "中心发文"
                        },
                        {
                            value: "shouwen",
                            name: "收文"
                        }
                    ]
                }
            ]
        }
    }


});

//# sourceMappingURL=config.js.map