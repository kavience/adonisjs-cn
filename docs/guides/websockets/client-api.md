# 客户端接口
本指南介绍用于连接 WebSocket 服务器的 JavaScript WebSocket 客户端。

## 安装
#### NPM
由于默认情况下未安装 WebSocket 客户端，npm 运行以下命令安装：
```bash
npm i @adonisjs/websocket-client
```
安装后，使用 Webpack，Rollup 等捆绑包。
然后，像这样导入 WebSocket 客户端：
```javascript
import Ws from '@adonisjs/websocket-client'
const ws = Ws('ws://localhost:3333')
```
#### UNPKG
或者，直接从 unpkg 中获取 UMD 包：
```javascript
<script src="https://unpkg.com/@adonisjs/websocket-client"></script>
<script>
  const ws = adonis.Ws('ws://localhost:3333')
</script>
```
## 填充工具
模块构建需要 regenerator-runtime polyfill (通过 Babel 添加)。

## 生产建设
由于开发版本包含许多日志语句，我们建议 NODE_ENV 通过 [Webpack DefinePlugin](https://webpack.js.org/plugins/define-plugin/) 或 [rollup-plugin-replace](https://github.com/rollup/rollup-plugin-replace) 进行定义。

## 入门
通过客户端连接到 WebSocket 服务器，如下所示：
```javascript
const ws = Ws(url, options)

// connect to the server
ws.connect()
```
> 如果忽略了完整的 WS://URL 值， URL 参数将回落到当前主机名。
#### 选项
键|默认值|描述
-|-|-
path|adonis-ws|用于建立连接的路径(仅在服务器上更改时才更改)。
reconnection|true|断开连接后是否自动重新连接。
reconnectionAttempts|10|放弃前的重新连接尝试次数。
reconnectionDelay|1000|在重新连接之前要等多久。该值将被用作 n x delay，其中 n 是重新连接尝试的当前值。
query|null|查询字符串传递给连接 URL (也接受一个对象)。
encoder|JsonEncoder|要使用的编码器(服务器上将需要相同的编码器)。

要管理你的应用程序状态，请侦听 open 和 close 事件：
```javascript
let isConnected = false

ws.on('open', () => {
  isConnected = true
})

ws.on('close', () => {
  isConnected = false
})
```
连接后，订阅不同或者多个主题：
```javascript
const chat = ws.subscribe('chat')

chat.on('ready', () => {
  chat.emit('message', 'hello')
})

chat.on('error', (error) => {
  console.log(error)
})

chat.on('close', () => {
})
```
## 订阅API
以下方法用于发送/接收消息。

#### emit(event, data)
将事件发送到服务器：
```javascript
chat.emit('message', {
  body: 'hello',
  user: 'virk'
})
```
#### on(event, callback)
绑定事件监听器：
```javascript
chat.on('message', () => {})
chat.on('new:user', () => {})
```
#### off(event, callback)
删除事件侦听器：
```javascript
const messageHandler = function () {}

chat.on('message', messageHandler)
chat.off('message', messageHandler)
```
#### close()
发起关闭订阅的请求：
```javascript
chat.on('close', () => {
  // server acknowledged close
})

chat.close()
```
> 监听关闭事件以确认订阅已关闭。
#### leaveError
服务器拒绝关闭订阅时发出：
```javascript
chat.on('leaveError', (response) => {
  console.log(response)
})
```
#### error
在 TCP 连接上发生错误时发出：
```javascript
chat.on('error', (event) => {
})
```
最好是听取 ws.on('error') 事件。
#### close
订阅结束时发出：
```javascript
chat.on('close', () => {
})
```
## Ws API
单个 ws 连接上提供以下方法。

#### connect
启动连接：
```javascript
ws.connect()
```
#### close
强行关闭连接：
```javascript
ws.close()
```
> 删除所有订阅，但不会触发重新连接。
#### getSubscription(topic)
返回给定主题的订阅实例：
```javascript
ws.subscribe('chat')

ws.getSubscription('chat').on('message', () => {
})
```
> 如果没有对给定主题的订阅，则返回null。
#### subscribe(topic)
订阅主题：

const chat = ws.subscribe('chat')
> 两次订阅同一主题会引发异常。
## 认证
 AdonisJs  WebSocket 客户端使得对用户进行身份验证变得简单。

Auth 凭证在初始连接期间仅传递一次到服务器，因此可以重复使用相同的信息来允许/禁止频道订阅。

> 如果你的应用程序使用会话，则会自动对用户进行身份验证，前提是他们具有有效会话
#### withBasicAuth(username, password)
通过基本身份验证进行身份验证
```javascript
const ws = Ws(url, options)

ws
  .withBasicAuth(username, password)
  .connect()
```
#### withApiToken(token)
通过 api 令牌进行身份验证：
```javascript
const ws = Ws(url, options)

ws
  .withApiToken(token)
  .connect()
```
#### withJwtToken(token)
通过 JWT 令牌进行身份验证：
```javascript
const ws = Ws(url, options)

ws
  .withJwtToken(token)
  .connect()
```
### 用户信息
在服务器上，通过auth对象访问用户信息：
```javascript
Ws.channel('chat', ({ auth }) => {
  console.log(auth.user)
})
```
必须设置必需的中间件才能访问该auth对象。
### 中间件
要验证连接，请确保 auth 应用指定的中间件：
```javascript
Ws.channel('chat', ({ auth }) => {
  console.log(auth.user)
}).middleware(['auth'])
```