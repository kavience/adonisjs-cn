# 请求
本指南概述了如何使用 **HTTP Request** 对象读取请求数据。

> req 可以通过访问 Node.js 原始对象 request.request 。
AdonisJs 将当前的 HTTP 请求对象作为 **HTTP Context** 的一部分传递给所有路由和中间件：
```javascript
Route.get('/', ({ request }) => {
  //
})
```
在上面的示例中，我们使用 ES6 的方式来解构从 HTTP Context 对象中获取的 request 对象。

## request body
请求对象提供了许多有用的方法来读取请求 body。

首先，确保已安装 BodyParser 中间件。

如果没有，请按照以下步骤操作。

### 设置BodyParser
> Fullstack 和 API only boilerplates 预先配置了 BodyParser 中间件。
运行 BodyParser 安装命令：
```bash
adonis install @adonisjs/bodyparser
```
然后，在 **start/app.js** 文件中注册提供程序：
```javascript
const providers = [
  '@adonisjs/bodyparser/providers/BodyParserProvider'
]
```
最后，在 **start/kernel.js** 文件中注册全局中间件：
```javascript
const globalMiddleware = [
  'Adonis/Middleware/BodyParser'
]
```
### body 方法
以下方法列表可用于读取 request 正文。

#### all
返回包含所有请求数据的对象（合并 get 请求参数和 post 请求参数）：
```javascript
const all = request.all()
```
#### get
返回 get 请求参数的对象：
```javascript
const query = request.get()
```
#### post
返回 post 请求参数的对象：
```javascript
const body = request.post()
```
#### raw
以字符串形式返回原始正文数据：
```javascript
const raw = request.raw()
```
> 如果原始数据是 JSON 并且 Content-type: application/json 已设置， BodyParser 将巧妙地解析它并将其作为 post 方法的一部分返回。
#### only
返回仅包含指定键的对象：
```javascript
const data = request.only(['username', 'email', 'age'])
```
#### except
返回除指定键以外的所有对象（与 only 相反）：
```javascript
const data = request.except(['csrf_token', 'submit'])
```
#### input
获取给定键的值（如果它不存在，则返回 default 值）：
```javascript
const drink = request.input('drink')

// with default value
const drink = request.input('drink', 'coffee')
```
## 请求收集
通常，你可能希望处理通过键/值对提交数据数组的 HTML 表单。

例如，以下表单一次创建多个用户：
```html
<form method="POST" action="/users">

  <input type="text" name="username[0]" />
  <input type="text" name="age[0]" />

  <input type="text" name="username[1]" />
  <input type="text" name="age[1]" />

</form>
```
假设我们想要获取用户名和年龄：
```javascript
const users = request.only(['username', 'age'])

// output
{ username: ['virk', 'nikk'], age: [26, 25] }
```
由于格式不正确，上面的示例无法保存到数据库。

使用 request.collect 我们可以格式化它，以便它可以保存到数据库：
```javascript
const users = request.collect(['username', 'age'])

// output
[{ username: 'virk', age: 26 }, { username: 'nikk', age: 25 }]

// save to db
await User.createMany(users)
```
## Headers
你可以使用以下方法之一从请求中读取 Headers。

### header
给定键的 header 值（可选择使用默认值）：
```javascript
var auth = request.header('authorization')

// case-insensitive
var auth = request.header('Authorization')

// with default value
const other = request.header('some-other-header', 'default')
```
### headers
返回所有 header 数据的对象：
```javascript
const headers = request.headers()
```
## cookie
你可以使用以下方法之一从请求中读取 Cookie 。

### cookie
给定键的 cookie 值（可选择使用默认值）：
```javascript
const cartTotal = request.cookie('cart_total')

// with default value
const cartTotal = request.cookie('cart_total', 0)
```
### cookies
返回所有 cookie 数据的对象：
```javascript
const cookies = request.cookies()
```
以下方法用于读取客户端设置的 cookie 。

