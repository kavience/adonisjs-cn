# 启动装置
[Ignitor](https://github.com/adonisjs/adonis-ignitor) 为 AdonisJs 应用程序的启动提供动力。

在本指南中，我们将了解 Ignitor 包提供的一些特性和功能，以管理我们的代码。

## Hooks
Ignitor 公开了许多钩子函数来自定义应用程序的行为。

这些钩子在 **start/hooks.js** 文件中注册。如果该文件尚不存在，请创建该文件。

以下是 **hooks.after** 注册视图全局的示例：
```JavaScript

启动/ hooks.js
const { hooks } = require('@adonisjs/ignitor')

hooks.after.providersBooted(() => {
  const View = use('View')
  View.global('time', () => new Date().getTime())
})
```
与 hooks.after 类似，你还可以在钩子发生之前使用 **hooks.before** 注册应用程序逻辑。

以下是可用的 Hooks 列表：

钩事件|描述
--|--
providersRegistered|所有提供商注册之前/之后
providersBooted|所有提供商启动之前/之后
preloading|在预加载注册文件之前/之后
httpServer|HTTP服务器启动之前/之后
aceCommand|执行ace命令之前/之后

## 预加载文件
Ignitor 可以在 HTTP 服务器启动后轻松预加载文件。

为此，请修改 **server.js** 文件并添加 preLoad 方法：
```JavaScript
new Ignitor(require('@adonisjs/fold'))
  .appRoot(__dirname)
  .preLoad('start/fire-zombies')
  .fireHttpServer()
  .catch(console.error)
```
> 该 preLoad 方法接受相对应用程序根路径或任何 JavaScript 文件的绝对路径。
要加载多个文件，请 preLoad 多次调用该方法：
```JavaScript
new Ignitor(require('@adonisjs/fold'))
  .preLoad('')
  .preLoad('')
  // etc
```
## Ignitor 方法
以下是 ignitor 实例上可用的方法列表。

### approot(路径)
定义应用程序根目录的绝对路径：
```JavaScript
ignitor
  .appRoot(__dirname)
```
### modulesRoot(路径)
定义应用程序 node_modules 父目录的绝对路径。

默认情况下，使用设置的路径 appRoot()：
```JavaScript
ignitor
  .modulesRoot(path.join(__dirname, '..'))
```
### appFile(路径)
定义应用程序文件的相对路径。

默认情况下，使用该 start/app.js 文件：
```JavaScript
ignitor
  .appFile('start/app.js')
```
### loadCommands()
指示 Ignitor 加载 ace 提供程序和命令。

这是在运行 ace 命令时完成的，但是，你也可以在启动 HTTP 服务器时加载命令：

```JavaScript
ignitor
  .loadCommands()
```