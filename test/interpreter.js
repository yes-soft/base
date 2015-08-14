var baseConfig = require('./base.js');
var baseDefault = baseConfig['_default'] || {};
baseDefault.title = baseDefault.title || 'missing base settings';

var checkList = {
    title: function (node, nodeDefault) {   // 每个配置项必须要有标题
        node.title = (node.title || nodeDefault.title) || baseDefault.title;
    },
    list: function () {
        //1. 每个配置项必须要有列表, 2. 列表必须有标题, 3. 必须要有operations, 4.必须要有headers;
    },
    headers: function () {
        //.必须要有headers, 检查属性是否符合格式;
    },
    detail: function () {
        //.必须要有title, 必须有template,必须有form,必须有schema;
    },
    form: function () {
        //.必须要有headers, 检查属性是否符合格式;
    },
    properties: function () {
        //
    },
    schema: function () {
        //必须有type, properties;
    },
    operations: function () {
        //1. name, 2. action;
    },
    template: function () {

    },
    resolves: function () {

    }
};


var interpreter = {
    explain: function (json, name) {
        var nodeDefault = json['_default'];
        var node = ( json[name] || nodeDefault ) || baseDefault;
        checkList.title(node, nodeDefault);
        checkList.list(node, nodeDefault);
        console.log(baseDefault);
        return node;
    }
};

module.exports = interpreter;