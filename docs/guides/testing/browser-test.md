# 浏览器测试

AdonisJs 使用 Chrome 浏览器编写功能测试变得更加简单和容易。在引擎盖下，它利用木偶操作员启动真正的浏览器并运行断言。

>由于 AdonisJs 使用 Chrome 引擎，因此你无法在 IE 或 Firefox 等多种浏览器上运行测试。跨浏览器测试通常是针对前端 JavaScript 进行的，这超出了 AdonisJs 的范围。
在本指南中，我们将学习如何以编程方式打开浏览器，并且像真实用户一样运行测试正在使用该应用程序。

## 建立
默认情况下不提供运行浏览器测试的提供程序，运行以下命令安装。

> Puppeteer 附带一个捆绑的 Chromium 并需要一段时间来安装它。你可以通过传递 PUPPETEER_SKIP_CHROMIUM_DOWNLOAD 环境变量来跳过 chrome 安装。
```bash
adonis install @adonisjs/vow-browser
# Skip Chromium download
PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true adonis install @adonisjs/vow-browser
```
接下来，我们需要在 aceProviders 数组下注册提供程序。

```javascript
const aceProviders = [
  '@adonisjs/vow-browser/providers/VowBrowserProvider'
]
```
就这些！

## 基本例子
现在我们已经设置了提供者; 我们可以开始利用 Test/Browser 特质打开一个新的浏览器。

通过运行以下命令创建新的功能测试。
```bash
adonis make:test hello-world
```
```javascript
create: test/functional/hello-world.spec.js
'use strict'

const { test, trait } = use('Test/Suite')('Hello World')

trait('Test/Browser')

test('Visit home page', async ({ browser }) => {
  const page = await browser.visit('/')
  await page.assertHas('Adonis')
})
```
现在，如果我们运行 adonis 测试，希望测试通过(如果你没有更改根路由的默认输出)。另外，让我们来谈谈一切如何运作。

- 首先我们注册 Test/Browser trait ，这使我们可以访问一个 browser 对象来发出 HTTP 请求。

- 接下来，我们访问一个 URL 并访问保存对页面对象的引用。
 
- 最后，我们运行断言以确保返回 HTML 确实包含 Adonis 文本。

## 自定义Chromium路径
如果你使用 PUPPETEER_SKIP_CHROMIUM_DOWNLOAD 环境变量来安装提供程序，则默认情况下不会安装 chromium ，并且你应该将路径传递给可执行文件。

- 首先，确保下载 chrome 并将其放在 Node.js 可以访问的目录中。

- 之后，在使用时 trait ，定义可执行文件的路径。
```javascript
trait('Test/Browser', {
  executablePath: '/absolute/path/to/chromium'
})
```
或者，你可以将可执行路径定义为文件内的环境变量 .env.testing 。
```javascript
CHROMIUM_PATH=/absolute/path/to/chromium
```
## 配置
以下是启动新浏览器时可以配置的选项列表。
```javascript
trait('Test/Browser', {
  headless: false
})
```
#### 选项
键|值|描述
-|-|-
headless|Boolean|是以无头模式运行测试还是启动真正的浏览器。
executablePath|String| Chromium 可执行文件的路径，只有当你不使用捆绑的铬时才需要它。
slowMo|Number|传递用于减慢每个浏览器交互的毫秒数。它可以用来看慢动作的测试。
dumpio|Boolean|将所有浏览器控制台消息记录到终端。

