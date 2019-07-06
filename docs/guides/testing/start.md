# 快速开始
每次对应用程序进行更改时，都要测试行为以确保其正常工作。通过访问每个网页或 API 来手动测试更改是不可能的，因此自动化测试可确保一切正常。

在本指南中，我们将了解测试应用程序的好处和不同方法

## 测试用例
如果你不熟悉测试，可能会发现很难发现测试的好处。但是一旦你养成了编写测试的习惯，你的代码质量和对代码的信心就会大大提高。

为了构建更好的心理模型，测试分为多个类别，以便你可以编写具有明确边界的不同类型的测试用例。

#### 单元测试
编写单元测试是为了单独测试小块代码。例如：直接测试服务，而不必担心在现实世界中如何使用该服务。

单元测试确保应用程序的每个部分都能正常工作，并且编写它们也更容易，因为在测试之前不需要整个应用程序。

```javascript
const { test } = use('Test/Suite')('Example unit test')
const UserValidator = use('App/Services/UserValidator')

test('validate user details', async ({ assert }) => {
  const validation = await UserValidator.validate({
    email: 'wrong email'
  })

  assert.isTrue(validation.fails())
  assert.deepEqual(validation.messages(), [
    {
      field: 'email',
      message: 'Invalid user email address'
    }
  ])
})
```
#### 功能测试
编写功能测试是为了像最终用户一样测试你的应用。这意味着以编程方式打开浏览器并访问网页以确保它们都能正常工作。

```javascript
const { test, trait } = use('Test/Suite')('Example functional test')
trait('Test/Browser')

test('validate user details', async ({ browser }) => {
  const page = await browser.visit('/')

  await page
    .type('email', 'wrong email')
    .submitForm('form')
    .waitForNavigation()

  page.session.assertError('email', 'Invalid user email address')
})
```
以上两个示例都验证了给定用户的电子邮件地址，但根据你编写的测试类型，方法会有所不同。

## 建立
首先，我们需要通过从npm安装来设置测试引擎。
```bash
adonis install @adonisjs/vow
```
接下来，确保在 aceProviders 阵列中注册提供程序，因为我们不希望在生产中运行应用程序时引导测试引擎。
```javascript
const aceProviders = [
  '@adonisjs/vow/providers/VowProvider'
]
```
一旦 @adonisjs/vow 安装后，它会创建一个样本测试，下面描述的一些其他文件。

#### vowfile.js
在 vowfiles.js 执行你的测试之前加载。你可以使用此文件来定义在运行所有测试之前和之后应执行的任务。

#### .env.testing
此文件包含运行测试时要使用的环境变量。此文件与 .env 文件合并，因此只能定义要从 .env 文件覆盖的值。

#### 测试
所有应用程序测试都存储在 test 目录的子文件夹中。

## 运行测试
Vow 提供程序会自动为你创建单元测试，可以通过运行以下命令来执行。
```bash
adonis test
```
```bash
# 输出
Example
  ✓ make sure 2 + 2 is 4 (2ms)

PASSED
total       : 1
passed      : 1
time        : 6ms
```
## 测试套件和特性
在我们开始编写测试之前，让我们了解一些对理解测试流程很重要的基础知识。

#### Suite
每个文件都是一个测试套件，它定义了一组具有相同行为的测试。例如，我们可以为用户注册提供一套测试。
```javascript
const Suite = use('Test/Suite')('User registeration')

// or destructuring
const { test } = use('Test/Suite')('User registeration')
```
test 从 Suite 实例获取的函数用于定义测试。
```javascript
test('return error when credentials are wrong', async (ctx) => {
  // implementation
})
```
#### Traits
特征是测试套件的构建块。由于 AdonisJs 测试运行器并没有臃肿一些功能，我们将不同的代码片段作为特征。

例如：使用浏览器运行测试。
```javascript
const { test, trait } = use('Test/Suite')('User registeration')

trait('Test/Browser')

test('return error when credentials are wrong', async ({ browser }) => {
  const page = await browser.visit('/user')
})
```
这种方法的优点在于 Traits 可以透明地增强你的测试，而无需做太多工作。例如，如果我们删除 Test/Browser 特征。 browser 对象获得 undefined 在我们的测试中。

此外，你可以通过定义闭包或 IoC 容器绑定来定义你的特征。

你不必为所有事物创建特征。大部分工作可以通过使用 Lifecycle 钩子完成。如果要捆绑要供他人使用的包，则特征很有用。
```javascript
const { test, trait } = use('Test/Suite')('User registeration')

trait(function (suite) {
  suite.Context.getter('foo', () => {
    return 'bar'
  })
})

test('foo must be bar', async ({ foo, assert }) => {
  assert.equal(foo, 'bar')
})
```
#### 上下文
由于每个测试都有一个独立的上下文，你可以通过定义 getter 或宏来传递值，并在测试闭包内访问它们。

默认情况下，上下文只有一个被调用的属性 assert ，它是运行断言的 chaijs / assert 实例。

## 生命周期钩子
每个套件都有一些生命周期钩子，可用于执行重复性任务，例如在每次测试后清理数据库等等。
```javascript
const Suite = use('Test/Suite')('User registeration')

const { before, beforeEach, after, afterEach } = Suite

before(async () => {
  // executed before all the tests for a given suite
})

beforeEach(async () => {
  // executed before each test inside a given suite
})

after(async () => {
  // executed after all the tests for a given suite
})

afterEach(async () => {
  // executed after each test inside a given suite
})
```
## 断言
assert 对象是 chaijs / assert 的一个实例，它作为测试上下文的属性传递给每个测试。

为了使测试更可靠，你还可以计划为给定测试执行断言。让我们考虑这个例子。
```javascript
test('must throw exception', async ({ assert }) => {
  try {
    await badOperation()
  } catch ({ message }) {
    assert.equal(message, 'Some error message')
  }
})
```
即使从未抛出异常且没有运行断言，上述测试也会通过。这意味着它是一个糟糕的测试，因为我们的结构非常糟糕。

要克服这种情况，你必须规划一些断言，以确保 catch 始终执行块并进行断言。
```javascript
test('must throw exception', async ({ assert }) => {
  assert.plan(1)

  try {
    await badOperation()
  } catch ({ message }) {
    assert.equal(message, 'Some error message')
  }
})
```
这一次，如果 badOperation 不抛出异常，测试仍然失败，因为我们计划 1 断言并且 0 已经完成。

