# 数据库迁移
迁移是记录的数据库改变，在整个应用程序的开发生命周期中创建，你可以在任何时间点回滚或重新运行。

迁移使团队工作变得更加容易，可以轻松跟踪一个开发人员对数据库架构的更改，然后由组织中的其他开发人员应用。

## 创建迁移
要使用迁移，必须首先在文件的数组中注册迁移提供程序。  start/app.jsaceProviders 
让我们在迁移的帮助下创建一个用户表。

首先，调用 adonis make:migration 命令以创建模式文件：
```bash
adonis make:migration users
```
出现提示时，选择 Create table 选项并按 Enter ：
```bash
输出
create database/migrations/1502691651527_users_schema.js
```
新文件(以当前时间戳为前缀)在 database/migrations 目录中创建，可以根据需要进行修改：
```javascript
数据库/迁移/ ... users_schema.js
'use strict'

const Schema = use('Schema')

class UsersSchema extends Schema {
  up () {
    this.create('users', (table) => {
      table.increments()
      table.timestamps()
    })
  }

  down () {
    this.drop('users')
  }
}

module.exports = UsersSchema
```
## 架构文件
模式文件需要两种方法：up和down。

向上()
该up方法用于对表执行操作。它可用于创建新表或更改现有表。

下()
该down方法用于还原方法中应用的更改up。何时up用于创建表，down将用于删除该表。

使用以下代码更新刚刚创建的模式文件：
```javascript
数据库/迁移/ ... users_schema.js
'use strict'

const Schema = use('Schema')

class UsersSchema extends Schema {
  up () {
    this.create('users', (table) => {
      table.increments()
      table.string('username', 80).notNullable().unique()
      table.string('email', 254).notNullable().unique()
      table.string('password', 60).notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('users')
  }
}

module.exports = UsersSchema
```
上面的示例演示了如何使用模式文件创建/更改数据库表，将不同的列类型/修饰符方法链接在一起以定义方法中各个字段属性的特征up。

## 列类型/修饰符
> 有关架构列类型和修饰符方法的完整列表，请参阅 Knex API 文档。
#### 列类型
方法|描述
-|-
table.bigInteger(name)|添加长整数列。
table.binary(name, [length])|添加二进制列。
table.boolean(name)|添加布尔列。
table.date(name)|添加日期列。
table.datetime(name, [precision])|添加日期时间列。
table.decimal(name, [precision], [scale])|添加一个十进制列。
table.enu(col, values, [options])|添加枚举列。
table.float(name, [precision], [scale])|添加一个浮点列。
table.increments(name)|添加自动递增列。
table.integer(name)|添加整数列。
table.json(name)|添加一个 json 列。
table.string(name, [length=255])|添加字符串列。
table.text(name, [textType])|添加文本列。
table.time(name, [precision])|添加时间列。
table.timestamp(name, [useTz], [precision])|添加时间戳列。
table.timestamps([useTimestamps], [defaultToNow])|添加创建/更新的列。
table.uuid(name)|添加一个 uuid 列。

#### 列修饰符
方法|描述
-|-
.after(field)|要插入设置列后 field 。
.after()|将列标记为 alter / modify。
.collate(collation)|设置列整理(例如utf8_unicode_ci)。
.comment(value)|设置列注释。
.defaultTo(value)|设置列默认值。
.first()|设置要插入第一个位置的列。
.index([indexName], [indexType])|将列指定为索引。
.inTable(table)|设置外键(.references)。
.notNullable()|将列设置为非 null 。
.nullable()|将列设置为可为空。
.primary([constraintName])|将列设置为表的主键。
.references(column)|设置外键列。
.unique()|将列设置为唯一。
.unsigned()|将列设置为无符号(如果为整数)。

## 多个连接
模式文件可以通过定义 connectiongetter 来使用不同的连接(确保 config/database.js 文件中存在不同的连接)：
```javascript
数据库/迁移/ ... users_schema.js
const Schema = use('Schema')

class UsersSchema extends Schema {
  static get connection () {
    return 'mysql'
  }

  // ...
}

module.exports = UsersSchema
```
> adonis_schema 始终在默认连接数据库中创建数据库表以管理迁移的生命周期(没有覆盖它的选项)。
## 运行迁移
我们需要调用 migration:run 命令来运行迁移( up 在所有挂起的迁移文件上执行该方法)：
```bash
adonis migration:run
```
```bash
# 输出
migrate: 1502691651527_users_schema.js
Database migrated successfully in 117 ms
```
## 迁移状态
你可以通过运行以下命令来检查所有迁移的状态：
```bash
adonis migration:status
```
> 该批次值存在，你可以使用在以后的时间限制回滚的参考。
这就是迁移工作的方式：

