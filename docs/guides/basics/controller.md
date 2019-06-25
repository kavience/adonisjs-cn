# 控制器
虽然闭包可能足以处理小型应用程序的路由逻辑，但当应用程序开始增长时，在其他地方组织应用程序逻辑会很有用。

这是控制器发挥作用的地方。

控制器连接到一个或多个路由，将相关的请求处理逻辑分组到单个文件中，控制器是模型、视图和你可能需要的任何其他服务之间的共同交互点。

> 控制器唯一的工作是响应HTTP请求。不要在不同的文件中引入它们。
## 创建控制器
要创建新控制器，请使用以下 **make:controller** 命令：
```bash
# HTTP Controller
 adonis make:controller User --type http

# WS Controller
 adonis make:controller User --type ws

# Will use an Admin subfolder
 adonis make:controller Admin/User
```
此命令在 App/Controllers/{TYPE} 文件夹中创建样板文件：
```javascript
'use strict'

class UserController {
  //
}

module.exports = UserController
```
> 使用该 --resource 标签创建一个资源控制器。
## 使用控制器
只能从路由访问控制器。

这是通过将控制器作为路由定义中的字符串引用来完成的：
```javascript
Route.get(url, 'UserController.index')
```
点之前的部分是对控制器文件的引用（例如 UserController ），默认情况下命名为 **App/Controllers/Http** 。

点后面的部分是你要在此控制器内调用的方法的名称（例如 index ）。

例如：
```javascript
// app/Controllers/Http/UserController -> index()
Route.get(url, 'UserController.index')

// app/Controllers/Http/Admin/UserController -> store()
Route.post(url, 'Admin/UserController.store')

// app/MyOwnControllers/UserController -> index()
Route.post(url, 'App/MyOwnControllers/UserController.index')
```
由于你定义的控制器方法是路由处理程序，因此它们将接收 [HTTP Context](/guides/concept/request-lifecycle.html) 作为参数：
```javascript
'use strict'

class UserController {
  index ({ request, response }) {
    //
  }
}

module.exports = UserController
```