# CSRF
跨站请求伪造( CSRF )允许攻击者在不知情或未经许可的情况下代表其他用户执行操作。

AdonisJs 通过拒绝未识别的请求来保护你的应用程序免受 CSRF 攻击。检查具有 POST，PUT 和 DELETE 方法的 HTTP 请求，以确保来自正确的人调用这些请求。

## 建立
通过 npm 安装 **sheild** 提供程序：
```bash
adonis install @adonisjs/shield
```
接下来，在 start/app.js 文件中注册提供程序：
```javascript
const providers = [
  '@adonisjs/shield/providers/ShieldProvider'
]
```
最后，在 start/kernel.js 文件中注册全局中间件：
```javascript
const globalMiddleware = [
  'Adonis/Middleware/Shield'
]
```
Shield 中间件依赖于会话，因此请确保它们已正确设置。
## 配置
CSRF 的配置保存在 config/shield.js 文件中：
```javascript
csrf: {
  enable: true,
  methods: ['POST', 'PUT', 'DELETE'],
  filterUris: ['/user/:id'],
  cookieOptions: {}
}
```
键|值|描述
-|-|-
enable|布尔|一个布尔值，用于打开/关闭整个应用程序的 CSRF 。
methods|数组|要受 CSRF 保护的 HTTP 谓词。考虑添加允许最终用户添加或修改数据的所有动词。
filterUris|数组|过滤的 URL 和路由列表。你可以传递实际路径定义或正则表达式以进行匹配。
cookieOptions|对象| [cookie option](https://www.npmjs.com/package/cookie#options-1) 的对象。

## 这个如何工作
- AdonisJs 为访问你网站的每个用户创建 CSRF 。

- 为每个请求生成一个相应的 token 标记，并作为 csrftoken 和 csrffield() 全局值传递给所有视图。

- 此外，相同的标记设置为带密钥的 cookie XSRF-TOKEN。像 AngularJs 这样的前端框架会自动读取此 cookie 并将其与每个 Ajax 请求一起发送。

- 每当发出 POST，PUT 或 DELETE 请求时，中间件都会使用密钥验证令牌以确保其有效。

> 如果你使用的是 XSRF-TOKENcookie 值，请确保标题键为 X-XSRF-TOKEN 。
## 查看助手
你可以使用以下视图助手之一访问 CSRF token ，以确保它在表单中设置。

要将令牌与每个请求一起发送，你需要访问它。有几种方法可以访问 CSRF 令牌。

#### csrfField
```javascript
{{ csrfField() }}
```
```html
<input type="hidden" name="_csrf" value="xxxxxx">
```
#### csrfToken
该 csrfToken 助手返回令牌的原始值：
```javascript
{{ csrfToken }}
```
## 异常处理
在验证失败时，将使用代码 EBADCSRFTOKEN 抛出异常。

确保你侦听此异常并返回适当的响应，如下所示：
```javascript
class ExceptionHandler {
  async handle (error, { response }) {
    if (error.code === 'EBADCSRFTOKEN') {
      response.forbidden('Cannot process your request.')
      return
    }
  }
}
```