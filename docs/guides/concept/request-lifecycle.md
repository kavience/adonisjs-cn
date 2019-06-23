# Request 生命周期
## 介绍
JavaScript 是异步的。对于初学者来说，很难理解它是如何工作的，以及如何处理它对应用程序流的非阻塞方法。

区分为前端编写的 JavaScript 和为后端编写的 JavaScript 也可能令人困惑。它们在语法上是相同的，但是不在相同的 run-time 和 context 中运行。

如果你对 Request 生命周期有一个更高层次的概念，那么你将觉得 AdonisJs 不那么“神奇”，并且你在构建应用程序时会更有信心。

## Request Flow
从客户机发送的 HTTP  Request 由 AdonisJs 服务器模块处理，执行所有**服务器级别的中间件**(例如， StaticFileMiddleware 服务于 public 目录中的静态文件)。

如果 Request 没有被服务器级中间件终止，AdonisJs 路由器就会发挥作用。它试图找到与 Request 的 URL 匹配的路由。如果路由器找不到匹配项，将抛出一个 RouteNotFound 异常。

在找到匹配的路由之后，所有全局中间件都被执行，然后是为匹配路由定义的任何局部中间件。如果没有全局或局部的中间件终止 Request ，则调用匹配的路由处理程序。

你必须终止路由处理程序中的 Request ，一旦终止， AdonisJs 将执行所有下游中间件并将响应发送回客户端。

## HTTP 上下文

AdonisJs 为每个路由处理程序提供一个 HTTP 上下文对象。

该对象包含处理 Request 所需的所有内容，比如 Request 或响应类，可以通过 provider 或 middleware 轻松扩展:
```JavaScript
Route.get('/', ({ request, response, view }) => {
  // request
  // response
  // view
})

```

或者，你可以直接使用它，而不是打开它:
```JavaScript
Route.get('/', (ctx) => {
  // ctx.request
  // ctx.response
  // ctx.view
  // etc
})

```