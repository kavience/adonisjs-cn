# Session
AdonisJs 拥有很好的 session 支持，可以使用各种内置驱动程序来高效管理和存储 session 。

在本指南中，我们将学习如何配置和使用这些不同的 session 驱动程序。

## 建立
如果尚未设置 session 驱动程序，请按照以下说明操作。

首先，运行 adonis 命令以下载 session 提供程序：
```bash
adonis install @adonisjs/session
```
以上命令还会创建 config/session.js 文件并显示一小组说明以帮助你完成设置。

接下来，在 **start/app.js** 文件中注册 session 提供程序：
```javascript
const providers = [
  '@adonisjs/session/providers/SessionProvider'
]
```
最后，在 start/kernel.js 文件中注册 session 中间件：
```javascript
const globalMiddleware = [
  'Adonis/Middleware/Session'
]
```
## 支持的驱动程序
以下是 session 提供程序支持的驱动程序列表。你可以更改 config/session.js 文件中的当前驱动程序。

Redis 驱动程序需要该 @adonisjs/redis 程序包(有关安装说明，请参阅 Redis 部分)。
名称|配置密钥|描述
-|-|-
Cookie|cookie|将 session 值保存在加密的cookie中。
File|file|将 session 值保存在服务器上的文件中(如果你在多个服务器上运行 AdonisJs 并且使用了负载均衡，则不应使用该值)。
Redis|redis|将 session 值保存在 Redis 中。

## 基本的例子
该 session 对象作为 HTTP Context 的一部分传递，就像 request 和 response 对象一样。

以下是如何在 HTTP 生命周期中使用 session 的快速示例：
```javascript
Route.get('/', ({ session, response }) => {
  session.put('username', 'virk')
  response.redirect('/username')
})

Route.get('/username', ({ session }) => {
  return session.get('username') // 'virk'
})
```
##  session 方法
以下是所有 session 方法及其示例用法的列表。

#### put(key，value)
将键值对添加到 session 存储：
```javascript
session.put('username', 'virk')
```
#### get(key，[defaultValue])
返回给定键的值(接受可选的默认值)：
```javascript
session.get('username')

// default value
session.get('username', 'defaultName')
```
#### all
从 session 存储中将所有内容作为对象返回：
```javascript
session.all()
```
#### increment(key, [steps])
增加给定键的值(确保前一个值是一个数字)：
```javascript
session.increment('counter')

// increment by 5
session.increment('counter', 5)
```
#### decrement(key, [steps])
减小给定键的值(确保前一个值是一个数字)：
```javascript
session.decrement('counter')

// decrement by 2
session.decrement('counter', 2)
```
#### forget(key)
从 session 存储中删除键值对：
```javascript
session.forget('username')
```
#### pull(key，[defaultValue])
从 session 存储中返回(然后删除)键值对：
```javascript
const username = session.pull('username') // returns username

session.get('username') // null
```
#### clear
清空 session 存储：
```javascript
session.clear()
```
## Flash消息
Flash 消息仅是单个 request 的短期 session 值。它们主要用于闪存错误等，但也可用于其他目的。

### HTML 表单示例
假设我们想要验证提交的用户数据，并在存在验证错误时重定向回我们的表单。

从以下HTML表单开始：
```html
<form method="POST" action="/users">
  {{ csrfField() }}
  <input type="text" name="username" />
  <button type="submit">Submit</button>
</form>
```
然后，注册 **/users** 路由以验证表单数据：
```javascript
const { validate } = use('Validator')

Route.post('users', ({ request, session, response }) => {
  const rules = { username: 'required' }
  const validation = await validate(request.all(), rules)

  if (validation.fails()) {
    session.withErrors(validation.messages()).flashAll()
    return response.redirect('back')
  }

  return 'Validation passed'
})
```
最后，重写 HTML 表单以使用视图助手检索 Flash 数据：
```javascript
<form method="POST" action="/users">
  {{ csrfField() }}
  <input type="text" name="username" value="{{ old('username', '') }}" />
  {{ getErrorFor('username') }}
  <button type="submit">Submit</button>
</form>
```
### Flash方法
以下是所有 session Flash 方法及其示例用法的列表。

#### flashAll
Flash  request 表单数据：
```javascript
session.flashAll()
```
#### flashOnly
仅闪存选定的字段：
```javascript
session.flashOnly(['username', 'email'])
```
#### flashExcept
闪存除选定字段之外的 request 表单数据：
```javascript
session.flashExcept(['password', 'csrf_token'])
```
#### withErrors
Flash 中包含一系列错误：
```javascript
session
  .withErrors([{ field: 'username', message: 'Error message' }])
  .flashAll()
```
#### flash
Flash 自定义对象：
```javascript
session.flash({ notification: 'You have been redirected back' })
```
### View 帮助函数
使用 Flash 消息时，可以使用以下视图助手从 Flash session 存储中读取值。
```javascript
old(key，defaultValue)
```
从闪存存储返回给定键的值：
```javascript
session.flashOnly(['username'])
<input type="text" name="username" value="{{ old('username', '') }}" />
```
### hasErrorFor(key)
如果 flash 存储中的给定字段存在错误，则返回 true ：
```javascript
session
  .withErrors({ username: 'Username is required' })
  .flashAll()
@if(hasErrorFor('username'))
  // display error
@endif
```
#### getErrorFor(key)
返回给定字段的错误消息：
```javascript
session
  .withErrors({ username: 'Username is required' })
  .flashAll()
```
#### flashMessage(key，defaultValue)
返回给定键的 flash 消息：
```javascript
session.flash({ notification: 'Update successful!' })
@if(flashMessage('notification'))
  <span>{{ flashMessage('notification') }}</span>
@endif
```
##  session 持久性
当 request 结束时， session 值将大量保留。这样可以保持  request / response 的性能，因为你可以根据需要多次改变 session 存储，并且只在最后执行批量更新。

它是通过 AdonisJs 中间件实现的(参见[此处](https://github.com/adonisjs/adonis-session/blob/develop/src/Session/Middleware.js#L89)的实现)。

但是，如果抛出异常，则中间件层会中断，并且永远不会提交 session 值。

AdonisJs 的第一方软件包处理得很好，但如果要处理自己的异常，则应手动提交 session ：
```javascript
const GE = require('@adonisjs/generic-exceptions')

class MyCustomException extends GE.LogicalException {
  handle (error, { session }) {
    await session.commit()
    // handle exception
  }
}
```