(window.webpackJsonp=window.webpackJsonp||[]).push([[52],{224:function(t,a,s){"use strict";s.r(a);var n=s(0),e=Object(n.a)({},function(){var t=this,a=t.$createElement,s=t._self._c||a;return s("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[s("h1",{attrs:{id:"介绍"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#介绍","aria-hidden":"true"}},[t._v("#")]),t._v(" 介绍")]),t._v(" "),s("p",[t._v("AdonisJs 提供了一些工具，可以保护你的网站免受常见的网络攻击。")]),t._v(" "),s("p",[t._v("在本指南中，我们将了解保持 AdonisJs 应用程序安全的最佳做法。")]),t._v(" "),s("blockquote",[s("p",[t._v("如果你发现任何安全漏洞，请立即通过电子邮件通知我们。不要创建 GitHub 问题，因为这可能会影响在生产中运行的应用程序。一旦将补丁推送到代码库，就会发现已发现的问题。")])]),t._v(" "),s("h2",{attrs:{id:"会话安全"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#会话安全","aria-hidden":"true"}},[t._v("#")]),t._v(" 会话安全")]),t._v(" "),s("p",[t._v("如果不小心处理，会话可能泄漏重要信息。")]),t._v(" "),s("p",[t._v("AdonisJs 使用 config/app.js 文件中的 appKey 对 cookie 加密和签名。")]),t._v(" "),s("p",[t._v("保证 appKey 安全 - 不要与任何人分享，也不要将其推送到像 Github 这样的版本控制系统。")]),t._v(" "),s("h4",{attrs:{id:"会话配置"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#会话配置","aria-hidden":"true"}},[t._v("#")]),t._v(" 会话配置")]),t._v(" "),s("p",[t._v("会话配置保存在 config/session.js 文件中。")]),t._v(" "),s("p",[t._v("更新会话配置时，请考虑以下建议：")]),t._v(" "),s("ul",[s("li",[s("p",[t._v("httpOnly 值应设置为 true ，因为设置为 false 将使你可以使用 JavaScript 访问你的 cookie  document.cookie。")])]),t._v(" "),s("li",[s("p",[t._v("sameSite 值也应设置为 true，确保你的会话 cookie 对于不同的域名不可见、不可访问。")])])]),t._v(" "),s("h2",{attrs:{id:"表单方法欺骗"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#表单方法欺骗","aria-hidden":"true"}},[t._v("#")]),t._v(" 表单方法欺骗")]),t._v(" "),s("p",[t._v("由于 HTML 表单只能创建 GET 和 POST 请求，因此你不能使用类似的 HTTP 谓词 PUT 或 DELETE 通过表单 method 属性执行资源操作。")]),t._v(" "),s("p",[t._v("为了解决这个问题， AdonisJs 实现了表单方法欺骗，使你能够通过请求 URL 的 _method 查询字符串参数发送你想要的 HTTP 方法：")]),t._v(" "),s("div",{staticClass:"language-javascript extra-class"},[s("pre",{pre:!0,attrs:{class:"language-javascript"}},[s("code",[t._v("Route"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("put")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'/users/:id'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'UserController.update'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n")])])]),s("div",{staticClass:"language-html extra-class"},[s("pre",{pre:!0,attrs:{class:"language-html"}},[s("code",[s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("<")]),t._v("form")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token attr-name"}},[t._v("action")]),s("span",{pre:!0,attrs:{class:"token attr-value"}},[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("=")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v('"')]),t._v("/users/1?_method=PUT"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v('"')])]),t._v(" "),s("span",{pre:!0,attrs:{class:"token attr-name"}},[t._v("method")]),s("span",{pre:!0,attrs:{class:"token attr-value"}},[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("=")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v('"')]),t._v("POST"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v('"')])]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("</")]),t._v("form")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("\n")])])]),s("p",[t._v("在上面的示例中，附加 ?_method=PUT 到表单的 actionURL 会将请求 HTTP 方法转换 POST 为 PUT 。")]),t._v(" "),s("p",[t._v("关于方法欺骗，你应该了解以下几点：")]),t._v(" "),s("ul",[s("li",[s("p",[t._v("AdonisJs 只能使用 HTTP 方法的 POST ，这意味着 GET 传递 HTTP 的请求 _method 不会被通过。")])]),t._v(" "),s("li",[s("p",[t._v("方法欺骗可以被禁用，在 config/app.js 文件，设置 allowMethodSpoofing 为 false ：")])])]),t._v(" "),s("div",{staticClass:"language-javascript extra-class"},[s("pre",{pre:!0,attrs:{class:"language-javascript"}},[s("code",[t._v("http"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  allowMethodSpoofing"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token boolean"}},[t._v("false")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),s("h2",{attrs:{id:"文件上传"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#文件上传","aria-hidden":"true"}},[t._v("#")]),t._v(" 文件上传")]),t._v(" "),s("p",[t._v("攻击者经常尝试将恶意文件上传到服务器以便以后执行并获取对服务器的访问权以执行某种破坏性活动。")]),t._v(" "),s("p",[t._v("除了上传恶意文件外，攻击者还可能会尝试上传大文件，因此你的服务器仍然忙于上传，并开始为后续请求抛出 TIMEOUT 错误。")]),t._v(" "),s("p",[t._v("为了解决这种情况， AdonisJs 允许你定义服务器可处理的最大上载大小。这意味着任何大于指定的文件都会 maxSize 被拒绝，从而使你的服务器保持健康状态。")]),t._v(" "),s("p",[t._v("maxSize 在 config/bodyParser.js 文件中设置你的值：")]),t._v(" "),s("div",{staticClass:"language-javascript extra-class"},[s("pre",{pre:!0,attrs:{class:"language-javascript"}},[s("code",[t._v("uploads"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  maxSize"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'2mb'")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),s("p",[t._v("以下是处理文件上传时需要考虑的一些提示：")]),t._v(" "),s("p",[t._v("在 上传/存储 之前重命名用户文件。")]),t._v(" "),s("p",[t._v("不要将上传的文件存储在 public 目录中，因为 public 可以直接访问文件。")]),t._v(" "),s("p",[t._v("不要与用户共享上传文件的实际位置。相反，请考虑在数据库中保存对上传文件路径的引用(每个文件具有唯一 ID )，并设置路由以通过以下方式为这些上载文件提供服务id：")]),t._v(" "),s("div",{staticClass:"language-JavaScript extra-class"},[s("pre",{pre:!0,attrs:{class:"language-javascript"}},[s("code",[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" Helpers "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("use")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'Helpers'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n\nRoute"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("get")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'download/:fileId'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("async")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token parameter"}},[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" params"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" response "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")])]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=>")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" file "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("await")]),t._v(" Files"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("findorFail")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("params"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("fileId"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n  response"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("download")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("Helpers"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("tmpPath")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'uploads/${file.path}'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n")])])])])},[],!1,null,null,null);a.default=e.exports}}]);