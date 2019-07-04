# 测试模拟器
自我实现的假货
邮件假
事件假
数据库事务
通常，您在编写测试时想要伪造应用程序某些部分的原始实现。由于AdonisJs利用IoC容器来管理依赖项，因此fake在编写测试时创建实现变得非常容易

自我实现的假货
让我们从伪造服务的基本示例开始，该服务向给定用户发送电子邮件。

在测试中创建太多假货可能会导致错误测试，其中所有测试都是语法而不是实现。 在编写测试时，
始终确保将伪造作为最后一个选项。
应用程序/服务/放在userRegistration
class UserRegistration {

  async sendVerificationEmail (user) {
    await Mail.send('emails.verify', user, (message) => {
      message.to(user.email)
      message.subject('Verify account')
    })
  }
}
现在假设UserController使用此服务，在测试用户注册时，会将一堆虚假电子邮件发送到某个电子邮件地址。

为了避免这种行为，假冒UserRegistration服务是有意义的。

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
该ioc.fake方法允许您将值绑定到IoC容器，并且当应用程序的任何部分尝试解析命名空间时，伪值将返回实际值。

以同样的方式，我们需要打电话ioc.restore来删除假货。

这种方法适用于大多数用例，直到您可以创建类似于实际实现的伪造。为了获得更好的控制，您可以使用像sinonjs这样的外部库。

邮件假
AdonisJs邮件提供商附带一个假的，可以在编写测试时使用。

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
调用Mail.fake方法将伪造绑定到IoC容器。从这一点来看，所有电子邮件都作为对象数组存储在内存中，以后可以用于运行断言。

以下是假邮件的可用方法列表。

最近（）
返回最近的电子邮件对象

Mail.recent()
pullRecent（）
返回最近的电子邮件对象，并将其从内存数组中删除。

Mail.pullRecent()
所有（）
返回所有电子邮件

assert.lengthof(Mail.all(), 1)
明确（）
清除内存中的电子邮件数组

Mail.clear()
恢复（）
恢复原始的电子邮件类

Mail.restore()
事件假
就像Mail提供Event者一样，提供者还带有一个内置的faker对象，用于将事件存储在内存数组中，并在以后用于断言。

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
或者，您可以trap在回调中内联并运行断言事件。

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
以下是所有可用方法的列表

最近（）
返回最近的事件对象

Event.recent()
pullRecent（）
返回最近的事件对象，并将其从内存数组中删除。

Event.pullRecent()
所有（）
返回所有事件

Event.all()
明确（）
清除内存中的事件数组

Event.clear()
恢复（）
恢复原始事件类

Event.restore()
数据库事务
为每次测试保持数据库清洁的努力是非常困难的。你可能最终会使用生命周期挂钩，以truncate每次测试后的表。

为了简化这个过程，AdonisJs附带了一个数据库事务特征，它将所有数据库查询包装在事务中，并在每次测试后回滚。

const { test, trait } = use('Test/Suite')('User registration')

trait('DatabaseTransactions')
这就是全部😊

