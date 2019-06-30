# 安装
安装 AdonisJs 是一个简单的过程，只需几分钟。

## 系统要求
框架的唯一依赖是 Node.js 和 npm 。

确保你的这些工具版本符合以下条件：

- Node.js> = 8.0.0

- npm> = 3.0.0

你可以使用像nvm这样的工具来帮助同时管理 Node.js 和 npm 的多个版本。
## 安装 AdonisJs 
#### 通过 AdonisJs  CLI
 AdonisJs CLI 是一个命令行工具，可以帮助你安装 AdonisJs 。

通过 npm 全局安装：
```bash
npm i -g @adonisjs/cli
```
> 你还可以使用 npx 以避免全局安装 CLI 。
确保将 npm 系统范围的 node_modules/.bin 目录添加到你的目录中， $PATH 以便能够访问已安装的二进制文件。

安装后，你可以使用 adonis new 命令创建 AdonisJs 的全新安装。

例如，要创建一个名为的新应用程序 yardstick ，只需：
```
adonis new yardstick
```
> 默认情况下，从 Github 克隆 [fullstack blueprint](https://github.com/adonisjs/adonis-fullstack-app) 。你可以使用选项 --api-only 或自定义此选项 --slim 。

你还可以通过指定选项 --blueprint=<github-org/repo> 指定自己的 blueprint 。

#### 通过 Git 
或者，你可以 **git clone** 我们的样板：
```bash
# Fullstack
git clone --dissociate https://github.com/adonisjs/adonis-fullstack-app

# API
git clone --dissociate https://github.com/adonisjs/adonis-api-app

# Slim
git clone --dissociate https://github.com/adonisjs/adonis-slim-app
```
克隆后，通过运行 npm install 安装所有依赖项。

## 运行应用程序
安装过程完成后，你可以 cd 进入新的应用程序目录并运行以下命令来启动 HTTP Server ：
```bash
adonis serve --dev
```
此命令在 .env 文件中定义的端口上启动服务器。

