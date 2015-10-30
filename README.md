# YES Base

YES base 是一套可以配置的管理系统前端开发框架

#### 技术构架

YES base 基于 Angularjs 技术

> 主要技术使用
> 
> 1. angularjs
> 2. jquery
> 3. requirejs
> 4. less css
> 5. bootstrap
> 6. gulp



#### 项目示例

http://www.yosell.com/dist

登录用户名： admin 密码 admin

#### 结构目录

``` 
├── Base
│   ├── css
│   │   ├── main.css
│   │   ├── vendor.css
│   ├── scripts
│   │   ├── require.js
│   │   ├── yes.app.js
│   │   ├── yes.app.min.js
│   └── vendor
│       ├── ace
│       ├── angular-schema-form
│       ├── angular-ui-grid
│       ├── ie8
│       ├── jquery
│       ├── tinymce
│       └── select2
├── data
└── plugins
    ├─── start.js
    ├─── base
    │   ├── assets
    │   ├── controllers
    │   ├── directives
    │   ├── i18n
    │   ├── pages
    │   ├── services
    │   ├── templates
    │   ├── app.js
    │   └── config.js
    └─── demo
        ├── ...
        └── config.js
```

#### 项目开始

#### 安装

``` 
bower install yes-base
```

#### 入口页面

dist/index.html

#### 配置设置

``` 
var settings = {
    version: "0.2.0",
    host: 'self',
    mock: true,
    menuRoot: null,
    debug: true,
    menuApi: 'base/menus',
    apiPath: "api",
    serverRoot: 'src',
    pluginFolder: 'plugins',
    language: language,
    templates: {
        'layout': 'plugins/base/templates/layout.html',
        'login': 'plugins/base/templates/login.html',
        'dashboard': 'plugins/base/templates/dashboard.html',
        'list': 'plugins/base/templates/list.uigrid.html',
        'detail': 'plugins/base/templates/detail.html',
        'searchCommon': 'plugins/base/templates/search-common.html',
        'dialog': 'plugins/base/templates/dialog-container.html',
        'import': 'plugins/base/templates/import.html',
        'uploader': 'plugins/base/templates/uploader-container.html'
    },
    headers: {'Content-Type': 'application/json'},
    pageSize: {
        defaults: 20,
        more: 10
    },
    getByAttIdUrl: "/base/attachment/getByAttId",
    uploadUrl: "/base/attachment/upload",
    getUuid: "/base/attachment/getUuid",
    delByUid: "/base/attachment/"
};
```

#### 路由设置

``` 
settings.routers = {
    'app': {
        url: '',
        templateUrl: settings.templates.layout,
        abstract: true,
        controller: 'app.layout',
        dependencies: [
            'base/controllers/layout'
        ]
    },
    'login': {
        url: '/login',
        templateUrl: settings.templates.login,
        controller: "app.login",
        dependencies: [
            'base/controllers/login'
        ]
    },
    'app.dashboard': {
        url: '/dashboard',
        views: {
            "content": {
                templateUrl: function () {
                    return settings.templates.dashboard;
                },
                controller: "app.dashboard"
            }
        },
        dependencies: [
            'base/controllers/dashboard'
        ]
    },
    'app.list': {
        url: '/:name/:page',
        views: {
            "content": {
                templateUrl: function () {
                    return settings.templates.list;
                },
                controller: "app.wrap.list"
            }
        },
        dependencies: [
            '{$name}/config',
            'base/controllers/list.wrap'
        ]
    },
    'app.pages': {
        url: '/:name/:page/:action',
        views: {
            "content": {
                templateUrl: function () {
                    return settings.templates.custom;
                }
            }
        },
        dependencies: [
            '{$name}/config',
            '{$name}/pages/{$action}'
        ]
    }
};
```

#### 页面结构

``` 
├── login
├── layout
│    ├── dashboard
│    ├── list
│    │   └── detail
│    ├── custom
│    │   └── detail
```

#### 继承式的配置

