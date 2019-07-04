# 邮箱
建立
基本例子
邮件API
消息API
切换连接
驱动程序
AdonisJs拥有发送电子邮件的一流支持。

该邮件提供支持多个驱动程序，其中包括：

Smtp（smtp）

Spark Post（sparkpost）

Mailgun（mailgun）

亚马逊SES（ses）

建立
由于默认情况下未安装邮件提供程序，我们需要从npm以下位置提取：

> adonis install @adonisjs/mail
接下来，在start/app.js文件中注册提供程序：

启动/ app.js
const providers = [
  '@adonisjs/mail/providers/MailProvider'
]
邮件配置保存在config/mail.js文件中，该文件adonis install在安装邮件提供程序时由命令创建。
基本例子
让我们从用户注册发送电子邮件的基本示例开始：

启动/ routes.js
Route.post('user', 'UserController.store')
应用程序/控制器/ HTTP / UserController.js
const Mail = use('Mail')

class UserController {

  async store ({ request }) {
    const data = request.only(['email', 'username', 'password'])
    const user = await User.create(data)

    await Mail.send('emails.welcome', user.toJSON(), (message) => {
      message
        .to(user.email)
        .from('<from-email>')
        .subject('Welcome to yardstick')
    })

    return 'Registered successfully'
  }
}

module.exports = UserController
最后，创建emails/welcome.edge包含HTML正文的视图文件：

资源/视图/电子邮件/ welcome.edge
<h2> Hello {{ username }} </h2>
<p>
  Welcome to the yardstick club, here's your getting started guide
</p>
邮件API
以下是可用于发送电子邮件的方法列表。

发送（视图，数据，回调）
使用一个或多个Edge视图发送电子邮件：

await Mail.send('view', data, (message) => {
  message
    .from('')
    .to('')
})
所述views参数可以是每个内容类型视图的单一视图或数组：

await Mail.send(['welcome', 'welcome.text'])
在上面的示例中，welcome视图用于电子邮件的HTML版本，而welcome.text视图用于纯文本版本。

如果您使用Edge作为模板引擎，则还可以使用‑text而不是.text纯文本正文模板后缀。
使用模板后缀，您还可以为Apple watch设置邮件正文：

await Mail.send(['welcome', 'welcome.text', 'welcome.watch'])
原始（身体，回调）
使用原始字符串发送邮件（当字符串为HTML时，将设置电子邮件HTML正文，否则只会发送纯文本电子邮件）：

await Mail.raw('plain text email', (message) => {
  message.from('foo@bar.com')
  message.to('baz@bar.com')
})

await Mail.raw('<h1> HTML email </h1>', (message) => {
  message.from('foo@bar.com')
  message.to('baz@bar.com')
})
消息API
下面是可以使用fluent messageAPI 构建邮件消息的方法列表。

到（地址，[姓名]）
设置to地址：

message.to(user.email)

// with email and name both
message.to(user.email, user.name)
来自（地址，[姓名]）
设置from地址：

message.from('team@yardstick.io')

// with email and name both
message.from('team@yardstick.io', 'Yardstick')
cc（地址，[姓名]）
将cc地址添加到电子邮件中：

message.cc(user.email)

// with email and name both
message.cc(user.email, user.name)
密送（地址，[姓名]）
将密送地址添加到电子邮件中：

message.bcc(user.email)

// with email and name both
message.bcc(user.email, user.name)
您可以多次调用上述方法来定义多个地址。
replyTo（地址，[姓名]）
设置replyTo邮箱地址：

message.replyTo('noreply@yardstick.io')
inReplyTo（MESSAGEID）
设置电子邮件ID：

message.inReplyTo(someThread.id)
受试者（值）
设置电子邮件主题

message.subject('Welcome to yardstick')
文本（值）
手动设置电子邮件的纯文本正文：

message.text('Email plain text version')
附加（filePath，[options]）
将文件附加到电子邮件：

message
  .attach(Helpers.tmpPath('guides/getting-started.pdf'))
设置自定义文件名：

message
  .attach(Helpers.tmpPath('guides/getting-started.pdf'), {
    filename: 'Getting-Started.pdf'
  })
attachData（data，filename，[options]）
将原始数据附加为String，Buffer或Stream：

message.attachData('hello', 'hello.txt')

// buffer
message.attachData(new Buffer('hello'), 'hello.txt')

// stream
message.attachData(fs.createReadStream('hello.txt'), 'hello.txt')
嵌入（filePath，cid，[options]）
使用内容ID将图像嵌入HTML正文：

message.embed(Helpers.publicPath('logo.png'), 'logo')
然后在模板中，您可以说：

<img src="cid:logo" />
确保cid给定电子邮件中的每个图像都是唯一的。
driverExtras（演员）
将值对象传递给当前驱动程序：

message.driverExtras({ campaign_id: 20 })
该邮件提供通过向驾驶员传递的对象，它是由驾驶员消耗这些值。

切换连接
该邮件提供定义内的多个连接config/mail.js文件：

配置/在mail.js
{
  connection: 'smtp',

  smtp: {},

  sparkpost: {
    driver: 'sparkpost',
    apiKey: Env.get('SPARKPOST_API_KEY'),
    extras: {}
  }
}
使用上面的配置，您可以sparkpost通过以下connection方法切换到连接：

await Mail
  .connection('sparkpost')
  .send('view', data, (message) => {
  })
驱动程序
以下是与每个特定驱动程序相关的配置说明。

SES
该ses驱动程序需要AWS-SDK包。

确保npm在使用ses驱动程序之前安装它：

> npm i aws-sdk
SparkPost
所述sparkpost驾驶员接受可选extras配置对象：

配置/在mail.js
{
  extras: {
    campaign_id: '',
    options: {}
  }
}
查看SparkPost的文档以了解有关其可用选项的更多信息。

您还可以extras使用以下driverExtras方法在运行时传递：

await Mail.send('view', data, (message) => {
  message.driverExtras({
    campaign_id: '',
    options: {}
  })
})
Mailgun
所述mailgun驾驶员接受可选extras配置对象：

配置/在mail.js
{
  extras: {
    'o:tag': '',
    'o:campaign': ''
  }
}
查看Mailgun的文档，了解有关其可用选项的更多信息。

您还可以extras使用以下driverExtras方法在运行时传递：

await Mail.send('view', data, (message) => {
  message.driverExtras({
    'o:tag': '',
    'o:campaign': ''
  })
})
