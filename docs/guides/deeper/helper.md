# 帮助
AdonisJs Helpers Provider 提供了许多方便的方法来增强你的应用程序。

其中许多方法可用于检索应用程序中特定目录的绝对路径。

## 基本例子
从应用程序的任何位置，只需拉入 Helpers Provider 并使用它来检索到不同目录的路径：
```javascript
const Helpers = use('Helpers')
const welcomeView = Helpers.viewsPath('welcome.edge')
```
## 路径助手
以下是通过 Helpers Provider 提供的与路径相关的帮助程序列表。

#### appRoot
返回应用程序根目录的路径：
```javascript
Helpers.appRoot()
```
#### publicPath([toFile])
返回目录中公共目录或文件的路径：
```javascript
const publicPath = Helpers.publicPath()
// or
const cssFile = Helpers.publicPath('style.css')
```
#### configPath([toFile])
返回目录中 config 目录或文件的路径：
```javascript
const configPath = Helpers.configPath()
// or
const appConfig = Helpers.configPath('app.js')
```
> 使用Config Provider读取配置文件值。
#### resourcesPath([toFile])
返回目录中资源目录或文件的路径：
```javascript
const resourcesPath = Helpers.resourcesPath()
// or
const appSass = Helpers.resourcesPath('assets/sass/app.scss')
```
#### migrationsPath([toFile])
返回目录中迁移目录或文件的路径：
```javascript
const migrationsPath = Helpers.migrationsPath()
// or
const UserSchema = Helpers.migrationsPath('UserSchema.js')
```
#### seedsPath([toFile])
返回目录中种子目录或文件的路径：
```javascript
const seedsPath = Helpers.seedsPath()
// or
const DatabaseSeed = Helpers.seedsPath('Database.js')
```
#### databasePath([toFile])
返回目录中数据库目录或文件的路径：
```javascript
const databasePath = Helpers.databasePath()
// or
const factoryFile = Helpers.databasePath('factory.js')
```
#### viewsPath([toFile])
返回目录中 views 目录或文件的路径：
```javascript
const viewsPath = Helpers.viewsPath()
// or
const welcomeView = Helpers.viewsPath('welcome.edge')
```
#### tmpPath([toFile])
返回目录中 tmp 目录或文件的路径：
```javascript
const tmpPath = Helpers.tmpPath()
// or
const resized = Helpers.tmpPath('resized.jpg')
```
## 其他助手
以下是通过 Helpers Provider 提供的其他帮助程序列表。

#### promisify
返回 promisified 回调函数：
```javascript
const exists = Helpers.promisify(require('fs').exists)
const isExist = await exists(Helpers.tmpPath('image.jpg'))
// or
const fs = Helpers.promisify(require('fs'))
await fs.unlink(Helpers.tmpPath('image.jpg'))
```
#### isAceCommand
返回进程是否作为ace命令启动：
```javascript
Helpers.isAceCommand()
```