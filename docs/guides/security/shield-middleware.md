# 屏蔽中间件
除了 CORS 和 CSRF 之外，AdonisJs 还可以防止你的 Web 应用程序受到其他恶意软件攻击，如 **XSS, Content Sniffing, Script Injection** 等。

没有什么可以完全保护你的网站。 AdonisJs 作为一个框架为你提供了一些防止常见 Web 攻击的方法。
## 建立
安装 shield 提供程序并注册中间件：
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
> Shield 中间件依赖于会话，因此请确保它们已正确设置。
## 内容安全政策
内容安全策略( CSP )可帮助你定义用于加载和执行脚本，样式，字体和各种其他资源的可信来源。

在允许从不同来源执行脚本时严格要求是一种好习惯。

有关更多信息，请阅读 [HTML5 rock](http://www.html5rocks.com/en/tutorials/security/content-security-policy) 的这篇文章。

#### 配置
CSP 的配置保存在 config/shield.js 文件中：
```javascript
csp: {
  directives: {
    defaultSrc: ['self', 'http://getcdn.com'],
    scriptSrc: ['self', '@nonce'],
    styleSrc: ['http://getbootstrap.com'],
    imgSrc: ['http://dropbox.com']
  },
  reportOnly: false,
  setAllHeaders: false,
  disableAndroid: true
}
```
键|值|描述
-|-|-
directives|对象| Directives 可帮助你定义要应用于不同资源类型的策略。你可以从 http://content-security-policy.com 获取所有指令的列表。
reportOnly|布尔值|将值设置 true 为记录违反某些规则的警告，而不是停止执行页面。
setAllHeaders|布尔值| Shield 为不同的浏览器设置不同的 HTTP 标头。将值设置 true 为设置所有后备标头，而不管浏览器如何。
disableAndroid|布尔值|由于已知 Android 有关 CSP 的错误，请将值设置 true 为禁用 Android 的 CSP 。

#### 浏览器支持
几乎所有现代浏览器都支持 CSP 。

以下是支持的浏览器的[列表](http://caniuse.com/#feat=contentsecuritypolicy)。

#### 通过元标记的 CSP 策略
shield 中间件自动设置为 CSP 工作所需的 HTTP header ，如果需要的话提供了一个视图助手来设置 meta 标签：
```javascript
{{ cspMeta() }}
```
```html
<meta http-equiv="Content-Security-Policy" content="xxx">
```
CSP Nonce
带有内联 JavaScript 代码的脚本标记会自动受到浏览器的信任和执行。

可以通过添加 @nonce 到配置 scriptSrc 数组来停止此行为：
```javascript
csp: {
  directives: {
    scriptSrc: ['self', '@nonce']
  },
  // ...
}
```
要告诉浏览器哪些内联脚本块仍应执行，请在模板中 nonce 使用 cspNonce 视图全局追加属性，如下所示：
```javascript
<script nonce="{{ cspNonce }}">
  // ...
</script>
```
## 恶意软件防护
恶意软件防护有助于保护你的网站免受 XSS 攻击，不需要 iframe embeds, content-type sniffing 并且不让 IE 在你的网页上下文中执行未经请求的脚本。

#### XSS
编辑 xss 配置对象以 启用/禁用 XSS 保护(设置标头X-XSS-Protection=1; mode=block)：
```javascript
xss: {
  enabled: true,
  enableOnOldIE: false
}
```
#### No Sniff
大多数现代浏览器试图通过嗅探其内容来检测请求的 Content-Type ，这意味着如果包含 JavaScript 代码，则以 .txt 结尾的文件可以作为 JavaScript 执行。

要禁用此行为，请设置 nosniff 为 false ：
```javascript
{
  nosniff: true
}
```
#### No Open
IE 用户可以在你的网站环境中执行网页，这是一个严重的安全风险。

要阻止 IE 在你的网站上下文中执行未知脚本，请确保 noopen 设置为 true (设置标题 X-Download-Options: noopen )：
```javascript
{
  noopen: true
}
```
#### XFrame
文件中的 xframe 选项 config/shield.js 使你可以轻松控制网站在 iframe 中的嵌入行为。

可用选项是 DENY，SAMEORIGIN 或：ALLOW-FROM http://example.com
```javascript
{
  xframe: 'DENY'
}
```