# 登录/注册

请求报文

|接口地址|/user/get|
|--|--|
|访问方式|POST|

```json
{
  "openid": string(微信登陆openid),
  "avatarUrl": string(头像图片地址),
  "nickName": string(昵称)
}
```

返回报文

```json
{
  "avatar": string(头像图片地址),
  "nickname": string(昵称),
  "id": number(用户id),
  "role": "user" | "admin" | "cameraman"
}
```

# 修改头像

请求报文

|接口地址|/user/change/avatar|
|--|--|
|访问方式|POST|

```json
{
  "id": number(用户id),
  "avatarUrl": string(头像图片地址)
}
```

返回报文

```json
{
  "success": boolean,
  "message": string(结果)
}
```

# 修改昵称

请求报文

|接口地址|/user/change/nickName|
|--|--|
|访问方式|POST|

```json
{
  "id": number(用户id),
  "nickName": string(昵称)
}
```

返回报文

```json
{
  "success": boolean,
  "message": string(结果)
}
```

# 通过摄像师id查询摄像师有多少预约

请求报文

|接口地址|/appointments/Cameraman/has|
|--|--|
|访问方式|POST|

```json
{
  "id": string(摄像师id)
}
```

返回报文

```json
[
{
  id: number(用户id),
  cn: string(用户名),
  session: string(漫展名字),
  time: string(场次时间),
  status: string(申请状态)
},
...
]
```

# 摄像师修改预约的状态

请求报文

|接口地址|/appointments/Cameraman/change|
|--|--|
|访问方式|POST|

```json
{
  "id": string(预约id),
  "status": string(状态)
}
```

返回报文

```json
{
  "success": boolean,
  "message": string(结果)
}
```

# 摄像师创建一个预约

请求报文

|接口地址|/appointments/appointments/create|
|--|--|
|访问方式|POST|

```json
{
  "sessionId": string(场次id),
  "exhibitionId": string(漫展id),
  "cameramanId": string(摄像师id),
  "time": string(时间)
}
```

返回报文

```json
{
  "success": boolean,
  "message": string(结果)
}
```

# 通过userid查询某人的所有预约

请求报文

|接口地址|/appointments/user/has|
|--|--|
|访问方式|POST|

```json
{
  "id": number(用户id)
}
```

返回报文

```json
[
{
  "session": string(漫展名称),
  "description": string(预约详情),
  "url": string(预约图片),
  "id": string(预约id),
  "exhibitionId": string(漫展id),
  "status": string(预约状态)
},
....
]
```

# 用户提交预约

请求报文

|接口地址|/appointments/appointments/submit|
|--|--|
|访问方式|POST|

```json
{
  "id": number(用户id),
  "appointmentId": string(预约id)
}
```

返回报文

```json
{
  "success": boolean,
  "message": string(结果)
}
```


# 查看漫展对应的摄像师

请求报文

|接口地址|/appointments/exhibition/get|
|--|--|
|访问方式|POST|

```json
{
  "id": string(漫展id)
}
```

返回报文

```json
[
{
  "id": string(摄像师id),
  "name": string(摄像师名字),
  "description": string(摄像师描述),
  "url": string(摄像师图片)
},
....
]
```

# 通过摄像师id查询摄像师信息

请求报文

|接口地址|/appointments/Cameraman/info|
|--|--|
|访问方式|POST|

```json
{
  "id": string(摄像师id)
}
```

返回报文

```json
{
    "url": string(摄像师id),
    "description": string(摄像师文字描述),
    "device": string(摄像师的设备),
    "imageUrls": [string(摄像师图片描述1)]
}
```

# 查询某摄像师的时间

请求报文

|接口地址|/appointments/appointments/times|
|--|--|
|访问方式|POST|

```json
{
  "eid": string(漫展id),
  "cid": string(摄像师id),
  
}
```

返回报文

```json
[
{
  "session": string(场次的时间),
  "time": [string(预约的时间列表)]
}
]
```

# 根据uid获取自身的订单

请求报文

|接口地址|/orders/list|
|--|--|
|访问方式|POST|

```json
{
  "id": number(用户id),
  "take": number(输出结果),
  "skip": number(跳过几个),
  
}
```

返回报文

```json
{ 
  "maxCount": number(总结过数), 
  "data": [
    {
      "id": string(订单id),
      "sessionImage": string(订单图片),
      "title": string(订单标题),
      "location": string(位置),
      "status": string(状态),
      "price": number(价格)
    },
    ....
  ]
}
```

# 根据订单id获取订单详情

请求报文

|接口地址|/orders/item|
|--|--|
|访问方式|POST|

```json
{
  "id": string(订单id)
}
```

返回报文

```json
{
  "id": string(订单id),
  "image":string(订单图片),
  "title": string(订单标题),
  "location": string(位置),
  "status": string(状态),
  "price": number(价格),
  "QRcode": string(二维码图片地址)
}
```

# 根据订单id退款

请求报文

|接口地址|/orders/refund|
|--|--|
|访问方式|POST|

```json
{
  "id": string(订单id)
}
```

返回报文

```json
{
  "success": boolean,
  "message": string(结果)
}
```

# 验票

请求报文

|接口地址|/orders/qr/verification|
|--|--|
|访问方式|POST|

```json
{
  "id": string(订单id),
  "code": string(二维码内容)
}
```

返回报文

```json
{
  "success": boolean,
  "message": string(结果)
}
```

这个结果里面含有有哪些票