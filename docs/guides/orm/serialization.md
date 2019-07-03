# 序列化
序列化程序提供干净的抽象来转换数据库结果。

AdonisJs 附带默认的 Vanilla Serializer ，但你可以自由创建和使用你的应用程序所需的任何序列化程序。

常见的序列化程序用法是根据 JSON：API 规范格式化数据。

## 介绍
通过 Lucid 模型进行的数据库查询返回可序列化的实例：
```javascript
const User = use('App/Models/User')

const users = await User.all()

// users -> Vanilla Serializer instance
```
要将可序列化实例转换为普通数组/对象，请调用其 toJSON 方法：
```javascript
const json = users.toJSON()
```
调用 toJSON 任何可序列化的实例都会返回准备好 JSON 输出的数据。

#### 为何使用序列化器？
编写 API 服务器时，你不希望将未序列化的模型实例数据返回给用户。

 Serializers 通过在需要时格式化模型数据来解决此问题。

假设一个 User 可以有很多 Post 关系：
```javascript
const User = use('App/Models/User')

const users = await User
  .query()
  .with('posts')
  .fetch()
```
在上面的示例中， Lucid 加载所有 User 模型及其 Post 关系，但不会在此时格式化 JSON 的加载数据。

users 最后会调用 toJSON ，格式化数据的责任交给了 Vanilla 序列化：
```javascript
// serialize the data
users.toJSON()
// 输出
[
  {
    id: 1,
    username: 'virk',
    posts: [
      {
        id: 1,
        user_id: 1,
        title: 'Adonis 101'
      }
    ]
  }
]
```
一个序列化执行所有 getters，setters 并 computed properties 返回格式化模型数据之前。

## 使用 Serializer
可以通过覆盖 Serializer 的 getter 方法来为每个模型定义序列化器：
```javascript
class User extends Model {
  static get Serializer () {
    return // your own implementation
  }
}
```
## Vanilla Serializer
 Vanilla Serializer 执行以下操作：

- 将每个模型记录旁边的所有关系附加为属性。

- 将所有 sideloaded 数据附加到根 __meta__ 键中，例如，给定用户的帖子计数表示如下：
```json
{
  id: 1,
  username: 'virk',
  __meta__: {
    posts_count: 2
  }
}
```
格式分页结果：
```json
{
  total: 10,
  perPage: 20,
  lastPage: 1,
  currentPage: 1,
  data: []
}
```
## 创建序列化程序
创建自己的序列化程序，以 AdonisJs 未提供的格式返回数据。

序列化程序 API 非常小，可以轻松添加新的序列化程序。

避免使用自定义序列化程序来修补 JSON 输出。相反，使用 getters 和 computed properties 。
#### API 概述
下面是自定义序列化程序的示例模板：
```javascript
class CustomSerializer {
  constructor (rows, pages = null, isOne = false) {
    this.rows = rows
    this.pages = pages
    this.isOne = isOne
  }

  first () {
    return this.rows[0]
  }

  last () {
    return this.rows[this.rows.length - 1]
  }

  size () {
    return this.isOne ? 1 : this.rows.length
  }

  toJSON () {
    // return formatted data
  }
}

module.exports = CustomSerializer
```
创建自定义序列化程序后，将其绑定到 IoC 容器：
```javascript
const { ioc } = require('@adonisjs/fold')

ioc.bind('MyApp/CustomSerializer', () => {
  return require('./app/Serializers/CustomSerializer')
})
```
绑定到容器后，为每个模型定义自定义序列化程序：
```javascript
class User extends Model {
  static get Serializer () {
    return 'MyApp/CustomSerializer'
  }
}
```
