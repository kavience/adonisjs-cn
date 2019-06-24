# 路由
路由使外部能够通过 URL 与你的应用进行交互。

路由在 **start/routes.js** 文件中注册。

## 基本路由
最基本的路由绑定需要 URL 和闭包：
```javascript
Route.get('/', () => 'Hello Adonis')
```
闭包的返回值将作为响应发送回客户端。

你还可以使用 **controller.method** 的方式将路由绑定到控制器：
```javascript
Route.get('posts', 'PostController.index')
```
上述签名 **PostController.index** 是指 **App/Controllers/Http/PostController.js** 文件的 **index** 方法。
### 可用的路由器方法
不同的 HTTP 请求类型对应不同的方法：
```javascript
Route.get(url, closure)
Route.post(url, closure)
Route.put(url, closure)
Route.patch(url, closure)
Route.delete(url, closure)
```
要注册响应多个动词的路由，请使用 Route.route ：
```javascript
Route.route('/', () => {
  //
}, ['GET', 'POST', 'PUT'])
```
要直接渲染视图（例如静态页面），请使用 **Route.on.render** ：
```javascript
Route.on('/').render('welcome')
```
在上面的示例中，当根路由 '/' 加载时， 将直接显示 **resources/view/welcome.edge** 视图文件。

## 路由参数
### 必要参数
对于动态路由，你可以定义路由参数，如下所示：
```javascript
Route.get('posts/:id', ({ params }) => {
  return `Post ${params.id}`
})
```
在上面的示例中，:id是一个路由参数。

然后通过params对象检索其值。

## 可选参数
要定义可选的路由参数，在末尾附加 '?' ：
```javascript
Route.get('make/:drink?', ({ params }) => {
  // use Coffee as fallback when drink is not defined
  const drink = params.drink || 'Coffee'

  return `One ${drink}, coming right up!`
})
```
在上面的示例中，:drink?是一个可选的路由参数。

## 通配路由
你可能希望从服务器呈现单个视图，并使用你喜欢的前端框架控制路由：
```javascript
Route.any('*', ({ view }) => view.render('...'))
```
不过需要注意的是需要在通配符路由之前定义其它特定路由：
```javascript
Route.get('api/v1/users', closure)

Route.any('*', ({ view }) => view.render('...'))
```
## 命名路由
虽然路由是在 **start/routes.js** 文件中定义的，但它们在应用程序中的其他位置都被引用（例如，使用 **views** 路由助手为给定路由创建 URL 。

