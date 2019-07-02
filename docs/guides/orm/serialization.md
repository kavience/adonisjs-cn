# 序列化
介绍
使用Serializer
香草系列
创建序列化程序
序列化程序提供干净的抽象来转换数据库结果。

AdonisJs附带默认的Vanilla Serializer，但你可以自由创建和使用你的应用程序所需的任何序列化程序。

常见的序列化程序用法是根据JSON：API规范格式化数据。

介绍
通过Lucid模型进行的数据库查询返回可序列化的实例：

const User = use('App/Models/User')

const users = await User.all()

// users -> Vanilla Serializer instance
要将可序列化实例转换为普通数组/对象，请调用其toJSON方法：

const json = users.toJSON()
调用toJSON任何可序列化的实例都会返回准备好JSON输出的数据。

为何使用序列化器？
编写API服务器时，你不太可能希望将未序列化的模型实例数据返回给用户。

Serializers通过在需要时格式化模型数据来解决此问题。

假设一个User可以有很多Post关系：

const User = use('App/Models/User')

const users = await User
  .query()
  .with('posts')
  .fetch()
在上面的示例中，Lucid加载所有User模型及其Post关系，但不会在此时格式化JSON的加载数据。

当toJSON最后呼吁users，格式化数据的责任交给了香草串行：

// serialize the data
users.toJSON()
产量
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
一个串行执行所有getters，setters并computed properties返回格式化模型数据之前。

使用Serializer
可以通过覆盖Serializergetter 来为每个模型定义序列化器：

应用/型号/ user.js的
class User extends Model {
  static get Serializer () {
    return // your own implementation
  }
}
香草系列
该香草串行执行以下操作：

将每个模型记录旁边的所有关系附加为属性。

将所有sideloaded数据附加到根__meta__密钥，例如，给定用户的帖子计数表示如下：

{
  id: 1,
  username: 'virk',
  __meta__: {
    posts_count: 2
  }
}
格式分页结果：

{
  total: 10,
  perPage: 20,
  lastPage: 1,
  currentPage: 1,
  data: []
}
创建序列化程序
创建自己的序列化程序，以AdonisJs未提供的格式返回数据。

序列化程序API非常小，可以轻松添加新的序列化程序。

避免使用自定义序列化程序来修补JSON输出。相反，使用getters和computed properties。
API概述
下面是自定义序列化程序的示例模板：

应用程序/串行器/ CustomSerializer.js
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
创建自定义序列化程序后，将其绑定到IoC容器：

启动/ hooks.js
const { ioc } = require('@adonisjs/fold')

ioc.bind('MyApp/CustomSerializer', () => {
  return require('./app/Serializers/CustomSerializer')
})
绑定到容器后，为每个模型定义自定义序列化程序：

应用/型号/ user.js的
class User extends Model {
  static get Serializer () {
    return 'MyApp/CustomSerializer'
  }
}
