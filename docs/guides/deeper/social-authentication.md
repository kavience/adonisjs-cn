# 公共认证
Ally 是 AdonisJs 的第一方认证提供商。

使用 Ally 使通过第三方网站(如 Google， Twitter 和 Facebook )对用户进行身份验证变得微不足道。

Ally 提供支持以下驱动程序：

- Facebook ( facebook )

- Github ( github )

- Google ( google )

- Instagram ( instagram )

- Linkedin ( linkedin )

- Twitter ( twitter )

- Foursquare ( foursquare )

## 建立
由于默认情况下未安装 Ally Provider ，我们需要从 npm 中提取它：
```bash
> adonis install @adonisjs/ally
```
接下来，在 start/app.js 文件中注册提供程序：
```javascript
const providers = [
  '@adonisjs/ally/providers/AllyProvider'
]
```
社交身份验证配置保存在 config/services.js 文件中，该文件是 adonis install 在安装 Ally Provider 时由命令创建的。
## 配置
你的配置必须存储在 config/services.js 文件的 ally 对象中：
```javascript
module.exports = {
  ally: {
    facebook: {}
  }
}
```
你始终可以在 Github 上访问最新的配置源文件。
## 基本例子
让我们从使用 Facebook 登录的基本示例开始。

首先，我们需要注册路由以将用户重定向到 Facebook ，然后在用户从 Facebook 重定向时处理响应：
```javascript
Route.get('login/facebook', 'LoginController.redirect')
Route.get('facebook/callback', 'LoginController.callback')
```
确保正确配置了 Auth Provider 和 auth 相关的中间件。
接下来，我们需要创建控制器来实现我们的路由方法：
```bash
> adonis make:controller Login
```
```javascript
const User = use('App/Models/User')

class LoginController {
  async redirect ({ ally }) {
    await ally.driver('facebook').redirect()
  }

  async callback ({ ally, auth }) {
    try {
      const fbUser = await ally.driver('facebook').getUser()

      // user details to be saved
      const userDetails = {
        email: fbUser.getEmail(),
        token: fbUser.getAccessToken(),
        login_source: 'facebook'
      }

      // search for existing user
      const whereClause = {
        email: fbUser.getEmail()
      }

      const user = await User.findOrCreate(whereClause, userDetails)
      await auth.login(user)

      return 'Logged in'
    } catch (error) {
      return 'Unable to authenticate. Try again later'
    }
  }
}
```
我们现在有几行代码的完整工作登录系统！

Ally 的 API 在驱动程序中是一致的，因此很容易 facebook 与 google 应用程序所需的交换或任何其他驱动程序交换。

## Ally API
以下是可用功能列表。

#### redirect
将用户重定向到第三方网站：
```javascript
await ally.driver('facebook').redirect()
```
#### getRedirectUrl
以字符串形式获取重定向网址：
```javascript
const url = await ally.driver('facebook').getRedirectUrl()

return view.render('login', { url })
```
#### scope(scopesArray)
在重定向用户之前定义运行时作用域：
```javascript
await ally
  .driver('facebook')
  .scope(['email', 'birthday'])
  .redirect()
```
> 查看相关提供商的官方 OAuth 文档，了解其可用范围列表。
#### fields(fieldsArray)
获取经过身份验证的用户配置文件时要获取的字段：
```javascript
await ally
  .driver('facebook')
  .fields(['username', 'email', 'profile_pic'])
  .getUser()
```
#### getUser
获取经过身份验证的用户的用户配置文件(返回AllyUser实例)：

await ally
  .driver('facebook')
  .fields(['email'])
  .getUser()
#### getUserByToken(accessToken，[accessSecret])
返回使用用户的详细信息 accessToken ：
```javascript
await ally.getUserByToken(accessToken)
```
这在使用客户端代码执行 OAuth 操作并且你有权访问 accesstoken 时很有用。

> 使用 OAuth 1 协议 accessSecret 时需要该参数(例如， Twitter 依赖于 OAuth 1 )。
## 用户API
以下是 AllyUser 实例上的可用方法列表。

#### getName
返回用户名：
```javascript
const user = await ally.driver('facebook').getUser()

user.getName()
```
#### getEmail
返回用户电子邮件：
```javascript
user.getEmail()
```
某些第三方提供商不共享电子邮件，在这种情况下此方法返回 null 。
#### getNickname
返回用户的昵称/显示名称：
```javascript
user.getNickname()
```
#### getAvatar
返回用户个人资料图片的公共URL：
```javascript
user.getAvatar()
```
#### getAccessToken
返回稍后可用于更新用户配置文件的访问令牌：
```javascript
user.getAccessToken()
```
#### getRefreshToken
刷新令牌在访问令牌到期时使用：
```javascript
user.getRefreshToken()
```
仅在第三方提供商实施 OAuth 2 时可用。
#### getExpires
访问令牌到期数据：
```javascript
user.getExpires()
```
仅在第三方提供商实施 OAuth 2 时可用。
#### getTokenSecret
返回令牌密钥：
```javascript
user.getTokenSecret()
```
仅在第三方提供商实施 OAuth 1 时可用。
#### getOriginal
第三方提供商返回的原始有效负载：
```javascript
user.getOriginal()
```