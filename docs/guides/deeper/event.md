# 事件
AdonisJs 附带专门的活动提供商。

在内部，它使用 [EventEmitter2](https://github.com/asyncly/EventEmitter2) 包，并在其上添加了其他方便的功能。

该事件提供了一个假的实现，可编写测试时使用的断言。

## 活动概述
事件侦听器在 start/events.js 文件中定义。

事件侦听器可以定义为闭包，或者你可以绑定 IoC 容器命名空间：
```javascript
Event.on('new::user', async (user) => {
})

// OR
Event.on('new::user', 'User.registered')
```
 Namespaced 事件侦听器存储在 app/Listeners 目录中。

将侦听器绑定到事件时，不需要输入整个命名空间。例如，存储为的侦听器 app/Listeners/User.js 被引用为 User.<method> 。

make:listener 命令可用于创建新的事件侦听器：
```bash
> adonis make:listener User
```
```bash
# 输出
✔ create  app/Listeners/User.js
```
## 基本例子
假设我们想在每次用户在我们的网站上注册时发出一个事件，并且在事件监听器内部，向注册用户发送一封电子邮件。

首先，我们需要创建相关的路由和控制器：
```javascript
Route.post('register', 'UserController.register')
```
```javascript
const Event = use('Event')

class UserController {
  register () {
    // register the user

    Event.fire('new::user', user)
  }
}
```
接下来，我们需要一个监听器， new::user 以便我们发送电子邮件。

为此，请 events.js 在 start 目录中创建一个文件：
```bash
# Mac / Linux
> touch start/events.js

# Windows
> type NUL > start/events.js
```
最后，在 start/events.js 文件中编写我们的事件处理代码：
```javascript
const Event = use('Event')
const Mail = use('Mail')

Event.on('new::user', async (user) => {
  await Mail.send('new.user', user, (message) => {
    message.to(user.email)
    message.from('from@email')
  })
})
```
如你所见， AdonisJs 可以在事件侦听器回调中轻松使用 await 关键字。

## API
以下是可用于与事件提供程序交互的方法列表。

#### on(event, listener)
为给定事件绑定单个或多个侦听器。 listener 可以是一个闭合功能或参照一个(或多个) IoC 容器绑定：
```javascript
Event.on('new::user', async () => {

})

// IoC container binding
Event.on('new::user', 'User.registered')

// Array of listeners
Event.on('new::user', ['Mailer.sendEmail', 'SalesForce.trackLead'])
```
#### when(event, listener)
when 方法使 on 方法别名。

#### once(event, listener)
与on相同，但只调用一次：
```javascript
Event.once('new::user', () => {
  console.log('executed once')
})
```
#### onAny(listener)
绑定任何事件的监听器：
```javascript
Event.onAny(function () {

})

// Ioc container binding
Event.onAny('EventsLogger.track')
```
#### times(number)
times 方法与 on 或 when 应限制侦听器应被触发的次数：
```javascript
Event
  .times(3)
  .on('new::user', () => {
    console.log('fired 3 times')
  })
  ```
#### emit(event, data)
使用可选数据发出事件：
```javascript
Event.emit('new::user', user)
```
#### fire(event, data)
fire 方法使 emit 方法别名。

#### removeListener(event, listener)
删除给定事件的侦听器：

Event.on('new::user', 'User.registered')

// later remove it
Event.removeListener('new::user', 'User.registered')
> 你必须绑定IoC容器引用以便稍后将其删除。
#### off(event, listener)
off 方法为 removeListener 方法添加别名。

#### removeAllListeners(event)
删除给定事件的所有侦听器：
```javascript
Event.removeAllListeners()
```
#### listenersCount(event)
返回给定事件的侦听器数量：
```javascript
Event.listenersCount('new::user')
```
#### getListeners(event)
返回给定事件的侦听器数组：
```javascript
Event.getListeners('new::user')
```
#### hasListeners(event)
返回一个boolean指示是否有给定事件的侦听器：
```javascript
Event.hasListeners('new::user')
```