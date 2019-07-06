# 开启 SSL
Node.js 的 HTTPs 服务器可以与 AdonisJs 一起使用，如下所示。想法是使用文件 https 内的 Node.js 模块 server.js 。
 
```javascript
const { Ignitor } = require('@adonisjs/ignitor')
const path = require('path')
const https = require('https')
const fs = require('fs')

// Certificate
const options = {
  key: fs.readFileSync(path.join(__dirname, './server.key')),
  cert: fs.readFileSync(path.join(__dirname, './server.crt'))
}

new Ignitor(require('@adonisjs/fold'))
  .appRoot(__dirname)
  .fireHttpServer((handler) => {
    return https.createServer(options, handler)
  })
  .catch(console.error)
```
真正的工作发生在 fireHttpServer 方法内部。此函数将单个参数作为回调，并且返回值必须是 Node.js 服务器的实例。

## 自签名证书
在开发过程中，您还可以使用自签名证书。它需要来自 npm 的额外依赖。
```javascript
npm i pem
const { Ignitor } = require('@adonisjs/ignitor')
const https = require('https')
const pem = require('pem')

pem.createCertificate({ days: 1, selfSigned: true }, (error, keys) => {
  if (error) {
    return console.log(error)
  }

  const options = {
    key: keys.serviceKey,
    cert: keys.certificate
  }

  new Ignitor(require('@adonisjs/fold'))
    .appRoot(__dirname)
    .fireHttpServer((handler) => {
      return https.createServer(options, handler)
    })
    .catch(console.error)
})
```