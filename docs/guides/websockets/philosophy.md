# 思想
本指南介绍了 WebSocket 服务器的原理。

在本指南结束时，你将了解频道，主题订阅和多路复用。

## 纯净的 WebSockets
 AdonisJs 使用纯净的 [WebSockets](https://developer.mozilla.org/en-US/docs/Glossary/WebSockets) 并且不依赖于轮询。

所有主流浏览器都支持 WebSockets ， AdonisJs 可以更轻松地在 Node.js 集群中水平扩展应用程序，而不需要任何第三方依赖(例如 Redis )，也不需要粘性会话。

## 复用
多路复用在通道之间分离事件和认证层时重用相同的 TCP 连接。

多路复用维护从客户端到服务器的单一连接， AdonisJS 提供了一个干净的抽象层来管理频道订阅和交换你的应用程序消息。

## 频道和主题
客户端建立 WebSocket 连接后，需要订阅主题才能交换消息。

频道和主题是相互关联的，所以让我们编写一些代码来更好地理解它们。

注册一个这样的频道：
```javascript
Ws.channel('chat', ({ socket }) => {
  console.log(socket.topic)
})
```
在上面的示例中，对 chat 通道的所有订阅都有一个称为静态主题 chat (即通道和主题名称相同)。

要使用动态/通配符主题注册频道：
```javascript
Ws.channel('chat:*', ({ socket }) => {
  console.log(socket.topic)
})
```
在上面的例子中， chat 信道接受动态主题，因此用户可以订阅通道 chat:watercooler ， chat:intro ， chat:news 等。

这种动态/通配符方法打开了一个令人兴奋的创造性可能世界(例如，两个用户之间私人聊天的动态主题)。

## 数据编码器
WebSocket 服务器在传递消息时使用数据编码器。

默认情况下，WebSocket 服务器使用 JSON 编码器，该编码器在传递二进制数据时具有限制。

如果需要，AdonisJs [@adonisjs/msgpack-encoder](https://www.npmjs.com/package/@adonisjs/msgpack-encoder) 包可用于处理 ArrayBuffers 和 Blob 。

## 消息包
多路复用需要标准来定义数据包结构。

作为 WebSocket 服务器软件包的使用者，你不必担心数据包类型，但在为服务器编写客户端时，了解它们至关重要。

你的 WebSocket 数据编码器将网络数据解码为对象(或编程语言的等同数据类型)，其中包含类似于以下的结构：
```javascript
{
  t: 7,
  d: {
    topic: 'chat',
    data: 'hello world'
  }
}
```
- 属性 t 是数据包的类型(我们在字符串上使用数字，因为数字要传输的数据较少)。

- 该属性 d 是与该数据包关联的数据。

> 了解有关 AdonisJs  WebSocket 数据包的[更多信息](https://github.com/adonisjs/adonis-websocket-protocol)。
