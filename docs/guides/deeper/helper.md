# 帮助
基本例子
路径助手
其他助手
AdonisJs Helpers Provider提供了许多方便的方法来增强您的应用程序。

其中许多方法可用于检索应用程序中特定目录的绝对路径。

基本例子
从应用程序的任何位置，只需拉入Helpers Provider并使用它来检索到不同目录的路径：

const Helpers = use('Helpers')
const welcomeView = Helpers.viewsPath('welcome.edge')
路径助手
以下是通过Helpers Provider提供的与路径相关的帮助程序列表。

为approot
返回应用程序根目录的路径：

Helpers.appRoot()
publicPath（[TOFILE]）
返回目录中公共目录或文件的路径：

const publicPath = Helpers.publicPath()
// or
const cssFile = Helpers.publicPath('style.css')
用configPath（[TOFILE]）
返回目录中config目录或文件的路径：

const configPath = Helpers.configPath()
// or
const appConfig = Helpers.configPath('app.js')
使用Config Provider读取配置文件值。
resourcesPath这（[TOFILE]）
返回目录中资源目录或文件的路径：

const resourcesPath = Helpers.resourcesPath()
// or
const appSass = Helpers.resourcesPath('assets/sass/app.scss')
migrationsPath（[TOFILE]）
返回目录中迁移目录或文件的路径：

const migrationsPath = Helpers.migrationsPath()
// or
const UserSchema = Helpers.migrationsPath('UserSchema.js')
seedsPath（[TOFILE]）
返回目录中种子目录或文件的路径：

const seedsPath = Helpers.seedsPath()
// or
const DatabaseSeed = Helpers.seedsPath('Database.js')
databasePath（[TOFILE]）
返回目录中数据库目录或文件的路径：

const databasePath = Helpers.databasePath()
// or
const factoryFile = Helpers.databasePath('factory.js')
viewsPath（[TOFILE]）
返回目录中views目录或文件的路径：

const viewsPath = Helpers.viewsPath()
// or
const welcomeView = Helpers.viewsPath('welcome.edge')
tmpPath（[TOFILE]）
返回目录中tmp目录或文件的路径：

const tmpPath = Helpers.tmpPath()
// or
const resized = Helpers.tmpPath('resized.jpg')
其他助手
以下是通过Helpers Provider提供的其他帮助程序列表。

promisify
返回promisified回调函数：

const exists = Helpers.promisify(require('fs').exists)
const isExist = await exists(Helpers.tmpPath('image.jpg'))
// or
const fs = Helpers.promisify(require('fs'))
await fs.unlink(Helpers.tmpPath('image.jpg'))
isAceCommand
返回进程是否作为ace命令启动：

Helpers.isAceCommand()
