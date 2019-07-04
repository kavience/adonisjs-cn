# 文件上传
基本例子
多个文件上传
验证选项
错误类型
文件属性
路线验证器
流媒体文件
AdonisJs安全地处理文件上传而不浪费服务器资源。

基本例子
让我们看看如何处理通过HTML表单上传的文件：

<form method="POST" action="upload" enctype="multipart/form-data">
  <input type="file" name="profile_pic" />
  <button type="submit"> Submit </button>
</form>
启动/ routes.js
const Helpers = use('Helpers')

Route.post('upload', async ({ request }) => {
  const profilePic = request.file('profile_pic', {
    types: ['image'],
    size: '2mb'
  })

  await profilePic.move(Helpers.tmpPath('uploads'), {
    name: 'custom-name.jpg',
    overwrite: true
  })

  if (!profilePic.moved()) {
    return profilePic.error()
  }
  return 'File moved'
})
该request.file方法接受两个参数（字段名称和验证对象以应用于上载的文件），并返回File实例。

接下来，我们调用profilePic.move尝试将文件移动到已定义目录的方法（在这种情况下，使用选项调用以使用新名称保存文件并在需要时覆盖文件）。

最后，我们通过调用profilePic.moved()方法检查移动操作是否成功（如果找到则返回错误）。

多个文件上传
AdonisJs上传多个文件就像上传单个文件一样简单。

当多个文件一起上载时，request.file返回FileJar实例而不是File实例：

<form method="POST" action="upload" enctype="multipart/form-data">
  <input type="file" name="profile_pics[]" multiple />
  <button type="submit"> Submit </button>
</form>
启动/ routes.js
const Helpers = use('Helpers')

Route.post('upload', async ({ request }) => {
  const profilePics = request.file('profile_pics', {
    types: ['image'],
    size: '2mb'
  })

  await profilePics.moveAll(Helpers.tmpPath('uploads'))

  if (!profilePics.movedAll()) {
    return profilePics.errors()
  }
})
在上面的示例中，与我们处理单个文件的方式相比：

而不是move，我们使用该moveAll方法（将所有上传的文件并行移动到给定目录）。

单个文件方法已更改为多个文件方法（例如moved → movedAll和error → errors）。

更改文件名
要移动和重命名单个文件上载，请将options对象传递给move定义文件new 的方法name：

await profilePic.move(Helpers.tmpPath('uploads'), {
  name: 'my-new-name.jpg'
})
要移动和重命名多个文件上载，请将回调传递给moveAll方法，以便为FileJar实例中的每个文件创建自定义选项对象：

profilePics.moveAll(Helpers.tmpPath('uploads'), (file) => {
  return {
    name: `${new Date().getTime()}.${file.subtype}`
  }
})
移动列表
移动多个文件上传时，某些文件可能会成功移动，而其他文件会因验证失败而拒绝。

在这种情况下，您可以使用movedAll()和movedList()方法来优化工作流程：

const removeFile = Helpers.promisify(fs.unlink)

if (!profilePics.movedAll()) {
  const movedFiles = profilePics.movedList()

  await Promise.all(movedFiles.map((file) => {
    return removeFile(path.join(file._location, file.fileName))
  }))

  return profilePics.errors()
}
验证选项
在完成移动操作之前，可以传递以下验证选项以验证文件：

键	值	描述
types

String[]

允许的类型数组。将根据文件媒体类型检查该值。

size

String 要么 Number

文件允许的最大大小。使用bytes.parse方法解析该值。

extnames

String[]

要对文件类型进行更精细的控制，可以定义允许的扩展而不是定义类型。

如何应用验证规则的示例如下：

const validationOptions = {
  types: ['image'],
  size: '2mb',
  extnames: ['png', 'gif']
}
const avatar = request.file('avatar', validationOptions)

// this is when validation occurs
await avatar.move()
错误类型
当上载验证失败时，File error方法返回一个对象，其中包含失败的fieldName原始clientName错误message和type触发错误的规则。

该FileJar errors方法返回一个阵列的错误。
下面列出了几个示例错误对象。

输入错误
{
  fieldName: "field_name",
  clientName: "invalid-file-type.ai",
  message: "Invalid file type postscript or application. Only image is allowed",
  type: "type"
}
大小错误
{
  fieldName: "field_name",
  clientName: "invalid-file-size.png",
  message: "File size should be less than 2MB",
  type: "size"
}
文件属性
可以在File实例上访问以下文件属性：

属性	生	里面的tmp	移动
clientName
客户端计算机上的文件名

String

String

String

fileName
移动操作后的文件名

null

null

String

fieldName
表单字段名称

String

String

String

tmpPath
临时路径

null

String

String

size
文件大小，以字节为单位

0

Number

Number

类型
文件主要类型

String

String

String

子类型
文件子类型

String

String

String

status
文件状态（设置为error失败时）

pending

consumed

moved

extname
文件扩展名

String

String

String

路线验证器
路由验证器在将上传的文件传递给控制器​​之前验证它们。

在下面的示例路由验证器中：

应用程序/验证器/ StoreUser.js
'use strict'

class StoreUser {
  get rules () {
    return {
      avatar: 'file|file_ext:png,jpg|file_size:2mb|file_types:image'
    }
  }
}

module.exports = StoreUser
该file规则确保该avatar字段是有效的文件。

该file_ext规则定义extnames了文件的允许范围。

该file_size规则定义size文件的最大值。

该file_types规则定义types了文件的允许范围。

流媒体文件
当流式传输到外部服务（如Amazon S3）时，大多数上载库/框架会多次处理文件。他们的上传工作流程通常设计如下：

处理请求文件然后将它们保存到tmp目录中。

将每个文件从tmp目录移动到目标目录。

使用外部服务的SDK最终将文件流式传输到外部服务。

此过程会浪费多次读取/写入单个文件的服务器资源。

AdonisJs使上传文件的流程更加高效。

禁用自动处理
首先，通过config/bodyparser.js文件禁用上传路由的文件自动处理：

配置/ bodyparser.js
processManually: ['/upload']
该processManually选项采用一系列路径或路由模式，不应自动处理文件。

处理流
最后，调用request.multipart.process文件上传控制器/路由处理程序中的方法：

启动/ routes.js
const Drive = use('Drive')

Route.post('upload', async ({ request }) => {

  request.multipart.file('profile_pic', {}, async (file) => {
    await Drive.disk('s3').put(file.clientName, file.stream)
  })

  await request.multipart.process()
})
您必须致电await request.multipart.process()开始处理上传的文件。
该request.multipart.file方法允许您选择特定文件并通过file.stream属性访问其可读流，以便您可以将流传输到Amazon S3或您想要的任何其他外部服务。

整个过程是异步的，只处理文件一次。

