# Traits
 traits 使得可以从外部向模型添加功能。

使用模型 traits ，你可以：

- 向模型类添加新方法。

- 监听模型钩子。

- 将方法添加到给定模型的 Query Builder 实例。

## 创造特质
 traits 存储在 app/Models/Traits 目录中。

使用该 make:trait 命令生成 traits 文件：
```bash
adonis make:trait Slugify
```
产量
```bash
# 输出
create  app/Models/Traits/Slugify.js
```
 Traits 需要一个 register 接收 Model 类的方法和一个 customOptions 对象作为其参数：
```javascript
'use strict'

class Slugify {
  register (Model, customOptions = {}) {
    const defaultOptions = {}
    const options = Object.assign(defaultOptions, customOptions)
  }
}

module.exports = Slugify
```
## 注册 traits 
给 Lucid 模型一样添加一个 traits ：
```javascript
const Model = use('Model')

class User extends Model {
  static boot () {
    super.boot()
    this.addTrait('Slugify')
  }
}
```
## 使用选项注册 traits 
如果需要，你可以在添加 traits 时传递初始化选项：
```javascript
const Model = use('Model')

class User extends Model {
  static boot () {
    super.boot()
    this.addTrait('Slugify', {useCamelCase: true})
  }
}
```
你传递的选项将转发到 traits 的 register() 方法。

传递选项时，建议你定义默认的 traits 选项，如下所示：
```javascript
const _ = require('lodash')

class Slugify {

  register (Model, customOptions) {
    const defaultOptions = {useCamelCase: false}
    const options = _.extend({}, defaultOptions, customOptions)
  }
}

module.exports = Slugify
```
## 扩展模型方法
使用 traits 添加静态和实例模型方法：
```javascript
class Slugify {

  register (Model, options) {
    // Add a static method
    Model.newAdminUser = function () {
      let m = new Model()
      m.isAdmin = true
      return m
    }

    // Add an instance method
    Model.prototype.printUsername = function () {
      console.log(this.username)
    }
  }
}

module.exports = Slugify
```
## 添加模型 Hooks
使用 traits 挂钩到数据库生命周期事件：
```javascript
class Slugify {

  register (Model, options) {
    Model.addHook('beforeCreate', function (modelInstance) {
      // create slug
    })
  }
}

module.exports = Slugify
```
## 扩展查询生成器
使用 traits 将宏添加到模型的 Query Builder 中：
```javascript
class Slugify {

  register (Model, options) {
    Model.queryMacro('whereSlug', function (value) {
      this.where('slug', value)
      return this
    })
  }
}

module.exports = Slugify
```
用法
```javascript
await User.query().whereSlug('some value')
```