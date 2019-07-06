# 扩展内核
AdonisJs 完全可以扩展到核心。

在本指南中，我们将学习如何扩展框架的一部分。

## 在哪里写代码
最简单的入门方法是使用应用程序挂钩，如果要将代码作为包共享，以后只能在提供程序中移动代码。

钩子存在于 start/hooks.js 文件内部，可用于在应用程序生命周期中的特定时间执行代码：
```javascript
const { hooks } = require('@adonisjs/ignitor')

hooks.after.providersRegistered(() => {
  // execute your code
})
```
> 钩子回调是同步的。你必须创建一个提供程序并使用 boot 方法编写异步代码。
提供者 providers 位于项目根目录中：
```bash
├── providers
  ├── AppProvider.js
```
你的提供商必须在 start/app.js 文件中注册：
```javascript
const path = require('path')

const providers = [
  path.join(__dirname, '..', 'providers/AppProvider')
]
```
提供程序通常用于通过将名称空间绑定到 IoC 容器来为应用程序添加功能，但是你也可以使用提供程序在引导时运行自定义代码：
```javascript
const { ServiceProvider } = require('@adonisjs/fold')

class AppProvider extends ServiceProvider {
  async boot () {
    // execute code
  }
}
```
## 添加 Macros/Getters
宏可以让你向现有类添加方法。

类必须扩展 Macroable 类以通过宏进行扩展。

> 使用钩子或提供者的 boot 方法来添加宏。
例如，如果宏定义如下：
```javascript
const Response = use('Adonis/Src/Response')
const Request = use('Adonis/Src/Request')

Response.macro('sendStatus', function (status) {
  this.status(status).send(status)
})
```
然后可以使用如下：
```javascript
Route.get('/', ({ response }) => {
  response.sendStatus(200)
})
```
以同样的方式，你还可以添加getters到你的宏类：
```javascript
Request.getter('time', function () {
  return new Date().getTime()
})

// Or add a singleton getter
Request.getter('id', function () {
  return uuid.v4()
}, true)
```
下面是你可以添加到 getters/macros 的类列表：

- Adonis/Src/HttpContext
- Adonis/Src/Request
- Adonis/Src/Response
- Adonis/Src/Route

## 扩展提供者
某些现有提供程序允许你通过添加新功能来扩展它们。

例如，会话提供程序允许添加新驱动程序，而 Auth Provider 允许新的序列化程序和方案。

> 请参阅各个提供商的文档以了解其扩展功能。
要使扩展接口统一且简单，请使用 Ioc.extend 方法添加新驱动程序或序列化程序：
```javascript
const { ioc } = require('@adonisjs/fold')
const { hooks } = require('@adonisjs/ignitor')

hooks.after.providersRegistered(() => {
  ioc.extend('Adonis/Src/Session', 'mongo', function () {
    return class MongoDriver {
    }
  })
})
```
如果你正在开发提供程序并希望使用相同的接口来公开扩展功能，请确保 Manager 按如下方式绑定对象：
```javascript
const { ServiceProvider } = require('@adonisjs/fold')

class MyProvider extends ServiceProvider {
  register () {
    this.app.manager('MyApp/Provider', {
      extend: function () {
      }
    })
  }
}
```
- manager 对象必须有一个 extend 方法。传递给的值 ioc.extend 将转发给此方法。
- namespace 必须一致。
- 你必须管理驱动程序的注册/生命周期。

