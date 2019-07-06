# 前端资源管理
AdonisJs 不做任何假设，也没有提供有关如何捆绑前端资产的工具。该框架的目标是仅为后端应用程序提供高效的工作流程。

然而，在本文中，我们将讨论如何管理和捆绑前端代码的一些方法。

## WebPack
前端生态系统中有如此多的构建工具，很容易让人感到压倒一切。但是，webpack (截至目前)确实可以优雅地管理所有内容，并且是许多开发人员的热门选择。

让我们看看如何存储你的资产然后捆绑它们。
```
目录结构
└── resources
    └── assets
        └── sass
        └── scripts
        └── images
```
我们应该把所有 source assets 内容保存在 resources 目录中。 Adonis 已使用此目录存储视图。

此目录中的所有已编译资产都放在 public 目录中。

#### Webpack 基础配置
首先，确保将 webpack 作为 dev 依赖项安装并创建配置文件。
```bash
npm i --save-dev webpack webpack-cli

touch webpack.config.js
```
```
# webpack.config.js
module.exports = {
}
```
运行 ./node_modules/.bin/webpack 以构建你的文件。

使用标志 --mode 在生产和开发之间进行选择。

要启动观察者，请使用 --watch 标志。

例子
```
./node_modules/.bin/webpack --mode development
```
## Sass 设置
```bash
npm i --save-dev style-loader css-loader extract-text-webpack-plugin@next node-sass sass-loader
```
将以下代码添加到 webpack.config.js 文件中。
```javascript
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const extractSass = new ExtractTextPlugin({
  filename: 'public/app.css'
})

function sassRules () {
  return [
    {
      test: /\.(sass|scss)$/,
      use: ExtractTextPlugin.extract(
        {
          fallback: 'style-loader',
          use: ['css-loader', 'sass-loader']
        })
    }
  ]
}

module.exports = {
  entry: [
    './resources/assets/sass/app.scss'
  ],
  output: {
    filename: 'public/app.js'
  },
  module: {
    rules: sassRules()
  },
  plugins: [
    extractSass
  ]
}
```
这里我们使用 sass-loader 和一些相关的依赖项来编译 resources/assets/sass/app.scss → public/app.css 。

需要来自 edge 模板的 css 文件。
```html
<head>
  {{ style('/public/app') }}
</head>
```
## 脚本设置
完成脚本设置以将前端 JavaScript 捆绑到单个文件中。我假设你要将代码编译到 ES5 以定位所有主流浏览器。

我们使用 babel 进行 ES6 到 ES5 的转录。此外 AdonisJs 本身并不需要，它只是为你写的浏览器 JavaScript 的。
```bash
npm i --save-dev babel-loader @babel/core @babel/preset-env
```
```javascript
function scriptRules () {
  return [
    {
      test: /\.js$/,
      exclude: [/node_modules/],
      loader: 'babel-loader',
      options: { presets: ['env'] }
    }
  ]
}

module.exports = {
  entry: [
    './resources/assets/sass/app.scss',
    './resources/assets/scripts/app.js'
  ],
  output: {
    filename: 'public/app.js'
  },
  module: {
    rules: sassRules().concat(scriptRules())
  },
  plugins: [
    extractSass
  ]
}
```
这次我们编译 resources/assets/scripts/app.js → public/app.js

需要 edge 模板中的 js 文件。
```html
<head>
  {{ script('/public/app') }}
</head>
```