# 文件上传
AdonisJs 安全地处理文件上传而不浪费服务器资源。

## 基本例子
让我们看看如何处理通过 HTML 表单上传的文件：
```html
<form method="POST" action="upload" enctype="multipart/form-data">
  <input type="file" name="profile_pic" />
  <button type="submit"> Submit </button>
</form>
```
```javascript
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
```
request.file 方法接受两个参数(字段名称和验证对象以应用于上载的文件)，并返回 File 实例。

接下来，我们调用 profilePic.move 尝试将文件移动到已定义目录的方法(在这种情况下，使用选项调用以使用新名称保存文件并在需要时覆盖文件)。

最后，我们通过调用 profilePic.moved() 方法检查移动操作是否成功(如果找到则返回错误)。

## 多个文件上传
AdonisJs 上传多个文件就像上传单个文件一样简单。

当多个文件一起上载时，request.file 返回 FileJar 实例而不是 File 实例：
```html
<form method="POST" action="upload" enctype="multipart/form-data">
  <input type="file" name="profile_pics[]" multiple />
  <button type="submit"> Submit </button>
</form>
```
```javascript
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
```
在上面的示例中，与我们处理单个文件的方式相比：

而不是 move ，我们使用 moveAll 方法(将所有上传的文件并行移动到给定目录)。

单个文件方法已更改为多个文件方法(例如 moved → movedAll 和 error → errors )。

#### 更改文件名
要移动和重命名单个文件上载，请将含有新名称的 options 对象传递给 move 方法：
```javascript
await profilePic.move(Helpers.tmpPath('uploads'), {
  name: 'my-new-name.jpg'
})
```
要移动和重命名多个文件上载，请将回调传递给 moveAll 方法，以便为 FileJar 实例中的每个文件创建自定义选项对象：
```javascript
profilePics.moveAll(Helpers.tmpPath('uploads'), (file) => {
  return {
    name: `${new Date().getTime()}.${file.subtype}`
  }
})
```
移动列表
移动多个文件上传时，某些文件可能会成功移动，而其他文件会因验证失败而拒绝。

在这种情况下，你可以使用 movedAll() 和 movedList() 方法来优化工作流程：
```javascript
const removeFile = Helpers.promisify(fs.unlink)

if (!profilePics.movedAll()) {
  const movedFiles = profilePics.movedList()

  await Promise.all(movedFiles.map((file) => {
    return removeFile(path.join(file._location, file.fileName))
  }))

  return profilePics.errors()
}
```
## 验证选项
在完成移动操作之前，可以传递以下验证选项以验证文件：

键|值|描述
-|-|-
types|String[]|允许的类型数组。将根据文件媒体类型检查该值。
size|String 或者 Number|文件允许的最大大小。使用 bytes.parse 方法解析该值。
extnames|String[]|要对文件类型进行更精细的控制，可以定义允许的扩展而不是定义类型。

如何应用验证规则的示例如下：
```javascript
const validationOptions = {
  types: ['image'],
  size: '2mb',
  extnames: ['png', 'gif']
}
const avatar = request.file('avatar', validationOptions)

// this is when validation occurs
await avatar.move()
```
## 错误类型
当上载验证失败时， File error 方法返回一个对象，其中包含失败的 fieldName, 原始的 clientName， 错误信息和规则类型等。

> FileJar errors 方法返回一个阵列的错误。
下面列出了几个示例错误对象。

#### 文件类型错误
```json
{
  fieldName: "field_name",
  clientName: "invalid-file-type.ai",
  message: "Invalid file type postscript or application. Only image is allowed",
  type: "type"
}
```
#### 文件大小错误
```json
{
  fieldName: "field_name",
  clientName: "invalid-file-size.png",
  message: "File size should be less than 2MB",
  type: "size"
}
```
## 文件属性
可以在 File 实例上访问以下文件属性：

属性|生|里面的tmp|移动
-|-|-|-
clientName (客户端计算机上的文件名)|String|String|String
fileName (移动操作后的文件名)|null|null|String
fieldName (表单字段名称)|String|String|String
tmpPath (临时路径)|null|String|String
size (文件大小，以字节为单位)|String|String|String
子类型 (文件子类型)|String|String|String
status (文件状态(设置为 error 失败时))|pending|consumed|moved
extname (文件扩展名)|String|String|String

## 路线验证器
路由验证器在将上传的文件传递给控制器​​之前验证它们。

在下面的示例路由验证器中：
```javascript
'use strict'

class StoreUser {
  get rules () {
    return {
      avatar: 'file|file_ext:png,jpg|file_size:2mb|file_types:image'
    }
  }
}

module.exports = StoreUser
```
- file 规则确保 avatar 字段是有效的文件。

- file_ext 规则定义 extnames 了文件的允许范围。

- file_size 规则定义 size 文件的最大值。

- file_types 规则定义 types 了文件的允许范围。

## 流媒体文件
当流式传输到外部服务(如 Amazon S3 )时，大多数上载库/框架会多次处理文件。他们的上传工作流程通常设计如下：

- 处理请求文件然后将它们保存到 tmp 目录中。

- 将每个文件从 tmp 目录移动到目标目录。

- 使用外部服务的 SDK 最终将文件流式传输到外部服务。

此过程会浪费多次读取/写入单个文件的服务器资源。

AdonisJs 使上传文件的流程更加高效。

#### 禁用自动处理
首先，通过 config/bodyparser.js 文件禁用上传路由的文件自动处理：
```javascript
processManually: ['/upload']
```
processManually 选项采用一系列路径或路由模式，不应自动处理文件。

#### 处理流
最后，调用 request.multipart.process 文件上传控制器/路由处理程序中的方法：
```javascript
const Drive = use('Drive')

Route.post('upload', async ({ request }) => {

  request.multipart.file('profile_pic', {}, async (file) => {
    await Drive.disk('s3').put(file.clientName, file.stream)
  })

  await request.multipart.process()
})
```
> 你必须调用 await request.multipart.process() 开始处理上传的文件。
request.multipart.file 方法允许你选择特定文件并通过 file.stream 属性访问其可读流，以便你可以将流传输到 Amazon S3 或你想要的任何其他外部服务。

整个过程是异步的，只处理文件一次。

