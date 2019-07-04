# 文件存储
建立
可用驱动程序
基本例子
驱动API
S3 / Spaces API
AdonisJs拥有一个基于Flydrive构建的专用Drive Provider，可与Amazon S3等本地和远程文件系统进行交互。

在本指南中，我们将学习如何设置和使用云端硬盘提供程序。

建立
由于默认情况下未安装云端硬盘驱动器，我们需要从以下位置获取npm：

> adonis install @adonisjs/drive
接下来，我们需要在start/app.js文件中注册提供程序：

启动/ app.js
const providers = [
  '@adonisjs/drive/providers/DriveProvider'
]
驱动程序配置保存在config/drive.js文件中，该文件是adonis install在安装Drive Provider时由命令创建的。
可用驱动程序
Drive Provider随附的默认驱动程序包括：

Amazon S3（s3），需要aws-sdk包

DigitalOcean Spaces（spaces），需要aws-sdk包

本地文件系统（local）

基本例子
以下是如何通过adonis repl以下方式与本地磁盘进行交互的基本示例：

驱动dlcc3v

驱动API
虽然读取和写入等常见操作在驱动程序中保持不变，但驱动器的API主要基于您用于与该驱动器的文件系统交互的驱动程序。

存在（relativePath）
查找文件/目录是否存在：

const exists = await Drive.exists('unicorn.jpg')
get（relativePath，encoding = utf-8）
获取文件内容作为缓冲区或字符串：

const unicorn = await Drive.get('unicorn.jpg')
getStream（relativePath）
获取文件作为流：

Drive.getStream('hello.txt')
put（relativePath，content，options = {}）
使用给定内容创建新文件（创建任何缺少的目录）：

await Drive.put('hello.txt', Buffer.from('Hello world!'))
prepend（relativePath，content，options = {}）
将内容预先添加到文件中（如果路径不存在，则创建新文件）：

await Drive.prepend('hello.txt', Buffer.from('Prepended!'))
该prepend方法仅适用于本地驱动程序。
append（relativePath，content，options = {}）
将内容附加到文件（如果路径不存在，则创建新文件）：

await Drive.append('hello.txt', Buffer.from('Appended!'))
该append方法仅适用于本地驱动程序。
删除（relativePath）
删除现有文件：

await Drive.delete('hello.txt')
move（src，dest，options = {}）
将文件从一个目录移动到另一个目录

await Drive.move('hello.txt', 'hi.txt')
copy（src，dest，options = {}）
将文件从一个目录复制到另一个目录

await Drive.copy('hi.txt', 'hello.txt')
S3 / Spaces API
以下方法仅适用于s3和spaces驱动程序。

getObject（location，params）
获取给定文件的S3对象（有关params信息，请参阅S3参数）：

await Drive.disk('s3').getObject('unicorn.jpg')
getUrl（location，[bucket]）
获取给定文件的URL（接受可选的替代bucket参数）：

const url = Drive.disk('s3').getUrl('unicorn.jpg')
getSignedUrl（location，expiry = 900，params）
获取给定文件的签名URL（15mins默认设置为到期时间）：

const url = await Drive.disk('s3').getSignedUrl('unicorn.jpg')
