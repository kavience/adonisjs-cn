## 贡献指南
开源项目由活跃的用户和协作者社区维护和支持。

我们鼓励你积极参与 AdonisJs 的开发，你可以选择贡献源代码、改进文档、报告潜在的 bug 或者测试新特性。
### 渠道

与 AdonisJs 团队沟通的方式有很多。

[Github 仓库](https://github.com/adonisjs)：共享 bug 或针对专用 AdonisJs 创建特性请求。

[论坛](https://forum.adonisjs.com/)：提出问题，展示你的项目，并参与 AdonisJs 框架的开发。

[Discord](https://discord.gg/vDcEjq6)：加入我们的 Discord 与社区中的其他人即时聊天。

[Twitter](https://twitter.com/adonisframework)：关注我们每天取得的最新进展，了解社区提供的最新项目。

### 错误报告

乍一看，提供一个好的 bug 报告似乎很简单。

但是你要尽量描述清楚，并提供足够的上下文和信息来重现问题。

错误报告也可以以包含失败测试的 pull request 的形式发送。

1. 提供问题的清晰标题和描述。

2. 提供你所使用的框架的版本。

3. 添加尽可能多的代码示例来演示这个问题，你还可以提供一个完整的存储库来快速重现问题。

记住，错误报告并不意味着错误将在一个小时内得到修复!

在报告问题之前就自己着手解决问题，这对你自己和社区都有好处。

### 编码风格
JavaScript 本身没有任何官方的编码风格。

因此，AdonisJs 使用 [StandardJS](https://standardjs.com/) 来帮助维护代码的可读性和一致性。

请确保在发送 pull request 到任何 AdonisJs 库之前，已经格式化了你的代码:
```javascript
npm run lint
```

### 文档
当向框架的核心添加新特性时，请确保在[文档](https://github.com/adonisjs/docs)中创建一个并行的 pull request 并将它们链接起来。

这将帮助 AdonisJs 团队理解你的特性并保持文档的更新。

### 测试

在发起 pull request 之前，请确保已经测试过添加的代码。