``` 
{
  	defaults:{....}
    examples:{....}
} //examples 可以继承defaults的一些设置内容
```

#### 配置节点 config.js

``` 
{
  title: "产品配置",  //节点标题
  operation: {...},  //操作
  list: {...}, //列表的配置
  form: {...}  //详情的配置
}
```

#### 操作节点

``` 
 {
 	add: true,
 	del: true
 }  
 //搜索、重置为默认开启的按钮; 新建、删除为配置开启的按钮。

```

#### 自定义操作按钮 operation

``` 
 { 	
 	custom:{
  		name:"自定义",
        action:function(){ ... } //可以注入参数
	}
 }
```

#### 列表页面的配置 list

``` 
{
   mock: false, //mock开启的时候如果没有后台数据，让列头也能正常显示
   headers:{...}, //表格头的定义
   filters:{...}, //查询条件的定义
   resolves:[] //扩展脚本定义
}
```

#### 表格头部列的定义 headers

``` 
gender: {
  displayName: '性别',
  headerCellFilter:'translate',
  cellFilter: "translatePrefix:'gender'",
  visible:true,
  min-width:40px,
  width: 60,
  htmlClass:"abc",
  cellTemplate:'' //列的显示模版
}
```

#### 检索条件定义 filters

``` 
{
    type: "select",
    name: "type$match",
    label: "账号类型",
    titleMap: [{name: '管理员', value: 'admin'}, {name: '普通用户', value: 'user'}]
},
//可选的类型 'input','select','datepicker','dateTimePicker','dateRangePicker','department','...'
```

#### 可扩展的脚本控制 resolves

``` 
resolves: function (utils, oPath, $timeout) {
  var context = this;
  var titleMap = oPath.find(context, ['list', 'filters', '[name:type$match]', 'titleMap'], []);
  $timeout(function () {
  titleMap.push({name: '示例脚本', value: '----'});
  }, 3000);
}//可以注入各种 services 如：utils,oPath 以及所有angular 内置的 service. 如: $http, $timeout ...
```

#### 详情页的配置 form

``` 
{
  fullScreen:true, //页面是否全屏
  schema:{...},
  form:{}
}
```

#### 表单数据结构的定义 schema

``` 
{
  type: "object",
  properties:[...]
} 
```

``` 
{
  key: "mobile",
  title: "手机",
  pattern: "^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$",
  type: "string",
  required:true
}
```

#### 表单定义 form

``` 
{
    type: "group",  //表单元素分组
    title: "基本信息",
    items: [{
        key: 'uid',
        title: '编号',
        placeholder: "编号"  //可以增加自定义的其他属性如： readonly, htmlclass,partten,...
    },
        {
            key: 'username',
            placeholder: '请输入用户名',
            title: '用户名'
        }, 
        ....]
},
....
```

#### 常用的 form 表单控件

| 名称                  | 备注            |
| ------------------- | ------------- |
| group               | 分组            |
| default             | 默认类型（不需要设置类型） |
| checkbox，checkboxes | 复选框           |
| radios              | 单选框           |
| select              | 下拉框（单值）       |
| select2             | 下拉框（对象）       |
| list                | 列表对象          |
| textarea            | 文本区域          |
| editor              | 文本编辑器         |
| uploader            | 文件上传          |
| gallery             | 图片上传          |
| datepicker          | 日期选择          |
| dateTimePicker      | 时间选择          |
| dateRangePicker     | 日期范围选择        |
| label               | 文本显示          |

#### 常用service介绍

###### utils

1. utils.async
2. utils.events
3. utils.serialize

###### settings

settings  直接注入取得

###### oPath

1. oPath.find
2. oPath.get

#### 常用第三方模块介绍

###### ocLazyLoad  https://github.com/ocombe/ocLazyLoad

###### angular-schema-form https://github.com/Textalk/angular-schema-form

###### ngDialog https://github.com/likeastore/ngDialog

#### 多语言 translate

#####  