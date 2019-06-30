# CORS
跨源资源共享( CORS )是一种允许来自不同域的传入 HTTP 请求的方法。

在 AJAX 应用程序中非常常见，如果服务器未授权，浏览器会阻止所有跨域请求。

点击 [这里](https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS) 了解更多关于 CORS。

## 建立
执行以下命令，通过 npm 安装中间件提供程序：
```bash
adonis install @adonisjs/cors
```
接下来，在 start/app.js 文件中注册提供程序：
```javascript
const providers = [
  '@adonisjs/cors/providers/CorsProvider'
]
```
最后，在 start/kernel.js 文件中注册中间件：
```javascript
Server
  .use(['Adonis/Middleware/Cors'])
```
## 配置
CORS 的配置在 config/cors.js 文件中定义，并接受以下选项。

#### 起源
允许进行跨域请求的来源。

返回以下值之一：

- 布尔值 true 或 false 拒绝当前请求源。

- 允许使用逗号分隔的域字符串。

- 允许的域数组。

- 一个函数，它接收当前请求源。在这里，你可以通过返回 true 或 false 来计算是否允许原点：
```javascript
配置/ cors.js
origin: function (currentOrigin) {
  return currentOrigin === 'mywebsite.com'
}
```
对于其他选项，请检查[配置文件](https://github.com/adonisjs/adonis-cors/blob/develop/config/cors.js#L3)中的注释。

