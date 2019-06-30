# 异常处理
AdonisJs 不仅将异常视为指导开发人员出错的一种方式，而且还将其作为围绕它们构建应用程序流的一种方式。

在本指南中，我们将了解如何引发异常，如何围绕它们编写逻辑以及最终创建自己的自定义异常。

## 介绍
例外是很好的，因为他们在某个阶段停止了程序，并确保一切正确，然后再继续。

例外情况通常只是作为指导来告诉开发人员出了什么问题，但如果处理得当，它们可以帮助你围绕它们构建应用程序流。

默认情况下，AdonisJs 会为你处理所有异常，并在开发过程中以漂亮的格式显示它们。但是，你可以随意处理异常。

## 处理异常
可以通过绑定通配符异常处理程序或使用其名称处理单个异常来处理异常。

#### 通用异常
让我们使用以下 adonis 命令创建一个通用异常处理程序：
```bash
 adonis make:ehandler
 ```
 ```bash
 # 控制台输出
✔ create  app/Exceptions/Handler.js
```
一旦创建，通用异常处理程序就会传递 HTTP 生命周期中发生的所有异常：
```javascript
const BaseExceptionHandler = use('BaseExceptionHandler')

class ExceptionHandler extends BaseExceptionHandler {
  async handle (error, { response, session }) {
    if (error.name === 'ValidationException') {
      session.withErrors(error.messages).flashAll()
      await session.commit()
      response.redirect('back')
      return
    }

    return super.handle(...arguments)
  }
}

module.exports = ExceptionHandler
```
在上面的示例中，该 handle 方法将 ValidationException 闪存验证错误处理回表单。

#### 个别异常
你可以通过为它们定义内联处理程序来挂钩各个异常。

这可以在 start/hooks.js 文件中完成：
```javascript
const { hooks } = require('@adonisjs/ignitor')

hooks.after.providersBooted(() => {
  const Exception = use('Exception')

  Exception.handle('ValidationException', async (error, { response, session }) => {
    session.withErrors(error.messages).flashAll()
    await session.commit()
    response.redirect('back')
    return
  })
})
```
## 自定义异常
AdonisJs 使构建自己的自定义异常并为它们定义处理程序变得简单。

让我们使用该 adonis 命令创建自定义异常：
```javascript
> adonis make:exception Custom
```
```javascript
✔ create  app/Exceptions/CustomException.js
```
```javascript
const { LogicalException } = require('@adonisjs/generic-exceptions')

class CustomException extends LogicalException {}

module.exports = CustomException
```
你可以通过导入其源文件来抛出此异常( status 和 code 值是可选的)：
```javascript
const CustomException = use('App/Exceptions/CustomException')

throw new CustomException(message, status, code)
```
你可以在自定义异常中设置默认消息，状态和代码：
```javascript
const { LogicalException } = require('@adonisjs/generic-exceptions')
const message = 'The item is in an status where modifications are disallowed'
const status = 403
const code = 'E_NOT_EDITABLE'

class NotEditableException extends LogicalException {
  constructor () {
    super(message, status, code)
  }
}

module.exports = NotEditableException
const NotEditableException = use('App/Exceptions/NotEditableException')

throw new NotEditableException()
```
这种方法的优点在于，你可以将异常的唯一名称作为类名称，然后适当地捕获并响应它们。

#### 更进一步
我们可以通过在自定义异常类上定义 handle 和 report 方法来进一步采用自定义异常处理：
```javascript
const { LogicalException } = require('@adonisjs/generic-exceptions')

class CustomException extends LogicalException {
  handle (error, { response }) {
    response
      .status(500)
      .send('Custom exception handled!')
  }
}

module.exports = CustomException
```
如果设置，AdonisJs 调用自定义异常的 handle 方法来创建并返回异常响应。

