# 中间件
中间件挂钩到应用程序的请求生命周期。

它们是按顺序执行的一组函数，允许你转换请求或响应。

例如， AdonisJs 提供了一个 auth 中间件，用于验证应用程序的用户是否经过身份验证。如果用户未经过身份验证，则会抛出异常，并且请求不会到达你的路由处理程序。

## 创建中间件
要创建新的中间件，请使用以下 **make:middleware** 命令：
```bash
 adonis make:middleware CountryDetector
 ```
此命令将在 **app/Middleware** 文件夹中创建一个带有一些基础代码的文件。

在我们的示例 **CountryDetector** 中间件中，我们希望从其IP地址检测用户的国家或者地区：
```javascript
'use strict'

const geoip = require('geoip-lite')

class CountryDetector {
  async handle ({ request }, next) {
    const ip = request.ip()
    request.country = geoip.lookup(ip).country
    await next()
  }
}

module.exports = CountryDetector
```
在此示例中，我们使用库 **geoip-lite** 将用户的国家或者地区添加到 [HTTP Context](https://adonisjs.com/docs/4.1/request-lifecycle#_http_context) 的 **request** 对象。

### 上游和下游中间件
在创建中间件时，你需要确定它是在请求到达路由处理程序之前，还是之后运行。

将代码定义在中间件的 **handle** 方法中的 **await next()** 之前：
```javascript
'use strict'

class UpstreamExample {
  async handle ({ request }, next) {
    // Code...
    await next()
  }
}

module.exports = UpstreamExample
```
要访问 response 下游中间件的对象，你需要从传递的 [HTTP Context](https://adonisjs.com/docs/4.1/request-lifecycle#_http_context) 中解析它：
```javascript
'use strict'

class DownstreamExample {
  async handle ({ response }, next) {
    await next()
    // Code...
  }
}

module.exports = DownstreamExample
```
你的中间件代码也可以在请求到达路由处理程序之前和之后运行：
```javascript
'use strict'

class BeforeAndAfterExample {
  async handle ({ response }, next) {
    // Upstream code...
    await next()
    // Downstream code...
  }
}

module.exports = BeforeAndAfterExample
```
## 注册中间件
所有中间件都在 start/kernel.js 文件中注册。

中间件分为 3 类：服务器中间件，全局中间件和命名中间件。

### 服务器中间件
服务器中间件在请求到达 AdonisJs 路由系统之前执行。这意味着如果请求的路由未注册， AdonisJs 仍将执行此处定义的所有中间件：
```javascript
const serverMiddleware = [
  'Adonis/Middleware/Static',
  'Adonis/Middleware/Cors',
]
```
服务器中间件通常用于提供静态资源或处理 CORS 。

### 全局中间件
在找到请求的路由后执行全局中间件：
```javascript
const globalMiddleware = [
  'Adonis/Middleware/BodyParser',
]
```
全局中间件按照定义的顺序执行，因此当一个中间件需要另一个中间件时必须注意。

### 命名中间件
命名中间件被分配给特定路由或路由组：
```javascript
const namedMiddleware = {
  auth: 'Adonis/Middleware/Auth',
}
```

```javascript
Route.get(url, closure).middleware(['auth'])
```
命名中间件按照针对其分配的路由定义的顺序执行。

## 中间件属性
 AdonisJs 使用 [pipe expression](https://www.npmjs.com/package/haye#pipe-expression) 来定义中间件属性。

例如， auth 中间件可以选择不同的认证方案作为中间件属性：
```javascript
// 使用 session 作为认证方案
Route.post(url, closure).middleware(['auth:session'])

// 使用 jwt 作为认证方案
Route.post(url, closure).middleware(['auth:jwt'])
```
你还可以通过用逗号使用多个方案：
```javascript
Route.post(url, closure).middleware(['auth:session,jwt'])
```
这些属性可用作中间件 handle 方法中的第三个参数：
```javascript
async handle (context, next, properties) {
  //
}
```