### plainCookie
给定键的原始 cookie 值（可选择使用默认值）：
```javascript

const jsCookie = request.plainCookie('cart_total')

// with default value
const jsCookie = request.plainCookie('cart_total', 0)
```
### plainCookies
返回所有原始 cookie 数据的对象：
```javascript
const plainCookies = request.plainCookies()
```
## 内容协商
内容协商是服务器和客户端约定从服务器返回的最佳响应类型的一种方式。

 Web 服务器不仅提供 Web 页面 - 它们还必须处理作为 JSON，XML 等的 API 响应。

消费者可以要求服务器以特定格式返回响应，而不是为每种内容类型创建单独的URL。

要以特定格式构造响应，服务器需要首先知道所请求的格式。这可以使用 accepts 方法完成。

### accepts
读取Accept标题以帮助确定响应格式：

const bestFormat = request.accepts(['json', 'html'])

if (bestFormat === 'json') {
  return response.json(users)
}

return view.render('users.list', { users })
### 语言
语言也可以根据 Accept-Language 标题进行协商：

const language = request.language(['en', 'fr'])
## 请求方法
以下是所有请求方法及其示例用法的列表。

### URL
返回当前请求 url ：
```javascript
const url = request.url()
```
### originalUrl
返回包含查询字符串的完整当前请求URL：
```javascript
const url = request.originalUrl()
```
### method
返回 HTTP 的请求方法：
```javascript
const method = request.method()
```
### intended
由于AdonisJs允许 method spoofing ，你可以使用 intended 方法获取实际方法：
```javascript
const method = request.intended()
```
### IP
返回用户的IP地址：
```javascript
const ip = request.ip()
```
### IPS
返回ips：
```javascript
const ips = request.ips()
```
### subdomains
返回请求子域列表（www从列表中删除）：
```javascript
const subdomains = request.subdomains()
```
### ajax
检查 X-Requested-With 标头以确定请求是否为 ajax ：
```javascript
if (request.ajax()) {
  // do something
}
```
### pjax
[Pjax](https://github.com/defunkt/jquery-pjax) 是一种使用 Ajax 为传统应用程序提供更好用户体验的演进方式。在 Rails 世界中，它被称为 Turbolinks 。

此方法查找 X-PJAX 标头以标识请求是否为 pjax ：
```javascript
if (request.pjax()) {
  // do something
}
```
### hostname
返回请求主机名：
```javascript
const hostname = request.hostname()
```
### protocol
返回请求协议：
```javascript
const protocol = request.protocol()
```
### match
返回传递的表达式集是否与当前请求 URL 匹配：
```javascript
// current request url - posts/1

request.match(['posts/:id']) // returns true
```
### hasBody
判断请求是否具有body（主要由 BodyParser 用于确定是否解析 body ）：
```javascript
if (request.hasBody()) {
  // do something
}
```
### is
该 is 方法返回当前请求的最佳匹配内容类型。

基于 content-type 标题：
```javascript
// assuming content-type is `application/json`

request.is(['json', 'html']) // returns - json

request.is(['application/*']) // returns - application/json
```
## 方法欺骗
 HTML 表单只能生成 GET 和 POST 请求，这意味着你无法使用其他HTTP方法，例如 PUT，DELETE 请求等等。

通过 _method 在查询字符串中添加参数，自动为你执行正确的路由， AdonisJs 可以轻松绕过请求方法：
```javascript
Route.put('users', 'UserController.update')
<form method="POST" action="/users?_method=PUT">
```
以上示例适用于以下情况：

1. 原始请求方法是 POST 。

2. **allowMethodSpoofing** 在 config/app.js 文件中启用。

## 扩展请求
你可以通过添加自己的方法（称为宏）来扩展 request 原型。

> 由于要扩展的代码 Request 只需执行一次，因此你可以使用 provider 或 Ignitor hooks 来执行此操作。阅读 [扩展核心](https://adonisjs.com/docs/4.1/extending-adonisjs) 以获取更多信息。
```javascript
const Request = use('Adonis/Src/Request')

Request.macro('cartValue', function () {
  return this.cookie('cartValue', 0)
})
```