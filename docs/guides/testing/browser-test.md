# 浏览器测试

AdonisJs 使用 Chrome 浏览器编写功能测试变得更加简单和容易。在引擎盖下，它利用木偶操作员启动真正的浏览器并运行断言。

由于 AdonisJs 使用 Chrome引擎，因此你无法在IE或Firefox等多种浏览器上运行测试。
跨浏览器测试通常是针对前端JavaScript进行的，这超出了AdonisJs的范围。
在本指南中，我们将学习如何以编程方式打开浏览器，并且像真实用户一样运行测试正在使用该应用程序。

## 建立
默认情况下不提供运行浏览器测试的提供程序。因此我们需要从中拉出来npm。

Puppeteer附带一个捆绑的Chromium并需要一段时间来安装它。你可以通过传递PUPPETEER_SKIP_CHROMIUM_DOWNLOAD环境变量来跳过chrome安装。
adonis install @adonisjs/vow-browser

# Skip Chromium download
PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true adonis install @adonisjs/vow-browser
接下来，我们需要在aceProviders数组下注册提供程序。

启动/ app.js
const aceProviders = [
  '@adonisjs/vow-browser/providers/VowBrowserProvider'
]
就这些！

## 基本例子
现在我们已经设置了提供者; 我们可以开始利用Test/Browser特质打开一个新的浏览器。

通过运行以下命令创建新的功能测试。

adonis make:test hello-world
产量

create: test/functional/hello-world.spec.js
'use strict'

const { test, trait } = use('Test/Suite')('Hello World')

trait('Test/Browser')

test('Visit home page', async ({ browser }) => {
  const page = await browser.visit('/')
  await page.assertHas('Adonis')
})
现在，如果我们运行adonis测试，希望测试通过(如果你没有更改/ route的默认输出)。另外，让我们来谈谈一切如何运作。

首先我们注册Test/Browser特征，这使我们可以访问一个browser对象来发出HTTP请求。

接下来，我们访问一个URL并访问保存对页面对象的引用。

最后，我们运行断言以确保返回HTML确实包含Adonis文本。

## 自定义Chromium路径
如果你使用PUPPETEER_SKIP_CHROMIUM_DOWNLOAD环境变量来安装提供程序，则默认情况下不会安装chromium，并且你应该将路径传递给可执行文件。

首先，确保下载chrome并将其放在Node.js可以访问的目录中。

之后，在使用时trait，定义可执行文件的路径。

trait('Test/Browser', {
  executablePath: '/absolute/path/to/chromium'
})
或者，你可以将可执行路径定义为文件内的环境变量.env.testing。

CHROMIUM_PATH=/absolute/path/to/chromium
## 组态
以下是启动新浏览器时可以配置的选项列表。

trait('Test/Browser', {
  headless: false
})
选项
键	描述
无头
布尔<true>

是以无头模式运行测试还是启动真正的浏览器。

executablePath
字符串

Chromium可执行文件的路径，只有当你不使用捆绑的铬时才需要它。

slowMo
数字

传递用于减慢每个浏览器交互的毫秒数。它可以用来看慢动作的测试。

dumpio
Boolean <false>

将所有浏览器控制台消息记录到终端。

对于所有其他选项，请检查puppeteer.launch官方文档。

## 浏览器API
AdonisJs在Puppeteer上添加了一个包装器，使其更适合测试。以下是主浏览器和页面对象的API。

browser.visit
该browser.visit方法调用Puppeteer的page.goto方法并具有相同的签名。

test('Visit home page', async ({ browser }) => {
  const page = await browser.visit('/', {
    waitUntil: 'load'
  })

  await page.assertHas('Adonis')
})
你可以通过访问该page.page属性来访问Puppeteer的实际页面对象。

test('Visit home page', async ({ browser }) => {
  const page = await browser.visit('/')

  // puppeteer page object
  page.page.addScriptTag()
})
## 页面交互
编写浏览器测试时最常见的事情就是与网页进行交互。以下是相同的方法列表。

浏览器客户端支持所有CSS选择器。随意使用你的CSS选择器技能。
type(选择器，值)
在给定选择器的元素内输入。

const { test, trait } = use('Test/Suite')('Hello World')

trait('Test/Browser')

test('Visit home page', async ({ browser }) => {
  const page = await browser.visit('/')

  await page
    .type('[name="username"]', 'virk')
})
要键入多个值，可以链接方法

await page
  .type('[name="username"]', 'virk')
  .type('[name="age"]', 22)
选择(选择器，值)
在选择框中选择值

await page
  .select('[name="gender"]', 'Male')
要选择多个选项，请传递一组值。

await page
  .select('[name="lunch"]', ['Chicken box', 'Salad'])
收音机(选择器，值)
根据其值选择一个单选按钮

await page
  .radio('[name="gender"]', 'Male')
检查(选择)
选中一个复选框

await page
  .check('[name="terms"]')
取消选中(选择器)
取消选中一个复选框

await page
  .uncheck('[name="newsletter"]')
submitForm(选择器)
提交选定的表格

await page
  .submitForm('form')

// or use a name
await page
  .submitForm('form[name="register"]')
单击(选择)
单击一个元素。

await page
  .click('a[href="/there"]')
DOUBLECLICK(选择器)
双击一个元素

await page
  .doubleClick('button')
右击(选择器)
右键单击元素

await page
  .rightClick('button')
清除(选择器)
清除给定元素的值。

