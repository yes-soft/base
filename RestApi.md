# Restful API 接口规范 - Account 示例

#### Get account

描述：获取一条账号数据 {编号}

###### URL 结构: http://xxx.com/api/base/account/uid={uid}

###### Method: Get

###### HTTP headers :

``` 
Accept: application/json
```

###### Response body :

``` 
{
  "error": 0, // 0 成功；401：未登录；403: 没有权限；5xx:服务端错误
  "message": "成功",
  "body":
  {
  "type": "admin",
  "email": "wushilan@sds.com",
  "displayName": "吴世浪",
  "username": "uname1",
  "mobile": "131998377766",
  "lastLogin": "2015-02-05T05:42:53.290Z",
  "active": false,
  "uid": "54d0dc5bff8f471028ec5942",
  "createdAt": "2013-02-04T04:42:53.290Z",
  "activeCode": "VJZwcKtRee",
  "gender": 0
  }
}
```

 *备注：返回值必须包含  error, message, body 属性；*

#### Get accounts

###### Description: 获取多条账号数据 {可变数字}

###### URL construct:  http://xxx.com/api/base/account?count={10}&start={1}

###### Method: Get

###### HTTP headers:

``` 
Accept: application/json
```

###### Parameters:

``` 
{
  count:20,  //获取记录条数
  start:1,  //分页位置
  mobile$match:'130'   //查询字段参数，查询方式使用$分割查询方法；
                       // match:模糊匹配; eq:精确匹配；lt:小于； lte:小于等于； gt:大于，gte:大于等于； range:范围值使用~分割；in: 在值范围内；
}
```

###### Response body:

``` 
{
  "error": 0,
  "message": "",
  "body": {
    "items": [
      {
        "type": "seller",
        "email": "seller@rqpai.com",
        "displayName": "测试卖家",
        "username": "seller",
        "lastLogin": "2015-05-05T05:42:53.290Z",
        "mobile": "130998877766",
        "active": false,
        "uid": "54d0dc5bff8f471028ec6942",
        "createdAt": "2014-02-04T04:42:53.290Z",
        "activeCode": "4JlPqYYAgx",
        "gender": 0
      }
    ],
    "count": 1,
    "headers": {
      "uid": "用户编号",
      "username": "用户名称",
      "mobile": "手机",
      "email": "邮件地址",
      "password": "密码",
      "lastLogin": "最后登录时间",
      "displayName": "昵称",
      "gender": "性别",
      "roles": "角色",
      "activeCode": "激活码",
      "active": "激活",
      "deleted": "禁用",
      "type": "类型",
      "frozenMoney": "冻结资金",
      "createdAt": "创建日期",
      "about": "介绍",
      "photo": "头像",
      "images": "照片",
      "files": "文件"
    }
  }
}
```

#### Add account

###### Description: 添加一条账号数据

###### URL construct:  http://xxx.com/api/base/account

###### Method: Post

###### HTTP headers:

``` 
Accept: application/json
```

###### Parameters:

###### Request body:

``` 
{
  "type": "seller",
  "email": "seller@rqpai.com",
  "displayName": "测试卖家",
  "username": "seller",
  "lastLogin": "2015-05-05T05:42:53.290Z",
  "mobile": "130998877766",
  "active": false,
  "uid": "54d0dc5bff8f471028ec6942",
  "createdAt": "2014-02-04T04:42:53.290Z",
  "activeCode": "4JlPqYYAgx",
  "gender": 0 
}
```

###### Response body:

``` 
{
  "error":0,
  "message":"",
  "body":{
    "type": "seller",
    "email": "seller@rqpai.com",
    "displayName": "测试卖家",
    "username": "seller",
    "lastLogin": "2015-05-05T05:42:53.290Z",
    "mobile": "130998877766",
    "active": false,
    "createdAt": "2014-02-04T04:42:53.290Z",
    "activeCode": "4JlPqYYAgx",
    "gender": 0 
	}
}
```

#### Update account

###### Description: 编辑一条账号数据

###### URL construct:  http://xxx.com/api/base/account/{uid}

###### Method: Put

###### HTTP headers:

``` 
Accept: application/json
```

###### Parameters:

###### Request body:

``` 
{
  "uid": "54d0dc5bff8f471028ec6942",
  "type": "seller",
  "email": "seller@rqpai.com",
  "displayName": "测试卖家",
  "username": "seller",
  "lastLogin": "2015-05-05T05:42:53.290Z",
  "mobile": "130998877766",
  "active": false,
  "createdAt": "2014-02-04T04:42:53.290Z",
  "activeCode": "4JlPqYYAgx",
  "gender": 0 
}
```

###### Response body:

``` 
{
  "error":0,
  "message":"",
  "body":{
  "uid": "54d0dc5bff8f471028ec6942",
  "type": "seller",
  "email": "seller@rqpai.com",
  "displayName": "测试卖家",
  "username": "seller",
  "lastLogin": "2015-05-05T05:42:53.290Z",
  "mobile": "130998877766",
  "active": false,
  "createdAt": "2014-02-04T04:42:53.290Z",
  "activeCode": "4JlPqYYAgx",
  "gender": 0 
  }
}
```

#### Delete account

###### Description: 删除一条账号数据

###### URL construct:  http://xxx.com/api/base/account/{uid}

###### Method: Delete

###### HTTP headers:

``` 
Accept: application/json
```

###### Response body:

``` 
{
  "error":0,
  "message":""
}
```