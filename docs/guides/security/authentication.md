# 权限认证
 AdonisJs 身份验证提供程序是一个功能齐全的系统，可使用多个身份验证器对 HTTP 请求进行身份验证。

使用身份验证器，你可以构建基于传统会话的登录系统并保护你的 API 。

> 对于固定用户配置文件管理，请查看官方 Adonis Persona 软件包 - 这是一项简单实用的服务，可让你在 AdonisJs 中创建，验证和更新用户配置文件。
## 验证器
每个验证器都是身份验证 Schemes 和 Serializers 的组合。

#### Schemes
- 会话(session)
- 基本认证(basic)
- JWT(jwt)
- 个人 API 令牌(api)

#### Serializers
- Lucid (lucid)
- 数据库 (database)

## 验证类型
身份验证分为两大类：有状态和无状态。

基于会话的身份验证被视为有状态，因为登录的用户可以导航到应用程序的不同区域而无需重新发送其凭据。

无状态身份验证要求用户在每个 HTTP 请求上重新发送其凭据，这在 API 中非常常见。

 AdonisJs 提供必要的工具和帮助程序，轻松管理这两种类型的身份验证。

## 密码哈希
 AdonisJs 身份验证提供程序使用 [哈希模块](https://adonisjs.com/docs/4.1/encryption-and-hashing#_hashing_values) 来验证密码。

始终在将密码保存到数据库之前对其进行哈希处理

## 建立
 AdonisJs auth 提供商预装了 fullstack 和 api 。

如果尚未设置身份验证提供程序，请按照以下说明操作。

首先，运行 adonis 命令以下载 auth 提供程序：
```bash
adonis install @adonisjs/auth
```
接下来，在 start/app.js 文件中注册 auth 提供程序：
```javascript
const providers = [
  '@adonisjs/auth/providers/AuthProvider'
]
```
最后，在start/kernel.js文件中注册auth中间件：
```javascript
const globalMiddleware = [
  'Adonis/Middleware/AuthInit'
]

const namedMiddleware = {
  auth: 'Adonis/Middleware/Auth',
  guest: 'Adonis/Middleware/AllowGuestOnly'
}
```
## 配置
你的身份验证配置保存在 **config/auth.js** 文件中。

默认情况下，session 身份验证器用于验证应用程序请求。

## 基本例子
让我们从登录用户的示例开始，然后仅在登录时向他们显示他们的个人资料。

首先，将以下路由添加到 start/routes.js 文件中：
```javascript
Route
  .post('login', 'UserController.login')
  .middleware('guest')

Route
  .get('users/:id', 'UserController.show')
  .middleware('auth')
```
接下来，UserController 通过 adonis 命令创建：
```bash
adonis make:controller User
```
将 login 方法添加到 UserController ：
```javascript
class UserController {

  async login ({ auth, request }) {
    const { email, password } = request.all()
    await auth.attempt(email, password)

    return 'Logged in successfully'
  }
}
```
上述 login 方法从请求中提取用户 email ，password 并在其凭据有效时将其登录。

最后，将 show 方法添加到 UserController ：
```javascript
class UserController {
  async login () {
    ...
  }

  show ({ auth, params }) {
    if (auth.user.id !== Number(params.id)) {
      return "You cannot see someone else's profile"
    }
    return auth.user
  }
}
```
上述 show 方法检查 idroute 参数是否等于当前登录的用户id。如果是，则返回经过身份验证的用户模型( AdonisJS 在最终响应中将其转换为 JSON )。

## Session
#### session 配置
```javascript
module.exports = {
  authenticator: 'session',
  session: {
    serializer: 'Lucid',
    scheme: 'session',
    model: 'App/Models/User',
    uid: 'email',
    password: 'password'
  }
}
```
键|值|描述
-|-|-
serializer|lucid, database|用于从数据库提取用户的序列化程序。
scheme|session, basic, jwt, api|用于获取和验证用户凭据的方案。
uid|数据库字段名称|数据库字段用作给定用户的唯一标识符。
password|数据库字段名称|用于验证用户密码的字段。
model|Model namespace (lucid only)|用于查询数据库的模型，仅在使用lucid序列化程序时适用。
table|仅在使用database序列化程序时适用。
### Seesion 方法
该会话认证公开以下方法来登录并验证用户身份。

#### 尝试(uid，密码)
通过 uid 和登录 password ，如果没有找到用户或密码无效，则抛出异常：
```javascript
await auth.attempt(uid, password)
```
#### 登录信息(用户)
通过user模型实例登录，不验证任何内容，只需将用户标记为已登录：
```javascript
const user = await User.find(1)

await auth.login(user)
```
#### loginViaId(ID)
登录via用户ID，查询数据库以确保用户存在：
```javascript
await auth.loginViaId(1)
```
#### 记得
调用方法时 attempt，login 或者 loginViaId 链接 remember 方法以确保用户在关闭浏览器后保持登录状态：
```javascript
await auth
  .remember(true)
  .attempt(email, password)
```
该 remember 方法为 tokens 表内的用户创建令牌。如果你想要撤销特定用户的长期会话，只需设置  is_revoked为 true 即可。
#### 校验
通过阅读会话检查用户是否已登录：
```javascript
try {
  await auth.check()
} catch (error) {
  response.send('You are not logged in')
}
```
#### 的getUser
返回登录的用户实例(通过 check 方法)：
```javascript
try {
  return await auth.getUser()
} catch (error) {
  response.send('You are not logged in')
}
```
#### 登出
注销当前登录的用户：
```javascript
await auth.logout()
```
## 基本认证
由于基本身份验证是无状态的，用户通过每个请求传递凭据，因此没有 login 和的概念 logout 。

> **Authorization = Basic <credentials>** 报头必须被设置为认证基本 AUTH 请求，其中 **<credentials>** 是一个 base64 的编码的字符串 uid:password ，其中，uid 是 uid 在所述数据库字段 config/auth.js 文件。
### 基本身份验证方法
在基本认证公开以下方法来验证用户身份。

#### 校验
检查用户在请求标头中的基本身份验证凭据，验证用户是否存在并验证其密码：
```javascript
try {
  await auth.check()
} catch (error) {
  response.send(error.message)
}
```
#### getUser
返回登录的用户实例(通过check方法)：
```javascript
try {
  return await auth.getUser()
} catch (error) {
  response.send('Credentials missing')
}
```
## JWT
JWT 身份验证是通过字符串令牌实现无状态身份验证的行业标准。

AdonisJs 通过其 jwt 身份验证器开箱即用，支持 JWT 令牌。

> **Authorization = Bearer <token>** 头必须设置为 JWT 身份验证请求，其中 <token> 是一个有效的JWT令牌。
### JWT 配置
```javascript
module.exports = {
  authenticator: 'jwt',
  jwt: {
    serializer: 'Lucid',
    model: 'App/Model/User',
    scheme: 'jwt',
    uid: 'email',
    password: 'password',
    options: {
      secret: Config.get('app.appKey'),
      // For additional options, see the table below...
    }
  }
}
```
键|值|默认值|描述
-|-|-|-
算法|HS256，HS384|HS256|用于生成令牌的算法。
有效时间|有效时间(以秒或毫秒为单位)|null|令牌有效期。
notBefore|有效时间(以秒或毫秒为单位)|null|保持令牌有效的最短时间。
audience|String|null|aud claim.
issuer|Array or String|null|iss claim.
subject|String|null|sub claim.

### JWT方法
在 JWT 认证公开以下方法来生成 JWT 令牌和验证用户。

#### attempt(uid, password, [jwtPayload], [jwtOptions])
验证用户凭据并在交换中生成 JWT 令牌：
```javascript
await auth.attempt(uid, password)
```
```javascript
{
  type: 'type',
  token: '.....',
  refreshToken: '....'
}
```
#### generate(user，[jwtPayload]，[jwtOptions])

为给定用户生成 JWT 令牌：
```javascript
const user = await User.find(1)

await auth.generate(user)
```
你可以选择传递要在令牌中编码的自定义对象。传递 jwtPayload=true 对令牌内的用户对象进行编码。

#### withRefreshToken
指示 JWT 身份验证器也生成刷新令牌：
```javascript
await auth
  .withRefreshToken()
  .attempt(uid, password)
```
生成刷新令牌，以便客​​户端可以刷新实际jwt令牌，而无需再次请求用户凭据。

#### generateForRefreshToken(refresh_token，[jwtPayload])
使用刷新令牌生成新的 JWT 令牌。传递 jwtPayload = true 会对令牌中的用户对象进行编码。
```javascript
const refreshToken = request.input('refresh_token')

await auth.generateForRefreshToken(refreshToken, true)
```
#### newRefreshToken
生成新 jwt 令牌时，身份验证提供程序不会重新发出新的刷新令牌，而是使用旧令牌。如果需要，还可以重新生成新的刷新令牌：
```javascript
await auth
  .newRefreshToken()
  .generateForRefreshToken(refreshToken)
```
#### 校验
检查是否已通过 Authorization 标头发送了有效的 JWT 令牌：
```javascript
try {
  await auth.check()
} catch (error) {
  response.send('Missing or invalid jwt token')
}
```
#### getUser
返回登录的用户实例(通过 check 方法)：
```javascript
try {
  return await auth.getUser()
} catch (error) {
  response.send('Missing or invalid jwt token')
}
```
#### listTokens
列出用户的所有 JWT 刷新令牌：
```javascript
await auth.listTokens()
```
## 个人API令牌
个人 API 令牌受到 Github 的欢迎，用于脚本，作为传统电子邮件和密码身份验证的可撤销替代品。

 AdonisJs 允许你构建应用程序，用户可以在其中创建个人 API 令牌并使用它们进行身份验证。

> **Authorization = Bearer <token>** 头必须设置为验证 API 身份验证请求，其中 <token> 是一个有效的 API 令牌。
### API方法
 API 认证公开以下方法来生成 API 令牌和验证用户。

#### attemp(uid，password)
验证用户凭据，然后为它们生成新令牌：
```javascript
const token = await auth.attempt(uid, password)
```
```javascript
{
  type: 'bearer',
  token: '...'
}
```
#### 生成(用户)
为给定用户生成令牌：
```javascript
const user = await User.find(1)

const token = await auth.generate(user)
```
#### 校验
检查是否已通过 Authorization 标头传递了有效的 API 令牌：
```javascript
try {
  await auth.check()
} catch (error) {
  response.send('Missing or invalid api token')
}
```
#### getUser
返回登录的用户实例(通过 check 方法)：
```javascript
try {
  await auth.getUser()
} catch (error) {
  response.send('Missing or invalid api token')
}
```
#### listTokens
列出用户的所有 API 令牌：

await auth.listTokens()
## 切换验证器
通过调用该方法，auth 提供程序可以在运行时在多个身份验证器之间切换 authenticator 。

假设用户使用 session 身份验证器登录，我们可以为它们生成 JWT 令牌，如下所示：
```javascript
// loggedin user via sessions
const user = auth.user

const auth
  .authenticator('jwt')
  .generate(user)
```
## Auth Middleware
该 auth 中间件为任何应用的路由自动身份验证。

它在 start/kernel.js 文件中注册为命名中间件：
```javascript
const namedMiddleware = {
  auth: 'Adonis/Middleware/Auth'
}
```
用法：
```javascript
Route
  .get('users/profile', 'UserController.profile')
  .middleware(['auth'])
```
## Guest 中间件
guest 中间件验证用户没有通过认证。
```javascript
它在 **start/kernel.js** 文件中注册为命名中间件：
```javascript
const namedMiddleware = {
  guest: 'Adonis/Middleware/AllowGuestOnly'
}
```
用法：
```javascript
// We don't want our logged-in user to access this view
Route
  .get('login', 'AuthController.login')
  .middleware(['guest'])
```
## 助手
auth 提供程序向视图实例添加了几个帮助程序，以便你可以围绕登录用户的状态编写 HTML 。

#### AUTH
参考 auth 对象：
```javascript
Hello {{ auth.user.username }}!
```
#### 登录
该 loggedIn 标记可用于 if/else 围绕登录用户进行编写：
```html
@loggedIn
  <h2> Hello {{ auth.user.username }} </h2>
@else
  <p> Please login </p>
@endloggedIn
```
## 撤销令牌
所述 jwt 和 api 方案公开方法使用撤消令牌 auth 接口。

因为 jwt ，只撤消刷新令牌，因为实际令牌永远不会保存在数据库中。
#### revokeTokens(tokens, delete = false)
以下方法将通过在tokens表中设置标志来撤消标记：
```javascript
const refreshToken = '' // get it from user

await auth
  .authenticator('jwt')
  .revokeTokens([refreshToken])
```
如果 true 作为第二个参数传递，则不会设置 is_revoked 数据库标志，而是从数据库中删除相关行：
```javascript
const refreshToken = '' // get it from user

await auth
  .authenticator('jwt')
  .revokeTokens([refreshToken], true)
```
要撤销所有令牌，请在revokeTokens没有任何参数的情况下调用：
```javascript
await auth
  .authenticator('jwt')
  .revokeTokens()
```
撤消 api 当前登录用户的令牌时，你可以从请求标头中访问该值：
```javascript
// for currently loggedin user
const apiToken = auth.getAuthHeader()

await auth
  .authenticator('api')
  .revokeTokens([apiToken])
revokeTokensForUser(user，tokens，delete = false)
```
此方法与方法的工作方式相同 revokeTokens ，但你可以自己指定用户：
```javascript
const user = await User.find(1)

await auth
  .authenticator('jwt')
  .revokeTokensForUser(user)
```
## 令牌加密
令牌以纯文本格式保存在数据库中，但以加密形式发送给最终用户。

这样做是为了确保有人访问你的数据库，他们无法直接使用你的令牌(他们必须弄清楚如何使用密钥加密它们)。

