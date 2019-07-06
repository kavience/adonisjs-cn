# 国际化
AdonisJs 在 formatjs.io 标准之上建立了国际化的一流支持。

使用 Antl Provider ，你可以轻松地将数字，日期和消息转换为多种语言。

## 建立
由于默认情况下未安装 Antl Provider ，运行以下命令安装：
```bash
> adonis install @adonisjs/antl
```
接下来，我们需要在 start/app.js 文件中注册提供程序：
```javascript
const providers = [
  '@adonisjs/antl/providers/AntlProvider'
]
```
你的 locales 配置对象必须保存在内部 config/app.js 使用下列选项文件：

选项|值|描述
-|-|-
locale|ISO 639|默认应用程序区域设置(必须是 ISO 639 代码中可用的区域设置之一)。
loader|database 或者 file|用于加载不同语言翻译的加载程序。
```javascript
module.exports = {
  locales: {
    loader: 'file',
    locale: 'en'
  }
}
```
## 本地存储
#### 文件
使用 file 加载程序时，所有语言环境都存储在 resources/locales 目录中。

每个语言环境目录应包含一组组翻译文件，如下所示：
```bash
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
```
> 在上面的例子中，每个区域设置包含 3 个翻译组：alerts，cart 和 store 。根据应用程序需要为每个区域设置创建任意数量的组文件。
你还可以创建一个名为 fallback 存储消息的目录，这些消息在找不到当前语言的消息时使用：
```bash
└── resources
  └── locales
      ├── en
      │ └── messages.json
      ├── fallback
      │ └── messages.json
      └── fr
        └── messages.json
```
#### 数据库
使用 database 加载程序时，将从 locales 数据库表中提取所有语言环境。

> adonis install 命令为 locales 表创建迁移。你始终可以在 Github 上引用最新的迁移源文件。
示例 locales 数据库表可能如下所示：

ID|现场|组|项目|文本
-|-|-|-|-
1|en|messages|greeting|Hello {name}
2|fr|messages|greeting|Bonjour {name}
3|en|cart|total|Cart total is {total, number, usd}
4|fr|cart|total| Le panier est total {total，number，usd}

你必须为每个项目定义组值 locales 。
## 访问区域设置
你可以通过 Antl 对象访问当前和默认语言环境：
```javascript
const Antl = use('Antl')

Antl.currentLocale()
Antl.defaultLocale()
```
## ICU 消息语法
AdonisJs 使用行业标准 ICU Message 语法来格式化消息。

以下主题定义 ICU 消息语法的用法。

#### 值
要检索转换值，只需通过其group.item键引用它：

资源/区域设置/ EN / messages.json
{
  "greeting": "Hello"
}
Antl.formatMessage('messages.greeting')
#### 参数
你可以传递动态参数以注入占位符，这些占位符由{ }消息中的花括号定义：

资源/区域设置/ EN / messages.json
{
  "greeting": "Hello {name}"
}
Antl.formatMessage('messages.greeting', { name: 'virk' })
#### 格式化参数
传递给消息的值可以选择按类型格式化。

你必须先注册格式才能使用它们(请参阅注册格式)。
例如，在传递数字时，我们可以将其格式化为 currency ：
```json
{
  "total": "Cart total is {total, number, usd}"
}
```
对于上面消息中的占位符{ total, number, usd }：

- total 是传递的值。

- number 是值的类型。

- usd 是该类型值的格式。

由于 ICU 消息语法不直接理解格式，我们需要在格式化消息时手动传递它们：
```javascript
const Antl = use('Antl')
const Formats = use('Antl/Formats')

Antl.formatMessage(
  'cart.total',
  { total: 20 },
  [Formats.pass('usd', 'number')]
)
```
在上面的例子中，我们只是 formatMessage 用 3 个参数调用：

- cart.total 是要格式化的消息的引用。

- { total: 20 } 是传递给该消息的数据。

- [Formats.pass('usd', 'number')] 是一系列可能的格式。

#### 选择格式
的select格式定义了基于传递的值有条件输出：
```javascript
{gender, select,
    male {He}
    female {She}
    other {They}
} will respond shortly
```
> 在浏览器中尝试编辑上面的消息。
#### 多种格式
plural 格式根据传递的值定义了 plurilization 选项：
```javascript
{count, plural,
   =0 {No candy left}
   one {Got # candy left}
   other {Got # candies left}
}
```
> 在浏览器中尝试编辑上面的消息。
## 格式化值
以下是可用于格式化消息或原始值的方法列表。

