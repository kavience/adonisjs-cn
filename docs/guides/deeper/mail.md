# 邮箱
AdonisJs 拥有发送电子邮件的一流支持。

该邮件提供支持多个驱动程序，其中包括：

- Smtp ( smtp )

- Spark Post ( sparkpost )

- Mailgun ( mailgun )

- 亚马逊 SES ( ses )

## 建立
由于默认情况下未安装邮件提供程序，我们需要从 npm 位置提取：
```bash
> adonis install @adonisjs/mail
```
接下来，在 start/app.js 文件中注册提供程序：
```javascript
const providers = [
  '@adonisjs/mail/providers/MailProvider'
]
```
邮件配置保存在 config/mail.js 文件中，该文件 adonis install 在安装邮件提供程序时由命令创建。
## 基本例子
让我们从用户注册发送电子邮件的基本示例开始：
```javascript
Route.post('user', 'UserController.store')
```
```javascript
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
```
最后，创建 emails/welcome.edge 包含 HTML 正文的视图文件：
```html
<h2> Hello {{ username }} </h2>
<p>
  Welcome to the yardstick club, here's your getting started guide
</p>
```
## 邮件API
以下是可用于发送电子邮件的方法列表。

#### send(views, data, callback)
使用一个或多个 Edge 视图发送电子邮件：
```javascript
await Mail.send('view', data, (message) => {
  message
    .from('')
    .to('')
})
````
所述 views 参数可以是每个内容类型视图的单一视图或数组：
```javascript
await Mail.send(['welcome', 'welcome.text'])
```
在上面的示例中， welcome 视图用于电子邮件的 HTML 版本，而 welcome.text 视图用于纯文本版本。

> 如果你使用 Edge 作为模板引擎，则还可以使用 ‑text 而不是 .text 纯文本正文模板后缀。
使用模板后缀，你还可以为 Apple watch 设置邮件正文：
```javascript
await Mail.send(['welcome', 'welcome.text', 'welcome.watch'])
```
#### raw(body, callback)
使用原始字符串发送邮件(当字符串为 HTML 时，将设置电子邮件 HTML 正文，否则只会发送纯文本电子邮件)：
```javascript
await Mail.raw('plain text email', (message) => {
  message.from('foo@bar.com')
  message.to('baz@bar.com')
})

await Mail.raw('<h1> HTML email </h1>', (message) => {
  message.from('foo@bar.com')
  message.to('baz@bar.com')
})
```
## 消息API
下面是可以使用 fluent messageAPI 构建邮件消息的方法列表。

#### to(address, [name])
设置 to 地址：
```javascript
message.to(user.email)

// with email and name both
message.to(user.email, user.name)
```
#### from(address, [name])
设置 from 地址：
```javascript
message.from('team@yardstick.io')

// with email and name both
message.from('team@yardstick.io', 'Yardstick')
```
#### cc(address, [name])
将 cc 地址添加到电子邮件中：
```javascript
message.cc(user.email)

// with email and name both
message.cc(user.email, user.name)
```
#### bcc(address, [name])
将密送地址添加到电子邮件中：
```javascript
message.bcc(user.email)

// with email and name both
message.bcc(user.email, user.name)
```
> 你可以多次调用上述方法来定义多个地址。
#### replyTo(address, [name])
设置 replyTo 邮箱地址：
```javascript
message.replyTo('noreply@yardstick.io')
```
#### inReplyTo(messageId)
设置电子邮件 ID ：
```javascript
message.inReplyTo(someThread.id)
```
#### subject(value)
设置电子邮件主题
```javascript
message.subject('Welcome to yardstick')
```
#### text(value)
手动设置电子邮件的纯文本正文：
```javascript
message.text('Email plain text version')
```
#### attach(filePath, [options])
将文件附加到电子邮件：
```javascript
message
  .attach(Helpers.tmpPath('guides/getting-started.pdf'))
```
设置自定义文件名：
```javascript
message
  .attach(Helpers.tmpPath('guides/getting-started.pdf'), {
    filename: 'Getting-Started.pdf'
  })
```
#### attachData(data，filename，[options])
将原始数据附加为 String ， Buffer 或 Stream：
```javascript
message.attachData('hello', 'hello.txt')

// buffer
message.attachData(new Buffer('hello'), 'hello.txt')

// stream
message.attachData(fs.createReadStream('hello.txt'), 'hello.txt')
```
#### embed(filePath, cid, [options])

使用内容ID将图像嵌入 HTML 正文：
```javascript
message.embed(Helpers.publicPath('logo.png'), 'logo')
```
然后在模板中，你可以说：
```javascript
<img src="cid:logo" />
```
> 确保 cid 给定电子邮件中的每个图像都是唯一的。
#### driverExtras(extras)
将值对象传递给当前驱动程序：
```javascript
message.driverExtras({ campaign_id: 20 })
```
该邮件提供通过向 driver 传递的对象，它是由 driver 消耗这些值。

## 切换连接
该邮件提供定义内的多个连接 config/mail.js 文件：
```javascript
{
  connection: 'smtp',

  smtp: {},

  sparkpost: {
    driver: 'sparkpost',
    apiKey: Env.get('SPARKPOST_API_KEY'),
    extras: {}
  }
}
```
使用上面的配置，你可以sparkpost通过以下connection方法切换到连接：
```javascript
await Mail
  .connection('sparkpost')
  .send('view', data, (message) => {
  })
```
## 驱动程序
以下是与每个特定驱动程序相关的配置说明。

#### SES
ses 驱动程序需要 [AWS-SDK](https://npmjs.org/package/aws-sdk) 包。

确保在使用 ses 驱动程序之前安装它：
```bash
> npm i aws-sdk
```
#### SparkPost
sparkpost driver 接受可选 extras 配置对象：
```javascript
{
  extras: {
    campaign_id: '',
    options: {}
  }
}
```
查看 SparkPost 的文档以了解有关其可用选项的更多信息。

你还可以 extras 使用以下 driverExtras 方法在运行时传递：
```javascript
await Mail.send('view', data, (message) => {
  message.driverExtras({
    campaign_id: '',
    options: {}
  })
})
```
#### Mailgun
所述 mailgun driver 接受可选 extras 配置对象：
```javascript
{
  extras: {
    'o:tag': '',
    'o:campaign': ''
  }
}
```
查看 [Mailgun](https://mailgun-documentation.readthedocs.io/en/latest/api-sending.html#sending) 的文档，了解有关其可用选项的更多信息。

你还可以使用以下 driverExtras 方法在运行时传递 extras ：
```javascript
await Mail.send('view', data, (message) => {
  message.driverExtras({
    'o:tag': '',
    'o:campaign': ''
  })
})
```