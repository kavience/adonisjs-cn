# 响应
本指南概述了如何使用 HTTP Response 对象来生成和返回响应。

> res 可以访问 Node.js 原始对象 response.response 。
AdonisJs 将当前 HTTP 响应对象作为 HTTP Context 的一部分传递，并发送到所有路由处理程序和中间件。
```javascript
Route.get('/', ({ response }) => {
  response.send('hello world')
})
```
## 基本的例子
以下示例以 JSON 格式返回用户数组：
```javascript
Route.get('/users', async ({ response }) => {
  const users = await User.all()
  response.send(users)
})
```
 response.json 方法也是 response.send 方法的别名：
```javascript
Route.get('/users', async ({ response }) => {
  response.json(await User.all())
})
```
## 做出回应
从  4.0 开始，你可以在路由的闭包或控制器方法里直接 return 值，而不是使用 response 的方法。

以下等同于 response.send 或者 response.json ，但是简单的 return 语句感觉更自然：
```javascript
Route.get('/', async () => {
  return await User.all()
})
```
### 避免回调
由于 request / response 生命周期允许你返回值或调用专用响应方法，因此 AdonisJs 不希望你使用回调。

在回调中发送的以下响应将不起作用：
```javascript
Route.get('/', async ({ response }) => {
  fs.readFile('somefile', (error, contents) => {
    response.send(contents)
  })
})
```
上述代码无法工作的原因是因为一旦路由处理程序执行， AdonisJs 就会结束响应 --- 因为回调函数在稍后执行，所以发生错误！

### promisify 回调
你可以做的是 promisify 你的回调并使用 await ：
```javascript
const fs = use('fs')
const Helpers = use('Helpers')
const readFile = Helpers.promisify(fs.readFile)

Route.get('/', async ({ response }) => {
  return await readFile('somefile')
})
```
JavaScript 拥有丰富的生态系统，只需要满足它们就可以 100％ 地编写没有回调的代码，作为一个社区，我们鼓励这种方法。

### 如果一定要使用回调的话
如果你仍然喜欢回调， AdonisJs 提供了继续使用它们的方法。

只需指示 response 对象不要隐式结束：
```javascript
Route.get('/', async ({ response }) => {
  response.implicitEnd = false

  fs.readFile('somefile', (error, contents) => {
    response.send(contents)
  })
})
```
## Headers
使用以下方法设置或者删除响应 Headers 。

### header
设置标头值：
```javascript
response.header('Content-type', 'application/json')
```
### safeHeader
仅设置 header 值(如果不存在)：
```javascript
response.safeHeader('Content-type', 'application/json')
```
### RemoveHeader
删除现有 header ：
```javascript
response.removeHeader('Content-type')
```
### type
设置 Content-Type 标题：
```javascript
response.type('application/json')
```
## Cookies
使用以下方法设置/删除响应cookie。

### cookie
设置 cookie 值：
```javascript
response.cookie('cartTotal', 20)
```
### clearCookie
删除现有的 cookie 值(通过设置过去的到期时间)：
```javascript
response.clearCookie('cartTotal')
```
### plainCookie
由于所有 cookie 都经过加密和签名，因此无法从前端 JavaScript 代码中读取它们。

在这种情况下，可能想要设置一个普通的 cookie ：
```javascript
// not signed or encrypted
response.plainCookie('cartTotal', 20)
```
## 重定向
使用以下方法之一将请求重定向到其他 URL 。
```javascript
redirect(url，[sendParams = false]，[status = 302])
```
将请求重定向到其他 URL (默认情况下，它将状态设置为 302 )：
```javascript
response.redirect('/url')

// or
response.redirect('/url', false, 301)
```
你可以通过将第二个参数设置为 true ：将当前请求参数发送到重定向位置：
```javascript
response.redirect('/url', true)
route(route，[data]，[domain]，[sendParams = false]，[status = 302])
```
重定向到路由(通过路由名称或控制器方法)：
```javascript
Route
  .get('users/:id', 'UserController.show')
  .as('profile')
// 通过路由名称
response.route('profile', { id: 1 })

// 通过控制器方法
response.route('UserController.show', { id: 1 })
```
由于 AdonisJs 允许为多个域名注册路由，因此你还可以指示此方法为特定域名构建 URL ：
```javascript
response.route('posts', { id: 1 }, 'blog.adonisjs.com')
```
## 附件
response 对象使你可以轻松地将文件从服务器传输到客户端。

### download(filePath)
将文件传输到客户端：
```javascript
response.download(Helpers.tmpPath('uploads/avatar.jpg'))
```
此方法不强制客户端将文件作为附件下载(例如，浏览器可以选择在新窗口中显示该文件)。

### attachment(filePath, [name], [disposition])
强制下载文件：
```javascript
response.attachment(
  Helpers.tmpPath('uploads/avatar.jpg')
)
```
使用自定义名称下载：
```javascript
response.attachment(
  Helpers.tmpPath('uploads/avatar.jpg'),
  'myAvatar.jpg' // custom name
)
```
## 描述性方法
AdonisJs 附带了一堆描述性消息，这些消息比 send 方法更具可读性。
```javascript
response.unauthorized('Login First')
```
比以下代码更具可读性：
```javascript
response.status(401).send('Login First')
```
以下是所有描述性方法及其相应 HTTP 状态的列表。检查 httpstatuses.com 以了解有关 HTTP 状态代码的更多信息。

方法|Http响应状态
--|--
continue|100
switchingProtocols|101
ok|200
created|201
accepted|202
nonAuthoritativeInformation|203
noContent|204
resetContent|205
partialContent|206
multipleChoices|300
movedPermanently|301
found|302
seeOther|303
notModified|304
useProxy|305
temporaryRedirect|307
badRequest|400
unauthorized|401
paymentRequired|402
forbidden|403
notFound|404
methodNotAllowed|405
notAcceptable|406
proxyAuthenticationRequired|407
requestTimeout|408
conflict|409
gone|410
lengthRequired|411
preconditionFailed|412
requestEntityTooLarge|413
requestUriTooLong|414
unsupportedMediaType|415
requestedRangeNotSatisfiable|416
expectationFailed|417
unprocessableEntity|422
tooManyRequests|429
internalServerError|500
notImplemented|501
badGateway|502
serviceUnavailable|503
gatewayTimeout|504
httpVersionNotSupported|505
## 扩展 Response
你可以通过添加自己的方法(称为宏)来扩展 Response 原型。

> 由于要扩展的代码 Response 只需执行一次，因此你可以使用 provider 或 Ignitor hooks 来执行此操作。阅读 [扩展核心](https://adonisjs.com/docs/4.1/extending-adonisjs) 以获取更多信息。
```javascript
const Response = use('Adonis/Src/Response')

Response.macro('sendStatus', function (status) {
  this.status(status).send(status)
})
```