#### formatMessage(key，[data]，[formats])
formatMessage 方法需要 key 格式化( group.item )：
```javascript
const Antl = use('Antl')

Antl.formatMessage('messages.greeting')
```
它还可以接受动态对象 data 传递给消息：
```javascript
const Antl = use('Antl')

Antl.formatMessage('response.eta', { gender: 'male' })
```
最后，它还可以接受一个 formats 解析传递数据的数组：
```javascript
const Antl = use('Antl')
const Formats = use('Antl/Formats')

Antl.formatMessage(
  'cart.total',
  { total: 20 },
  [
    Formats.pass('usd', 'number')
  ]
)
```
#### formatNumber(value，[options])
将值格式化为数字(接受此处 options 定义的 NumberFormat )：
```javascript
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
formatAmount(value，currency，[options])
```
style 设置为货币的格式值：
```javascript
Antl.formatAmount(100, 'usd')
```
#### formatDate(value，[options])
格式化值作为日期(接受此处 options 定义的 DateTimeFormat )：
```javascript
Antl.formatDate(new Date())

// pull weekday for the date
Antl.formatDate(new Date(), {
  weekday: 'long'
})

// pull day only
Antl.formatDate(new Date(), {
  day: '2-digit'
})
```
#### formatRelative(value，[options])
格式化相对于当前日期/时间的日期(接受此处 options 定义的 RelativeFormat )：
```javascript
Antl.formatRelative(new Date())

// always in numeric style
Antl.formatRelative(new Date(), {
  style: 'numeric'
})
```
## 注册格式
formatMessage 方法只接受的预先登记的格式的阵列。

要注册给定类型的格式：
```javascript
const Formats = use('Antl/Formats')

Formats.add('usd', {
  style: 'currency',
  currency: 'usd'
})
```
使用方法如下：
```javascript
Antl.formatMessage(
  'cart.total'
  { total: 20 },
  [
    Formats.pass('usd', 'number')
  ]
)
```
Formats.pass 方法有两个参数：

- 第一个参数是要使用的格式。

- 第二个参数是应该应用格式的类型。

#### 多种类型格式
你可以将多种格式传递给给定类型。例如：
```javascript
{
  "total": "USD total { usdTotal, number, usd } or in GBP { gbpTotal, number, gbp }"
}
```
接下来，注册 usd 和 gbp 格式化。
```javascript
Formats.add('usd', {
  style: 'currency',
  currency: 'usd'
})

Formats.add('gbp', {
  style: 'currency',
  currency: 'gbp'
})
```
最后，你可以格式化消息，如下所示：
```javascript
Antl.formatMessage(
  'cart.total',
  { usdTotal: 20, gbpTotal: 13 },
  [
    Formats.pass('usd', 'number'),
    Formats.pass('gbp', 'number')
  ]
)
```
```bash
# 输出
USD total $20.00 or in GBP £13.00
```
## 切换区域设置
Antl 提供者可以很方便地在运行时的语言环境进行格式化。

为此，请在 forLocale 之前调用 formatMessage ：
```javascript
Antl
  .forLocale('fr')
  .formatMessage('response.eta')
```
## Switch Loader
你可以通过调用 loader 方法在运行时在加载器之间切换：
```javascript
const Antl = use('Antl')

// asynchronous
await Antl.bootLoader()

// get antl instance for a booted loader
const AntlDb = Antl.loader('database')

// all methods are available
AntlDb.formatMessage()
```
始终调用 bootLoader 在 Antl.loader 之前  (你只需要调用 bootLoader 一次)。
## Http 请求区域设置
Antl 提供者绑定 locale 属性设置为 HTTP 上下文对象：
```javascript
Route.get('/', ({ locale }) => {
  return `User language is ${locale}`
})
```
locale 属性解析如下：

所述 Accept-LanguageHTTP 标头或 lang 查询参数进行检查以检测用户的语言。

用户语言与应用程序配置的可用语言环境列表进行匹配。已配置的区域设置由保存在数据库或文件系统内的给定语言的消息确定。

如果应用程序不支持用户语言，则它将回退到 config/app.js 文件中定义的默认语言环境。

## Http格式化
由于我们可以 locale 根据标准约定访问用户，因此你可以通过以下方式之一格式化消息。

#### 全局导入
你可以全局导入 Antl Provider ，并在格式化值时手动调用 forLocale 方法：
```javascript
const Antl = use('Antl')

Route.get('/', ({ locale }) => {
  return Antl
    .forLocale(locale)
    .formatNumber(20, { style: 'currency', currency: 'usd' })
})
```
#### 上下文实例
你还可以使用 antl 传递给所有路由处理程序的对象，例如请求和响应：
```javascript
Route.get('/', ({ antl }) => {
  return antl
    .formatNumber(20, { style: 'currency', currency: 'usd' })
})
```
例如，你可以切换视图的区域设置，如下所示：
```javascript
Route.get('/', ({ antl, view }) => {
  antl.switchLocale('fr')
  return view.render('some-view')
}
```
## 查看全局
由于 antl 上下文实例与所有视图共享，你可以在视图模板中访问其方法，如下所示：
```javascript
{{ antl.formatNumber(20, currency = 'usd', style = 'currency')  }}
```
或者，你可以使用 @mustache 标记写入多行：
```javascript
@mustache(antl.formatNumber(
  20,
  { currency: 'usd', style: 'currency }
))
```
> 无法在模板中切换加载程序。
