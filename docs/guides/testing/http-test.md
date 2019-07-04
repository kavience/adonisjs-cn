# HTTP测试
基本的例子
客户方法
多部分请求
会议
认证
断言
在本指南中，我们将学习如何针对API服务器编写测试。如果您不熟悉AdonisJs或一般情况，请务必阅读入门指南。

基本的例子
让我们开始使用一个基本示例来测试返回JSON中的帖子列表的端点。

即将到来的示例假定您已使用Post模型设置数据库表。
让我们从创建功能测试开始，因为我们像最终用户一样测试API端点。

adonis make:test Post
产量

create: test/functional/post.spec.js
让我们打开测试文件并在其中粘贴以下代码。

测试/功能/ post.spec.js
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
现在，如果我们运行adonis test，希望测试通过。另外，让我们来谈谈一切如何运作。

首先我们注册了Test/ApiClient特征，它为我们提供了一个HTTP客户端来对URL发出请求。

我们在点击postsURL 之前创建一个虚拟帖子。

最后，我们运行断言以确保返回HTTP状态是200一个帖子具有相同的标题和正文。

恭喜👏你的第一次测试通过了。

客户方法
以下是您在发出HTTP请求时可以调用的可用方法列表。

得到（URL）
GET向给定的URL 发出HTTP 请求。

client.get('posts')
就像get，你可以使用其他方法，比如post，put，delete使HTTP请求。

标题（键，值）
key/value在发出HTTP请求时将对设置为标头。

client
  .get('posts')
  .header('accept', 'application/json')
发送（体）
发出HTTP请求时发送请求正文。

client
  .post('posts')
  .send({
    title: 'Adonis 101',
    body: 'Post content'
  })
查询（queryObject）
设置查询字符串

client
  .get('posts')
  .query({ order: 'desc', page: 1 })
型（类型）
设置请求内容类型。

client
  .get('posts')
  .type('json')
接受（类型）
从服务器设置要接受的数据类型。

client
  .get('posts')
  .accept('json')
cookie（键，值）
设置请求cookie。由于所有cookie都是在AdonisJs中加密的，因此这种方法可以确保正确加密这些值，以便AdonisJs服务器可以解析它们。

client
  .get('posts')
  .cookie('name', 'virk')
plainCookie（键，值）
设置一个未加密的cookie

client
  .get('posts')
  .plainCookie('name', 'virk')
结束
该end方法结束HTTP请求链并返回响应。确保始终调用'end'方法。

const response = await client.get('posts').end()
多部分请求
API客户端还可以生成多部分请求并将文件作为请求正文的一部分发送。

await client
  .post('posts')
  .field('title', 'Adonis 101')
  .attach('cover_image', Helpers.tmpPath('cover-image.jpg'))
  .end()
此外，您可以设置HTML表单样式字段名称以发送数据数组。

await client
  .post('user')
  .field('user[name]', 'Virk')
  .field('user[email]', 'virk@adonisjs.com')
  .end()
会议
在编写测试时，您可能希望事先设置会话，并且可以通过使用Session/Client特征来完成相同的操作。

在利用Session/Client特征之前，请确保已安装会话提供程序。
const { test, trait } = use('Test/Suite')('Post')

trait('Test/ApiClient')
trait('Session/Client')

test('get list of posts', async ({ client }) => {
  const response = await client
    .get('posts')
    .session('adonis-auth', 1)
    .end()
})
认证
此外，您可以使用Auth/Client特征预先验证用户。

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
或者，您可以传递用于验证用户身份的自定义方案。

client
  .get('posts')
  .loginVia(user, 'jwt')
此外，对于基本身份验证，您必须传递username和password登录用户。

client
  .get('posts')
  .loginVia(username, password, 'basic')
断言
下面是使用API​​客户端时可以运行的断言列表。

assertStatus
断言响应状态

response.assertStatus(200)
assertJSON
响应响应主体deepEqual的预期值。

response.assertJSON({
})
assertJSONSubset
断言JSON的子集。此断言测试对象的子集，当对象内的某些键无法确定时，这非常有用。例如：时间戳

response.assertJSONSubset({
  title: 'Adonis 101',
  body: 'Some content'
})
assertText
断言服务器返回的纯文本

response.assertText('Hello world')
assertError
断言作为响应收到的错误

response.assertError([
  {
    message: 'username is required',
    field: 'username',
    validation: 'required'
  }
])
assertCookie
断言服务器使用值设置cookie

response.assertCookie('key', 'value')
assertPlainCookie
断言纯cookie

response.assertPlainCookie('key', 'value')
assertCookieExists
断言服务器使用给定名称设置cookie

response.assertCookieExists('key')
assertPlainCookieExists
断言存在的普通cookie存在

response.assertPlainCookieExists('key')
assertHeader
断言服务器发送了标头。

response.assertHeader('content-type', 'application/json')
assertRedirect
断言请求已重定向到给定的URL。

response.assertRedirect('/there')
