# 关系
基本例子
有一个
有很多
属于
属于许多人
很多通过
查询数据
渴望加载
懒惰的渴望加载
过滤数据
计数
插入，更新和删除
关系是数据驱动应用程序的支柱，将一种模型类型链接到另一种模型类型。

例如，a User可以有很多Post关系，每个关系Post可以有很多Comment关系。

Lucid的富有表现力的API使得关联和获取模型关系的过程变得简单直观，无需触摸SQL语句甚至编辑SQL模式。

基本例子
让我们来看一个包含两个模型的场景：User和Profile。

在我们的示例中，每个User实例都可以有一个 Profile。

我们称之为一对一的关系。

定义关系
要定义此关系，请将以下方法添加到User模型中：

应用/型号/ user.js的
const Model = use('Model')

class User extends Model {
  profile () {
    return this.hasOne('App/Models/Profile')
  }
}

module.exports = User
在上面的示例中，我们向模型添加了一个profile方法，User返回hasOne键入模型的关系Profile。

如果Profile模型不存在，请生成它：

> adonis make:model Profile
应用/型号/ Profile.js
const Model = use('Model')

class Profile extends Model {
}

module.exports = Profile
无需在两个模型上定义关系。只需在单个模型上进行单向设置即可。
获取用户个人资料
现在我们已经定义了User和之间的关系Profile，我们可以执行以下代码来获取用户的配置文件：

const User = use('App/Models/User')

const user = await User.find(1)
const userProfile = await user.profile().fetch()
有一个
一个hasOne关系定义了一对一的使用关系外键的相关模型。

API
hasOne(relatedModel, primaryKey, foreignKey)
relatedModel
对当前模型具有的模型的IoC容器引用。

首要的关键
默认为当前模型主键(即id)。

FOREIGNKEY
默认为tableName_primaryKey当前模型。使用表名的单数形式(例如，外键user_id引用id表上的列users)。

数据库表
HasOne wechyq

定义关系
应用/型号/ user.js的
const Model = use('Model')

class User extends Model {
  profile () {
    return this.hasOne('App/Models/Profile')
  }
}

module.exports = User
有很多
一个hasMany关系定义了一对多使用的关系外键的其他相关模型。

API
hasMany(relatedModel, primaryKey, foreignKey)
relatedModel
对模型的IoC容器引用，当前模型有很多。

首要的关键
默认为当前模型主键(即id)。

FOREIGNKEY
默认为tableName_primaryKey当前模型。使用表名的单数形式(例如，外键user_id引用id表上的列users)。

数据库表
HasMany kkbac9

定义关系
应用/型号/ user.js的
const Model = use('Model')

class User extends Model {
  posts () {
    return this.hasMany('App/Models/Post')
  }
}

module.exports = User
属于
该belongsTo关系是hasOne关系的反转，并应用于关系的另一端。

继续我们User和Profile示例，Profile模型属于User模型，因此具有在belongsTo其上定义的关系。

API
belongsTo(relatedModel, primaryKey, foreignKey)
relatedModel
IoC容器引用当前模型所属的模型。

首要的关键
默认为相关的模型外键(在我们Profile所属的User示例中，这将是user_id)。

FOREIGNKEY
默认为相关的模型主键。

数据库表
属于fwqdc3

定义关系
应用/型号/ Profile.js
const Model = use('Model')

class Profile extends Model {
  user () {
    return this.belongsTo('App/Models/User')
  }
}

module.exports = Profile
属于许多人
该belongsToMany关系允许你在两个模型上定义多对多的关系。

例如：

A User可以有很多Car型号。

A 在其生命周期中Car可以有许多User模型(即所有者)。

由于这两个User和Car可以有其他模型的许多关系，我们说每个模型属于许多其他模型。

当定义一个belongsToMany关系，我们不存储在无论是作为我们为我们的模型表的外键hasOne和hasMany关系。

相反，我们必须依赖第三个称为数据透视表的中间表。

你可以使用迁移文件创建数据透视表。
API
belongsToMany(
  relatedModel,
  foreignKey,
  relatedForeignKey,
  primaryKey,
  relatedPrimaryKey
)
relatedModel
对模型的IoC容器引用，当前模型有很多。

FOREIGNKEY
默认为当前模型外键(在我们的User许多Car示例中，这将是user_id)。

relatedForeignKey
默认为相关的模型外键(在我们的User许多Car示例中，这将是car_id)。

首要的关键
默认为当前模型主键(即id)。

relatedPrimaryKey
默认为相关的模型主键(即id)。

