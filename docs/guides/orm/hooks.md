# 钩子函数
定义钩子
中止数据库操作
生命周期事件
挂钩是在数据库生命周期事件之前或之后执行的操作。

使用模型挂钩有助于保持代码库DRY，从定义挂钩的任何位置提供方便的生命周期代码注入。

经典的钩子示例是在将用户保存到数据库之前散列用户密码。

定义钩子
钩子可以通过闭包在模型类文件中定义，也可以通过引用目录中的任何file.method处理程序来定义app/Models/Hooks。

绑定关闭
const Model = use('Model')
const Hash = use('Hash')

class User extends Model {
  static boot () {
    super.boot()

    this.addHook('beforeCreate', async (userInstance) => {
      userInstance.password = await Hash.make(userInstance.password)
    })
  }
}

module.exports = User
In the example above, the beforeCreate closure is executed when creating a User model to ensure the user’s password is hashed before it’s saved.

Hook File
AdonisJs has a dedicated app/Models/Hooks directory to store model hooks.

Use the make:hook command to create a hook file:

> adonis make:hook User
Output
✔ create  app/Models/Hooks/UserHook.js
Open the new UserHook.js file and paste in the code below:

app/Models/Hooks/UserHook.js
'use strict'

const Hash = use('Hash')

const UserHook = exports = module.exports = {}

UserHook.hashPassword = async (user) => {
  user.password = await Hash.make(user.password)
}
With a hook file.method defined, we can remove the inline closure from our previous example and instead reference the hook file and method like so:

const Model = use('Model')

class User extends Model {
  static boot () {
    super.boot()
    this.addHook('beforeCreate', 'UserHook.hashPassword')
  }
}

module.exports = User
Aborting Database Operations
Hooks can abort database operations by throwing exceptions:

app/Models/Hooks/UserHook.js
UserHook.validate = async (user) => {
  if (!user.username) {
    throw new Error('Username is required')
  }
}
Lifecycle Events
Below is the list of available database lifecycle events to hook into:

Event	Description
beforeCreate

Before creating a new record.

afterCreate

After a new record is created.

beforeUpdate

在更新记录之前。

afterUpdate

记录更新后。

beforeSave

在创建或更新新记录之前。

afterSave

创建或更新新记录后。

beforeDelete

在删除记录之前。

afterDelete

删除记录后。

afterFind

从数据库中提取单个记录后。

afterFetch

fetch执行该方法后。hook方法接收一组模型实例。

afterPaginate

paginate执行该方法后。hook方法接收两个参数：模型实例数组和分页元数据。

