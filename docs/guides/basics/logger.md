# logger 调试

AdonisJs 配备了一个基于 [winston](https://github.com/winstonjs/winston) 的全功能记录器，使用 [RFC5424](https://tools.ietf.org/html/rfc5424#page-11) 记录级别。

Logger 附带以下驱动程序：

1. 控制台(console)

2. 文件(file)

你可以自由添加自己的基于 [winston transports](https://github.com/winstonjs/winston#transports) 的驱动程序。

## 组态
Logger 的配置保存在对象 **config/app.js** 下的文件中 **logger** ：
```javascript
logger: {
  transport: 'console',
  console: {
    driver: 'console'
  },
  file: {
    driver: 'file',
    filename: 'adonis.log'
  }
}
```
该 file 驱动程序保存应用程序根目录中的日志文件tmp目录。

> 如果需要的话，你可以定义日志文件到不同的路径。
## 基本的例子
让我们从应用程序中记录数据的基本示例开始：
```javascript
const Logger = use('Logger')

Logger.info('request url is %s', request.url())

Logger.info('request details %j', {
  url: request.url(),
  user: auth.user.username()
})
```
> 所有日志记录方法都支持 sprintf 语法。
记录器使用 RFC5424 日志级别，为每个级别公开简单方法：

水平|方法|用法
-|-|-
0|emerg|Logger.emerg(msg, …​data)
1|alert|Logger.alert(msg, …​data)
2|crit|Logger.crit(msg, …​data)
3|error|Logger.error(msg, …​data)
4|warning|Logger.warning(msg, …​data)
5|notice|Logger.notice(msg, …​data)
6|info|Logger.info(msg, …​data)
7|debug|Logger.debug(msg, …​data)

### 切换日志方式
你可以使用 transport 方法动态切换日志方式：
```javascript
Logger
  .transport('file')
  .info('request url is %s', request.url())
```
## 日志级别
Logger 有一个默认的配置日志记录等级 ，可以在运行时更新。

不记录定义的日志记录级别以上的任何消息。例如：
```javascript
const Logger = use('Logger')
Logger.level = 'info'

// not logged
Logger.debug('Some debugging info')

Logger.level = 'debug'

// now logged
Logger.debug('Some debugging info')
```
当你的服务器处于高负载时，此方法可以更轻松地关闭调试消息。