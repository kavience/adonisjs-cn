## 关于 AdonisJs
AdonisJs 是一个 Node.js MVC 框架，**可以运行在所有主要的操作系统上(需要支持 nodejs )。** 它通过使用JavaScript语言来编写服务器端，并且提供了一个稳定的生态系统，因此你可以将重点放在业务需求上，而不是最终确定选择哪个包。

AdonisJs 支持开发人员使用一致且富有表现力的 API 来构建全栈 web 应用程序或提供微型的 API 。
> 译者注：AdonisJs 像PHP最流行的框架 laravel 一样，让代码变得更加优雅。
### 立即开始
使用 AdonisJs 没有硬性要求，但是最好对 JavaScript、异步编程和 Node.js 有一定的了解。

此外，如果你是 JavaScript 新手或不熟悉它在 ES6 中的新特性，我建议你看[阮一峰的课程](http://es6.ruanyifeng.com/)。

最后，如果这是你第一次使用 AdonisJs ， 请务必阅读[安装指南](/guides/started/installation.html)。

### 服务提供者
AdonisJs 是一个模块化框架，由多个服务提供者组成，它们是 AdonisJs 应用程序的构建模块。

实际上，它们就像其他 npm 模块一样，在 AdonisJs 应用程序上运行(例如，解析HTTP请求体的 [BodyParser](https://github.com/adonisjs/adonis-bodyparser) ，或者是 SQL ORM 的 [Lucid](/guides/orm/start.html) )。
### FAQ's
以下是一些常见问题，如果你认为列表中缺少一个常见的问题，请在[这里](https://github.com/adonisjs/docs)创建一个 issue 。

1. AdonisJs 与 Express 或 Koa 有什么不同?

Express 和 Koa 是路由库，同时在顶部有一层薄薄的中间件。它们在大多数情况下，能取得非常好的效果(例如服务端渲染)，但是当项目变得庞大时，就会变得很难维护。

由于你的项目有自己的标准和约定，因此雇佣开发人员处理它们可能会变得更加困难。但是 AdonisJs 遵循一套标准化的约定，所以应该更容易雇人来开发现有的 AdonisJs 应用程序。

2. AdonisJs 是单个应用程序吗?

不是。 AdonisJs 框架是多个包的组合，可以优雅地和应用程序的其余部分集成。

该框架提供了一个强大的[依赖注入层](/guides/concept/ioc-container.html)，所有官方和第三方包都可以利用该层提供功能，而无需手动连接应用程序的每个部分。