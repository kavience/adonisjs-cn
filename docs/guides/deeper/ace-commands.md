# 命令行工具
Ace 是为 AdonisJs 精心设计的强大命令行工具。

到目前为止，你已使用各种 Ace 命令生成控制器，模型或运行迁移。

在本指南中，我们将了解 Ace 内部以及如何创建命令。

## 介绍
每个 AdonisJs 项目在项目根目录中都有一个 ace 文件，这是一个常规 JavaScript 文件但没有 .js 扩展名。

ace 文件用于执行特定于项目的命令。对于可重用命令，必须将它们捆绑为 npm 包。

运行以下代码以查看可用的 Ace 命令列表：
```bash
node ace
```
```bash
# 输出
Usage:
  command [arguments] [options]

Global Options:
  --env                Set NODE_ENV before running the commands
  --no-ansi            Disable colored output

Available Commands:
  seed                 Seed database using seed files
 migration
  migration:refresh    Refresh migrations by performing rollback and then running from start
  migration:reset      Rollback migration to the first batch
  migration:rollback   Rollback migration to latest batch or a specific batch number
  migration:run        Run all pending migrations
  migration:status     Check migrations current status
```
> 为方便起见，adonis 命令代理给定项目的所有命令。例如，运行 adonis migration:run 与运行 node ace migration:run 具有相同的结果。
## 创建命令
让我们快速构建一个 Ace 命令，通过 [wisdom API](http://gophergala.github.io/wisdom) 从 Paul Graham 中提取随机引号并将它们输出到终端。

#### 建立
```bash
adonis make:command Quote
```
```bash
✔ create  app/Commands/Quote.js
┌───────────────────────────────────────────────────────────┐
│        Register command as follows                        │
│                                                           │
│        1. Open start/app.js                               │
│        2. Add App/Commands/Quote to commands array        │
└───────────────────────────────────────────────────────────┘
```
按照输出指令， commands 在 start/app.js 文件中的数组中注册新创建的命令：
```javascript
const commands = [
  'App/Commands/Quote',
]
```
现在，如果我们运行 adonis ，我们应该 quote 在可用命令列表中看到命令。

#### 显示 quote 
使用以下代码替换命令文件中的所有内容：
```javascript
'use strict'

const { Command } = use('@adonisjs/ace')
const got = use('got')

class Quote extends Command {
  static get signature () {
    return 'quote'
  }

  static get description () {
    return 'Shows inspirational quote from Paul Graham'
  }

  async handle (args, options) {
    const response = await got('https://wisdomapi.herokuapp.com/v1/author/paulg/random')
    const quote = JSON.parse(response.body)
    console.log(`${this.chalk.gray(quote.author.name)} - ${this.chalk.cyan(quote.author.company)}`)
    console.log(`${quote.content}`)
  }
}

module.exports = Quote
```
> 确保通过 npm 安装获得的包，该命令用于在上面的命令代码中使用 HTTP API 。
Running adonis quote 将检索到的报价打印到终端。

## 命令签名
命令签名定义命令名称，必需/可选选项和标志。

签名定义为表达式字符串，如下所示：
```javascript
static get signature () {
  return 'greet { name: Name of the user to greet }'
}
```
在上面的示例签名中：

- greet 是命令名称

- { name } 是运行命令时要传递的必需参数

- 之后的所有内容都是:前面的参数名称的描述

命令签名可以使用 ES6 模板文字跨越多行：
```javascript
static get signature () {
  return `
    greet
    { name : Name of the user to greet }
    { age? : User age }
  `
}
```
#### 可选参数
通过附加 ? 参数名称，参数可以是可选的：
```javascript
'greet { name? : Name of the user to greet }'
```
#### 默认值
你还可以为参数定义默认值，如下所示：
```javascript
'greet { name?=virk : Name of the user to greet }'
```
#### 标志
标志带有前缀并且--与参数具有相同的签名：
```javascript
static get signature () {
  return `
    send:email
    { --log : Log email response to the console }
  `
}
```
使用上面的示例签名，你可以在 --log 运行命令时传递标志，如下所示：
```bash
adonis send:email --log
```
#### 带有值的标志
有时你可能希望接受带有标志的值。

这可以通过调整签名表达式来完成，如下所示：
```javascript
static get signature () {
  return `
    send:email
    { --driver=@value : Define a custom driver to be used  }
  `
}
```
在上面的示例中，=@value 指示 Ace 确保始终使用该 --driver 标志传递值。

## 命令行动
在 handle 该命令类调用方法在每次执行命令的时间，并且接收的目的 arguments 和 flags ：
```javascript
async handle (args, flags) {
  console.log(args)
  console.log(flags)
}
```
> 所有参数和标志都以驼峰大小写格式传递。例如，--file-path 标志将被设置为 filePath 传递 flags 对象内的键。
## 问题
在命令中，你可以通过询问交互式问题来提示用户提供答案并接受值。

#### ask(question, [defaultAnswer])
提示用户输入文本：
```javascript
async handle () {
  const name = await this
    .ask('Enter project name')

  // with default answer
  const name = await this
    .ask('Enter project name', 'yardstick')
}
```
#### secure(question, [defaultAnswer])
secure 方法类似于 ask ，但隐藏了用户的输入(在询问敏感信息时很有用，例如密码)：
```javascript
const password = await this
  .secure('What is your password?')
confirm(question)
```
提示用户yes/no回答：
```javascript
const deleteFiles = await this
  .confirm('Are you sure you want to delete selected files?')
  ```
#### multiple(title, choices, [selected])
提示用户提供多项选择题的答案：
```javascript
const lunch = await this
  .multiple('Friday lunch ( 2 per person )', [
    'Roasted vegetable lasagna',
    'Vegetable & feta cheese filo pie',
    'Roasted Cauliflower + Aubergine'
  ])
  ```
你的 choices 数组值可以是对象：
```javascript
const lunch = await this
  .multiple('Friday lunch ( 2 per person )', [
    {
      name: 'Roasted Cauliflower + Aubergine',
      value: 'no 1'
    },
    {
      name: 'Carrot + Tabbouleh',
      value: 'no 2'
    }
  ])
  ```
你还可以传递一组预先选定的值：
```javascript
const lunch = await this
  .multiple('Friday lunch ( 2 per person )', [
    'Roasted vegetable lasagna',
    'Vegetable & feta cheese filo pie',
    'Roasted Cauliflower + Aubergine'
  ], [
    'Roasted vegetable lasagna',
  ])
  ```
#### choice(question, choices, [selected])
提示用户对多项选择题的单一答案：
```javascript
const client = await this
  .choice('Client to use for installing dependencies', [
    'yarn', 'npm'
  ])
  ```
你的 choices 数组值可以是对象：
```javascript
const client = await this
  .choice('Client to use for installing dependencies', [
    {
      name: 'Use yarn',
      value: 'yarn'
    },
    {
      name: 'Use npm',
      value: 'npm'
    }
  ])
  ```
你还可以传递预选值：
```javascript
const client = await this
  .choice('Client to use for installing dependencies', [
    {
      name: 'Use yarn',
      value: 'yarn'
    },
    {
      name: 'Use npm',
      value: 'npm'
    }
  ], 'npm')
  ```
## 彩色输出
Ace 使用 kleur 向终端输出彩色日志消息。

> 你可以通过 this.chalk 访问 kleur 实例 。
### 助手方法
以下帮助程序方法将始终如一的样式消息记录到终端。

#### info(message)
使用青色将信息消息记录到控制台：
```javascript
this.info('Something worth sharing')
```
#### success(message)
使用绿色将成功消息记录到控制台：
```javascript
this.success('All went fine')
```
#### warn(message)
使用黄色将警告消息记录到控制台：
```javascript
this.warn('Fire in the hole')
```
> warn 使用 console.warn 而不是 console.log 。
#### error(message)
使用红色将错误消息记录到控制台：
```javascript
this.error('Something went bad')
```
> error 使用 console.error 而不是console.log 。
#### completed(action, message)
将带有消息的操作打印到控制台：
```javascript
this.completed('create', 'config/app.js')
// 输出
create: config/app.js
```
#### failed(action, message)
使用消息向控制台打印失败的操作：
```javascript
this.failed('create', 'config/app.js')
```
 failed 使用 console.error 而不是 console.log 。
#### table(head, body)
将表格数据打印到控制台：
```javascript
const head = ['Name', 'Age']
const body = [['virk', 22], ['joe', 23]]

this.table(head, body)
```
```jbash
# 输出
┌──────┬─────┐
│ Name │ Age │
├──────┼─────┤
│ virk │ 22  │
├──────┼─────┤
│ joe  │ 23  │
└──────┴─────┘
```
头行颜色也可以定义：
```javascript
const head = ['Name', 'Age']
const body = [['virk', 22], ['joe', 23]]
const options = { head: ['red'] }

this.table(head, body, options)
```
#### icon(type)
返回给定类型的彩色图标：
```javascript
console.log(`${this.icon('success')} Completed`)
```
```bash
✔ Completed
```
类型|颜色|图标
-|-|-
info|青色|ℹ
success|绿色|✔
warn|黄色|⚠
error|红色|✖

## 文件管理
通过提供 Promise 第一个 API ， Ace 可以轻松地与文件系统进行交互。

### writeFile(location, contents)
将文件写入给定位置(自动创建缺少的目录)：
```javascript
await this.writeFile(Helpers.appRoot('Models/User.js'), '…')
```
#### ensureFile(location)
确保文件存在，否则创建一个空文件：
```javascript
await this.ensureFile(Helpers.appRoot('Models/User.js'))
```
#### ensureDir(location)
确保目录存在，否则创建一个空目录：
```javascript
await this.ensureDir(Helpers.appRoot('Models'))
```
#### pathExists(location)
返回一个布尔值，指示路径是否存在：
```javascript
const exists = await this.pathExists('some-location')

if (exists) {
  // do something
}
```
#### removeFile(location)
从给定位置删除文件：
```javascript
await this.removeFile('some-location')
```
#### removeDir(location)
从给定位置删除目录：
```javascript
await this.removeDir('some-location')
```
#### readFile(location)
读取给定文件的内容：
```javascript
const contents = await this.readFile('some-location', 'utf-8')
```
#### copy(src, dest)
将文件/目录从一个位置复制到另一个位置：
```javascript
await this.copy(src, dest)
```
#### move(src, dest)
将文件/目录从一个位置移动到另一个位置：
```javascript
await this.move(src, dest)
```
## 数据库连接管理
在 Ace 命令中使用数据库访问(通过 Lucid 或直接)时，你必须记住手动关闭数据库连接：
```javascript
Database.close()
```
一个更完整的例子：
```javascript
const Database = use('Database')

class Quote extends Command {
  static get signature () {
    return 'quote'
  }

  static get description () {
    return 'Shows inspirational quote from Paul Graham'
  }

  async handle (args, options) {
    let quote = await Quote.query().orderByRaw('rand()').first()
    console.log(quote.content)

    // Without the following line, the command will not exit!
    Database.close()
  }
}
```