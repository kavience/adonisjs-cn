# 服务提供者
到目前为止，我们学习了如何将依赖项绑定到 IoC 容器。

在本指南中，我们将进一步了解服务提供者以及如何分发与 AdonisJs 生态系统良好协作的软件包。

## 介绍

我们知道该 ioc.bind 方法可用于注册绑定。但是，我们还没有定义在何处调用此方法。

这是服务提供者发挥作用的地方，服务提供者是具有生命周期方法的纯 ES6 类，用于注册和引导绑定。

例如：

```JavaScript
const { ServiceProvider } = require('@adonisjs/fold')

class MyProvider extends ServiceProvider {
  register () {
    // register bindings
  }

  boot () {
    // optionally do some initial setup
  }
}

module.exports = MyProvider
```
1. **register** 方法用于注册绑定，你不应该在此方法中使用任何其他绑定。

2. **boot** 方法会在 provider 注册时调用，该方法也是是使用现有绑定来引导应用程序状态的正确位置。

例如，添加全局视图：
```JavaScript
boot () {
  const View = this.app.use('Adonis/Src/View')
  View.global('time', () = new Date().getTime())
}
```
## npm包作为服务提供者

让我们看看我们如何在服务提供者中包装现有的 npm 包。

> 不要像 lodash 在 servive 提供程序中那样打包，因为它可以直接使用，且不需要任何设置过程。
providers 都位于应用程序根目录中：
### 目录结构
```
├── app
└── providers
  └── Queue
    └── index.js
    └── Provider.js
└── start
```
### 原则
例如我们将 [bee-queue](https://github.com/bee-queue/bee-queue) 包装为服务提供者。

以下是我们要遵循的一系列原则：

1. 使用者不应该担心服务提供者的配置队列程序。

2. 所有配置都应该存在于 **config/queue.js** 文件中。

3. 它应该足够简单，以创建具有不同配置的新队列。

### 实现
让我们在 **providers/Queue/index.js** 文件中实现包装器：
```JavaScript
'use strict'

const BeeQueue = require('bee-queue')

class Queue {
  constructor (Config) {
    this.Config = Config
    this._queuesPool = {}
  }

  get (name) {
    /**
     * If there is an instance of queue already, then return it
     */
    if (this._queuesPool[name]) {
      return this._queuesPool[name]
    }

    /**
     * Read configuration using Config
     * provider
     */
    const config = this.Config.get(`queue.${name}`)

    /**
     * Create a new queue instance and save it's
     * reference
     */
    this._queuesPool[name] = new BeeQueue(name, config)

    /**
     * Return the instance back
     */
    return this._queuesPool[name]
  }
}

module.exports = Queue
```
上面的类只有一个调用的方法get，它返回给定队列名的队列实例。

该 get 方法执行的步骤是：

1. 查找给定队列名称的实例。

2. 如果实例不存在，请使用Config Provider读取配置。

3. 创建一个新bee-queue实例并存储在对象中以供将来使用。

4. 最后，返回实例。

Queue 类是纯粹的，因为它不依赖于框架，而是依赖注入来提供配置程序。

### 服务提供者
现在让我们创建一个服务提供者来执行此类的实例化并将其绑定到 IoC 容器。

代码存在于 providers/Queue/Provider.js ：

```JavaScript
const { ServiceProvider } = require('@adonisjs/fold')

class QueueProvider extends ServiceProvider {
  register () {
    this.app.singleton('Bee/Queue', () ={
      const Config = this.app.use('Adonis/Src/Config')
      return new (require('.'))(Config)
    })
  }
}

module.exports = QueueProvider
```
注意，**this.app** 是 ioc 对象的引用，这意味着我们不能直接调用 **ioc.singleton** ，而是调用 **this.app.singleton** 。

最后，我们需要像 **start/app.js** 文件中的其他提供者一样注册此提供程序：
```JavaScript
const providers = [
  path.join(__dirname, '..', 'providers', 'Queue/Provider')
]
```
现在，我们可以调用 **use('Bee/Queue')** 应用程序中的任何文件来使用它：
```JavaScript
const Queue = use('Bee/Queue')

Queue
  .get('addition')
  .createJob({ x: 2, y: 3 })
  .save()
```
## 作为一个包分发
我们创建的 Bee/Queue 服务提供者在同一个项目结构中。但是，我们可以将其提取到自己的包中。

让我们创建一个具有以下目录结构的新目录：
```
└── providers
    └── QueueProvider.js
├── src
  └── Queue
    └── index.js
└── package.json
```
我们所做的只是将实际的 Queue 实现移动到 src 目录并将提供程序文件重命名为 QueueProvider.js 。

此外，我们还必须进行以下更改：

1. 由于 Queue/index.js 位于不同的目录中，我们需要在服务提供者内部调整对此文件的引用。

2. 将命名 Bee/Queue 空间重命名为更合适的命名空间，该命名空间具有较少的冲突机会。例如，在为 AdonisJs 创建此提供者时，我们将其命名为 Adonis/Addons/Queue 。
```JavaScript
const { ServiceProvider } = require('@adonisjs/fold')

class QueueProvider extends ServiceProvider {
  register () {
    this.app.singleton('Adonis/Addons/Queue', () ={
      const Config = this.app.use('Adonis/Src/Config')
      return new (require('../src/Queue'))(Config)
    })
  }
}

module.exports = QueueProvider
```
> 不要包含 @adonisjs/fold 作为提供者的依赖项，因为这应该由主应用程序安装。对于测试，你可以将其安装为 dev 依赖项。
### 撰写提供者测试
AdonisJs 官方使用 [japa](https://github.com/thetutlage/japa) 提供程序测试，但你可以使用任何你想要的测试引擎。

设置 japa 很简单：
```
npm i --save-dev japa
```
在 test 目录中创建测试：
```
mkdir test
```
可以使用以下 node 命令运行测试文件来执行测试：
```
node test/example.spec.js
```
要一起运行所有测试，你可以使用 japa-cli ：
```
npm i --save-dev japa-cli
```
并运行所有测试：
```
./node_modules/.bin/japa
```

## 常见问题解答

常见问题解答
1. 为什么不安装 **@adonisjs/fold** 为依赖？

这一要求使得 @adonisjs/fold 的主要应用程序版本总是安装在你的提供者使用。这样的话每个提供者最终都将提供自己版本的 AdonisJS IoC 容器。如果你曾经使用过 gulp ，他们还[建议(p:14)](https://github.com/gulpjs/gulp/blob/master/docs/writing-a-plugin/guidelines.md)在创建插件时不要将 gulp 作为依赖项安装。
