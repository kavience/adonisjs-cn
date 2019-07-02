# 快速开始
通过其强大的 Query Builder，Lucid ORM，Migrations，Factories, and Seeds.，大大简化了创建 AdonisJs 数据驱动的应用程序。

在本指南中，我们将学习如何设置和使用数据库提供程序。

> 数据提供程序在内部使用 Knex.js ，因此只要需要进一步的信息，请浏览 [Knex 文档](https://knexjs.org/)。
## 支持的数据库
支持的数据库及其等效驱动程序列表如下：

数据库| NPM 驱动程序
-|-
MariaDB|npm i mysql 或者 npm i mysql2
MSSQL|npm i mssql
MySQL|npm i mysql 要么 npm i mysql2
Oracle|npm i oracledb
PostgreSQL|npm i pg
SQLite3|npm i sqlite3

## 建立
### 安装
如果未安装数据库提供程序( Lucid )，请从npm以下位置提取：
```bash
adonis install @adonisjs/lucid
```
接下来，在 start/app.js 文件中注册以下提供程序：
```javascript
const providers = [
  '@adonisjs/lucid/providers/LucidProvider'
]

const aceProviders = [
  '@adonisjs/lucid/providers/MigrationsProvider'
]
```
> 默认情况下， AdonisJs 安装了 Lucid 。
### 配置
该数据库提供使用 sqlite 默认连接。

可以通过 config/database.js 文件设置默认连接：
```javascript
module.exports = {
  connection: 'mysql',
}
```
支持所有 [Knex 配置选项](http://knexjs.org/#Installation-client)。

## 基本例子
AdonisJs Query Builder 具有流畅的 API，这意味着你可以链接/附加 JavaScript 方法来创建 SQL 查询。

例如，要选择所有用户并将其作为 JSON 返回：
```javascript
const Database = use('Database')

Route.get('/', async () => {
  return await Database.table('users').select('*')
})
```
### 条件查询
要向查询添加 where 子句，请链接 where 方法：
```javascript
Database
  .table('users')
  .where('age', '>', 18)
```
要添加另一个 where 子句，请链接一个 orWhere 方法：
```javascript
Database
  .table('users')
  .where('age', '>', 18)
  .orWhere('vip', true)
```
有关完整的 API 参考，请参阅 [Query Builder 文档](https://adonisjs.com/docs/4.1/query-builder)。

## 多个连接
默认情况下，AdonisJs 在进行数据库查询时使用文件中 connection 定义的值 config/database.js 。

你可以 config/database.js 在运行时选择文件中定义的任何连接来进行查询：
```javascript
Database
  .connection('mysql')
  .table('users')
```
> 由于 AdonisJs 池连接以便重用，因此除非进程终止，否则将维护所有使用的连接。
要关闭连接，请调用close传递任何连接名称的方法：
```javascript
const users = await Database
  .connection('mysql')
  .table('users')

// later close the connection
Database.close(['mysql'])
```
## 表前缀
该数据库提供商可以通过定义自动前缀表名 prefix 的内在价值 config/database.js 的文件：
```javascript
module.exports = {
  connection: 'sqlite',

  sqlite: {
    client: 'sqlite3',
    prefix: 'my_'
  }
}
```
现在，sqlite 连接上的所有查询都将 my_ 作为其表前缀：
```javascript
await Database
  .table('users')
  .select('*')
// SQL输出
select * from `my_users`
```
#### withOutPrefix
如果 prefix 定义了值，则可以通过调用以忽略它withOutPrefix：
```javascript
await Database
  .withOutPrefix()
  .table('users')
```
## 调试
调试数据库查询在开发和生产中都很方便。

让我们来看看调试查询的可用策略。

#### 全局
debug: true 在 database/config.js 文件内部设置可以全局调试所有查询：
```javascript
module.exports = {
  connection: 'sqlite',

  sqlite: {
    client: 'sqlite3',
    connection: {},
    debug: true
  }
}
```
你还可以通过 Database Provider query 事件调试查询。

query 通过在 start/hooks.js 文件中定义一个钩子来监听事件：
```javascript
const { hooks } = require('@adonisjs/ignitor')

hooks.after.providersBooted(() => {
  const Database = use('Database')
  Database.on('query', console.log)
})
```
start/hooks.js 如果文件不存在，请创建该文件。
#### 本地调试
你可以 query 在运行时侦听每个查询的事件：
```javascript
await Database
  .table('users')
  .select('*')
  .on('query', console.log)
```