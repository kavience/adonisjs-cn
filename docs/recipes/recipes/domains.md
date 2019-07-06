# 域名管理
我们都喜欢在开发中使用漂亮的域名，例如 .dev 。在本文中，我们将学习如何将自定义域绑定到你的应用，而不是访问 localhost 。

> 该技术没有技术优势或劣势，而是用作个人偏好。
## 设置 hotel
第一步是设置一个名为 hotel 的外部工具。它允许你注册应用程序或 URL 的域。
```bash
npm install -g hotel
```
接下来，我们需要 port=2000 使用以下命令将其作为守护程序启动。
```bash
hotel start
```
运行后，你可以运行 hotel ls 命令以查看已注册的应用/域的列表。

## 设置代理
让我们从理论上理解这是如何工作的。我们需要告诉我们的浏览器或系统网络通过一个代理，该代理服务于我们的 .dev 应用程序或将请求传递到实际的 URL 。

整个代理过程非常轻量级，不会影响你的系统性能或速度。

现在我们知道，所有魔法都是通过代理完成的，让我们更新浏览器/系统的设置以通过 hotel 代理传递。

### 系统配置
我们需要将网络指向 http://localhost:2000/proxy.pac 文件。

#### Mac OSX
```
Network Preferences > Advanced > Proxies > Automatic Proxy Configuration
```
#### windows
```
Settings > Network and Internet > Proxy > Use setup script
```
#### Linux（ubuntu）
```
System Settings > Network > Network Proxy > Automatic
```
### 浏览器配置
浏览器配置仅代理该浏览器的请求，而不是整个系统。

#### Chrome ( exit chrome first )
```
# Linux
google-chrome --proxy-pac-url=http://localhost:2000/proxy.pac

# OS X
open -a "Google Chrome" --args --proxy-pac-url=http://localhost:2000/proxy.pac
```
#### 火狐
```
Preferences > Advanced > Network > Connection > Settings > Automatic proxy URL configuration
```
## 与 AdonisJs 集成
现在 hotel 已经配置，我们可以独立于 AdonisJs 使用它来进行任何应用。但是，问题是所有注册的应用程序都会 hotel 永久映射，除非你手动删除它们。

此行为可能会导致问题，你希望你的一次性域在你的应用运行之前一直存在。

**Adonis cli adonis serve** 命令接受一个标志，该标志向 hotel 注册一次性域，并在你停止应用时将其删除。
```
adonis serve --domain=yardstick@http://localhost:3333
```
**--domain** 标志采用域和 URL 。在这种情况下
```
domain=yardstick

url=http://localhost:3333
```
