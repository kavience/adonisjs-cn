# Fake
通常，你在编写测试时想要伪造应用程序某些部分的原始实现。由于 AdonisJs 利用 IoC 容器来管理依赖项，因此在编写测试时创建  fake 非常容易

## 自我实现的 fake 
让我们从伪造服务的基本示例开始，该服务向给定用户发送电子邮件。

> 在测试中创建太多 fake 可能会导致错误测试，其中所有测试都是语法而不是实现。 在编写测试时，始终确保将伪造作为最后一个选项。
```javascript
class UserRegistration {

  async sendVerificationEmail (user) {
    await Mail.send('emails.verify', user, (message) => {
      message.to(user.email)
      message.subject('Verify account')
    })
  }
}
```
现在假设 UserController 使用此服务，在测试用户注册时，会将一堆虚假电子邮件发送到某个电子邮件地址。

为了避免这种行为，模拟 UserRegistration 服务是有意义的。
```javascript
const { ioc } = use('@adonisjs/fold')
const { test } = use('Test/Suite')('User registration')

test('register user', async () => {
  ioc.fake('App/Services/UserRegistration', () => {
    return {
      sendVerificationEmail () {}
    }
  })

  // code to test user registration
  // ....

  ioc.restore('App/Services/UserRegistration')
})
```
ioc.fake 方法允许你将值绑定到 IoC 容器，并且当应用程序的任何部分尝试解析命名空间时，伪值将返回实际值。

以同样的方式，我们需要调用 ioc.restore 来删除 fake 。

这种方法适用于大多数用例，直到你可以创建类似于实际实现的伪造。为了获得更好的控制，你可以使用像 sinonjs 这样的外部库。

## 模拟邮件
AdonisJs 邮件提供商附带一个 fake ，可以在编写测试时使用。
```javascript
const Mail = use('Mail')
const { test } = use('Test/Suite')('User registration')

test('register user', async ({ assert }) => {
  Mail.fake()

  // write your test

  const recentEmail = Mail.pullRecent()
  assert.equal(recentEmail.message.to[0].address, 'joe@example.com')
  assert.equal(recentEmail.message.to[0].name, 'Joe')

  Mail.restore()
})
```
调用 Mail.fake 方法将伪造绑定到 IoC 容器。从这一点来看，所有电子邮件都作为对象数组存储在内存中，以后可以用于运行断言。

以下是模拟邮件的可用方法列表。

#### recent()
返回最近的电子邮件对象
```
Mail.recent()
```
#### pullRecent()
返回最近的电子邮件对象，并将其从内存数组中删除。
```javascript
Mail.pullRecent()
```
#### all()
返回所有电子邮件
```javascript
assert.lengthof(Mail.all(), 1)
```
#### clear()
清除内存中的电子邮件数组
```javascript
Mail.clear()
```
#### restore()
恢复原始的电子邮件类
```javascript
Mail.restore()
```
## 模拟事件
就像 Mail 提供者医药， Event 提供者还带有一个内置的 faker 对象，用于将事件存储在内存数组中，并在以后用于断言。
```javascript
const Event = use('Event')
const { test } = use('Test/Suite')('User registration')

test('register user', async ({ assert }) => {
  Event.fake()

  // write your test
  ....

  const recentEvent = Event.pullRecent()
  assert.equal(recentEvent.event, 'register:user')

  Event.restore()
})
```
或者，你可以 trap 在回调中内联并运行断言事件。
```javascript
test('register user', async ({ assert }) => {
  assert.plan(2)
  Event.fake()

  Event.trap('register:user', function (data) {
    assert.equal(data.username, 'joe')
    assert.equal(data.email, 'joe@example.com')
  })

  // write your test
  ....

  Event.restore()
})
```
以下是所有可用方法的列表

#### recent()
返回最近的事件对象
```javascript
Event.recent()
```
#### pullRecent()
返回最近的事件对象，并将其从内存数组中删除。
```javascript
Event.pullRecent()
```
#### all()
返回所有事件
```javascript
Event.all()
```
#### clear()
清除内存中的事件数组
```javascript
Event.clear()
```
#### restore()
恢复原始事件类
```javascript
Event.restore()
```
## 数据库事务
为每次测试保持数据库清洁的努力是非常困难的。你可能最终会使用生命周期挂钩，以 truncate 每次测试后的表。

为了简化这个过程，AdonisJs 附带了一个数据库事务特征，它将所有数据库查询包装在事务中，并在每次测试后回滚。
```javascript
const { test, trait } = use('Test/Suite')('User registration')

trait('DatabaseTransactions')
```