- 调用 adonis migration:run 运行所有挂起的模式文件并将它们分配给新批处理。

- 运行一批迁移文件后，它们不会再次运行。

- adonis migration:rollback 以相反顺序调用回滚最后一批迁移。

> 不要在单个模式文件中创建多个表。而是为每个数据库更改创建一个新文件。这样，你可以保持数据库的原子性，并可以回滚到任何版本。
## 迁移命令
以下是可用迁移命令的列表。

#### 命令列表
命令|描述
-|-
make:migration|创建一个新的迁移文件。
migration:run|运行所有挂起的迁移。
migration:rollback|回滚最后一组迁移。
migration:refresh|将所有迁移回滚到0批处理，然后从头开始重新运行它们。
migration:reset|将所有迁移回滚到批处理。
migration:status|获取所有迁移的状态。

#### 命令帮助
有关详细的命令选项，请附加 --help 到每个迁移命令：
```bash
adonis migration:run --help
```
```bash
# 输出
Usage:
  migration:run [options]

Options:
  -f, --force   Forcefully run migrations in production
  -s, --silent  Silent the migrations output
  --seed        Seed the database after migration finished
  --log         Log SQL queries instead of executing them

About:
  Run all pending migrations
```
## Schema Table API
下面是可用于与数据库表交互的模式方法的列表。

#### create
创建一个新的数据库表：
```javascript
up () {
  this.create('users', (table) => {
  })
}
```
#### createIfNotExists
创建一个新的数据库表(仅当它不存在时)：
```javascript
up () {
  this.createIfNotExists('users', (table) => {
  })
}
```
#### rename(from, to)
重命名现有数据库表：
```javascript
up () {
  this.rename('users', 'my_users')
}
```
#### drop
删除数据库表：
```javascript
down () {
  this.drop('users')
}
```
#### dropIfExists
删除数据库表(仅当它存在时)：
```javascript
down () {
  this.dropIfExists('users')
}
```
#### alter
选择要更改的数据库表：
```javascript
up () {
  this.alter('users', (table) => {
    // add new columns or remove existing
  })
}
```
#### raw
运行任意 SQL 查询：
```javascript
up () {
  this
    .raw("SET sql_mode='TRADITIONAL'")
    .table('users', (table) => {
      table.dropColumn('name')
      table.string('first_name')
      table.string('last_name')
    })
}
```
#### hasTable
返回表是否存在(这是一个 async 方法)：
```javascript
async up () {
  const exists = await this.hasTable('users')

  if (!exists)  {
    this.create('up', (table) => {
    })
  }
}
```
## 扩展
以下是运行迁移时可以执行的扩展方法列表。

扩展仅适用于 PostgreSQL 数据库。
#### createExtension(EXTENSIONNAME)
创建数据库扩展：
```javascript
class UserSchema {
  up () {
    this.createExtension('postgis')
  }
}
```
#### createExtensionIfNotExists(EXTENSIONNAME)
创建数据库扩展(仅当不存在时)：
```javascript
class UserSchema {
  up () {
    this.createExtensionIfNotExists('postgis')
  }
}
```
#### dropExtension(extensioName)
删除数据库扩展：
```javascript
class UserSchema {
  down () {
    this.dropExtension('postgis')
  }
}
```
#### dropExtensionIfExists(EXTENSIONNAME)
删除数据库扩展(仅当存在时)：
```javascript
class UserSchema {
  down () {
    this.dropExtensionIfExists('postgis')
  }
}
```
## 执行任意代码
在 up 和 down 方法中编写的命令计划在稍后的迁移中执行。

如果需要执行任意数据库命令，请将它们包装在 schedule 函数中：
```javascript
class UserSchema {
  up () {
    // create new table
    this.create('new_users', (table) => {
    })

    // copy data
    this.schedule(async (trx) => {
      const users = await Database.table('users').transacting(trx)
      await Database.table('new_users').transacting(trx).insert(users)
    })

    // drop old table
    this.drop('users')
  }
}
```
schedule 方法接收事务对象。在同一事务中运行所有数据库命令很重要，否则你的查询将永久挂起。
## Schema Builder API
架构构建器 API 使用 Knex API ，因此请务必阅读其文档以获取更多信息。

#### fn.now()
Knex 有一个名为 knex.fn.now() 的方法，用于设置数据库字段的当前时间戳。

在 AdonisJs 中，你将此方法引用为 this.fn.now() ：
```javascript
up () {
  this.table('users', (table) => {
    table.timestamp('created_at').defaultTo(this.fn.now())
  })
}
```