数据库表
BelongsToMany ngg7oj

定义关系
应用/型号/ Car.js
const Model = use('Model')

class User extends Model {
  cars () {
    return this.belongsToMany('App/Models/Car')
  }
}

module.exports = User
在上面的示例中，名为的表car_user是存储主模板和模型主键之间唯一关系的数据透视表。CarUser

数据透视表
默认情况下，数据透视表名称是通过按字母顺序对小写的相关模型名称进行排序并使用_字符(例如User+ Car= car_user)连接它们得出的。

要设置自定义数据透视表名称，请调用pivotTable关系定义：

cars () {
  return this
    .belongsToMany('App/Models/Car')
    .pivotTable('user_cars')
}
withTimestamps
默认情况下，不假定数据透视表具有时间戳。

要启用时间戳，请调用withTimestamps关系定义：

cars () {
  return this
    .belongsToMany('App/Models/Car')
    .withTimestamps()
}
withPivot
默认情况下，只从数据透视表返回外键。

要返回其他数据透视表字段，请调用withPivot关系定义：

cars () {
  return this
    .belongsToMany('App/Models/Car')
    .withPivot(['is_current_owner'])
}
pivotModel
要更好地控制对数据透视表的查询，可以绑定数据透视表模型：

cars () {
  return this
    .belongsToMany('App/Models/Car')
    .pivotModel('App/Models/UserCar')
}
应用/型号/ UserCar.js
const Model = use('Model')

class UserCar extends Model {
  static boot () {
    super.boot()
    this.addHook('beforeCreate', (userCar) => {
      userCar.is_current_owner = true
    })
  }
}

module.exports = UserCar
在上面的例子中，UserCar是一个常规的L​​ucid模型。

通过分配枢轴模型，你可以使用生命周期钩子，getter / setter等。

打电话后pivotModel你无法调用pivotTable和withTimestamps方法。相反，你需要在数据透视模型本身上设置这些值。
很多通过
这种manyThrough关系是定义间接关系的便捷方式。

例如：

A User属于Country。

A User有很多Post型号。

使用manyThrough，你可以获取Post给定的所有模型Country。

API
manyThrough(
  relatedModel,
  relatedMethod,
  primaryKey,
  foreignKey
)
relatedModel
对模型的IoC容器引用，当前模型需要访问以访问间接相关的模型。

relatedMethod
调用关系方法relatedModel来获取间接相关的模型结果。

首要的关键
默认为当前模型主键(即id)。

FOREIGNKEY
默认为当前模型的外键(在我们Posts通过Country例子，这将是country_id)。

数据库表
HasManyThrough dcr86k

定义关系
关系需要在主要和中间模型上定义。

我们继续Posts通过Country例子，让我们定义所需hasMany的中介关系User模型：

应用/型号/ user.js的
const Model = use('Model')

class User extends Model {
  posts () {
    return this.hasMany('App/Models/Post')
  }
}
最后，定义manyThrough主Country模型上的关系：

应用/型号/ Country.js
const Model = use('Model')

class Country extends Model {
  posts () {
    return this.manyThrough('App/Models/User', 'posts')
  }
}
在上面的示例中，第二个参数是posts对User模型上方法的引用。

该relatedMethod参数必须始终传递给manyThrough方法的许多通过关系来工作。
查询数据
Lucid的直观API极大地简化了查询相关数据，为所有类型的模型关系提供了一致的界面。

如果a User有很多Post型号，我们可以为用户提取所有帖子，id=1如下所示：

const User = use('App/Models/User')

const user = await User.find(1)
const posts = await user.posts().fetch()
通过调用Query Builder方法(如典型查询)来添加运行时约束：

const user = await User.find(1)

// published posts
const posts = await user
  .posts()
  .where('is_published', true)
  .fetch()
上面的示例为用户提取所有已发布的帖子id=1。

查询数据透视表
你可以where为belongsToMany数据透视表添加子句，如下所示：

const user = await User.find(1)

const cars = await user
  .cars()
  .wherePivot('is_current_owner', true)
  .fetch()
以上示例获取其当前所有者为用户的所有汽车id=1。

这些方法whereInPivot和orWherePivot也可提供。

渴望加载
当你想要获取多个基本关系的关系时(例如，多个用户的帖子)，急切加载是首选方法。

渴望加载是为了避免n+1问题而获取可能的最小数据库查询的关系的概念。

没有急切加载，使用本节前面讨论的技术：

不建议
const User = use('App/Models/User')

const users = await User.all()
const posts = []

