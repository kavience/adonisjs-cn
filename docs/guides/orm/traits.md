# 特点
创造特质
注册特征
使用选项注册特征
扩展模型方法
添加模型挂钩
扩展查询生成器
特征使得可以从外部向模型添加功能。

使用模型特征，你可以：

向模型类添加新方法。

听模型钩子。

将方法添加到给定模型的Query Builder实例。

创造特质
特征存储在app/Models/Traits目录中。

使用该make:trait命令生成特征文件：

> adonis make:trait Slugify
产量
✔ create  app/Models/Traits/Slugify.js
Traits需要一个register接收Model类的方法和一个customOptions对象作为其参数：

应用/型号/性状/ Slugify.js
'use strict'

class Slugify {
  register (Model, customOptions = {}) {
    const defaultOptions = {}
    const options = Object.assign(defaultOptions, customOptions)
  }
}

module.exports = Slugify
注册特征
像Lucid模型一样添加一个特征：

const Model = use('Model')

class User extends Model {
  static boot () {
    super.boot()
    this.addTrait('Slugify')
  }
}
使用选项注册特征
如果需要，你可以在添加特征时传递初始化选项：

const Model = use('Model')

class User extends Model {
  static boot () {
    super.boot()
    this.addTrait('Slugify', {useCamelCase: true})
  }
}
你传递的选项将转发到特征的register()方法。

传递选项时，建议你定义默认的特征选项，如下所示：

应用/型号/性状/ Slugify.js
const _ = require('lodash')

class Slugify {

  register (Model, customOptions) {
    const defaultOptions = {useCamelCase: false}
    const options = _.extend({}, defaultOptions, customOptions)
  }
}

module.exports = Slugify
扩展模型方法
使用traits添加静态和实例模型方法：

应用/型号/性状/ Slugify.js
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
添加模型挂钩
使用traits 挂钩到数据库生命周期事件：

class Slugify {

  register (Model, options) {
    Model.addHook('beforeCreate', function (modelInstance) {
      // create slug
    })
  }
}

module.exports = Slugify
扩展查询生成器
使用traits将宏添加到模型的Query Builder中：

class Slugify {

  register (Model, options) {
    Model.queryMacro('whereSlug', function (value) {
      this.where('slug', value)
      return this
    })
  }
}

module.exports = Slugify
用法
await User.query().whereSlug('some value')
