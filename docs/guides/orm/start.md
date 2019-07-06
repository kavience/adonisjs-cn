# 快速开始
Lucid 是 AdonisJS 的 [active record pattern](https://en.wikipedia.org/wiki/Active_record_pattern) 的实现

如果你熟悉 Laravel 或 Ruby on Rails 的，你会发现 Lucid 和 Laravel 的 Eloquent 或 Rails 的 Active Record 非常相似。

## 介绍
活动记录模型通常优于普通数据库查询，因为它们易于使用，而且功能强大的 API 可以驱动应用程序数据流。

Lucid 模型提供许多好处，包括：

- 透明地获取和保存模型数据。
- 管理关联关系的富有表现力的 API ：
```javascript
class User extends Model {

  profile () {
    return this.hasOne('App/Models/Profile')
  }

  posts () {
    return this.hasMany('App/Models/Post')
  }
}
```
- 生命周期挂钩，以保持你的代码干燥。
- [Getters / setters](https://adonisjs.com/docs/4.1/database-getters-setters) 可以动态改变数据。
- 使用序列化器，计算属性等进行数据序列化
- 日期格式管理。
- 以及更多。

> Lucid 模型不依赖于你的数据库模式，而是他们自己管理所有内容。例如，在使用 Lucid 关系时，不需要在 SQL 中定义关联。
Lucid 模型存储在 app/Models 目录中，其中每个模型代表一个数据库表。

模型/表映射的示例包括：

模型|数据库表
-|-
User|users
Post|posts
Comment|comments

## 基本例子
让我们看看如何创建模型并使用它来读取和写入数据库。

#### 制作模型
首先，使用 make:model 命令生成 User 模型类：
```bash
adonis make:model User
```
```bash
# 输出
create  app/Models/User.js
```
```javascript
'use strict'

const Model = use('Model')

class User extends Model {
}

module.exports = User
```
> 传递 --migration 标志以生成迁移文件。
```bash
adonis make:model User --migration
```
```bash
# 输出
create  app/Models/User.js
create  database/migrations/1502691651527_users_schema.js
```
#### 创建用户
接下来，实例化一个 User 实例并将其保存到数据库：
```javascript
const User = use('App/Models/User')

const user = new User()

user.username = 'virk'
user.password = 'some-password'

await user.save()
```
#### 获取用户
最后，在 start/routes.js 文件内部，获取所有 User 实例：
```javascript
const Route = use('Route')
const User = use('App/Models/User')

Route.get('users', async () => {
  return await User.all()
})
```
## 默认配置
Lucid 模型基于 AdonisJs 惯例，但你可以通过应用程序设置覆盖默认值。

#### table
默认情况下，模型数据库表名称是模型名称的小写和复数形式(例如 User → users )。

要覆盖此行为，在模型上设置 table getter：
```javascript`
class User extends Model {
  static get table () {
    return 'my_users'
  }
}
```
#### 连接
默认情况下，模型使用 config/database.js 文件中定义的默认连接。

要覆盖此行为，在模型上设置 connection getter ：
```javascript
class User extends Model {
  static get connection () {
    return 'mysql'
  }
}
```
#### 主键
默认情况下，模型的主键设置为 id 列。

要覆盖此行为，在模型上设置 primaryKey getter：
```javascript
class User extends Model {
  static get primaryKey () {
    return 'uid'
  }
}
```
> primaryKey 字段的值应始终是唯一的。
#### createdAtColumn
用于设置创建时间戳的字段名称(返回 null 禁用)：
```javascript
class User extends Model {
  static get createdAtColumn () {
    return 'created_at'
  }
}
```
#### updatedAtColumn
用于设置修改时间戳的字段名称(返回 null 禁用)：
```javascript
class User extends Model {
  static get updatedAtColumn () {
    return 'updated_at'
  }
}
```
#### incrementing
Lucid假设每个模型数据库表都有一个自动递增的主键。

要覆盖此行为，请设置 incrementinggetter 返回 false ：
```javascript
class User extends Model {
  static get incrementing () {
    return false
  }
}
```
> 当 incrementing 设置为 false ，确保设定的模型 primaryKeyValue 手动。
#### primaryKeyValue
主键的值(仅在 incrementing 设置为时更新 false )：
```javascript
const user = await User.find(1)
console.log(user.primaryKeyValue)

// when incrementing is false
user.primaryKeyValue = uuid.v4()
```
## 隐藏字段
通常，你需要省略数据库结果中的字段(例如，从 JSON 输出中隐藏用户密码)。

AdonisJs 允许你在模型类上定义 hidden 或 visible 属性，从而简化了这一过程。

#### hidden
```javascript
class User extends Model {
  static get hidden () {
    return ['password']
  }
}
```
#### 可见
```javascript
class Post extends Model {
  static get visible () {
    return ['title', 'body']
  }
}
```
#### 调用 setVisible / setHidden
你可以为单个查询定义 hidden 或 visible 字段，如下所示：
```javascript
User.query().setHidden(['password']).fetch()

// or set visible
User.query().setVisible(['title', 'body']).fetch()
```
## 日期
日期管理可以增加数据驱动应用程序的复杂性

你的应用程序可能需要以不同的格式存储和显示日期，这通常需要一定程度的手动工作。

Lucid 优雅地处理日期，最大限度地减少使用它们所需的工作。

#### 定义日期字段
默认情况下，时间戳记 created_at 并 updated_at 标记为日期。

通过在dates模型的getter中连接它们来定义自己的字段：
```javascript
class User extends Model {
  static get dates () {
    return super.dates.concat(['dob'])
  }
}
```
在上面的例子中，我们拉从父默认日期字段Model级和推动新dob领域的super.dates阵列，返回三个日期字段：created_at，updated_at和dob。

#### 格式化日期字段
默认情况下，Lucid 将存储日期格式化为 YYYY-MM-DD HH:mm:ss 。

要自定义存储的日期格式，请覆盖以下 formatDates 方法：
```javascript
class User extends Model {
  static formatDates (field, value) {
    if (field === 'dob') {
      return value.format('YYYY-MM-DD')
    }
    return super.formatDates(field, value)
  }
}
```
在上面的示例中，value 参数是设置字段时提供的实际日期。

> formatDates 在将模型实例保存到数据库之前调用该方法，因此请确保返回值始终是你正在使用的数据库引擎的有效格式。
#### Casting Dates
现在我们已将日期保存到数据库，我们可能希望在向用户显示日期时对它们进行不同的格式化。

要格式化日期的显示方式，请使用以下 castDates 方法：
```javascript
class User extends Model {
  static castDates (field, value) {
    if (field === 'dob') {
      return `${value.fromNow(true)} old`
    }
    return super.formatDates(field, value)
  }
}
```
value 参数是 Moment.js 实例，使你可以调用任何 Moment 方法来格式化日期。

#### 反序列化
castDates 当反序列化模型实例(通过调用触发 toJSON )时，将自动调用该方法：
```javascript
const users = await User.all()

// converting to JSON array
const usersJSON = users.toJSON()
```
## 查询生成器
Lucid 模型使用 AdonisJs Query Builder 来运行数据库查询。

要获取 Query Builder 实例，请调用 model query 方法：
```javascript
const User = use('App/Models/User')

const adults = await User
  .query()
  .where('age', '>', 18)
  .fetch()
```
完全支持所有 Query Builder 方法。

fetch 方法需要执行查询以确保 serializer 实例中的结果返回(有关更多信息，请参阅 [Serializers 文档](https://adonisjs.com/docs/4.1/serializers))。

## 静态方法
Lucid 模型有许多静态方法可以在不使用 Query Builder 接口的情况下执行常见操作。

使用以下静态方法时无需调用 fetch 。

#### find
使用主键查找记录(始终返回一条记录)：
```javascript
const User = use('App/Models/User')
await User.find(1)
```
#### findOrFail
类似于 find，但 ModelNotFoundException 在无法找到记录时抛出一个：
```javascript
const User = use('App/Models/User')
await User.findOrFail(1)
```
#### findBy / findByOrFail
使用键/值对查找记录(返回第一个匹配的记录)：
```javascript
const User = use('App/Models/User')
await User.findBy('email', 'foo@bar.com')

// or
await User.findByOrFail('email', 'foo@bar.com')
```
#### first / firstOrFail
从数据库中查找第一行：
```javascript
const User = use('App/Models/User')
await User.first()

// or
await User.firstOrFail()
```
#### findOrCreate(whereAttributes，values)
查找记录，如果未找到，将创建并返回新记录：
```javascript
const User = use('App/Models/User')
const user = await User.findOrCreate(
  { username: 'virk' },
  { username: 'virk', email: 'virk@adonisjs.com' }
)
```
#### pick(rows = 1)
从表中正序选择 n 行(默认为1行)：
```javascript
const User = use('App/Models/User')
await User.pick(3)
```
#### pickInverse(rows = 1)
从表中逆序开始选择 n 行(默认为 1 行)：
```javascript
const User = use('App/Models/User')
await User.pickInverse(3)
```
#### ids
返回一组主键：
```javascript
const User = use('App/Models/User')
const userIds = await User.ids()
```
> 如果主键是返回值 uid 的数组 uid 。
#### 对(lhs，rhs)
返回键/值对的对象( lhs 是键，rhs 是值)：
```javascript
const User = use('App/Models/User')
const users = await User.pair('id', 'country')

// returns { 1: 'ind', 2: 'uk' }
```
#### all
选择所有行：
```javascript
const User = use('App/Models/User')
const users = await User.all()
```
#### truncate
删除所有行(截断表)：
```javascript
const User = use('App/Models/User')
const users = await User.truncate()
```
## 实例方法
Lucid 实例有许多方法可以在不使用 Query Builder 接口的情况下执行常见操作。

#### reload
从数据库重新加载模型：
```javascript
const User = use('App/Models/User')
const user = await User.create(props)
// user.serviceToken === undefined

await user.reload()
// user.serviceToken === 'E1Fbl3sjH'
```
> 在创建挂钩期间设置属性的模型将需要重新加载以检索在该挂钩期间设置的值。
## 聚合助手
Query Builder 聚合帮助函数提供常见聚合查询的快捷方式。

以下静态模型方法可用于聚合整个表。

> 这些方法结束 Query Builder 链并返回一个值，因此 在使用它们时无需调用 fetch() 。
#### getCount(columnName ='*')
返回给定结果集中的记录数：
```javascript
const User = use('App/Models/User')

// returns number
await User.getCount()
```
你可以在调用之前添加查询约束 getCount ：
```javascript
await User
  .query()
  .where('is_active', 1)
  .getCount()
```
与此类似 getCount ，查询生成器上提供了所有其他聚合方法。

## 查询范围
查询范围将查询约束提取为可重用，功能强大的方法。

例如，获取具有配置文件的所有用户：
```javascript
const Model = use('Model')

class User extends Model {
  static scopeHasProfile (query) {
    return query.has('profile')
  }

  profile () {
    return this.hasOne('App/Models/Profile')
  }
}
```
通过设置 scopeHasProfile ，你可以限制查询，如下所示：
```javascript
const users = await User.query().hasProfile().fetch()
```
范围使用 scope 前缀后跟方法名称定义。

调用范围时，删除 scope 关键字并以 camelCase 形式调用方法(例如 scopeHasProfile → hasProfile )。

你可以在查询范围内调用所有标准查询构建器方法。

## 分页
Lucid 还支持 Query Builder paginate 方法：
```javascript
const User = use('App/Models/User')
const page = 1

const users = await User.query().paginate(page)

return view.render('users', { users: users.toJSON() })
```
在上面的示例中，返回值 paginate 不是用户数组，而是具有元数据的对象和 data 包含用户列表的属性：
```javascript
{
  total: '',
  perPage: '',
  lastPage: '',
  page: '',
  data: [{...}]
}
```
## 插入和更新
#### save
使用模型，你可以保留模型实例，而不是将原始值插入数据库，而模型实例又会为你进行插入查询。例如：
```javascript
const User = use('App/Models/User')

const user = new User()
user.username = 'virk'
user.email = 'foo@bar.com'

await user.save()
```
save 方法将实例持久保存到数据库，智能地确定是创建新行还是更新现有行。例如：
```javascript
const User = use('App/Models/User')

const user = new User()
user.username = 'virk'
user.email = 'foo@bar.com'

// Insert
await user.save()

user.age = 22

// Update
await user.save()
```
Update 语句只有当数据改变才会生效。

在 save 不更新任何模型属性的情况下多次调用将不会执行任何后续查询。

#### fill / merge
如果不是手动设置属性，fill 或者 merge 可以使用。

fill 方法重写现有的模型实例键/对值：
```javascript
const User = use('App/Models/User')

const user = new User()
user.username = 'virk'
user.age = 22

user.fill({ age: 23 }) // remove existing values, only set age.

await user.save()

// returns { age: 23, username: null }
```
merge 方法仅修改指定的属性：
```javascript
const User = use('App/Models/User')

const user = new User()
user.fill({ username: 'virk', age: 22 })

user.merge({ age: 23 })

await user.save()

// returns { age: 23, username: 'virk' }
```
#### create
你可以在创建时将数据直接传递给模型，而不是在实例化后手动设置属性：
```javascript
const User = use('App/Models/User')
const userData = request.only(['username', 'email', 'age'])

// save and get instance back
const user = await User.create(userData)
```
#### createMany
比如 create，你可以在创建时直接为多个实例传递数据：
```javascript
const User = use('App/Models/User')
const usersData = request.collect(['username' 'email', 'age'])

const users = await User.createMany(usersData)
```
createMany 方法进行 n 次查询而不是进行批量插入，其中 n 是行数。
#### 批量更新
在 Query Builder 的帮助下执行批量更新( Lucid 确保在更新时格式化日期)：
```javascript
const User = use('App/Models/User')

await User
  .query()
  .where('username', 'virk')
  .update({ role: 'admin' })
```
批量更新不执行模型挂钩。
## 删除
可以通过调用 delete 方法删除单个模型实例：
```javascript
const User = use('App/Models/User')

const { id } = params
const user = await User.find(id)

await user.delete()
```
调用后 delete，禁止模型实例执行任何更新，但你仍然可以访问其数据：
```javascript
await user.delete()

console.log(user.id) // works fine

user.id = 1 // throws exception
```
#### 批量删除
在 Query Builder 的帮助下执行批量删除：
```javascript
const User = use('App/Models/User')

await User
  .query()
  .where('role', 'guest')
  .delete()
```
> 批量删除不执行模型挂钩。
## 事务
大多数 Lucid 方法都支持事务。

第一步是 trx 使用数据库提供程序获取对象：
```javascript
const Database = use('Database')
const trx = await Database.beginTransaction()

const user = new User()

// pass the trx object and lucid will use it
await user.save(trx)

// once done commit the transaction
trx.commit()
```
与调用 save 一样，你也可以将 trx 对象传递给 create 方法：
```javascript
const Database = use('Database')
const trx = await Database.beginTransaction()

await User.create({ username: 'virk' }, trx)

// once done commit the transaction
await trx.commit()
// or rollback the transaction
await trx.rollback()
```
你还可以将 trx 对象传递给 createMany 方法：
```javascript
await User.createMany([
  { username: 'virk' }
], trx)
```
#### 关系中的事务
使用事务时，你需要传递一个 trx 对象作为关系 attach 和 detach 方法的第三个参数：
```javascript
const Database = use('Database')
const trx = await Database.beginTransaction()

const user = await User.create({email: 'user@example.com', password: 'secret'})

const userRole = await Role.find(1)

await user.roles().attach([userRole.id], null, trx)

await trx.commit()
// if something gone wrong
await trx.rollback
```
## 启动周期
每个模型都有一个引导周期，其 boot 方法被调用一次。

如果要执行只应发生一次的事情，请考虑将其写入模型 boot 方法中：
```javascript
const Model = use('Model')

class User extends Model {
  static boot () {
    super.boot()

    /**
      I will be called only once
    */
  }
}

module.exports = User
```