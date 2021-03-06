# 为什么要翻译 AdonisJs？
2019 年 7 月 6 日 21: 53: 00。

终于在这一刻把 AdonisJs 翻译完了。在这个时刻喝上一杯 2019 年的冰镇可乐，爽。

至于为什么？其实从一开始的好奇到想放弃，再到坚持，再到现在，其实我也一直在想这个问题。现在我想我有了答案了，主要有以下几点：
## 与个人经历有关
从大学开始，最先开始接触 C 语言，再到 Java ，然后是 PHP ，然后是前端开发，中间也穿插过各种学习的技术( MySql, Linux, python, Vue, React, 小程序, 安卓开发, Laravel, ThinkPhp等等)，简而言之，从语言本身的学习到各种各样的框架，再到目前从事前端开发的工作，我的学习经历是比较零散的，可以说其实没有一门是特别精通的。虽然目前从事前端开发的岗位，但我的心中一直有个全栈梦。其实一开始，我是作为一个 phper 的，使用各种框架得心应手，但是到后期没有大项目练手，觉得甚是乏味，所以才转的前端。 然后学习 Vue 和 React 框架，在我以为可能以后主要以前端为主的时候，意外的发现国外竟有这样一款用 js 写的类似 Laravel 的框架(熟悉 php 的人一定知道 Laravel 吧)，心中特别开心，在佩服作者的同时，决心在工作之余，学习这款框架。这个框架究竟有什么魅力？请滑到最后查看 FAQ。

## 与兴趣爱好有关
其实我觉得我是喜欢写作的，如果当初好好读书，说不定可以当一个作家或者律师什么的...

所以在翻译英文文档的同时，可以练习一下写作能力和翻译能力。

## 与工作状态有关
作为一个凡夫俗子，很多时候我们的注意力往往不能集中在一点上，比如我喜欢某一门技术，但是我无法做到把全部的时间都投入学习该门技术中，心中会有一种非常压抑的感觉，反而适得其反，造成学习效率低下。所以在专注于前端开发的同时，我会抽出部分时间看看其它技术的文档或者视频，就全当听故事一样了，给自己打一点鸡血和补充一下知识。

## FAQ's
1. AdonisJs 和其他主流 nodejs 框架有什么区别？

目前主流的 nodejs 框架主要有国外的 Express ，Koa 等；国内的阿里 Egg (底层基于 Koa )，360 的 ThinkJs。 个人认为最大的区别在于 AdonisJs 是更加针对全栈开发，内置 edge 模板引擎，更像是一款真正的后端开发框架。Express、Koa 等框架相当于前端与后端中间的一层薄膜，且更加轻量级，在服务端渲染上有天然的优势，而且这些框架的初衷也确实是这样，在现在前后端大分离的时代，如果后端 API 接口尚未完成，前端人员也可以使用这些框架进行模拟 API 。而 AdonisJs 是真正的想挑起后端开发的这个角色，而不是甘于做一个'第三者'，在项目需要敏捷开发且业务不大情况下，使用 AdonisJs 会让你极大地节省时间和金钱成本。

2. AdonisJs 和 Laravel 有什么关系？

最大的区别在于前者是用 JavaScript 作为开发语言，运行在 node 环境下，管理包依赖使用的是 npm ；后者是使用 PHP 作为开发语言，运行在 Apache 、 Nginx、IIS 等 web 容器下，管理包依赖使用的是 composer 。但是除此之外 AdonisJs 和 Laravel 极度相似，如果你有使用过 PHP 的 Laravel 、ThinkPhp 等框架，你会觉得惊人的相似。个人也觉得 AdonisJs 借鉴了 Laravel。

3. AdonisJs 适合什么样的业务使用？

中小型项目 & 需要快速上线的项目 & 前端开发人员多于后端开发人员的项目

4. 发现文档中有很多明显的翻译错误？

鄙人英语只有四级水平，看英文文档稍有吃力，很多一些专有名词很难理解，或者说翻译不出来那种中文的感觉，如果你有更好的建议，请发起 PR ，欢迎大家参与进来，让 AdonisJs 生态更加丰富。
