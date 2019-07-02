# 增强
吸气剂
塞特斯
计算属性
Getter和setter提供了许多好处，包括在保存和从数据库检索之前转换数据的能力。

在本指南中，我们将了解何时何地使用getter，setter和computed属性(也称为访问器和mutator)。

吸气剂
从模型实例检索值时调用getter。

它们通常用于转换模型数据以进行显示。

例如，将Post标题转换为标题案例：

应用/型号/ Post.js
'use strict'

const Model = use('Model')

class Post extends Model {
  getTitle (title) {
    return title.replace(/^(.)|\s(.)/g, ($1) => {
      return $1.toUpperCase()
    })
  }
}
const post = await Post.find(postId)

// getters are called automatically
return post.toJSON()
在上面的示例中，假设Post标题保存为title数据库中的字段，AdonisJs执行该getTitle方法并在post.title引用时使用返回的值。

Getters始终以get关键字开头，后跟字段名称的驼峰案例版本(例如field_name→ getFieldName)。

在模型实例上引用该字段时，将使用getter的返回值而不是实际的数据库字段名称值。

调用toJSON模型实例或序列化程序实例时，将自动评估getter 。

由于getter是同步的，因此你无法在其中运行异步代码(对于异步功能，请使用挂钩)。

塞特斯
在为模型实例赋值时调用setter。

它们通常用于在保存到数据库之前规范化数据：

应用/型号/ user.js的
'use strict'

const Model = use('Model')

class User extends Model {
  setAccess (access) {
    return access === 'admin' ? 1 : 0
  }
}

const user = new User()
user.access = 'admin'

console.log(user.access) // will return 1
await user.save()
Setter始终以set关键字开头，后跟字段名称的驼峰案例版本。

在模型实例上设置/更新给定字段的值时，将执行setter。

Setter在分配之前接收要解析的给定字段的当前值。

由于setter是同步的，因此你无法在其中运行异步代码(对于异步功能，请使用挂钩)。

计算属性
计算属性是仅存在于模型实例的JSON表示中的虚拟值。

要从名/姓创建计算fullname属性User：

应用/型号/ user.js的
'use strict'

const Model = use('Model')

class User extends Model {
  static get computed () {
    return ['fullname']
  }

  getFullname ({ firstname, lastname }) {
    return `${firstname} ${lastname}`
  }
}
在上面的示例中，在实例toJSON上调用时，User会将fullname属性添加到返回值：

const user = await User.find(1)

const json = user.toJSON()
console.log(json.fullname) // firstname + lastname
fullname必须在模型类静态computedgetter 的数组中返回所有计算属性名称(例如)。

计算属性方法定义以getgetter方法定义(例如getFullname)为前缀。

计算属性接收现有模型属性的对象，以便在其方法定义中使用。