for (let user of users) {
  const userPosts = await user.posts().fetch()
  posts.push(userPosts)
}
上面的示例n+1对数据库进行查询，其中n是用户数。通过大量用户循环将导致对数据库进行大量查询，这几乎不是理想的！

通过急切加载，只需要2个查询即可获取所有用户及其帖子：

推荐的
const User = use('App/Models/User')

const users = await User
  .query()
  .with('posts')
  .fetch()
该with方法渴望加载通过关系与原始有效载荷的一部分，所以运行users.toJSON()现在会返回一个输出像这样：

JSON输出
[
  {
    id: 1,
    username: 'virk',
    posts: [{
      id: 1,
      user_id: 1,
      title: '...'
    }]
  }
]
在上面的JSON输出中，每个User对象现在都有一个posts关系属性，因此很容易一目了然地发现Post属于哪个User。

添加运行时约束
将运行时约束添加到急切加载的关系，如下所示：

const users = await User
  .query()
  .with('posts', (builder) => {
    builder.where('is_published', true)
  })
  .fetch()
加载多个关系
通过链接with方法可以加载多个关系：

const users = await User
  .query()
  .with('posts')
  .with('profile')
  .fetch()
加载嵌套关系
嵌套关系通过点表示法加载。

以下查询加载所有User帖子及其相关注释：

const users = await User
  .query()
  .with('posts.comments')
  .fetch()
嵌套关系约束回调仅适用于最后一个关系：

const users = await User
  .query()
  .with('posts.comments', (builder) => {
    builder.where('approved', true)
  })
  .fetch()
在上面的示例中，该builder.where子句仅适用于comments关系(而不是posts关系)。

要向第一个关系添加约束，请使用以下方法：

const users = await User
  .query()
  .with('posts', (builder) => {
    builder.where('is_published', true)
      .with('comments')
  })
  .fetch()
在上面的示例中，where约束被添加到posts关系中，同时急切加载posts.comments。

检索加载的模型数据
要检索加载的数据，你必须调用getRelated方法：

const user = await User
  .query()
  .with('posts')
  .fetch()

const posts = user.getRelated('posts')
懒惰的渴望加载
要在已获取数据后加载关系，请使用该load方法。

例如，要posts在已经获取后加载相关的User：

const user = await User.find(1)
await user.load('posts')
你可以使用以下loadMany方法延迟加载多个关系：

const user = await User.find(1)
await user.loadMany(['posts', 'profiles'])
要通过loadMany你设置查询约束，必须传递一个对象：

const user = await User.find(1)
await user.loadMany({
  posts: (builder) => builder.where('is_published', true),
  profiles: null
})
检索加载的模型数据
要检索加载的数据，你必须调用getRelated方法：

const user = await User.find(1)
await user.loadMany(['posts', 'profiles'])

const posts = user.getRelated('posts')
const profiles = user.getRelated('profiles')
过滤数据
Lucid的API使得根据关系的存在过滤数据变得简单。

让我们使用查找带注释的所有帖子的经典示例。

这是我们的Post模型及其comments关系定义：

应用/型号/ Post.js
const Model = use('Model')

class Post extends Model {
  comments () {
    return this.hasMany('App/Models/Comments')
  }
}
具有
要仅检索至少有一个的帖子Comment，请链接该has方法：

const posts = await Post
  .query()
  .has('comments')
  .fetch()
就这么简单！ 😲

has像这样向方法添加表达式/值约束：

const posts = await Post
  .query()
  .has('comments', '>', 2)
  .fetch()
以上示例仅检索超过2条评论的帖子。

whereHas
该whereHas方法类似has但允许更具体的约束。

例如，要获取至少包含2条已发布评论的所有帖子：

const posts = await Post
  .query()
  .whereHas('comments', (builder) => {
    builder.where('is_published', true)
  }, '>', 2)
  .fetch()
doesntHave
与该has条款相反：

const posts = await Post
  .query()
  .doesntHave('comments')
  .fetch()
此方法不接受表达式/值约束。
whereDoesntHave
与该whereHas条款相反：

const posts = await Post
  .query()
  .whereDoesntHave('comments', (builder) => {
    builder.where('is_published', false)
  })
  .fetch()
此方法不接受表达式/值约束。
你可以添加or通过调用该条款orHas，orWhereHas，orDoesntHave和orWhereDoesntHave方法。

计数
通过调用方法检索关系计数withCount：

const posts = await Post
  .query()
  .withCount('comments')
  .fetch()

