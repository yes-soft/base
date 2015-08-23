"use strict";
angular
    .module("app.config")
    .constant("scaffold.config", {
        plugins: {
            "title": "系统初始化",
            operation: {
                'del': true
            },
            "list": {
                operations: {
                    'add': true,
                    'del': true
                },
                "headers": {
                    "name": "插件名称",
                    "__default": "默认配置",
                    "pages": "配置节点"
                },
                "filter": [],
                "resolves": []
            },
            "form": {
                "debug": true,
                "title": "配置详情",
                "template": "detail.html",
                "schema": {
                    type: "object",
                    properties: {}
                },
                "form": [

                ],
                "operations": [],
                "resolves": []
            }
        }

    });