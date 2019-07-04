# 国际化
建立
区域存储
访问区域设置
ICU消息语法
格式化值
注册格式
切换区域设置
Switch Loader
Http请求区域设置
Http格式化
查看全球
AdonisJs在formatjs.io标准之上建立了国际化的一流支持。

使用Antl Provider，您可以轻松地将数字，日期和消息转换为多种语言。

建立
由于默认情况下未安装Antl Provider，我们需要从以下位置获取npm：

> adonis install @adonisjs/antl
接下来，我们需要在start/app.js文件中注册提供程序：

启动/ app.js
const providers = [
  '@adonisjs/antl/providers/AntlProvider'
]
你的locales配置对象必须保存在内部config/app.js使用下列选项文件：

选项	值	描述
locale

ISO 639

默认应用程序区域设置（必须是ISO 639代码中可用的区域设置之一）。

loader

database 要么 file

用于加载不同语言翻译的加载程序。

配置/ app.js
module.exports = {
  locales: {
    loader: 'file',
    locale: 'en'
  }
}
区域存储
文件
使用file加载程序时，所有语言环境都存储在resources/locales目录中。

每个语言环境目录应包含一组组翻译文件，如下所示：

└── resources
  └── locales
      ├── en
      │ ├── alerts.json
      │ ├── cart.json
      │ └── store.json
      └── fr
        ├── alerts.json
        ├── cart.json
        └── store.json
在上面的例子中，每个区域设置包含3个假想翻译团：alerts，cart和store。根据应用程序需要为每个区域设置创建任意数量的组文件。
您还可以创建一个名为fallback存储消息的目录，这些消息在找不到当前语言的消息时使用：

└── resources
  └── locales
      ├── en
      │ └── messages.json
      ├── fallback
      │ └── messages.json
      └── fr
        └── messages.json
数据库
使用database加载程序时，将从locales数据库表中提取所有语言环境。

该adonis install命令为locales表创建迁移。
您始终可以在Github上引用最新的迁移源文件。
示例locales数据库表可能如下所示：

ID	现场	组	项目	文本
1

恩

消息

欢迎

你好{name}

2

FR

消息

欢迎

Bonjour {name}

3

恩

大车

总

购物车总数为{total，number，usd}

4

FR

大车

总

Le panier est total {total，number，usd}

您必须为每个项目定义组值locales。
访问区域设置
您可以通过Antl对象访问当前和默认语言环境：

const Antl = use('Antl')

Antl.currentLocale()
Antl.defaultLocale()
ICU消息语法
AdonisJs使用行业标准ICU Message语法来格式化消息。

以下主题定义ICU消息语法的用法。

值
要检索转换值，只需通过其group.item键引用它：

资源/区域设置/ EN / messages.json
{
  "greeting": "Hello"
}
Antl.formatMessage('messages.greeting')
参数
您可以传递动态参数以注入占位符，这些占位符由{ }消息中的花括号定义：

资源/区域设置/ EN / messages.json
{
  "greeting": "Hello {name}"
}
Antl.formatMessage('messages.greeting', { name: 'virk' })
格式化参数
传递给消息的值可以选择按类型格式化。

您必须先注册格式才能使用它们（请参阅注册格式）。
例如，在传递数字时，我们可以将其格式化为currency：

资源/区域设置/ EN / cart.json
{
  "total": "Cart total is {total, number, usd}"
}
对于{total, number, usd}上面消息中的占位符：

total 是传递的价值。

number是值的类型。

usd是该类型值的格式。

由于ICU消息语法不直接理解格式，我们需要在格式化消息时手动传递它们：

const Antl = use('Antl')
const Formats = use('Antl/Formats')

Antl.formatMessage(
  'cart.total',
  { total: 20 },
  [Formats.pass('usd', 'number')]
)
在上面的例子中，我们只是formatMessage用3个参数调用：

cart.total 是要格式化的消息的引用。

{ total: 20 }是传递给该消息的数据。

[Formats.pass('usd', 'number')]是一系列可能的格式。

选择格式
的select格式定义了基于传递的值有条件输出：

{gender, select,
    male {He}
    female {She}
    other {They}
} will respond shortly
在浏览器中尝试编辑上面的消息。
多种格式
该plural格式根据传递的值定义了plurilization选项：

