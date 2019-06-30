# 介绍
 AdonisJs 提供了一些工具，可以保护你的网站免受常见的网络攻击。

在本指南中，我们将了解保持 AdonisJs 应用程序安全的最佳做法。

> 如果你发现任何安全漏洞，请立即通过电子邮件通知我们。不要创建 GitHub 问题，因为这可能会影响在生产中运行的应用程序。一旦将补丁推送到代码库，就会发现已发现的问题。
## 会话安全
如果不小心处理，会话可能泄漏重要信息。

 AdonisJs 使用 config/app.js 文件中的 appKey 对 cookie 加密和签名。

保证 appKey 安全 - 不要与任何人分享，也不要将其推送到像 Github 这样的版本控制系统。

#### 会话配置
会话配置保存在 config/session.js 文件中。

更新会话配置时，请考虑以下建议：

- httpOnly 值应设置为 true ，因为设置为 false 将使你可以使用 JavaScript 访问你的 cookie  document.cookie。

- sameSite 值也应设置为 true，确保你的会话 cookie 对于不同的域名不可见、不可访问。

## 表单方法欺骗
由于 HTML 表单只能创建 GET 和 POST 请求，因此你不能使用类似的 HTTP 谓词 PUT 或 DELETE 通过表单 method 属性执行资源操作。

为了解决这个问题， AdonisJs 实现了表单方法欺骗，使你能够通过请求 URL 的 _method 查询字符串参数发送你想要的 HTTP 方法：
```javascript
Route.put('/users/:id','UserController.update')
```
```html
<form action="/users/1?_method=PUT" method="POST">
</form>
```
在上面的示例中，附加 ?_method=PUT 到表单的 actionURL 会将请求 HTTP 方法转换 POST 为 PUT 。

关于方法欺骗，你应该了解以下几点：

- AdonisJs 只能使用 HTTP 方法的 POST ，这意味着 GET 传递 HTTP 的请求 _method 不会被通过。

- 方法欺骗可以被禁用，在 config/app.js 文件，设置 allowMethodSpoofing 为 false ：
```javascript
http: {
  allowMethodSpoofing: false
}
```
## 文件上传
攻击者经常尝试将恶意文件上传到服务器以便以后执行并获取对服务器的访问权以执行某种破坏性活动。

除了上传恶意文件外，攻击者还可能会尝试上传大文件，因此你的服务器仍然忙于上传，并开始为后续请求抛出 TIMEOUT 错误。

为了解决这种情况， AdonisJs 允许你定义服务器可处理的最大上载大小。这意味着任何大于指定的文件都会 maxSize 被拒绝，从而使你的服务器保持健康状态。

 maxSize 在 config/bodyParser.js 文件中设置你的值：
```javascript
uploads: {
  maxSize: '2mb'
}
```
以下是处理文件上传时需要考虑的一些提示：

在 上传/存储 之前重命名用户文件。

不要将上传的文件存储在 public 目录中，因为 public 可以直接访问文件。

不要与用户共享上传文件的实际位置。相反，请考虑在数据库中保存对上传文件路径的引用(每个文件具有唯一 ID )，并设置路由以通过以下方式为这些上载文件提供服务id：

```JavaScript
const Helpers = use('Helpers')

Route.get('download/:fileId', async ({ params, response }) => {
  const file = await Files.findorFail(params.fileId)
  response.download(Helpers.tmpPath('uploads/${file.path}'))
})
```