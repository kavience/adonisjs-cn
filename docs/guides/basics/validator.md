# 验证器

AdonisJs 使得在 **validation provider** 的帮助下验证用户输入变得简单。

在本指南中，你将学习如何手动或通过路由验证器验证数据。

> AdonisJs 验证器使用的是 [Indicative](http://indicative.adonisjs.com/) 。有关完整用法的详细信息，请参阅官方文档。
## 建立
按照以下说明设置验证器。

首先，运行 adonis 命令以下载验证器提供程序：
```bash
adonis install @adonisjs/validator
```
然后，在 start/app.js文件中注册验证器提供程序：
```javascript
const providers = [
  '@adonisjs/validator/providers/ValidatorProvider'
]
```
## 验证用户输入
让我们从验证 HTML 表单收到的用户输入的示例开始：
```html
<form method="POST" action="{{ route('UserController.store') }}">
  <div>
    <input type="text" name="email" />
  </div>

  <div>
    <input type="text" name="password" />
  </div>

  <button type="submit"> Submit </button>
</form>
```
注册路由和控制器以处理表单提交的数据，并使用验证器验证数据：
```javascript
Route.post('users', 'UserController.store')
const { validate } = use('Validator')

class UserController {

  async store ({ request, session, response }) {
    const rules = {
      email: 'required|email|unique:users,email',
      password: 'required'
    }

    const validation = await validate(request.all(), rules)

    if (validation.fails()) {
      session
        .withErrors(validation.messages())
        .flashExcept(['password'])

      return response.redirect('back')
    }

    return 'Validation passed'
  }
}

module.exports = UserController
```
让我们将上面的控制器代码分解为小步骤：

- 定义了 rules 规则

- 使用该 validate 方法根据规则验证所有请求数据。

- 如果验证失败，则清除所有错误并重定向回我们的表单。

### 显示闪存错误
我们可以修改HTML表单以显示我们的flash消息，这些消息在验证失败时设置：
```html
<form method="POST" action="{{ route('UserController.store') }}">
  <div>
    <input type="text" name="email" value="{{ old('email', '') }}" />
    {{ elIf('<span>$self</span>', getErrorFor('email'), hasErrorFor('email')) }}
  </div>

  <div>
    <input type="text" name="password" />
    {{ elIf('<span>$self</span>', getErrorFor('password'), hasErrorFor('password')) }}
  </div>

  <button type="submit"> Submit </button>
</form>
```
## 验证方法
以下是可用方法列表。

#### validate(data, rules, [messages], [formatter])
使用定义的规则验证数据：
```javascript
const { validate } = use('Validator')

const validation = await validate(data, rules)

if (validation.fails()) {
  return validation.messages()
}
```
> 你可以选择传递自定义错误消息，以在验证失败时作为第三个方法参数返回。
#### validateAll(data, rules, [messages], [formatter])
和 validate 一样，但是该 validate 方法在遇到第一个错误时就停止：
```javascript
const { validateAll } = use('Validator')
const validation = await validateAll(data, rules)
```
#### sanitize(data, rules)
此方法返回通过验证的新对象：
```javascript
const { sanitize } = use('Validator')
const data = sanitize(request.all(), rules)
```
#### sanitizor
Returns a reference to Indicative’s [sanitizor](http://indicative.adonisjs.com/docs/api/extend#_adding_sanitization_rules):
```javascript
const { sanitizor } = use('Validator')
const slug = sanitizor.slug('My first blog post')
```
> 这一句我还不是很理解，日后再说

#### formatters
Returns a reference to Indicative’s formatters:
```javascript
const { formatters } = use('Validator')
validate(data, rules, messages, formatters.JsonApi)
```
## 路由验证器
数据验证通常发生在 HTTP 请求和响应生命周期中，你最终可以在每个控制器内编写相同的验证代码。

 AdonisJs 路由验证器可以使验证的过程更简单：
```javascript
// For a single route
Route
  .post('users', 'UserController.store')
  .validator('StoreUser')

// For a resourceful route
Route
  .resource('users', 'UserController')
  .validator(new Map([
    [['users.store'], ['StoreUser']],
    [['users.update'], ['UpdateUser']]
  ]))
```
> 验证器位于 app/Validators 目录内。
让我们使用以下 adonis 命令创建一个 StoreUser 验证器：
```bash
adonis make:validator StoreUser
```
该命令自动在 app/Validators 目录下生成一个 StoreUser.js。

现在，我们需要做的就是在验证器上定义我们的规则：
```javascript
'use strict'

class StoreUser {
  get rules () {
    return {
      email: 'required|email|unique:users',
      password: 'required'
    }
  }
}

module.exports = StoreUser
```
如果验证失败，验证器会自动将错误设置为闪存消息，并将用户重定向回表单。

> 如果请求具有 **Accept: application/json** 标头，则响应将作为 JSON 发回。
### 自定义错误消息
默认错误消息可能会让用户感到困惑，因此需要创建自己的自定义验证错误消息。

AdonisJs 提供以下方法来实现。

只需在路由验证器上声明一个 messages 方法，并返回一个包含每条规则消息的对象，如下所示：
```javascript
'use strict'

class StoreUser {
  get rules () {
    return {
      email: 'required|email|unique:users',
      password: 'required'
    }
  }

  get messages () {
    return {
      'email.required': 'You must provide a email address.',
      'email.email': 'You must provide a valid email address.',
      'email.unique': 'This email is already registered.',
      'password.required': 'You must provide a password'
    }
  }
}

module.exports = StoreUser
```
验证所有
要验证所有字段，设置一个 validateAll 方法，并且返回 true ：
```javascript
'use strict'

class StoreUser {
  get validateAll () {
    return true
  }
}

module.exports = StoreUser
```
### 消除用户输入
你可以通过定义 sanitizationRules 在验证发生之前对请求数据执行的操作来过滤用户的输入：
```javascript
class StoreUser {
  get sanitizationRules () {
    return {
      email: 'normalize_email',
      age: 'to_int'
    }
  }
}

module.exports = StoreUser
```
> 意思是将输入过来的 email 转化为 emial 格式，age 转化为整数

#### 处理验证失败
由于每个应用程序的结构都不同，因此有时可能不希望自动处理错误。

你可以通过向 fails 验证器添加方法来手动处理故障：
```javascript
class StoreUser {
  async fails (errorMessages) {
    return this.ctx.response.send(errorMessages)
  }
}

module.exports = StoreUser
```
#### 自定义数据对象
你可能希望验证不属于请求正文的自定义属性（例如，标题）。

这可以通过 data 在验证器类上定义属性来完成：
```javascript
class StoreUser {
  get rules () {
    return {
      sessionId: 'required'
    }
  }

  get data () {
    const requestBody = this.ctx.request.all()
    const sessionId = this.ctx.request.header('X-Session-Id')

    return Object.assign({}, requestBody, { sessionId })
  }
}

module.exports = StoreUser
```
#### 格式化
你还可以将 [Indicative formatter](http://indicative.adonisjs.com/docs/formatters#_available_formatters) 定义为 validator 类的属性：
```javascript
const { formatters } = use('Validator')

class StoreUser {
  get formatter () {
    return formatters.JsonApi
  }
}
```
#### 授权
你可能希望执行检查以确保用户有权采取所需的操作。

这可以通过 authorize 在验证器类上定义一个方法来完成：
```javascript
class StoreUser {
  async authorize () {
    if (!isAdmin) {
      this.ctx.response.unauthorized('Not authorized')
      return false
    }

    return true
  }
}

module.exports = StoreUser
```
从 authorize 方法返回一个布尔值，告诉验证器是否将请求转发给控制器。
#### Request context
所有路由验证器都可以通过 this.ctx 访问当前 Request context 。

## 自定义规则
AdonisJs 支持所有 [Indicative](https://indicative.adonisjs.com/) 验证，但也添加了一些自定义规则。

以下是自定义 AdonisJs 规则的列表。

#### unique(tableName, [fieldName], [ignoreField], [ignoreValue])
确保给定值对于给定的数据库表是唯一的：
```javascript
'use strict'

class StoreUser {
  get rules () {
    return {
      email: 'unique:users,email'
    }
  }
}
```
更新现有用户配置文件时，在执行 unique 规则时无需检查其电子邮件地址。这可以通过定义 ignoreField (id) 和 ignoreValue (userId) 来完成：
```javascript
class StoreUser {
  get rules () {
    const userId = this.ctx.params.id

    return {
      email: `unique:users,email,id,${userId}`
    }
  }
}
```
## 扩展验证器
作为如何扩展 AdonisJs 的示例 Validator，首先添加一个新规则，以确保在向数据库添加新评论时存在帖子。

我们称这个规则为 exists ：
```javascript
const Validator = use('Validator')
const Database = use('Database')

const existsFn = async (data, field, message, args, get) => {
  const value = get(data, field)
  if (!value) {
    /**
     * skip validation if value is not defined. `required` rule
     * should take care of it.
    */
    return
  }

  const [table, column] = args
  const row = await Database.table(table).where(column, value).first()

  if (!row) {
    throw message
  }
}

Validator.extend('exists', existsFn)
```
我们可以使用我们的新 exists 规则：
```javascript
get rules () {
  return {
    post_id: 'exists:posts,id'
  }
}
```
> 由于要扩展的代码 Validator 只需执行一次，因此你可以使用 Provider 或 Ignitor hooks 来执行此操作。阅读 [Extending the Core](https://adonisjs.com/docs/4.1/extending-adonisjs) 以获取更多信息。
