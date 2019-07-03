# 关联(二)
## 懒加载
当你想要获取多个基本关联的关联时(例如，多个用户的帖子)，懒加载是首选方法。

懒加载是为了避免 [n+1 问题](https://secure.phabricator.com/book/phabcontrib/article/n_plus_one/#overview)而获取可能的最小数据库查询的关联的概念。

如果没有懒加载：
```javascript
// 不建议
const User = use('App/Models/User')

const users = await User.all()
const posts = []

for (let user of users) {
  const userPosts = await user.posts().fetch()
  posts.push(userPosts)
}
```
上面的示例中对数据库进行 n+1 此查询，其中 n 是用户数。通过大量用户循环将导致对数据库进行大量查询，这几乎不是理想的！

通过懒加载，只需要 2 个查询即可获取所有用户及其帖子：
```javascript
// 推荐的
const User = use('App/Models/User')

const users = await User
  .query()
  .with('posts')
  .fetch()
```
 with 方法懒加载通过关联与原始有效载荷的一部分，所以运行 users.toJSON() 现在会返回一个输出像这样：

JSON 输出
```json
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
```
在上面的 JSON 输出中，每个 User  对象现在都有一个posts 关联属性，因此很容易一目了然地发现 Post 属于哪个 User 。

#### 添加运行时约束
将运行时约束添加到懒加载的关联，如下所示：
```javascript
const users = await User
  .query()
  .with('posts', (builder) => {
    builder.where('is_published', true)
  })
  .fetch()
```
#### 加载多个关联
通过链接 with 方法可以加载多个关联：
```javascript
const users = await User
  .query()
  .with('posts')
  .with('profile')
  .fetch()
```
#### 加载嵌套关联
嵌套关联通过 . 表示法加载。

以下查询加载所有 User 帖子及其相关评论：
```javascript
const users = await User
  .query()
  .with('posts.comments')
  .fetch()
```
嵌套关联约束回调仅适用于最后一个关联：
```javascript
const users = await User
  .query()
  .with('posts.comments', (builder) => {
    builder.where('approved', true)
  })
  .fetch()
```
在上面的示例中，builder.where 子句仅适用于 comments 关联(而不是 posts 关联)。

要向第一个关联添加约束，请使用以下方法：
```javascript
const users = await User
  .query()
  .with('posts', (builder) => {
    builder.where('is_published', true)
      .with('comments')
  })
  .fetch()
```
在上面的示例中， where 约束被添加到 posts 关联中，同时懒加载 posts.comments 。

#### 检索加载的模型数据
要检索加载的数据，你必须调用 getRelated 方法：
```javascript
const user = await User
  .query()
  .with('posts')
  .fetch()

const posts = user.getRelated('posts')
```
## 动态加载
要在已获取数据后加载关联，请使用 load 方法。

例如，要在 posts 已经获取后加载相关的 User ：
```javascript
const user = await User.find(1)
await user.load('posts')
```
你可以使用以下 loadMany 方法延迟加载多个关联：
```javascript
const user = await User.find(1)
await user.loadMany(['posts', 'profiles'])
```
要通过 loadMany 查询约束，必须传递一个对象：
```javascript
const user = await User.find(1)
await user.loadMany({
  posts: (builder) => builder.where('is_published', true),
  profiles: null
})
```
#### 检索加载的模型数据
要检索加载的数据，你必须调用 getRelated 方法：
```javascript
const user = await User.find(1)
await user.loadMany(['posts', 'profiles'])

const posts = user.getRelated('posts')
const profiles = user.getRelated('profiles')
```
## 过滤数据
Lucid 的 API 使得根据关联的存在过滤数据变得简单。

让我们使用查找带注释的所有帖子的经典示例。

这是我们的 Post 模型及其 comments 关联定义：
```javascript
const Model = use('Model')

class Post extends Model {
  comments () {
    return this.hasMany('App/Models/Comments')
  }
}
```
#### has
要仅检索至少有一个的帖子 Comment ，请链接 has 方法：
```javascript
const posts = await Post
  .query()
  .has('comments')
  .fetch()
```
就这么简单！ 😲

向 has 方法添加表达式/值约束，如下所示：
```javascript
const posts = await Post
  .query()
  .has('comments', '>', 2)
  .fetch()
```
以上示例仅检索超过 2 条评论的帖子。

#### whereHas
whereHas 方法类似 has 但允许更具体的约束。

例如，要获取至少包含 2 条已发布评论的所有帖子：
```javascript
const posts = await Post
  .query()
  .whereHas('comments', (builder) => {
    builder.where('is_published', true)
  }, '>', 2)
  .fetch()
```
#### doesntHave
与 has 方法相反：
```javascript
const posts = await Post
  .query()
  .doesntHave('comments')
  .fetch()
```
> 此方法不接受表达式/值约束。
#### whereDoesntHave
与 whereHas 方法相反：
```javascript
const posts = await Post
  .query()
  .whereDoesntHave('comments', (builder) => {
    builder.where('is_published', false)
  })
  .fetch()
```
> 此方法不接受表达式/值约束。
你可以添加 or 闭包调用 orHas ， orWhereHas ， orDoesntHave 和 orWhereDoesntHave 方法。

## 计数
通过调用方法检索关联计数 withCount ：
```javascript
const posts = await Post
  .query()
  .withCount('comments')
  .fetch()

posts.toJSON()
```
```json
// JSON输出
{
  title: 'Adonis 101',
  __meta__: {
    comments_count: 2
  }
}
```
为计数定义别名，如下所示：
```javascript
const posts = await Post
  .query()
  .withCount('comments as total_comments')
  .fetch()
```
```json
// JSON输出
__meta__: {
  total_comments: 2
}
```
#### 计算约束
例如，要仅检索已批准的注释计数：
```javascript
const posts = await Post
  .query()
  .withCount('comments', (builder) => {
    builder.where('is_approved', true)
  })
  .fetch()
```
## 插入，更新和删除
添加，更新和删除相关记录就像查询数据一样简单。

#### save
save 方法需要相关模型的实例。

save 可以应用于以下关联类型：

- hasOne

- hasMany

- belongsToMany
```javascript

const User = use('App/Models/User')
const Post = use('App/Models/Post')

const user = await User.find(1)

const post = new Post()
post.title = 'Adonis 101'

await user.posts().save(post)
```
#### create
create 方法类似于 save 但需要一个普通的 JavaScript 对象，返回相关的模型实例。

create 可以应用于以下关联类型：

- hasOne

- hasMany

- belongsToMany
```javascript
const User = use('App/Models/User')

const user = await User.find(1)

const post = await user
  .posts()
  .create({ title: 'Adonis 101' })
```
#### createMany
将许多相关行保存到数据库中。

createMany 可以应用于以下关联类型：

- hasMany

- belongsToMany
```javascript
const User = use('App/Models/User')

const user = await User.find(1)

const post = await user
  .posts()
  .createMany([
    { title: 'Adonis 101' },
    { title: 'Lucid 101' }
  ])
```
#### saveMany
与 save 类似，但保存相关模型的多个实例：

saveMany 可以应用于以下关联类型：

- hasMany

- belongsToMany
```javascript
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
```
#### associate
associate 方法专用于 belongsTo 关联，将两个模型实例相互关联。

假设一个 Profile 属于一个 User，将一个 User 与一个 Profile 关联：
```javascript
const Profile = use('App/Models/Profile')
const User = use('App/Models/User')

const user = await User.find(1)
const profile = await Profile.find(1)

await profile.user().associate(user)
```
#### dissociate
 dissociate 方法和 associate 相反。

删除关联：
```javascript
const Profile = use('App/Models/Profile')
const profile = await Profile.find(1)

await profile.user().dissociate()
```
#### attach
在通过数据透视表附加相关模型 attach 的 belongsToMany 关联上调用该方法：
```javascript
const User = use('App/Models/User')
const Car = use('App/Models/Car')

const mercedes = await Car.findBy('reg_no', '39020103')
const user = await User.find(1)

await user.cars().attach([mercedes.id])
```
 attach 方法接受一个 pivotModel 实例的可选回调，允许你根据需要在数据透视表上设置额外的属性：
```javascript
const mercedes = await Car.findBy('reg_no', '39020103')
const audi = await Car.findBy('reg_no', '99001020')

const user = await User.find(1)
const cars = [mercedes.id, audi.id]

await user.cars().attach(cars, (row) => {
  if (row.car_id === mercedes.id) {
    row.is_current_owner = true
  }
})
```
> create 和 save 方法 belongsToMany 的关联也接受回调允许你如果需要在数据透视表设置额外的属性。
#### detach
detach 方法与 attach 方法相反，删除所有现有的数据透视表关联：
```javascript
const user = await User.find(1)
await user.cars().detach()
```
要仅分离选定的关联，请传递一组 id ：
```javascript
const user = await User.find(1)
const mercedes = await Car.findBy('reg_no', '39020103')

await user.cars().detach([mercedes.id])
```
#### sync
sync 方法提供了一种方便快捷方式 detach 然后 attach ：
```javascript
const mercedes = await Car.findBy('reg_no', '39020103')
const user = await User.find(1)

// Behave the same way as:
// await user.cars().detach()
// await user.cars().attach([mercedes.id])

await user.cars().sync([mercedes.id])
```
#### update
update 方法批量更新查询的行。

你可以使用查询生成器方法仅更新特定字段：
```javascript
const user = await User.find(1)

await user
  .posts()
  .where('title', 'Adonis 101')
  .update({ is_published: true })
```
要更新数据透视表，请在 pivotQuery 之前调用 update ：
```javascript
const user = await User.find(1)

await user
  .cars()
  .pivotQuery()
  .where('name', 'mercedes')
  .update({ is_current_owner: true })
```
#### delete
delete 方法从数据库中删除相关的行：
```javascript
const user = await User.find(1)

await user
  .cars()
  .where('name', 'mercedes')
  .delete()
```
在这种情况下 belongsToMany ，此方法也会丢弃与数据透视表的关联。
