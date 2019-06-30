# 加密
AdonisJs 附带散列值和加密数据的提供程序。

散列值与加密数据不同，因为散列值一旦加密就无法解密。

## 加密数据
AdonisJs 加密提供程序使用 [Node.js 加密模块](https://nodejs.org/api/crypto.html)来加密和解密值。

> 在进行加密之前，你的 AppKey 必须在 config/app.js 内部被定义。
#### encrypt(value)
```javascript
const Encryption = use('Encryption')
const encrypted = Encryption.encrypt('hello world')
```
#### decrypt
```javascript
const Encryption = use('Encryption')
const decrypted = Encryption.decrypt('encrypted value')
```
## 哈希值
AdonisJs 哈希提供程序附带了多个驱动程序来散列用户数据。

默认情况下它使用 **bcrypt** ，但是通过 [argon2](https://npm.im/argon2) 提供 Argon 支持。

> @adonisjs/framework 版本 >=5.0.8，支持多个驱动程序。
#### 配置
配置在 config/hash.js 文件中定义：
```javascript
module.exports = {
  driver: 'bcrypt',
  bcrypt: {
    rounds: 10
  },
  argon: {
    type: 1
  }
}
```
> 如果使用 argon 驱动程序，则必须通过 npm 安装 argon2 包。
#### make(value，[config])
散列一个纯字符串值：
```javascript
const Hash = use('Hash')
const safePassword = await Hash.make(request.input('password'))
```
(可选)可以传递内联配置以覆盖配置文件默认值：
```javascript
const Hash = use('Hash')
const safeExample = await Hash.make('example', config)
```
#### verify(value，hashedValue)
由于无法解密散列，因此可以根据先前的散列值验证用户输入。
```javascript
const Hash = use('Hash')
const isSame = await Hash.verify('plain-value', 'hashed-value')

if (isSame) {
  // ...
}
```