posts.toJSON()
JSON输出
{
  title: 'Adonis 101',
  __meta__: {
    comments_count: 2
  }
}
为计数定义别名，如下所示：

const posts = await Post
  .query()
  .withCount('comments as total_comments')
  .fetch()
JSON输出
__meta__: {
  total_comments: 2
}
计算约束
例如，要仅检索已批准的注释计数：

const posts = await Post
  .query()
  .withCount('comments', (builder) => {
    builder.where('is_approved', true)
  })
  .fetch()
插入，更新和删除
添加，更新和删除相关记录就像查询数据一样简单。

保存
该save方法需要相关模型的实例。

save 可以应用于以下关系类型：

hasOne

hasMany

belongsToMany

const User = use('App/Models/User')
const Post = use('App/Models/Post')

const user = await User.find(1)

const post = new Post()
post.title = 'Adonis 101'

await user.posts().save(post)
创建
该create方法类似于save但需要一个普通的JavaScript对象，返回相关的模型实例。

create 可以应用于以下关系类型：

hasOne

hasMany

belongsToMany

const User = use('App/Models/User')

const user = await User.find(1)

const post = await user
  .posts()
  .create({ title: 'Adonis 101' })
createMany
将许多相关行保存到数据库中。

createMany 可以应用于以下关系类型：

hasMany

belongsToMany

const User = use('App/Models/User')

const user = await User.find(1)

const post = await user
  .posts()
  .createMany([
    { title: 'Adonis 101' },
    { title: 'Lucid 101' }
  ])
saveMany
save与之类似，但保存相关模型的多个实例：

saveMany 可以应用于以下关系类型：

hasMany

belongsToMany

const User = use('App/Models/User')
const Post = use('App/Models/Post')

const user = await User.find(1)

const adonisPost = new Post()
adonisPost.title = 'Adonis 101'

const lucidPost = new Post()
lucidPost.title = 'Lucid 101'

await user
  .posts()
  .saveMany([adonisPost, lucidPost])
关联
该associate方法专用于belongsTo关系，将两个模型实例相互关联。

假设a Profile属于a User，将a User与a 关联Profile：

const Profile = use('App/Models/Profile')
const User = use('App/Models/User')

const user = await User.find(1)
const profile = await Profile.find(1)

await profile.user().associate(user)
分离
该dissociate方法是相反associate。

删除关联关系：

const Profile = use('App/Models/Profile')
const profile = await Profile.find(1)

await profile.user().dissociate()
连接
在通过数据透视表附加相关模型attach的belongsToMany关系上调用该方法：

const User = use('App/Models/User')
const Car = use('App/Models/Car')

const mercedes = await Car.findBy('reg_no', '39020103')
const user = await User.find(1)

await user.cars().attach([mercedes.id])
该attach方法接受一个接收pivotModel实例的可选回调，允许你根据需要在数据透视表上设置额外的属性：

const mercedes = await Car.findBy('reg_no', '39020103')
const audi = await Car.findBy('reg_no', '99001020')

const user = await User.find(1)
const cars = [mercedes.id, audi.id]

await user.cars().attach(cars, (row) => {
  if (row.car_id === mercedes.id) {
    row.is_current_owner = true
  }
})
该create和save方法belongsToMany的关系也接受回调允许你如果需要在数据透视表设置额外的属性。
分离
该detach方法与attach方法相反，删除所有现有的数据透视表关系：

const user = await User.find(1)
await user.cars().detach()
要仅分离选定的关系，请传递一组id：

const user = await User.find(1)
const mercedes = await Car.findBy('reg_no', '39020103')

await user.cars().detach([mercedes.id])
同步
该sync方法提供了一种方便快捷方式detach然后attach：

const mercedes = await Car.findBy('reg_no', '39020103')
const user = await User.find(1)

// Behave the same way as:
// await user.cars().detach()
// await user.cars().attach([mercedes.id])

await user.cars().sync([mercedes.id])
更新
该update方法批量更新查询的行。

你可以使用查询生成器方法仅更新特定字段：

const user = await User.find(1)

await user
  .posts()
  .where('title', 'Adonis 101')
  .update({ is_published: true })
要更新数据透视表，请pivotQuery在之前调用update：

const user = await User.find(1)

await user
  .cars()
  .pivotQuery()
  .where('name', 'mercedes')
  .update({ is_current_owner: true })
删除
该delete方法从数据库中删除相关的行：

const user = await User.find(1)

await user
  .cars()
  .where('name', 'mercedes')
  .delete()
在这种情况下belongsToMany，此方法也会丢弃与数据透视表的关系。
