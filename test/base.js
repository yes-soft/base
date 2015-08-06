module.exports = {
    __default: {
        title: "短信平台",
        list: {
            operations: null
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
    accounts: {
        form: {},
        list: {}
    }
};