# 修改器
 Getter 和 setter 提供了许多好处，包括在保存和从数据库检索之前转换数据的能力。

在本指南中，我们将了解何时何地使用 getter，setter 和 computed 属性(也称为访问器和 mutator )。

## Getters
从模型实例检索值时调用 getter。

它们通常用于转换模型数据以进行显示。

例如，将 Post 标题转换为大写：
```javascript
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
```
在上面的示例中，假设 Post 标题保存为 title 数据库中的字段， AdonisJs 执行该 getTitle 方法并在 post.title 引用时使用返回的值。

- Getters 始终以 get 关键字开头，后跟字段名称的驼峰案例版本(例如 field_name → getFieldName )。

- 在模型实例上引用该字段时，将使用 getter 的返回值而不是实际的数据库字段名称值。

- 调用 toJSON 模型实例或序列化程序实例时，将自动评估 getter 。

- 由于 getter 是同步的，因此你无法在其中运行异步代码(对于异步功能，请使用挂钩)。

## Setters
在为模型实例赋值时调用 setter 。

它们通常用于在保存到数据库之前规范化数据：
```javascript
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
```
- Setter 始终以 set 关键字开头，后跟字段名称的驼峰案例版本。

- 在模型实例上设置/更新给定字段的值时，将执行 setter 。

- Setter 在分配之前接收要解析的给定字段的当前值。

- 由于 setter 是同步的，因此你无法在其中运行异步代码(对于异步功能，请使用挂钩)。

## 计算属性
计算属性是仅存在于模型实例的 JSON 表示中的虚拟值。

要从 User 中根据 firstname / lastname 计算 fullname 属性：
```javascript
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
```
在上面的示例中，在实例 User 调用 toJSON 时会将 fullname 属性添加到返回值：
```javascript
const user = await User.find(1)

const json = user.toJSON()
console.log(json.fullname) // firstname + lastname
```
- fullname 必须在模型类静态 computed getter 的数组中返回所有计算属性名称。

- 计算属性方法定义以 getgetter 方法定义(例如 getFullname )为前缀。

- 计算属性接收现有模型属性的对象，以便在其方法定义中使用。

