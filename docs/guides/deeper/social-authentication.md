# 公共认证
建立
配置
基本例子
Ally API
用户API
Ally是AdonisJs的第一方社会认证提供商。

使用Ally使通过第三方网站（如Google，Twitter和Facebook）对用户进行身份验证变得微不足道。

该盟友提供支持以下驱动程序：

Facebook（facebook）

Github（github）

谷歌（google）

Instagram（instagram）

Linkedin（linkedin）

Twitter（twitter）

Foursquare（foursquare）

建立
由于默认情况下未安装Ally Provider，我们需要从npm中提取它：

> adonis install @adonisjs/ally
接下来，在start/app.js文件中注册提供程序：

启动/ app.js
const providers = [
  '@adonisjs/ally/providers/AllyProvider'
]
社交身份验证配置保存在config/services.js文件中，该文件是adonis install在安装Ally Provider时由命令创建的。
配置
您的配置必须存储在config/services.js文件的ally对象中：

配置/ services.js
module.exports = {
  ally: {
    facebook: {}
  }
}
您始终可以在Github上访问最新的配置源文件。
基本例子
让我们从使用Facebook登录的基本示例开始。

首先，我们需要注册路由以将用户重定向到Facebook，然后在用户从Facebook重定向时处理响应：

启动/ routes.js
Route.get('login/facebook', 'LoginController.redirect')
Route.get('facebook/callback', 'LoginController.callback')
确保正确配置了Auth Provider和auth相关的中间件。
接下来，我们需要创建控制器来实现我们的路由方法：

> adonis make:controller Login
应用程序/控制器/ HTTP / LoginController.js
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
我们现在有几行代码的完整工作登录系统！

Ally的API在驱动程序中是一致的，因此很容易facebook与google应用程序所需的交换或任何其他驱动程序交换。

Ally API
以下是可用功能列表。

重定向
将用户重定向到第三方网站：

await ally.driver('facebook').redirect()
getRedirectUrl
以字符串形式获取重定向网址：

const url = await ally.driver('facebook').getRedirectUrl()

return view.render('login', { url })
范围（scopesArray）
在重定向用户之前定义运行时作用域：

await ally
  .driver('facebook')
  .scope(['email', 'birthday'])
  .redirect()
查看相关提供商的官方OAuth文档，了解其可用范围列表。
字段（fieldsArray）
获取经过身份验证的用户配置文件时要获取的字段：

await ally
  .driver('facebook')
  .fields(['username', 'email', 'profile_pic'])
  .getUser()
的getUser
获取经过身份验证的用户的用户配置文件（返回AllyUser实例）：

await ally
  .driver('facebook')
  .fields(['email'])
  .getUser()
getUserByToken（accessToken，[accessSecret]）
返回使用用户的详细信息accessToken：

await ally.getUserByToken(accessToken)
当使用客户端代码执行OAuth操作并且您可以访问时，这非常有用accessToken。

使用OAuth 1协议accessSecret时需要该参数（例如，Twitter依赖于OAuth 1）。
用户API
以下是AllyUser实例上的可用方法列表。

的getName
返回用户名：

const user = await ally.driver('facebook').getUser()

user.getName()
getEmail
返回用户电子邮件：

user.getEmail()
某些第三方提供商不共享电子邮件，在这种情况下此方法返回null。
getNickname
返回用户的昵称/显示名称：

user.getNickname()
getAvatar
返回用户个人资料图片的公共URL：

user.getAvatar()
getAccessToken
返回稍后可用于更新用户配置文件的访问令牌：

user.getAccessToken()
getRefreshToken
刷新令牌在访问令牌到期时使用：

user.getRefreshToken()
仅在第三方提供商实施OAuth 2时可用。
getExpires
访问令牌到期数据：

user.getExpires()
仅在第三方提供商实施OAuth 2时可用。
getTokenSecret
返回令牌密钥：

user.getTokenSecret()
仅在第三方提供商实施OAuth 1时可用。
getOriginal
第三方提供商返回的原始有效负载：

user.getOriginal()
