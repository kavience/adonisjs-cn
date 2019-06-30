# 目录结构
 AdonisJs 目录结构乍一看可能会让人感到压力，因为有一些预先配置的目录。

渐渐地，你将了解将实体分成多个目录的好处，使你的代码易于维护且易于搜索。

标准的 AdonisJs 安装看起来像这样：
```
.
├── app/
  ├── ...
├── config/
  ├── app.js
  ├── auth.js
  └── ...
├── database/
  ├── migrations/
  ├── seeds/
  └── factory.js
├── public/
├── resources/
  ├── ...
  └── views/
├── storage/
├── start/
  ├── app.js
  ├── kernel.js
  └── routes.js
├── test/
├── ace
├── server.js
└── package.json
```
## 根目录
#### 应用
 app 目录是应用程序逻辑的主页。

它在命名空间下自动加载 App 。

#### config
config 目录用于定义应用程序的配置。

 AdonisJs 附带了许多配置文件，但你可以随意创建自己的配置文件。

[详细了解配置](https://adonisjs.com/docs/4.1/configuration-and-env)。

#### database
database 目录用于存储所有与数据库相关的文件。

[了解更多关于数据库](https://adonisjs.com/docs/4.1/database)。

#### public
public 目录用于通过HTTP提供静态资产。

此目录映射到你网站的根目录：
```html
<!-- actual file is stored in /public/style.css -->
<link rel="stylesheet" href="/style.css" />
```
#### resources
resources 目录用于存储应用程序的演示文件，如 视图模板，LESS / SASS 文件，未编译的 JavaScript 和图片。

#### 开始
start 目录用于存储在应用程序启动时加载的文件。默认情况下，你会找到 app.js，kernel.js 和 routes.js 。

#### 测试
test 目录用于存储所有应用程序测试。默认情况下不包含测试包 - 你可以按照此处定义的说明进行安装。

## app目录
#### app/Commands
app/Commands 目录用于存储所有 CLI 命令。运行 **adonis make:command --name** 时会自动创建此目录。

#### app/Controllers
app/Controllers 目录用于存储所有 Http 和 WebSocket 控制器。运行 **adonis make:controller --name** 时会自动创建此目录。

#### app/Exceptions
app/Exceptions 目录用于存储全局异常处理程序和所有自定义异常。运行 adonis make:ehandler 或 adonis make:exception --name 会自动创建此目录。

#### app/Listeners
app/Listeners 目录用于存储所有事件侦听器。运行 **adonis make:listener --name** 时会自动创建此目录。

#### app/Middleware
app/Middleware 目录用于存储所有中间件。运行 **adonis make:middleware --name** 时会自动创建此目录  。

#### app/Models
app/Models 目录用于存储所有模型。运行 **adonis make:model --name** 时会自动创建此目录。

#### app/Validators
app/Validators 目录用于存储所有路由验证器。运行 **adonis make:validator --name** 时会自动创建此目录(你需要安装 Validator Provider 才能使用此命令)。

