# 快速开始
 AdonisJs 提供强大的 WebSocket Provider 来提供实时应用程序。

服务器在纯 WebSocket 连接上工作(由所有主流浏览器支持)，并在 Node.js 进程集群中自然扩展。

## 建立
由于默认情况下未安装 WebSocket Provider ，请运行 npm 安装：
```bash
adonis install @adonisjs/websocket
```
安装提供程序会将以下文件添加到项目中：

- config/socket.js 包含 WebSocket 服务器配置。

- start/socket.js 引导 WebSocket 服务器并注册通道。

- start/wsKernel.js 注册中间件以在通道订阅上执行。

接下来，在 start/app.js 文件中注册提供程序：
```javascript
const providers = [
  '@adonisjs/websocket/providers/WsProvider'
]
```
最后，指示器 Ignitor 在根 server.js 文件中引导 WebSocket 服务器：
```javascript
const { Ignitor } = require('@adonisjs/ignitor')

new Ignitor(require('@adonisjs/fold'))
   .appRoot(__dirname)
   .wsServer() // boot the WebSocket server
   .fireHttpServer()
   .catch(console.error)
  ```
### 集群支持
运行 [Node.js 集群](https://nodejs.org/api/cluster.html)时，主节点需要连接工作节点之间的发布/订阅通信。

为此，请将以下代码添加到根 server.js 文件的顶部：
```javascript
const cluster = require('cluster')

if (cluster.isMaster) {
  for (let i=0; i < 4; i ++) {
    cluster.fork()
  }
  require('@adonisjs/websocket/clusterPubSub')()
  return
}
```
## 基本例子
让我们构建一个用于用户消息传递的单聊天服务器。

为了简单起见，我们不会存储用户消息，只是提供它们。

打开 start/socket.js 文件并粘贴以下代码：
```javascript
const Ws = use('Ws')

Ws.channel('chat', 'ChatController')
```
> 我们也可以将闭包绑定到 Ws.channel 方法，但建议使用专用控制器。
接下来，ChatController 使用以下 make:controller 命令创建：
```javascript
adonis make:controller Chat --type=ws
```
```bash
# 输出
create  app/Controllers/Ws/ChatController.js
```
```javascript
'use strict'

class ChatController {
  constructor ({ socket, request }) {
    this.socket = socket
    this.request = request
  }
}

module.exports = ChatController
```
### 客户端代码
让我们从服务器切换到客户端并订阅该 chat 频道。

首先，将 CSS 和 HTML 模板从此要点复制到以下位置：

- CSS → public/style.css

- HTML 模板 → resources/views/chat.edge

> 确保定义提供 HTML 模板的路由。
接下来，创建一个 public/chat.js 文件并粘贴下面的代码以将客户端连接到服务器(为了简单起见，我们使用 jQuery )：
```javascript
let ws = null

$(function () {
  // Only connect when username is available
  if (window.username) {
    startChat()
  }
})

function startChat () {
  ws = adonis.Ws().connect()

  ws.on('open', () => {
    $('.connection-status').addClass('connected')
    subscribeToChannel()
  })

  ws.on('error', () => {
    $('.connection-status').removeClass('connected')
  })
}
```
然后，添加通道订阅方法，绑定侦听器来处理消息：
```javascript
// ...

function subscribeToChannel () {
  const chat = ws.subscribe('chat')

  chat.on('error', () => {
    $('.connection-status').removeClass('connected')
  })

  chat.on('message', (message) => {
    $('.messages').append(`
      <div class="message"><h3> ${message.username} </h3> <p> ${message.body} </p> </div>
    `)
  })
}
```
最后，添加事件处理程序以在 Enter 释放密钥时发送消息：
```javascript
// ...

$('#message').keyup(function (e) {
  if (e.which === 13) {
    e.preventDefault()

    const message = $(this).val()
    $(this).val('')

    ws.getSubscription('chat').emit('message', {
      username: window.username,
      body: message
    })
    return
  }
})
```
### 服务器代码
现在完成了客户端，让我们切换回服务器。

将 onMessage 事件方法添加到 ChatController 文件中：
```javascript
class ChatController {
  constructor ({ socket, request }) {
    this.socket = socket
    this.request = request
  }

  onMessage (message) {
    this.socket.broadcastToAll('message', message)
  }
}
```
在上面的示例中，onMessage 方法通过套接字 broadcastToAll 方法向所有连接的客户端发送相同的消息。

## 控制器
控制器通过为每个通道定义单独的类来保持代码的有序性。

WebSocket 控制器存储在 app/Controllers/Ws 目录中。

每个订阅创建一个新的控制器实例，并将一个 context 对象传递给它的构造函数，从而使 socket 实例能够解压缩，如下所示：
```javascript
class ChatController {
  constructor ({ socket }) {
    this.socket = socket
  }
}
```
事件方法
通过创建具有相同名称的控制器方法绑定到 WebSocket 事件：
```javascript
class ChatController {
  onMessage () {
    // same as: socket.on('message')
  }

  onClose () {
    // same as: socket.on('close')
  }

  onError () {
    // same as: socket.on('error')
  }
}
```
> 事件方法必须以 on 关键字为前缀。
