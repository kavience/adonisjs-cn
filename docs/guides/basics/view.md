# 视图
AdonisJs 使用 Edge 作为其模板引擎，它速度极快，并提供了一个优雅的 API 来创建动态视图。

在引擎盖下，Edge支持：

- 页面拆分
- 组件
- 使用 chrome dev 工具进行运行时调试
- 逻辑标签及其间的所有内容

## 基本的例子
让我们从渲染经典的 Hello World 示例开始。

确保 AdonisJs ViewProvider 已在 start/app.js 文件中注册为提供者。
```JavaScript
const providers = [
  '@adonisjs/framework/providers/ViewProvider'
]
```
所有视图都存储在 resources/views 目录中，并以 .edge 扩展名结尾。

使用该 adonis 命令创建视图：
```bash
adonis make:view hello-world
```
```bash
# 控制台输出
✔ create  resources/views/hello-world.edge
```
打开 hello-world.edge 并保存其内容为：
```html
<h1>Hello World!</h1>
```
现在，创建一个渲染 hello-world.edge 视图的路由：
```JavaScript
Route.get('hello-world', ({ view }) => {
  return view.render('hello-world')
})
```
该 view.render 方法获取 resources/views 视图文件的相对路径。无需键入 .edge 扩展名。

如果你还没有这样做，请为你的网站服务：
```bash
adonis serve --dev
```
最后，浏览到 **127.0.0.1:3333/hello-world** ，你应该看到：

“hello world”

#### 嵌套视图
你还可以通过点表示法在子文件夹中渲染视图：
```JavaScript
// file path: resources/views/my/nested/view.edge

view.render('my.nested.view')
```
## 请求信息
所有视图都可以访问当前 request 对象。

你可以在视图模板中调用请求方法，如下所示：
```JavaScript
The request URL is {{ request.url() }}
```
request.url 上面的值也可以通过 url 全局检索：
```JavaScript
The request URL is {{ url }}
```
## 全局
除了所有 Edge 全局变量之外，AdonisJs 还提供了以下全局变量。

#### style
将 link 标记添加到 CSS 文件。

相对路径(到 public 目录中的 CSS 文件)：
```html
{{ style('style') }}
<link rel="stylesheet" href="/style.css" />
```
绝对路径：
```html
{{ style('https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css') }}
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta/css/bootstrap.min.css" />
```
#### script
将 script 标签添加到 JavaScript 文件。

相对路径(到 public 目录中的 JavaScript 文件)：
```JavaScript
{{ script('app') }}
<script type="text/javascript" src="/app.js"></script>
```
绝对路径：
```JavaScript
{{ script('https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js') }}
<script type="text/javascript" src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js"></script>
```
#### assetsUrl
返回相对于 public 目录的文件路径：
```JavaScript
<img src="{{ assetsUrl('images/logo.png') }}" />
<img src="/images/logo.png" />
```
#### 路由
返回路由的 URL 。

例如，使用以下示例路由...
```JavaScript
Route.get('users/:id', 'UserController.show')
  .as('profile')
```
...如果你传递路由名称和任何路由参数......
```html
<a href="{{ route('profile', { id: 1 }) }}">
  View profile
</a>
```
...路由 URL 将如下呈现：
```html
<a href="/users/1">
  View profile
</a>
```
你也可以传递 controller.method 签名：
```html
<a href="{{ route('UserController.show', { id: 1 }) }}">
  View profile
</a>
```
#### URL
返回当前请求 url ：
```JavaScript
The request URL is {{ url }}
```
#### AUTH
如果使用 AdonisJs Auth Provider ，你可以通过全局 auth 对象访问当前登录的用户：
```JavaScript
{{ auth.user }}
```
### CSRF
如果使用AdonisJs Shield中间件，你可以使用以下全局变量之一访问CSRF令牌和输入字段。
#### csrfToken
```JavaScript
{{ csrfToken }}
```
#### csrfField
```JavaScript
{{ csrfField() }}
```
```html
<input type="hidden" name="_csrf" value="...">
```
#### cspMeta
使用 AdonisJs Shield 中间件，可自动设置 CSP headers。

但是，你也可以通过 cspMeta 全局手动设置它们：
```html
<head>
  {{ cspMeta() }}
</head>
```
## Tags
标签是 Edge 模板的构建块。

例如 @if，@each 和 @include 全部标签附带在默认情况下边沿。

Edge 还公开了一个非常强大的 API 来为其添加新标签。

以下是 tagsAdonisJs 的具体列表。

#### loggedIn
该 loggedIn 标签可以让你写一个 if/else 各地登录的用户条件从句。

例如：
```JavaScript
@loggedIn
  You are logged in!
@else
  <a href="/login">Click here</a> to login.
@endloggedIn
```
之间一切都 @loggedIn 与 @else 用户是否登录标签被呈现，而之间的所有内容 @else 和 @endloggedIn 标签，如果他们不被渲染。

#### inlineSvg
在 HTML 中内嵌呈现 SVG 文件。

标记需要指向 public 目录中 SVG 文件的相对路径：
```JavaScript
<a href="/login">
  @inlineSvg('lock')
  Login
</a>
```
## 模板
AdonisJs 与 Edge 分享其模板语法。

有关更多信息，请阅读 Edge [语法指南](http://edge.adonisjs.com/docs/syntax-guide)。

## 扩展视图
也可以通过添加自己的视图全局变量或标记来扩展视图。

> 由于要扩展的代码 View 只需执行一次，因此你可以使用 Provider 或 Ignitor hooks 来执行此操作。阅读 [Extending the Core](https://adonisjs.com/docs/4.1/extending-adonisjs) 以获取更多信息。
#### 全局
```JavaScript
const View = use('View')

View.global('currentTime', function () {
  return new Date().getTime()
})
```
以上全局返回在视图中引用时的当前时间：
```JavaScript
{{ currentTime() }}
```
#### 全局范围
this 全局闭包内部的值绑定到视图上下文，因此你可以从中访问运行时值：
```JavaScript
View.global('button', function (text) {
  return this.safe(`<button type="submit">${text}</button>`)
})
```
该 safe 方法确保不会转义返回的 HTML 。
要在自定义全局变量中使用其他全局变量，请使用以下 this.resolve 方法：
```JavaScript
View.global('messages', {
  success: 'This is a success message',
  warning: 'This is a warning message'
})

View.global('getMessage', function (type) {
  const message = this.resolve('messages')
  return messages[type]
})
{{ getMessage('success') }}
```
#### 标签
你可以通过 Edge [文档](http://edge.adonisjs.com/docs/tags) 了解有关标签的更多信息。
```JavaScript
const View = use('View')

class MyTag extends View.engine.BaseTag {
  //
}

View.engine.tag(new MyTag())
```
#### 运行时值
你可能希望与你的视图共享特定的请求值。

这可以通过创建中间件和共享本地来完成：
```JavaScript
class SomeMiddleware {

  async handle ({ view }, next) {
    view.share({
      apiVersion: request.input('version')
    })

    await next()
  }
}
```
然后，在你的视图中，你可以像任何其他值一样访问它：
```JavaScript
{{ apiVersion }}
```
## 语法高亮
以下编辑器插件提供 Edge 语法突出显示支持：

- Sublime Text
- Atom
- Visual Studio Code