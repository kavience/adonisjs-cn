# 服务端接口
在本指南中，我们深入了解频道，身份验证和交换实时消息。

## 注册频道
WebSocket 频道已在 start/socket.js 文件中注册：
```javascript
const Ws = use('Ws')

Ws.channel('news', ({ socket }) => {
  console.log('a new subscription for news topic')
})
```
通道处理程序接收一个 context 对象，类似于 HTTP 路由处理程序。

默认情况下，信道 context 对象包含 socket 和 request 属性(通过可选的中间件等更多的附加 Auth，Session 等)。

订阅完成后，使用 socket 实例交换消息：
```javascript
socket.on('message', (data) => {
})

// emit events
socket.emit('message', 'Hello world')
socket.emit('typing', true)
```
### 动态主题
可以注册频道以接受动态主题订阅：
```javascript
Ws.channel('chat:*', ({ socket }) => {
  console.log(socket.topic)
})
```
另外，在上述的例子中，* 设置信道接受任何订阅主题开头 chat:(例如 chat:watercooler ， chat:intro 等)。

动态主题的订阅是通过客户端 API 进行的：
```javascript
const watercooler = ws.subscribe('chat:watercooler')
const intro = ws.subscribe('chat:intro')
const news = ws.subscribe('chat:news')
```
在上面的示例中，我们的不同主题订阅都指向同一个通道，但是当发出主题特定事件时，它们将仅传递给其特定主题订阅者。

## 注册中间件
中间件在 start/wsKernel.js 文件中注册：
```javascript
const globalMiddleware = [
  'Adonis/Middleware/Session',
  'Adonis/Middleware/AuthInit'
]

const namedMiddleware = {
  auth: 'Adonis/Middleware/Auth'
}
```
在 start/socket.js 文件中的每个通道应用命名中间件：
```javascript
Ws
  .channel('chat', 'ChatController')
  .middleware(['auth'])
```
## 创建中间件
WebSocket 中间件需要一种 wsHandle 方法。

你可以通过确保在中间件类上定义 handle (对于 HTTP 请求)和 wsHandle 方法来共享 HTTP 和 WebSocket 中间件：
```javascript
'use strict'

class CustomMiddleware {
  // for HTTP
  async handle (ctx, next) {
  }

  // for WebSocket
  async wsHandle (ctx, next) {
  }
}

module.exports = CustomMiddleware
```
## 随处广播
由于可以从应用程序内的任何位置访问预先注册的 WebSocket 通道，因此 WebSocket 通信不仅限于套接字生命周期。

在 HTTP 生命周期中发出 WebSocket 事件，如下所示：
```javascript
const Ws = use('Ws')

class UserController {
  async register () {
    // ...

    Ws
      .getChannel('subscriptions')
      .topic('subscriptions')
      .broadcast('new:user')
  }
}
```
在上面的例子中，我们：

- 通过 getChannel(name) 方法选择通道

- 通过该topic(name)方法选择频道主题

- 通过broadcast(event)消息向主题订阅者广播

topic() 返回包含以下方法的对象：
```javascript
const chat = Ws.getChannel('chat:*')
const { broadcast, emitTo } = chat.topic('chat:watercooler')

// broadcast: send to everyone (except the caller)
// emitTo: send to selected socket ids
```
> 有关详细信息，请参阅下面的套接字[方法列表](https://adonisjs.com/docs/4.1/websocket-server#_methods)。
## 套接字API
### 事件
以下事件是保留的，不得发出。

#### error
收到错误时调用：
```javascript
socket.on('error', () => {
})
```
#### close
订阅关闭时调用：
```javascript
socket.on('close', () => {
})
```
### 方法
可以在套接字实例上调用以下方法。

#### emit(event, data, [ackCallback])
向连接的客户端发送事件：
```javascript
socket.emit('id', socket.id)
```
> 此方法仅向你自己的连接发送消息。
```javascript
emitTo(event，data，socketIds [])
```
#### emitTo(event, data, socketIds[])
```javascript
socket.emitTo('greeting', 'hello', [someIds])
```
#### broadcast(event, data)
向除自己以外的所有人发送活动：
```javascript
socket.broadcast('message', 'hello everyone!')
```
#### broadcastToAll(event, data)
向包括你自己在内的所有人发送活动
```javascript
socket.broadcastToAll('message', 'hello everyone!')
```
#### close()
从服务器强制关闭订阅：
```javascript
socket.close()
```
### 属性
可以在套接字实例上访问以下只读属性。

#### id
Socket 唯一 id ：
```javascript
socket.id
```
#### topic
创建订阅套接字的主题：
```javascript
socket.topic
```
#### connection
引用 TCP 连接(在单个客户端的多个套接字之间共享以进行多路复用)：
```javascript
socket.connection
```