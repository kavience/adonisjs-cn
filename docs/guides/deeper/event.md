# 事件
活动
活动概述
基本例子
API
AdonisJs附带专门的活动提供商。

在内部，它使用EventEmitter2包，并在其上添加了其他方便的功能。

该事件提供了一个假的实现，可编写测试时使用的断言。

活动概述
事件侦听器在start/events.js文件中定义。

事件侦听器可以定义为闭包，或者您可以绑定IoC容器命名空间：

Event.on('new::user', async (user) => {
})

// OR
Event.on('new::user', 'User.registered')
Namespaced事件侦听器存储在app/Listeners目录中。

将侦听器绑定到事件时，不需要输入整个命名空间。例如，存储为的侦听器app/Listeners/User.js被引用为User.<method>。

该make:listener命令可用于创建新的事件侦听器：

> adonis make:listener User
产量
✔ create  app/Listeners/User.js
基本例子
假设我们想在每次用户在我们的网站上注册时发出一个事件，并且在事件监听器内部，向注册用户发送一封电子邮件。

首先，我们需要创建相关的路由和控制器：

启动/ routes.js
Route.post('register', 'UserController.register')
应用程序/控制器/ HTTP / UserController.js
const Event = use('Event')

class UserController {
  register () {
    // register the user

    Event.fire('new::user', user)
  }
}
接下来，我们需要一个监听器，new::user以便我们发送电子邮件。

为此，请events.js在start目录中创建一个文件：

# Mac / Linux
> touch start/events.js

# Windows
> type NUL > start/events.js
最后，在start/events.js文件中编写我们的事件处理代码：

const Event = use('Event')
const Mail = use('Mail')

Event.on('new::user', async (user) => {
  await Mail.send('new.user', user, (message) => {
    message.to(user.email)
    message.from('from@email')
  })
})
如您所见，AdonisJs可以await在事件侦听器回调中轻松使用关键字。

API
以下是可用于与事件提供程序交互的方法列表。

on（事件，听众）
为给定事件绑定单个或多个侦听器。的listener可以是一个闭合功能或参照一个（或多个）IoC容器绑定：

Event.on('new::user', async () => {

})

// IoC container binding
Event.on('new::user', 'User.registered')

// Array of listeners
Event.on('new::user', ['Mailer.sendEmail', 'SalesForce.trackLead'])
什么时候（事件，听众）
该when方法使on方法别名。

一次（事件，听众）
与on相同，但只调用一次：

Event.once('new::user', () => {
  console.log('executed once')
})
onAny（听众）
绑定任何事件的监听器：

Event.onAny(function () {

})

// Ioc container binding
Event.onAny('EventsLogger.track')
倍（数字）
该times方法与on或when应限制侦听器应被触发的次数：

Event
  .times(3)
  .on('new::user', () => {
    console.log('fired 3 times')
  })
发射（事件，数据）
使用可选数据发出事件：

Event.emit('new::user', user)
火灾（事件，数据）
该fire方法使emit方法别名。

removeListener（event，listener）
删除给定事件的侦听器：

Event.on('new::user', 'User.registered')

// later remove it
Event.removeListener('new::user', 'User.registered')
您必须绑定IoC容器引用以便稍后将其删除。
关（事件，听众）
该off方法为removeListener方法添加别名。

removeAllListeners（事件）
删除给定事件的所有侦听器：

Event.removeAllListeners()
listenersCount（事件）
返回给定事件的侦听器数量：

Event.listenersCount('new::user')
getListeners（事件）
返回给定事件的侦听器数组：

Event.getListeners('new::user')
hasListeners（事件）
返回一个boolean指示是否有给定事件的侦听器：

Event.hasListeners('new::user')