await page
  .clear('[name="username"]')
附加(选择器，[文件])
附加一个或多个文件

await page
  .attach('[name="profile_pic"]', [
    Helpers.tmpPath('profile_pic.jpg')
  ])
截图(saveToPath)
拍摄并保存当前网页状态的屏幕截图

await page
  .type('[name="username"]', 'Virk')
  .type('[name="age"]', 27)
  .screenshot()
## 等待行动
通常，你必须等待某个操作生效。例如：

等待元素出现在网页上。

等待页面重定向等等。

 

waitForElement(selector，timeout = 15000)
等待DOM中存在元素。默认超时为15 seconds。

await page
  .waitForElement('div.alert')
  .assertHasIn('div.alert', 'Success!')
waitUntilMissing(选择器)
等到元素从DOM中消失。

await page
  .waitUntilMissing('div.alert')
  .assertNotExists('div.alert')
waitForNavigation()
等到页面正确导航到新URL。

await page
  .click('a[href="/there"]')
  .waitForNavigation()
  .assertPath('/there')
WAITFOR(关闭)
等到Closure返回true。闭包在浏览器上下文中执行，并且可以访问变量window，document等等。

await page
  .waitFor(function () {
    return !!document.querySelector('body.loaded')
  })
暂停(超时= 15000)
暂停网页给定的时间范围

await page.pause()
## 阅读价值观
以下是可用于从网页读取值的方法列表。

的getText([选择器])
获取给定元素或整个页面的文本

await page
  .getText()

// or
await page
  .getText('span.username')
getHtml([选择器])
获取给定元素或整个网页的HTML

await page
  .getHtml()

// or
await page
  .getHtml('div.header')
ISVISIBLE(选择器)
查找给定元素是否在页面上可见。

const isVisible = await page
  .isVisible('div.alert')

assert.isFalse(isVisible)
hasElement(选择器)
查找DOM中是否存在元素。

const hasElement = await page
  .hasElement('div.alert')

assert.isFalse(hasElement)
器isChecked(选择器)
查找是否选中了复选框

const termsChecked = await page
  .isChecked('[name="terms"]')

assert.isTrue(termsChecked)
getAttribute(selector，name)
获取给定属性的值

const dataTip = await page
  .getAttribute('div.tooltip', 'data-tip')
的getAttributes(选择器)
获取给定元素的所有属性

const attributes = await page
  .getAttributes('div.tooltip')
的getValue(选择器)
获取给定表单元素的值

const value = await page
  .getValue('[name="username"]')

assert.equal(value, 'virk')
的getPath()
获取当前网页路径

await page
  .getPath()
getQueryParams()
获取查询参数

await page
  .getQueryParams()
getQueryParam(钥匙)
获取单个查询参数的值

await page
  .getQueryParam('orderBy')
的getTitle()
获取网页标题

await page
  .getTitle()
## 断言
运行断言的一种方法是读取某些元素的值，然后手动运行断言。而浏览器客户端捆绑了一堆帮助方法来运行内联断言。

assertHas(预期)
断言网页包含预期的文本值

await page
  .assertHas('Adonis')
assertHasIn(选择器，预期)
断言给定的选择器包含期望值。

await page
  .assertHasIn('div.alert', 'Success!')
assertAttribute(selector，attribute，expected)
断言属性的值与预期相同

await page
  .assertAttribute('div.tooltip', 'data-tip', 'Some helpful tooltip')
assertValue(选择器，预期)
断言给定表单元素的值。

await page
  .assertValue('[name="username"]', 'virk')
assertIsChecked(选择器)
断言复选框已选中

await page
  .assertIsChecked('[name="terms"]')
assertIsNotChecked(选择器)
断言未选中该复选框

await page
  .assertIsNotChecked('[name="terms"]')
assertIsVisible(选择器)
断言元素是可见的

await page
  .assertIsVisible('div.notification')
assertIsNotVisible(选择器)
断言元素不可见

await page
  .assertIsNotVisible('div.notification')
assertPath(值)
断言当前路径的值

await page
  .assertPath('/there')
assertQueryParam(键，值)
断言查询参数的值

await page
  .assertQueryParam('orderBy', 'id')
assertExists(选择器)
断言DOM中存在一个元素

await page
  .assertExists('div.notification')
assertNotExists(选择器)
断言DOM中不存在元素

await page
  .assertNotExists('div.notification')
assertCount(selector，expectedCount)
断言给定选择器的元素数量

await page
  .assertCount('table tr', 2)
assertTitle(预期)
断言网页标题

await page
  .assertTitle('Welcome to Adonis')
assertEval(selector，fn，[args]，expected)
断言在给定选择器上执行的函数的值。将fn在浏览器环境中执行。

await page
  .assertEval('table tr', function (el) {
    return el.length
  }, 2)
在上面的示例中，我们计算tr表内部的数量并断言该计数是多少2。

此外，你可以将args传递给选择器fn。

await page
  .assertEval(
    'div.notification',
    function (el, attribute) {
      return el[attribute]
    },
    ['id'],
    'notification-1'
  )
在上面的例子中，我们断言了给定的属性div.notification。该属性是动态的，并作为参数传递。

assertFn(fn，[args]，预期)
断言给定函数的输出。将fn在浏览器环境中执行。

assertFn和之间的区别在于assertEval后者在运行函数之前预先选择了一个元素。

await page
  .assertFn(function () {
    return document.title
  }, 'Welcome to Adonis')