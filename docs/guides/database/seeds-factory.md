# 假数据填充
使用迁移准备好数据库模式后，下一步是添加一些数据。这就是数据库 seeds 和 factories 的用武之地。

## seeds
 seeds 是包含 run 方法的 JavaScript 类。在该 run 方法中，你可以自由编写 seeds 所需的任何数据库相关操作。

与迁移一样，使用以下adonis make命令创建 seeds 文件：
```bash
adonis make:seed User
```
```
# 输出
create  database/seeds/UserSeeder.js
```
现在打开此文件并在其中键入以下代码：
```javascript
const Factory = use('Factory')
const Database = use('Database')

class UserSeeder {
  async run () {
    const users = await Database.table('users')
    console.log(users)
  }
}

module.exports = UserSeeder
```
通过调用该 adonis seed 命令运行 seeds 文件，该命令将对 run 所有现有 seeds 文件执行该方法。

由于你可以在 seeds 文件中编写任何与数据库相关的代码并从命令行执行它们，因此它们有助于从实际应用程序代码中卸载某些任务。

然而，当与 factories 结合时，seeds 的真正力量被解锁。

##  factories  
 factories 定义用于生成虚拟数据的数据结构( blueprints )。

 factories blueprints 设置在 database/factory.js 文件内：
```javascript
const Factory = use('Factory')
const Hash = use('Hash')

Factory.blueprint('App/Models/User', async (faker) => {
  return {
    username: faker.username(),
    email: faker.email(),
    password: await Hash.make(faker.password())
  }
})
```
从 factories  blueprints 生成模型实例时，使用 blueprints 内定义的键预填充模型的属性：
```javascript
const user = await Factory
  .model('App/Models/User')
  .create()
```
可以同时生成许多模型实例：
```javascript
const usersArray = await Factory
  .model('App/Models/User')
  .createMany(5)
```
### 建立关系
假设我们想要创建一个 User 模型并将 Post 与之相关联。

> 对于下面的示例，posts 必须首先在 User 模型上定义关系。[详细了解这里的关系](https://adonisjs.com/docs/4.1/relationships)。
首先，为 database/factory.js 文件中的两个模型创建 blueprints ：
```javascript
// User blueprint
Factory.blueprint('App/Models/User', (faker) => {
  return {
    username: faker.username(),
    password: faker.password()
  }
})

// Post blueprint
Factory.blueprint('App/Models/Post', (faker) => {
  return {
    title: faker.sentence(),
    body: faker.paragraph()
  }
})
```
然后，创建一个 User，创建一个 Post ，并将两个模型相互关联：
```javascript
const user = await Factory.model('App/Models/User').create()
const post = await Factory.model('App/Models/Post').make()

await user.posts().save(post)
```
你可能已经注意到我们 make 在 Postblueprints 上使用了该方法。

与该 create 方法不同，该 make 方法不会将 Post 模型持久化到数据库，而是返回 Post 预填充虚拟数据的 Post 模型的未保存实例(在 .posts().save() 调用方法时保存模型)。

##  seeds 命令
以下是可用的 seeds 命令列表。

命令|选项|描述
-|-|-
adonis make:seed|没有|制作一个新的 seeds 文件。
adonis seed|--files|执行 seeds 文件(你可以选择传递 --files 要执行的逗号分隔列表，否则，将执行所有文件)。

## Model Factory API
以下是使用 Lucid 模型 factories  时可用方法的列表。

#### create
持久并返回模型实例：
```javascript
await Factory
  .model('App/Models/User')
  .create()
```
#### createMany
坚持并返回许多模型实例：
```javascript
await Factory
  .model('App/Models/User')
  .createMany(3)
```
#### make
返回模型实例但不将其持久保存到数据库：
```javascript
await Factory
  .model('App/Models/User')
  .make()
```
#### makeMany
返回模型实例的数组，但不将它们持久保存到数据库：
```javascript
await Factory
  .model('App/Models/User')
  .makeMany(3)
```
## 没有Lucid的用法
如果你的应用程序不使用 Lucid 模型，你仍然可以使用数据库提供程序生成 factories 数据库记录。

#### blueprint
要在没有 Lucid 的情况下定义 factories blueprints ，请将表名作为第一个参数而不是模型名称(例如，users 而不是 App/Models/User )：
```javascript
Factory.blueprint('users', (faker) => {
  return {
    username: faker.username(),
    password: faker.password()
  }
})
```
#### create
创建了一个表记录：
```javascript
run () {
  await Factory.get('users').create()
}
```
#### table
在运行时定义不同的表名：
```javascript
await Factory
  .get('users')
  .table('my_users')
  .create()
```
#### returning
对于 PostgreSQL ，定义一个返回列：
```javascript
await Factory
  .get('users')
  .returning('id')
  .create()
```
#### connection
在运行时选择不同的连接：
```javascript
await Factory
  .get('users')
  .connection('mysql')
  .returning('id')
  .create()
```
#### createMany
创建多个记录：
```javascript
await Factory
  .get('users')
  .createMany(3)
```
## 自定义数据
的方法 make，makeMany ，create 并 createMany 接受其直接传递到你的 blueprints 自定义数据对象。

例如：
```javascript
const user = await Factory
  .model('App/Models/User')
  .create({ status: 'admin' })
```
在你的 blueprints 中，你的自定义数据对象的使用方式如下：
```javascript
Factory.blueprint('App/Models/User', async (faker, i, data) => {
  return {
    username: faker.username(),
    status: data.status
  }
})
```
## Faker API
faker 传递给 factories blueprints 的对象是对 Chance 随机生成器 JavaScript 库的引用。

请务必阅读 [Chance](http://chancejs.com/) 的文档，以获取可用 faker 方法和属性的完整列表。

## 常见问题解答
由于 factories  和 seeds 适用于许多不同的用例，你可能会对如何/何时使用它们感到困惑，因此这里列出了常见问题。

- factories  和 seeds 必须一起使用吗？
 factories 和 seeds 不相互依赖，可以单独使用。例如，你可以使用 seeds 文件从完全不同的应用程序将数据导入 AdonisJs 应用程序。

- 我可以在编写测试时使用 factories  吗？
可以。将 factories 提供者( Factory )导入你的测试并根据需要使用。

- 我可以只运行选定的 seeds 文件吗？
可以。--files 将逗号分隔的文件名列表传递给 adonis seed 命令可确保仅运行那些文件，例如：
```bash
adonis seed --files='UsersSeeder.js, PostsSeeder.js'
```