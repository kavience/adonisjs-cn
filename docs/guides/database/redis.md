# Redis缓存
 AdonisJs 拥有基于 ioredis 构建的 Redis 的一流支持，具有更好的pub/sub API 。

> 配置，事件 API 和所有 ioredis 方法都是 100％ 支持。有关完整文档，请参阅 [ioredis](https://github.com/luin/ioredis) 存储库。
## 建立
由于默认情况下未安装 Redis Provider ，我们需要从以下位置获取 npm ：
```bash
adonis install @adonisjs/redis
```
接下来，在 start/app.js 文件中注册提供程序：
```javascript
const providers = [
  '@adonisjs/redis/providers/RedisProvider'
]
```
Redis 配置保存在 config/redis.js 文件中，该文件 adonis install 在安装 Redis Provider 时由命令创建。
## 基本例子
让我们从在 Redis 中缓存用户的基本示例开始：
```javascript
'use strict'

const Redis = use('Redis')
const User = use('App/Models/User')

class UserController {

  async index () {
    const cachedUsers = await Redis.get('users')
    if (cachedUsers) {
      return JSON.parse(cachedUsers)
    }

    const users = await User.all()
    await Redis.set('users', JSON.stringify(users))
    return users
  }
}
```
上面的示例可能不是缓存数据的最佳方法 - 它只是提供了如何使用 Redis 的思路。
## 命令
支持所有 Redis 命令作为 JavaScript 函数，例如：
```javascript
const Redis = use('Redis')

const user = {
  username: 'foo',
  email: 'foo@bar.com'
}

// set user
await Redis.hmset('users', user.username, JSON.stringify(user))

// get user
const user = await Redis.hmget('users', user.username)
```
## 发布/订阅
Redis 内置支持发布/订阅(pub/sub)以在同一服务器或多个服务器上共享消息。

 AdonisJs 在 Redis pub/sub 之上提供了一个干净的 API 来订阅不同的事件并对它们采取行动。

在 start/redis.js 文件中设置 Redis 订阅者：
```javascript
'use strict'

const Redis = use('Redis')

Redis.subscribe('music', async (track) => {
  console.log('received track', track)
})
```
start/redis.js 如果文件不存在，请创建该文件并将其加载到 server.js：.preLoad('start/redis') 。
订阅者注册后，你可以从相同或不同的服务器向此频道发布数据：
```javascript
const Redis = use('Redis')

Redis.publish('music', track)
```
### 可用方法
下面是与 Redis 的 pub/sub 层交互的方法列表。

> 你只能为给定频道拥有一个订阅者。
#### subscribe(channel, listener)
```javascript
Redis.subscribe('music', (track) {
  console.log(track)
})
```
你还可以 file.method 从 app/Listeners 目录传递引用：
```javascript
Redis.subscribe('music', 'Music.newTrack')
```
```javascript
'use strict'

const Music = exports = module.exports = {}

Music.newTrack = (track) => {
  console.log(track)
}
```
#### psubscribe(pattern, listener)
订阅模式：
```javascript
Redis.psubscribe('h?llo', function (pattern, message, channel) {
})

Redis.publish('hello')
Redis.publish('hallo')
```
#### publish(channel, message)
将消息发布到给定频道：
```javascript
Redis.publish('music', JSON.stringify({
  id: 1,
  title: 'Love me like you do',
  artist: 'Ellie goulding'
}))
```
#### unsubscribe(channel)
取消订阅指定频道：

```javascript
Redis.unsubscribe('music')
```
#### punsubscribe(channel)
取消订阅特定模式：
```javascript
Redis.punsubscribe('hello')
```
## 多个连接
你可以在 config/redis.js 文件中定义多个连接的配置，并且可以通过调用 connection 方法来使用这些连接：
```javascript
module.exports = {
  connection: 'local',

  local: {
    ...
  },

  secondary: {
    host: 'myhost.com',
    port: 6379
  }
}
```
#### connection(name)
使用其他连接进行 Redis 查询：
```javascript
await Redis
  .connection('secondary')
  .get('users')

// hold reference to connection
const secondaryConnection = Redis.connection('secondary')
await secondaryConnection.get('users')
```
#### quit(name)
Redis Provider 创建连接池以重用现有连接。

你可以通过调用 quit 传递单个连接或连接数组的方法来退出连接：
```javascript
await Redis.quit('primary')
await Redis.quit(['primary', 'secondary'])
```