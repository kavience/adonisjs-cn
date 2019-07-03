#  Hooks 函数
 Hooks 是在数据库[生命周期](https://adonisjs.com/docs/4.1/database-hooks#_lifecycle_events)事件之前或之后执行的操作。

使用模型 Hooks 有助于保持代码库 [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself) ，从定义 Hooks 的任何位置提供方便的生命周期代码注入。

经典的 Hooks 示例是在将用户保存到数据库之前散列用户密码。

## 定义 Hooks 
 Hooks 可以通过闭包在模型类文件中定义，也可以通过引用目录中的任何 file.method 处理程序来定义 app/Models/Hooks 。

#### 绑定闭包
```javascript
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
```
在上面的示例中，beforeCreate 在创建 User 模型时执行闭包，以确保在保存用户密码之前对其进行哈希处理。

#### Hooks 文件
AdonisJs 有一个专门的 app/Models/Hooks 目录来存储模型 Hooks 。

使用该 make:hook 命令创建 Hooks 文件：
```bash
adonis make:hook User
```
```bash
# 输出
create  app/Models/Hooks/UserHook.js
```
打开新 UserHook.js 文件并粘贴下面的代码：
```javascript
'use strict'

const Hash = use('Hash')

const UserHook = exports = module.exports = {}

UserHook.hashPassword = async (user) => {
  user.password = await Hash.make(user.password)
}
```
在 file.method 定义了一个 Hooks 的情况下，我们可以从前面的例子中删除内联闭包，而是引用 Hooks 文件和方法，如下所示：
```javascript
const Model = use('Model')

class User extends Model {
  static boot () {
    super.boot()
    this.addHook('beforeCreate', 'UserHook.hashPassword')
  }
}

module.exports = User
```
## 中止数据库操作
 Hooks 可以通过抛出异常来中止数据库操作：
```javascript
UserHook.validate = async (user) => {
  if (!user.username) {
    throw new Error('Username is required')
  }
}
```
## 生命周期事件
下面是要 Hooks 的可用数据库生命周期事件列表：

事件|描述
-|-
beforeCreate|在创建新记录之前。
afterCreate|创建新记录后。
beforeUpdate|在更新记录之前。
afterUpdate|记录更新后。
beforeSave|在创建或更新新记录之前。
afterSave|创建或更新新记录后。
beforeDelete|在删除记录之前。
afterDelete|删除记录后。
afterFind|从数据库中提取单个记录后。
afterFetch|执行 fetch 方法后。 hook 方法接收一组模型实例。
afterPaginate| paginate 执行该方法后。 hook 方法接收两个参数：模型实例数组和分页元数据。