对于所有其他选项，请检查 [puppeteer.launch](https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#puppeteerlaunchoptions) 官方文档。

## 浏览器 API 
AdonisJs 在 Puppeteer 上添加了一个包装器，使其更适合测试。以下是主浏览器和页面对象的 API 。

#### browser.visit
browser.visit 方法调用 Puppeteer 的 page.goto 方法并具有相同的签名。
```javascript
test('Visit home page', async ({ browser }) => {
  const page = await browser.visit('/', {
    waitUntil: 'load'
  })

  await page.assertHas('Adonis')
})
```
你可以通过访问 page.page 属性来访问 Puppeteer 的实际页面对象。
```javascript
test('Visit home page', async ({ browser }) => {
  const page = await browser.visit('/')

  // puppeteer page object
  page.page.addScriptTag()
})
```
## 页面交互
编写浏览器测试时最常见的事情就是与网页进行交互。以下是相同的方法列表。

> 浏览器客户端支持所有 CSS 选择器。随意使用你的 CSS 选择器技能。
#### type(selector, value)
在给定选择器的元素内输入。
```javascript
const { test, trait } = use('Test/Suite')('Hello World')

trait('Test/Browser')

test('Visit home page', async ({ browser }) => {
  const page = await browser.visit('/')

  await page
    .type('[name="username"]', 'virk')
})
```
要键入多个值，可以链接方法
```javascript
await page
  .type('[name="username"]', 'virk')
  .type('[name="age"]', 22)
```
#### select(selector, value)
在选择框中选择值
```javascript
await page
  .select('[name="gender"]', 'Male')
```
要选择多个选项，请传递一组值。
```javascript
await page
  .select('[name="lunch"]', ['Chicken box', 'Salad'])
```
#### radio(selector, value)
根据其值选择一个单选按钮
```javascript
await page
  .radio('[name="gender"]', 'Male')
```
#### check(selector)
选中一个复选框
```javascript
await page
  .check('[name="terms"]')
```
#### uncheck(selector)
取消选中一个复选框
```javascript
await page
  .uncheck('[name="newsletter"]')
```
#### submitForm(selector)
提交选定的表格
```javascript
await page
  .submitForm('form')

// or use a name
await page
  .submitForm('form[name="register"]')
```
#### click(selector)
单击一个元素。
```javascript
await page
  .click('a[href="/there"]')
```
#### doubleClick(selector)
双击一个元素
```javascript
await page
  .doubleClick('button')
```
#### rightClick(selector)
右键单击元素
```javascript
await page
  .rightClick('button')
```
#### clear(selector)
清除给定元素的值。
```javascript
await page
  .clear('[name="username"]')
```
#### attach(selector, [files])
附加一个或多个文件
```javascript
await page
  .attach('[name="profile_pic"]', [
    Helpers.tmpPath('profile_pic.jpg')
  ])
```
#### screenshot(saveToPath)
拍摄并保存当前网页状态的屏幕截图
```javascript
await page
  .type('[name="username"]', 'Virk')
  .type('[name="age"]', 27)
  .screenshot()
```
## 等待行为
通常，你必须等待某个操作生效。例如：

- 等待元素出现在网页上。

- 等待页面重定向等等。

#### waitForElement(selector，timeout = 15000)
等待 DOM 中存在元素。默认超时为 15 seconds 。
```javascript
await page
  .waitForElement('div.alert')
  .assertHasIn('div.alert', 'Success!')
  ```
#### waitUntilMissing(selector)
等到元素从 DOM 中消失。
```javascript
await page
  .waitUntilMissing('div.alert')
  .assertNotExists('div.alert')
  ```
#### waitForNavigation()
等到页面正确导航到新URL。
```javascript
await page
  .click('a[href="/there"]')
  .waitForNavigation()
  .assertPath('/there')
  ```
#### waitFor(closure)
等到 Closure 返回 true 。闭包在浏览器上下文中执行，并且可以访问变量 window，document 等等。
```javascript
await page
  .waitFor(function () {
    return !!document.querySelector('body.loaded')
  })
  ```
#### pause(timeout = 15000)
暂停网页给定的时间范围
```javascript
await page.pause()
```
## 读取值
以下是可用于从网页读取值的方法列表。

#### getText([selector])
获取给定元素或整个页面的文本
```javascript
await page
  .getText()

// or
await page
  .getText('span.username')
  ```
#### getHtml([selector])
获取给定元素或整个网页的HTML
```javascript
await page
  .getHtml()

// or
await page
  .getHtml('div.header')
  ```
#### isVisible(selector)
查找给定元素是否在页面上可见。
```javascript
const isVisible = await page
  .isVisible('div.alert')

assert.isFalse(isVisible)
```
#### hasElement(selector)
查找DOM中是否存在元素。
```javascript
const hasElement = await page
  .hasElement('div.alert')

assert.isFalse(hasElement)
```
#### isChecked(selector)
查找是否选中了复选框
```javascript
const termsChecked = await page
  .isChecked('[name="terms"]')

assert.isTrue(termsChecked)
```
#### getAttribute(selector, name)
获取给定属性的值
```javascript
const dataTip = await page
  .getAttribute('div.tooltip', 'data-tip')
  ```
#### getAttributes(selector)
获取给定元素的所有属性
```javascript
const attributes = await page
  .getAttributes('div.tooltip')
  ```
#### getValue(selector)
获取给定表单元素的值
```javascript
const value = await page
  .getValue('[name="username"]')

assert.equal(value, 'virk')
```
#### getPath()
获取当前网页路径
```javascript
await page
  .getPath()
  ```
#### getQueryParams()
获取查询参数
```javascript
await page
  .getQueryParams()
  ```
#### getQueryParam(key)
获取单个查询参数的值
```javascript
await page
  .getQueryParam('orderBy')
  ```
#### getTitle()
获取网页标题
```javascript
await page
  .getTitle()
  ```
## 断言
运行断言的一种方法是读取某些元素的值，然后手动运行断言。而浏览器客户端捆绑了一堆帮助方法来运行内联断言。

#### assertHas(expected)
断言网页包含预期的文本值
```javascript
await page
  .assertHas('Adonis')
  ```
#### assertHasIn(selector, expected)
断言给定的选择器包含期望值。
```javascript
await page
  .assertHasIn('div.alert', 'Success!')
  ```
#### assertAttribute(selector, attribute, expected)
断言属性的值与预期相同
```javascript
await page
  .assertAttribute('div.tooltip', 'data-tip', 'Some helpful tooltip')
  ```
#### assertValue(selector, expected)
断言给定表单元素的值。
```javascript
await page
  .assertValue('[name="username"]', 'virk')
  ```
#### assertIsChecked(selector)
断言复选框已选中
```javascript
await page
  .assertIsChecked('[name="terms"]')
  ```
#### assertIsNotChecked(selector)
断言未选中该复选框
```javascript
await page
  .assertIsNotChecked('[name="terms"]')
  ```
#### assertIsVisible(selector)
断言元素是可见的
```javascript
await page
  .assertIsVisible('div.notification')
  ```
#### assertIsNotVisible(selector)
断言元素不可见
```javascript
await page
  .assertIsNotVisible('div.notification')
  ```
#### assertPath(value)
断言当前路径的值
```javascript
await page
  .assertPath('/there')
  ```
#### assertQueryParam(key, value)
断言查询参数的值
```javascript
await page
  .assertQueryParam('orderBy', 'id')
  ```
#### assertExists(selector)
断言DOM中存在一个元素
```javascript
await page
  .assertExists('div.notification')
  ```
#### assertNotExists(selector)
断言 DOM 中不存在元素
```javascript
await page
  .assertNotExists('div.notification')
  ```
#### assertCount(selector, expectedCount)
断言给定选择器的元素数量
```javascript
await page
  .assertCount('table tr', 2)
  ```
#### assertTitle(expected)
断言网页标题
```javascript
await page
  .assertTitle('Welcome to Adonis')
  ```
#### assertEval(selector, fn, [args], expected)
断言在给定选择器上执行的函数的值。将fn在浏览器环境中执行。
```javascript
await page
  .assertEval('table tr', function (el) {
    return el.length
  }, 2)
  ```
在上面的示例中，断言 tr 表内部的数量为 2 。

此外，你可以将args传递给选择器fn。
```javascript
await page
  .assertEval(
    'div.notification',
    function (el, attribute) {
      return el[attribute]
    },
    ['id'],
    'notification-1'
  )
  ```
在上面的例子中，我们断言了给定的属性 div.notification 。该属性是动态的，并作为参数传递。

#### assertFn(fn, [args], expected)
断言给定函数的输出。将 fn 在浏览器环境中执行。

assertFn 和之间的区别在于 assertEval 后者在运行函数之前预先选择了一个元素。
```javascript
await page
  .assertFn(function () {
    return document.title
  }, 'Welcome to Adonis')
  ```