# 配置
## 配置提供商
拥有可维护代码库的第一步是找到用于存储应用程序配置的专用位置。

 AdonisJs 使用 config 目录，其中所有文件在引导时加载。

你可以通过 Config Provider 访问配置值：
```javascript
const Config = use('Config')
const appSecret = Config.get('app.appSecret')
```
获取配置值，使用 Config.get 该值接受引用表单中所需键的字符串参数 fileName.key 。

你可以使用点表示法获取嵌套的配置值：
```javascript
// Example of a configuration file e.g. database.js
{
  mysql: {
    host: '127.0.0.1',
  },
}

// You can retrieve it like so...
Config.get('database.mysql.host')
```
如果你不确定配置中是否定义了密钥，则可以提供第二个参数，该参数将作为默认值返回：
```javascript
Config.get('database.mysql.host', '127.0.0.1')
```
如果要更改内存配置值，请使用 Config.set ：
```javascript
Config.set('database.mysql.host', 'db.example.com')
```
Config.set 只会更改内存中的值。它不会将新值写入配置文件。
## 环境提供者
构建应用程序时，你可能需要根据运行代码的环境进行不同的配置。

为了满足这一要求， AdonisJs 使用 dotenv 库。

在每个新的 AdonisJs 项目的根目录中，你将找到一个 .env.example 文件。如果你使用 AdonisJs  CLI 安装应用程序，则此文件将自动复制为 .env。否则，你应该手动复制它。

 .env 永远不应 将该文件提交给你的源代码管理或与其他人共享。
该 .env 文件具有简单的 key=value 语法：
```bash
.ENV
APP_SECRET=F7op5n9vx1nAkno0DsNgZm5vjNXpOLIq
DB_HOST=127.0.0.1
DB_USER=root
```
你可以使用 Env Provider 访问 env 值：
```javascript
const Env = use('Env')
const appSecret = Env.get('APP_SECRET')
```
与配置提供程序一样，你可以提供默认值作为第二个参数：
```javascript
Env.get('DB_USER', 'root')
```
Env.get 总是返回一个 string。如果你希望某个 Env 值充当布尔值，则需要通过条件相等语句进行检查，如下所示：
```javascript
const myBoolean = Env.get('MY_BOOLEAN') === 'true'
```
#### 如果不存在所需的环境变量，则引发错误
当你具有运行应用程序所需的环境变量时，Env.getOrFail() 如果未设置所需的变量，则可能会使用此错误。

> 如果你希望应用程序在缺少环境变量时在引导时快速失败，则仅限制从配置文件内部访问环境变量，并且不要在应用程序中的任何其他位置使用 Env Provider 。
```javascript
const Env = use('Env')
// Throw "Make sure to define APP_SECRET inside .env file."
Env.getOrFail('APP_SECRET')
```
#### .env文件的位置
你可能想要加载其他 .env 文件。

这可以通过使用 ENV_PATH 环境变量来完成：
```javascript
> ENV_PATH=/user/.env adonis serve
```
#### 禁用.env文件
你可能希望直接在服务器上使用环境变量，而不是中继到文件。

这可以通过使用 ENV_SILENT 环境变量来完成：
```javascript
> ENV_SILENT=true adonis serve
```
#### 测试环境
如果你使用 NODE_ENV 设置为启动应用程序 testing， AdonisJs 将加载你的 .env.testing 文件并将其值合并到你的 .env 文件中。

这在测试代码库时设置不同的凭据非常有用。