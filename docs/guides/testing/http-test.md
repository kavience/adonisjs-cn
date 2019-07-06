# HTTP 测试
在本指南中，我们将学习如何针对 API 服务器编写测试。如果你不熟悉 AdonisJs 或一般情况，请务必阅读入门指南。

## 基本的例子
让我们开始使用一个基本示例来测试返回 JSON 中的帖子列表的端点。

> 即将到来的示例假定你已使用 Post 模型设置数据库表。
让我们从创建功能测试开始，因为我们像最终用户一样测试 API 端点。
```bash
adonis make:test Post
```
```bash
# 输出
create: test/functional/post.spec.js
```
让我们打开测试文件并在其中粘贴以下代码。
```javascript
const { test, trait } = use('Test/Suite')('Post')
const Post = use('App/Models/Post')

trait('Test/ApiClient')

test('get list of posts', async ({ client }) => {
  await Post.create({
    title: 'Adonis 101',
    body: 'Blog post content'
  })

  const response = await client.get('/posts').end()

  response.assertStatus(200)
  response.assertJSONSubset([{
    title: 'Adonis 101',
    body: 'Blog post content'
  }])
})
```
现在，如果我们运行 adonis test ，希望测试通过。另外，让我们来谈谈一切如何运作。

首先我们注册了 Test/ApiClient 特征，它为我们提供了一个 HTTP 客户端来对 URL 发出请求。

我们在点击 postsURL 之前创建一个虚拟帖子。

最后，我们运行断言以确保返回 HTTP 状态是 200 且帖子具有相同的标题和正文。

恭喜👏你的第一次测试通过了。

## 客户端方法
以下是你在发出 HTTP 请求时可以调用的可用方法列表。

#### get(url)
GET 向给定的 URL 发出 HTTP 请求。
```javascript
client.get('posts')
```
除了 get ，你可以使用其他方法，比如 post ， put ， delete 等 HTTP 请求。

#### header(key, value)
key/value 在发出 HTTP 请求时将对设置为标头。
```javascript
client
  .get('posts')
  .header('accept', 'application/json')
```
#### send(body)
发出 HTTP 请求时发送请求正文。
```javascript
client
  .post('posts')
  .send({
    title: 'Adonis 101',
    body: 'Post content'
  })
```
#### query(queryObject)
设置查询字符串
```javascript
client
  .get('posts')
  .query({ order: 'desc', page: 1 })
  ```
#### type(type)
设置请求内容类型。
```javascript
client
  .get('posts')
  .type('json')
  ```
#### accept(type)
从服务器设置要接受的数据类型。
```javascript
client
  .get('posts')
  .accept('json')
  ```
#### cookie(key, value)
设置请求 cookie 。由于所有 cookie 都是在 AdonisJs 中加密的，因此这种方法可以确保正确加密这些值，以便 AdonisJs 服务器可以解析它们。
```javascript
client
  .get('posts')
  .cookie('name', 'virk')
  ```
#### plainCookie(key, value)
设置一个未加密的 cookie 
```javascript
client
  .get('posts')
  .plainCookie('name', 'virk')
  ```
#### end
end 方法结束 HTTP 请求链并返回响应。确保始终调用 'end' 方法。
```javascript
const response = await client.get('posts').end()
```
## 多请求
API 客户端还可以生成多请求并将文件作为请求正文的一部分发送。
```javascript
await client
  .post('posts')
  .field('title', 'Adonis 101')
  .attach('cover_image', Helpers.tmpPath('cover-image.jpg'))
  .end()
  ```
此外，你可以设置 HTML 表单样式字段名称以发送数据数组。
```javascript
await client
  .post('user')
  .field('user[name]', 'Virk')
  .field('user[email]', 'virk@adonisjs.com')
  .end()
  ```
## Sessions
在编写测试时，你可能希望事先设置会话，并且可以通过使用 Session/Client 特征来完成相同的操作。

> 在利用 Session/Client 特征之前，请确保已安装会话提供程序。
```javascript
const { test, trait } = use('Test/Suite')('Post')

trait('Test/ApiClient')
trait('Session/Client')

test('get list of posts', async ({ client }) => {
  const response = await client
    .get('posts')
    .session('adonis-auth', 1)
    .end()
})
```
## 认证
此外，你可以使用 Auth/Client 特征预先验证用户。
```javascript
const { test, trait } = use('Test/Suite')('Post')

trait('Test/ApiClient')
trait('Auth/Client')
trait('Session/Client')

test('get list of posts', async ({ client }) => {
  const user = await User.find(1)

  const response = await client
    .get('posts')
    .loginVia(user)
    .end()
})
```
或者，你可以传递用于验证用户身份的自定义方案。
```javascript
client
  .get('posts')
  .loginVia(user, 'jwt')
  ```
此外，对于基本身份验证，你必须传递 username 和 password 登录用户。
```javascript
client
  .get('posts')
  .loginVia(username, password, 'basic')
  ```
## 断言
下面是使用 API​​ 客户端时可以运行的断言列表。

#### assertStatus
断言响应状态
```javascript
response.assertStatus(200)
```
#### assertJSON
响应响应主体 deepEqual 的预期值。
```javascript
response.assertJSON({
})
```
#### assertJSONSubset
断言 JSON 的子集。此断言测试对象的子集，当对象内的某些键无法确定时，这非常有用。例如：时间戳
```javascript
response.assertJSONSubset({
  title: 'Adonis 101',
  body: 'Some content'
})
```
#### assertText
断言服务器返回的纯文本
```javascript
response.assertText('Hello world')
```
#### assertError
断言作为响应收到的错误
```javascript
response.assertError([
  {
    message: 'username is required',
    field: 'username',
    validation: 'required'
  }
])
```
#### assertCookie
断言服务器使用值设置 cookie 
```javascript
response.assertCookie('key', 'value')
```
#### assertPlainCookie
断言纯 cookie 
```javascript
response.assertPlainCookie('key', 'value')
```
#### assertCookieExists
断言服务器使用给定名称设置 cookie
```javascript
response.assertCookieExists('key')
```
#### assertPlainCookieExists
断言存在的普通 cookie 存在
```javascript
response.assertPlainCookieExists('key')
```
#### assertHeader
断言服务器发送了标头。
```javascript
response.assertHeader('content-type', 'application/json')
```
#### assertRedirect
断言请求已重定向到给定的 URL 。
```javascript
response.assertRedirect('/there')
```