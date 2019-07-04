# 继承内核
在哪里写代码
添加宏/ Getters
扩展提供商
AdonisJs完全可以扩展到核心。

在本指南中，我们将学习如何扩展框架的一部分。

在哪里写代码
最简单的入门方法是使用应用程序挂钩，如果要将代码作为包共享，以后只能在提供程序中移动代码。

钩子存在于start/hooks.js文件内部，可用于在应用程序生命周期中的特定时间执行代码：

启动/ hooks.js
const { hooks } = require('@adonisjs/ignitor')

hooks.after.providersRegistered(() => {
  // execute your code
})
钩子回调是同步的。您必须创建一个提供程序并使用该boot方法编写异步代码。
提供者providers位于项目根目录中：

├── providers
  ├── AppProvider.js
您的提供商必须在start/app.js文件中注册：

启动/ app.js
const path = require('path')

const providers = [
  path.join(__dirname, '..', 'providers/AppProvider')
]
提供程序通常用于通过将名称空间绑定到IoC容器来为应用程序添加功能，但是您也可以使用提供程序在引导时运行自定义代码：

const { ServiceProvider } = require('@adonisjs/fold')

class AppProvider extends ServiceProvider {
  async boot () {
    // execute code
  }
}
添加宏/ Getters
宏可以让您向现有类添加方法。

类必须扩展Macroable类以通过宏进行扩展。

使用钩子或提供者的boot方法来添加宏。
例如，如果宏定义如下：

const Response = use('Adonis/Src/Response')
const Request = use('Adonis/Src/Request')

Response.macro('sendStatus', function (status) {
  this.status(status).send(status)
})
然后可以使用如下：

Route.get('/', ({ response }) => {
  response.sendStatus(200)
})
以同样的方式，您还可以添加getters到您的宏类：

Request.getter('time', function () {
  return new Date().getTime()
})

// Or add a singleton getter
Request.getter('id', function () {
  return uuid.v4()
}, true)
下面是您可以将getters / macros添加到的类列表：

阿多尼斯/ src目录/ HttpContext的

阿多尼斯/ src目录/请求

阿多尼斯/ src目录/响应

阿多尼斯/ src目录/路由

扩展提供商
某些现有提供程序允许您通过添加新功能来扩展它们。

例如，会话提供程序允许添加新驱动程序，而Auth Provider允许新的序列化程序和方案。

请参阅各个提供商的文档以了解其扩展功能。
要使扩展接口统一且简单，请使用该Ioc.extend方法添加新驱动程序或序列化程序：

const { ioc } = require('@adonisjs/fold')
const { hooks } = require('@adonisjs/ignitor')

hooks.after.providersRegistered(() => {
  ioc.extend('Adonis/Src/Session', 'mongo', function () {
    return class MongoDriver {
    }
  })
})
如果您正在开发提供程序并希望使用相同的接口来公开扩展功能，请确保Manager按如下方式绑定对象：

const { ServiceProvider } = require('@adonisjs/fold')

class MyProvider extends ServiceProvider {
  register () {
    this.app.manager('MyApp/Provider', {
      extend: function () {
      }
    })
  }
}
manager对象必须有一个extend方法。传递给的值ioc.extend将转发给此方法。

在namespace必须相同绑定的命名空间。

您必须管理驱动程序的注册/生命周期。

