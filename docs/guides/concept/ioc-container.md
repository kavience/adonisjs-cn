# IoC 容器

## 介绍
在理解控制反转( IoC )容器的使用和好处之前，我们需要回过头来了解大型代码库所面临的依赖关系管理问题。

### 无用的抽象
经常会遇到这样的情况，你必须为库创建无用的抽象来管理其生命周期。

例如，为了确保数据库只连接一次，你可以将所有数据库设置代码移动到它自己的文件中(例如 lib/database.js )，然后在应用程序中导入:
```JavaScript
const knex = require('knex')

const connection = knex({
  client: 'mysql',
  connection: {}
})

module.exports = connection

```
现在，不需要直接使用 knex ，你可以在任何需要的地方使用 lib/database.js 。

这对于单个依赖项来说没有问题，但是随着应用程序的增长，你会发现代码库中有许多这样的文件在增长，这并不理想。
### 依赖关系管理

大型代码库面临的最大问题之一是依赖关系的管理。

由于依赖项彼此不了解，开发人员必须以某种方式将它们连接在一起。

让我们以存储在 redis 数据库中的会话为例:
```JavaScript
class Session {
  constructor (redis) {
    // needs Redis instance
  }
}

class Redis {
  constructor (config) {
    // needs Config instance
  }
}

class Config {
  constructor (configDirectory) {
    // needs config directory path
  }
}

```
可以看到，会话类依赖于 Redis 类， Redis 类依赖于配置类，等等。

当使用会话类时，我们必须正确地构建它的依赖关系:
```JavaScript
const config = new Config(configDirectory)
const redis = new Redis(config)
const session = new Session(redis)

```
由于依赖项列表可能会根据项目的需求而增加，你可以很快想象这个顺序实例化过程将如何开始失控!

这就是 IoC 容器发挥作用的地方，它负责为你解决依赖关系。
### 痛苦的测试

当不使用 IoC 容器时，你必须想出不同的方法来模拟依赖关系，或者依赖于像 sinonjs 这样的库。

使用 IoC 容器时，创建 fakes 很简单，因为所有依赖项都是从 IoC 容器解析的，而不是直接从文件系统解析的。

## 绑定依赖关系
假设我们想要 Redis 在 IoC 容器中绑定库，确保它知道如何编写自己。

> IoC 容器其实没什么，控制模块之间的依赖关系是一个相当简单的想法，但是开辟了一个全新的世界。
第一步是创建 Redis 类，并将所有依赖项定义为构造参数：
```JavaScript
class Redis {
  constructor (Config) {
    const redisConfig = Config.get('redis')
    // connect to redis server
  }
}

module.exports = Redis
```
请注意， Config 是构造函数依赖项，而不是 require 语句。

接下来，让我们将 Redis 类绑定到 IoC 容器 My/Redis ：
```JavaScript
const { ioc } = require('@adonisjs/fold')
const Redis = require('./Redis')

ioc.bind('My/Redis', function (app) {
  const Config = app.use('Adonis/Src/Config')
  return new Redis(Config)
})
```
然后我们可以像这样使用 My/Redis 绑定：
```JavaScript
const redis = ioc.use('My/Redis')
```
1. 该 ioc.bind 方法有两个参数：

    - 绑定的名称（例如 My/Redis ）

    - 每次访问绑定时都会执行一个工厂函数，返回绑定的最终值

2. 由于我们使用的是 IoC 容器，因此我们会提取任何现有的绑定（例如 Config ）并将其传递给 Redis 类。

3. 最后，我们返回一个新的实例Redis，已配置并可供使用。

### 单例模式
我们刚刚创建的绑定 **My/Redis** 存在一个这样的问题：

每次我们从 IoC 容器中获取它时，它返回一个新 Redis 实例，然后都会创建一个新的 Redis 服务器连接。

为了解决这个问题，IoC 容器允许你使用单例模式：
```JavaScript
ioc.singleton('My/Redis', function (app) {
  const Config = app.use('Adonis/Src/Config')
  return new Redis(Config)
})
```
相比于 ioc.bind ，ioc.singleton 会缓存它的第一个返回值，当再次使用 My/Redis 的时候，仍将返回上一个 Redis 实例。

## 解决依赖关系
只需调用 ioc.use 方法并为其指定命名空间即可：
```JavaScript
const redis = ioc.use('My/Redis')
```
也可以使用 use 全局方法：
```JavaScript
const redis = use('My/Redis')
```
从 IoC 容器解析依赖关系时执行的步骤是：

1. 寻找已注册的 Fake 。

2. 接下来，找到实际的绑定。

3. 查找别名，如果找到，重复该绑定过程。

4. 解析为自动加载路径。

5. 回退到 Node.js 原生的 require 方法。

### 别名
由于 IoC 容器绑定必须是唯一的，我们使用以下模式来绑定名称： **Project/Scope/Module** 。

以 **Adonis/Src/Config** 为例：

- Adonis 是项目名称（也可能是你公司的名称）

- Src 是 Scope ，因为这个绑定是核心的一部分（对于自己的包，我们使用 **Addon** 关键字）

- Config 是实际的模块名称

由于有时很难记住并输入完整的命名空间，因此 IoC 容器允许你为它们定义别名。

别名是在 start/app.js 文件 aliases 对象中定义的。

> AdonisJs 预设了一些别名，如 Route ，View ，Model 等。但是，你可以覆盖它们，如下所示。
```JavaScript
aliases: {
  MyRoute: 'Adonis/Src/Route'
}
```
```JavaScript
const Route = use('MyRoute')
```
### 自动加载
你还可以定义一个由 IoC 容器自动加载的目录，而不仅仅是将依赖项绑定到 IoC 容器。

不用担心，它不会从目录中加载所有文件，而是将目录路径视为依赖项解析过程的一部分。

例如，AdonisJs 的 app 的目录定义为 App 命名空间，这意味着你可以 require app 目录中的所有文件而不需要写路径。

例如：
```JavaScript
class FooService {
}

module.exports = FooService
```
可以被导入
```JavaScript
const Foo = use('App/Services/Foo')
```
如果没有自动加载，就不得不像这样导入它：
 **require('../../Services/Foo')** 。

因此，将自动加载视为一种更可读，更一致的方式来处理文件。

## FAQ's
1. 是否必须绑定 IoC 容器内的所有内容？

不需要。当你想要将 library/module 的设置抽象为它自己的东西时，才应该使用IoC容器绑定。此外，当你想要分发依赖关系并希望它们与 AdonisJs 生态系统一起时，请考虑使用[服务提供者](/guides/concept/service-provider.html)。

2. 如何模拟绑定？

因为 AdonisJs 允许你实现 fakes ，所以不需要模拟绑定。了解更多关于[fakes](/guides/testing/fakes.html)。

3. 如何将npm模块包装为服务提供者？

[服务提供者](/guides/concept/service-provider.html)是完整的指南。

