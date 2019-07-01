# 查询构造器
AdonisJs Query Builder 提供了使用 JavaScript 方法与 SQL 数据库交互的统一语法。

本指南是对查询生成器上所有可用方法的引用。

有关支持的数据库列表，配置选项以及如何调试 SQL 查询，请参阅数据库[入门指南](https://adonisjs.com/docs/4.1/database)。
## 介绍
即使你熟练使用 SQL ，编写 SQL 查询也很繁琐。

### 语法抽象
想象一下，所有的查询都是为 MySQL 编写的，稍后你会被要求将所有内容迁移到 PostgreSQL 。你必须重写/修改你的 MySQL 查询，以确保它们仍然适用于 PostgreSQL 。

查询生成器抽象出连接特定语法，因此你可以专注于应用程序功能而不是 SQL 语言的变体。

### 条件查询
另一个问题可能是使用条件块构建增量查询：
```javascript
// 不使用 query builder
const sql = 'SELECT * FROM `users`'

if (username) {
  sql += ' WHERE `username` = ' + username
}
```
```javascript
、、 使用 query builder
const query = Database.table('users')

if (username) {
  query.where('username', username)
}
```
## 基本例子
这是使用查询生成器链接不同方法的基本示例：
```javascript
const Database = use('Database')

class UserController {

  async index (request, response) {
    return await Database
      .table('users')
      .where('username', 'john')
      .first()
  }
}
```
## 选择
该 select 方法定义了为给定查询选择的字段：
```javascript
await Database.select('id', 'username').from('users')
// or
await Database.select('*').from('users')
```
```sql
# SQL 输出
select `id`, `username` from `users`
select * from `users`
```
你可以像这样定义查询别名：
```javascript
await Database.select('username as uname')
```
## where 语句
Query Builder 提供了许多动态方法来添加 where 子句。

它还通过传递闭包或其他查询而不是实际值来支持子查询。

有关详细 where 信息，请参阅 Knex 的[文档](http://knexjs.org/#Builder-wheres)。

传递 undefined 给 where 子句会在 SQL 编译期间导致错误，因此 undefined 在传递动态值之前不要确保它们。
#### where
```javascript
const users = await Database.from('users').where('id', 1)
// Or
const users = await Database.from('users').where({ id: 1 })
```
你可以将比较运算符传递给where子句，如下所示：
```javascript
const adults = await Database
  .from('users')
  .where('age', '>', 18)
```
#### where (with callback)
你可以将回调传递给该 where 子句，以便对回调中包含的所有子句进行分组：
```javascript
await Database.from('users').where(function () {
  this
    .where('id', 1)
    .orWhere('id', '>', 10)
})
```
```sql 
# SQL输出
select * from `users` where (`id` = 1 or `id` > 10)
```
#### whereNot
```javascript
await Database
  .from('users')
  .whereNot('age', '>', 15)

// or
await Database
  .from('users')
  .whereNot({username: 'foo'})
```
#### whereIn
```javascript
await Database
  .from('users')
  .whereIn('id', [1,2,3])
```
#### whereNotIn
```javascript
await Database
  .from('users')
  .whereNotIn('id', [1,2,3])
  ```
#### whereNull
```javascript
await Database
  .from('users')
  .whereNull('deleted_at')
  ```
#### whereNotNull
```javascript
await Database
  .from('users')
  .whereNotNull('created_at')
  ```
#### whereExists
```javascript
await Database.from('users').whereExists(function () {
  this.from('accounts').where('users.id', 'accounts.user_id')
})
```
#### whereNotExists
```javascript
await Database.from('users').whereNotExists(function () {
  this.from('accounts').where('users.id', 'accounts.user_id')
})
```
#### whereBetween
```javascript
await Database
  .table('users')
  .whereBetween('age', [18, 32])
  ```
#### whereNotBetween
```javascript
await Database
  .table('users')
  .whereNotBetween('age', [45, 60])
  ```
#### whereRaw
便利助手 .where(Database.raw(query))：
```javascript
await Database
  .from('users')
  .whereRaw('id = ?', [20])
  ```
## Joins
#### innerJoin
```javascript
await Database
  .table('users')
  .innerJoin('accounts', 'user.id', 'accounts.user_id')
```
你还可以传递回调以构建连接：
```javascript
await Database
  .table('users')
  .innerJoin('accounts', function () {
    this
      .on('users.id', 'accounts.user_id')
      .orOn('users.id', 'accounts.owner_id')
  })
```
#### leftJoin
```javascript
Database
  .select('*')
  .from('users')
  .leftJoin('accounts', 'users.id', 'accounts.user_id')
```
#### leftOuterJoin
```javascript
await Database
  .select('*')
  .from('users')
  .leftOuterJoin('accounts', 'users.id', 'accounts.user_id')
```
#### rightJoin
```javascript
await Database
  .select('*')
  .from('users')
  .rightJoin('accounts', 'users.id', 'accounts.user_id')
```
#### rightOuterJoin
```javascript
await Database
  .select('*')
  .from('users')
  .rightOuterJoin('accounts', 'users.id', 'accounts.user_id')
  ```
#### outerJoin
```javascript
await Database
  .select('*')
  .from('users')
  .outerJoin('accounts', 'users.id', 'accounts.user_id')
```
#### fullOuterJoin
```javascript
await Database
  .select('*')
  .from('users')
  .fullOuterJoin('accounts', 'users.id', 'accounts.user_id')
```
#### crossJoin
```javascript
await Database
  .select('*')
  .from('users')
  .crossJoin('accounts', 'users.id', 'accounts.user_id')
```
#### joinRaw
```javascript
await Database
  .select('*')
  .from('accounts')
  .joinRaw('natural full join table1').where('id', 1)
```
## Ordering and Limits
#### distinct
```javascript
await Database
  .table('users')
  .distinct('age')
```
#### 通过...分组
```javascript
await Database
  .table('users')
  .groupBy('age')
```
#### groupByRaw
```javascript
await Database
  .table('users')
  .groupByRaw('age, status')
```
#### orderBy(column，[direction = asc])
```javascript
await Database
  .table('users')
  .orderBy('id', 'desc')
```
#### orderByRaw(column，[direction = asc])
```javascript
await Database
  .table('users')
  .orderByRaw('col NULLS LAST DESC')
```
#### having
> groupBy() 必须先调用 having() 。
```javascript
await Database
  .table('users')
  .groupBy('age')
  .having('age', '>', 18)
```
#### offset/limit(value)
```javascript
await Database
  .table('users')
  .offset(11)
  .limit(10)
```
## Inserts
#### insert(values)
insert 操作创建一行并返回其新创建的 id ：
```javascript
const userId = await Database
  .table('users')
  .insert({username: 'foo', ...})
```
在批量插入的情况下，id 返回第一个记录(这是 MySQL 本身的限制；请参阅 [LAST_INSERT_ID](http://dev.mysql.com/doc/refman/5.6/en/information-functions.html#function_last-insert-id) )：
```javascript
// BULK INSERT
const firstUserId = await Database
  .from('users')
  .insert([{username: 'foo'}, {username: 'bar'}])
```
#### into(tableName)

into 方法比 table/from 插入数据库行时使用的方法更具可读性：
```javascript
const userId = await Database
  .insert({username: 'foo', ...})
  .into('users')
```
### PostgreSQL Return Column

对于 PostgreSQL ，你必须显式定义返回列(所有其他数据库客户端忽略此语句)：
```javascript
const userId = await Database
  .insert({ username: 'virk' })
  .into('users')
  .returning('id')
```
## 更新
所有更新操作都返回受影响的行数：
```javascript
const affectedRows = await Database
  .table('users')
  .where('username', 'tutlage')
  .update('lastname', 'Virk')
```
要更新多个列，请将这些列/值作为对象传递：
```javascript
const affectedRows = await Database
  .table('users')
  .where('username', 'tutlage')
  .update({ lastname: 'Virk', firstname: 'Aman' })
```
## 删除
#### delete
删除操作还会返回受影响的行数：
```javascript
const affectedRows = await Database
  .table('users')
  .where('username', 'tutlage')
  .delete()
```
> 作为 delete 被保留在 JavaScript 中保留的关键字，你也可以使用替代 del() 方法。
截短
Truncate 删除所有表行，将表自动增量 id 重置为 0 ：
```javascript
await Database.truncate('users')
```
## 分页
查询生成器提供了方便的方法来分页数据库结果。

#### forPage(page, [limit = 20])
```javascript
const users = await Database
  .from('users')
  .forPage(1, 10)
```
#### paginate(page, [limit = 20])
```javascript
const results = await Database
  .from('users')
  .paginate(2, 10)
```
> paginate 方法的输出与 forPage 方法不同。

```javascript
// 输出
{
  total: '',
  perPage: '',
  lastPage: '',
  page: '',
  data: [{...}]
}
```
如果使用 PostgreSQL ，则 total 密钥将是一个字符串，因为 JavaScript 无法 bigint 本机处理(有关推荐的解决方案，请参阅[此问题](https://github.com/adonisjs/adonis-lucid/issues/339#issuecomment-387399508))。
## 数据库事务
数据库事务是安全操作，在你明确提交更改之前，这些操作不会反映在数据库中。

#### beginTransaction

beginTransaction 方法返回事务对象，可用于执行任何查询：
```javascript
const trx = await Database.beginTransaction()
await trx.insert({username: 'virk'}).into('users')

await trx.commit() // insert query will take place on commit
await trx.rollback() // will not insert anything
```
#### transaction
你还可以将事务包装在回调中：
```javascript
await Database.transaction(async (trx) => {
  await trx.insert({username: 'virk'}).into('users')
})
```
> 你无需在此回调中调用 commit 或 rollback 手动调用。
如果你的任何查询引发错误，则事务将自动回滚，否则将提交。

## Aggregates
Query Builder 公开了 Knex 的[聚合函数](http://knexjs.org/#Builder-count) 的全部功能。

#### 计数()
```javascript
const count = await Database
  .from('users')
  .count()                // returns array

const total = count[0]['count(*)']    // returns number

// COUNT A COLUMN
const count = await Database
  .from('users')
  .count('id')                 // returns array

const total = count[0]['count("id")']    // returns number

// COUNT COLUMN AS NAME
const count = await Database
  .from('users')
  .count('* as total')            // returns array

const total = count[0].total       // returns number
```
#### countDistinct
countDistinct 是一样的 count ，但添加了一个 distinct 表达式：
```javascript
const count = await Database
  .from('users')
  .countDistinct('id')                          // returns array

const total = count[0]['count(distinct "id")']  // returns number
```
#### min
```javascript
await Database.from('users').min('age')         // returns array
await Database.from('users').min('age as a')    // returns array
```
#### max
```javascript
await Database.from('users').max('age')         // returns array
await Database.from('users').max('age as a')    // returns array
```
#### sum 
```javascript
await Database.from('cart').sum('total')        // returns array
await Database.from('cart').sum('total as t')   // returns array
sumDistinct
await Database.from('cart').sumDistinct('total')      // returns array
await Database.from('cart').sumDistinct('total as t') // returns array
```
#### sumDistinct
```javascript
await Database.from('users').avg('age')         // returns array
await Database.from('users').avg('age as age')  // returns array
```
#### avgDistinct
```javascript
await Database.from('users').avgDistinct('age')         // returns array
await Database.from('users').avgDistinct('age as age')  // returns array
```
#### 自增
通过以下方式增加列值：
```javascript
await Database
  .table('credits')
  .where('id', 1)
  .increment('balance', 10)
  ```
#### 自减
通过以下方式减少列值：
```javascript
await Database
  .table('credits')
  .where('id', 1)
  .decrement('balance', 10)
```
### 聚合助手
AdonisJs 查询生成器还使用有用的常用聚合查询快捷方法扩展了 Knex 的查询聚合。这些辅助方法结束查询构建器链并返回一个值。

所有帮助程序都接受用于聚合的列名。如果可能，Query Builder 将为列名选择默认值。

例如 sum() 一样的方法，需要列名。

底层 Knex 查询制造商确定的方法：count()，countDistinct()，avg()，avgDistinct()，sum()，sumDistinct()，min()，和 max() 。为了避免混淆和命名冲突，Query Builder 将其聚合辅助方法作为前缀 get(例如getCount) 。

#### getCount(columnName ='*')
```javascript
const total = await Database
  .from('users')
  .getCount()                                   // returns number
```
#### getCountDistinct(COLUMNNAME)
```javascript
const total = await Database
  .from('users')
  .countDistinct('id')                          // returns number
  ```
#### getMin(COLUMNNAME)
```javascript
await Database.from('users').getMin('age')      // returns a number
```
#### getMax的(COLUMNNAME)
```javascript
await Database.from('users').getMax('age')      // returns number
```
#### getSum(COLUMNNAME)
```javascript
await Database.from('cart').getSum('total')     // returns number
```
#### getSumDistinct(COLUMNNAME)
```javascript
await Database.from('cart').getSumDistinct('total')   // returns number
```
#### getAvg(COLUMNNAME)
```javascript
await Database.from('users').getAvg('age')      // returns number
```
#### getAvgDistinct(COLUMNNAME)
```javascript
await Database.from('users').getAvgDistinct('age')      // returns number
```
## 帮助函数
#### pluck(column)

pluck 方法将返回所选列的值数组：
```javascript
const usersIds = await Database.from('users').pluck('id')
```
#### first
first 方法查询满足条件的第一条数据：
```javascript
await Database.from('users').first()
```
#### clone
clone 当前查询链以供以后使用：
```javascript
const query = Database
  .from('users')
  .where('username', 'virk')
  .clone()

// later
await query
```
#### columnInfo
返回给定列的信息：
```javascript
const username = await Database
  .table('users')
  .columnInfo('username')
  ```
## 子查询
```javascript
const subquery = Database
  .from('accounts')
  .where('account_name', 'somename')
  .select('account_name')

const users = await Database
  .from('users')
  .whereIn('id', subquery)
select * from `users` where `id` in (select `account_name` from `accounts` where `account_name` = 'somename')
```
## 原始查询
Database.raw 方法应该用于运行原始 SQL 查询：
```javascript
await Database
  .raw('select * from users where username = ?', [username])
  ```
## 关闭连接
可以通过调用 close 方法来关闭数据库连接。默认情况下，此方法关闭所有打开的数据库连接。

要关闭所选连接，请传递一组连接名称：
```javascript
Database.close() // all

Database.close(['sqlite', 'mysql'])
```