{count, plural,
   =0 {No candy left}
   one {Got # candy left}
   other {Got # candies left}
}
在浏览器中尝试编辑上面的消息。
格式化值
以下是可用于格式化消息或原始值的方法列表。

formatMessage（key，[data]，[formats]）
该formatMessage方法需要key格式化（group.item）：

const Antl = use('Antl')

Antl.formatMessage('messages.greeting')
它还可以接受动态对象data传递给消息：

const Antl = use('Antl')

Antl.formatMessage('response.eta', { gender: 'male' })
最后，它还可以接受一个formats解析传递数据的数组：

const Antl = use('Antl')
const Formats = use('Antl/Formats')

Antl.formatMessage(
  'cart.total',
  { total: 20 },
  [
    Formats.pass('usd', 'number')
  ]
)
formatNumber（value，[options]）
将值格式化为数字（接受此处options定义的NumberFormat ）：

Antl.formatNumber(10)

// as currency
Antl.formatNumber(10, {
  style: 'currency',
  currency: 'usd'
})

// as percentage
Antl.formatNumber(10, {
  style: 'percent'
})
formatAmount（value，currency，[options]）
style设置为货币的格式值：

Antl.formatAmount(100, 'usd')
formatDate（value，[options]）
格式化值作为日期（接受此处options定义的DateTimeFormat ）：

Antl.formatDate(new Date())

// pull weekday for the date
Antl.formatDate(new Date(), {
  weekday: 'long'
})

// pull day only
Antl.formatDate(new Date(), {
  day: '2-digit'
})
formatRelative（value，[options]）
格式化相对于当前日期/时间的日期（接受此处options定义的RelativeFormat ）：

Antl.formatRelative(new Date())

// always in numeric style
Antl.formatRelative(new Date(), {
  style: 'numeric'
})
注册格式
该FORMATMESSAGE方法只接受的预先登记的格式的阵列。

要注册给定类型的格式：

const Formats = use('Antl/Formats')

Formats.add('usd', {
  style: 'currency',
  currency: 'usd'
})
使用方法如下：

Antl.formatMessage(
  'cart.total'
  { total: 20 },
  [
    Formats.pass('usd', 'number')
  ]
)
该Formats.pass方法有两个参数：

第一个参数是要使用的格式。

第二个参数是应该应用格式的类型。

多种类型格式
您可以将多种格式传递给给定类型。例如：

资源/区域设置/ EN / cart.json
{
  "total": "USD total { usdTotal, number, usd } or in GBP { gbpTotal, number, gbp }"
}
接下来，注册usd和gbp格式化。

Formats.add('usd', {
  style: 'currency',
  currency: 'usd'
})

Formats.add('gbp', {
  style: 'currency',
  currency: 'gbp'
})
最后，您可以格式化消息，如下所示：

Antl.formatMessage(
  'cart.total',
  { usdTotal: 20, gbpTotal: 13 },
  [
    Formats.pass('usd', 'number'),
    Formats.pass('gbp', 'number')
  ]
)
产量
USD total $20.00 or in GBP £13.00
切换区域设置
该Antl提供商可以很方便地在运行时的语言环境进行格式化。

为此，请forLocale在之前致电formatMessage：

Antl
  .forLocale('fr')
  .formatMessage('response.eta')
Switch Loader
您可以通过调用loader方法在运行时在加载器之间切换：

const Antl = use('Antl')

// asynchronous
await Antl.bootLoader()

// get antl instance for a booted loader
const AntlDb = Antl.loader('database')

// all methods are available
AntlDb.formatMessage()
始终调用bootLoader之前Antl.loader（你只需要调用bootLoader一次）。
Http请求区域设置
该Antl提供商绑定locale属性设置为HTTP上下文对象：

Route.get('/', ({ locale }) => {
  return `User language is ${locale}`
})
locale属性解析如下：

所述Accept-LanguageHTTP标头或lang查询参数进行检查以检测用户的语言。

用户语言与应用程序配置的可用语言环境列表进行匹配。已配置的区域设置由保存在数据库或文件系统内的给定语言的消息确定。

如果应用程序不支持用户语言，则它将回退到config/app.js文件中定义的默认语言环境。

Http格式化
由于我们可以locale根据标准约定访问用户，因此您可以通过以下方式之一格式化消息。

全球导入
您可以全局导入Antl Provider，并forLocale在格式化值时手动调用该方法：

const Antl = use('Antl')

Route.get('/', ({ locale }) => {
  return Antl
    .forLocale(locale)
    .formatNumber(20, { style: 'currency', currency: 'usd' })
})
上下文实例
您还可以使用antl传递给所有路由处理程序的对象，例如请求和响应：

Route.get('/', ({ antl }) => {
  return antl
    .formatNumber(20, { style: 'currency', currency: 'usd' })
})
例如，您可以切换视图的区域设置，如下所示：

Route.get('/', ({ antl, view }) => {
  antl.switchLocale('fr')
  return view.render('some-view')
}
查看全球
由于antl 上下文实例与所有视图共享，您可以在视图模板中访问其方法，如下所示：

{{ antl.formatNumber(20, currency = 'usd', style = 'currency')  }}
或者，您可以使用@mustache标记写入多行：

@mustache(antl.formatNumber(
  20,
  { currency: 'usd', style: 'currency }
))
无法在模板中切换加载程序。