通过使用该 **as** 方法，你可以为路由指定唯一名称：
```javascript
Route.get('users', closure).as('users.index')
```
这将使你能够在模板中使用 **route** 助手函数，如下所示：
```javascript
<!-- before -->
<a href="/users">List of users</a>

<!-- after -->
<a href="{{ route('users.index') }}">List of users</a>
```
```javascript
foo ({ response }) {
  return response.route('users.index')
}
```
**route** 助手函数与 Route 共享，并且可选的参数作为第二个参数：
```javascript
Route.get('posts/:id', closure).as('posts.show')

route('posts.show', { id: 1 })
```
**route** 助手函数还接受可选参数对象作为第三个参数，它可以控制 protocol，domain 和 query 参数：
```javascript
route('posts.show', { id: 1 }, {
  query: { foo: 'bar' }
});

// resulting in /post/1?foo=bar

// Without parameters:
route('auth.login', null, {
  domain: 'auth.example.com',
  protocol: 'https',
  query: { redirect: '/dashboard' }
});

// resulting in https://auth.example.com/login?redirect=%2Fdashboard
```
这些规则也适用于视图。
```javascript
<a href="{{ route('posts.show', { id: 1 }, {query: { foo: 'bar' }}) }}">Show post</a>
// href="/post/1?foo=bar"
```
## 路由格式
路由格式为 [content negotiation](https://developer.mozilla.org/en-US/docs/Web/HTTP/Content_negotiation) 开辟了一种新方式，你可以在其中接受响应格式作为 URL 的一部分。

路由格式是客户端和服务器之间的约定，用于返回何种类型的响应：
```javascript
Route.get('users', async ({ request, view }) => {
  const users = await User.all()

  if (request.format() === 'json') {
    return users
  }

  return view.render('users.index', { users })
}).formats(['json'])
```
对于上面的示例， /users 节点将能够基于 URL 以多种格式进行响应：
```javascript
GET /users.json     # Returns an array of users in JSON
GET /users          # Returns the view in HTML
```
你还可以禁用默认 URL 并强制客户端定义格式：
```javascript
Route.get('users', closure).formats(['json', 'html'], true)
```
 true 作为第二个参数传递可确保客户端指定其中一种预期格式。否则，抛出 404 错误。

## 路由资源
你通常会创建资源丰富的路由来对资源执行 CRUD 操作。

 **Route.resource** 使用单行代码将 CRUD 路由分配给控制器：
```javascript
// resource 路由命名方式
Route.resource('users', 'UserController')

// 等同于
Route.get('users', 'UserController.index').as('users.index')
Route.post('users', 'UserController.store').as('users.store')
Route.get('users/create', 'UserController.create').as('users.create')
Route.get('users/:id', 'UserController.show').as('users.show')
Route.put('users/:id', 'UserController.update').as('users.update')
Route.patch('users/:id', 'UserController.update')
Route.get('users/:id/edit', 'UserController.edit').as('users.edit')
Route.delete('users/:id', 'UserController.destroy').as('users.destroy')
```
> 注意：此功能仅在将路由绑定到 Controller 时可用。
你也可以进行资源嵌套：
```javascript
Route.resource('posts.comments', 'PostCommentController')
```
### 资源过滤
你可以通过 **Route.resource** 方法来限制方法分配的路由。

#### apiOnly
移除 **GET resource/create** 和 **GET resource/:id/edit** 路由：
```javascript
Route.resource('users', 'UserController')
  .apiOnly()
  ```
#### only
仅保留传递的路由：
```javascript
启动/ routes.js
Route.resource('users', 'UserController')
  .only(['index', 'show'])
  ```
#### except
保留指定的路由以外的所有路由：
```javascript
启动/ routes.js
Route.resource('users', 'UserController')
  .except(['index', 'show'])
  ```
### 资源中间件
你可以像使用单个路由一样将中间件附加到资源路由：
```javascript
启动/ routes.js
Route.resource('users', 'UserController')
  .middleware(['auth'])
  ```
如果你不想将中间件附加到通过 **Route.resource** 生成的所有路由，你可以通过传递 Map 给 middleware 方法来自定义此行为：
```javascript
Route.resource('users', 'UserController')
  .middleware(new Map([
    [['store', 'update', 'destroy'], ['auth']]
  ]))
  ```
在上面的示例中， auth 中间件仅应用于 store ，update 和 destory 路由。

### 资源格式
你可以通过 formats 方法为资源路由定义响应格式：
```javascript
Route.resource('users', 'UserController')
  .formats(['json'])
  ```
## 路由域
你的应用程序可能使用多个域名。

 **AdonisJs** 可以非常轻松地处理这个问题。

域名可以是静态端点 **blog.adonisjs.com** ，也可以是动态端点: user.adonisjs.com。

> 你也可以在单个路由上定义域。
```javascript
Route.group(() => {
  Route.get('/', ({ subdomains }) => {
    return `The username is ${subdomains.user}`
  })
}).domain(':user.myapp.com')
```
在上面的示例中，如果你访问过 **virk.myapp.com** ，你会看到 The username is virk 。

## 路由组
如果你的路由共享通用的逻辑或者配置，你可以对它们进行分组，而不需要为每个路由进行单独配置，：
```javascript
// Ungrouped
Route.get('api/v1/users', closure)
Route.post('api/v1/users', closure)

// Grouped
Route.group(() => {
  Route.get('users', closure)
  Route.post('users', closure)
}).prefix('api/v1')
```
#### 前缀
使用路由组在路由上定义前缀：
```javascript
Route.group(() => {
  Route.get('users', closure)   // GET /api/v1/users
  Route.post('users', closure)  // POST /api/v1/users
}).prefix('api/v1')
```
#### 中间件
使用路由组在路由上定义中间件：
```javascript
Route.group(() => {
  //
}).middleware(['auth'])
```
> 路由组中间件在路由中间件之前执行。
#### 命名空间
使用路由组在路由上定义命名空间：
```javascript
Route.group(() => {
  // Binds '/users' to 'App/Controllers/Http/Admin/UserController'
  Route.resource('/users', 'UserController')
}).namespace('Admin')
```
#### 格式
使用路由组在路由上定义格式：
```javascript
Route.group(() => {
  //
}).formats(['json', 'html'], true)
```
#### 域名
指定哪个路由组属于某个域名：
```javascript
启动/ routes.js
Route.group(() => {
  //
}).domain('blog.adonisjs.com')
```
> 译者注： 路由组也可以嵌套