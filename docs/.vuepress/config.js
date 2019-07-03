module.exports = {
    base: '/adonisjs-cn/',
    title: 'AdonisJs',
    description: '优雅的 Node.js web 框架',
    themeConfig: {
      nav: [
        { text: '首页', link: '/' },
        { text: '快速开始', link: '/start/' },
        { text: '指南', link: '/guides/preface/about' },
        { text: '专题', link: '/recipes/recipes/nginx-proxy' },
        { text: '官网', link: 'https://adonisjs.com/' },
      ],
      sidebarDepth: 0,
      sidebar:{
          '/guides/':[
              {
                  title: '序言', 
                  collapsable: false, 
                  children: [
                      '/guides/preface/about', 
                      '/guides/preface/upgrade', 
                      '/guides/preface/contribution', 
                  ]
              },
              {
                  title: '主要概念', 
                  collapsable: false, 
                  children: [
                      '/guides/concept/request-lifecycle', 
                      '/guides/concept/ioc-container', 
                      '/guides/concept/service-provider', 
                      '/guides/concept/ignitor', 
                  ]
              },
              {
                  title: '快速开始', 
                  collapsable: false, 
                  children: [
                      '/guides/started/installation', 
                      '/guides/started/configuration', 
                      '/guides/started/directory-structure', 
                  ]
              },
              {
                  title: '基础入门', 
                  collapsable: false, 
                  children: [
                      '/guides/basics/routing', 
                      '/guides/basics/middleware', 
                      '/guides/basics/controller', 
                      '/guides/basics/request', 
                      '/guides/basics/response', 
                      '/guides/basics/view', 
                      '/guides/basics/session', 
                      '/guides/basics/validator', 
                      '/guides/basics/error-handling', 
                      '/guides/basics/logger', 
                  ]
              },
              {
                  title: '安全', 
                  collapsable: false, 
                  children: [
                      '/guides/security/introduction', 
                      '/guides/security/authentication', 
                      '/guides/security/cors', 
                      '/guides/security/csrf-protection', 
                      '/guides/security/encryption', 
                      '/guides/security/shield-middleware', 
                  ]
              },
              {
                  title: '深入了解', 
                  collapsable: false, 
                  children: [
                      '/guides/deeper/ace-commands', 
                      '/guides/deeper/event', 
                      '/guides/deeper/extend-core', 
                      '/guides/deeper/file-upload', 
                      '/guides/deeper/file-storage', 
                      '/guides/deeper/helper', 
                      '/guides/deeper/international', 
                      '/guides/deeper/mail', 
                      '/guides/deeper/social-authentication', 
                  ]
              },
              {
                  title: '数据库', 
                  collapsable: false, 
                  children: [
                      '/guides/database/start', 
                      '/guides/database/query-builder', 
                      '/guides/database/migration', 
                      '/guides/database/seeds-factory', 
                      '/guides/database/redis', 
                  ]
              },
              {
                  title: 'Lucid模型', 
                  collapsable: false, 
                  children: [
                      '/guides/orm/start', 
                      '/guides/orm/hooks', 
                      '/guides/orm/traits', 
                      '/guides/orm/mutator', 
                      '/guides/orm/relationships-one', 
                      '/guides/orm/relationships-two', 
                      '/guides/orm/serialization', 
                  ]
              },
              {
                  title: 'websocket', 
                  collapsable: false, 
                  children: [
                      '/guides/websockets/start', 
                      '/guides/websockets/philosophy', 
                      '/guides/websockets/server-api', 
                      '/guides/websockets/client-api', 
                  ]
              },
              {
                  title: '测试', 
                  collapsable: false, 
                  children: [
                      '/guides/testing/start', 
                      '/guides/testing/http-test', 
                      '/guides/testing/browser-test', 
                      '/guides/testing/fakes', 
                  ]
              },
              {
                title: '结语', 
                collapsable: false, 
                children: [
                    '/guides/finally/about', 
                ]
            },
          ],
          '/recipes/':[
                {
                    title: '专题', 
                    collapsable: false, 
                    children: [
                        '/recipes/recipes/nginx-proxy', 
                        '/recipes/recipes/domains', 
                        '/recipes/recipes/assets', 
                        '/recipes/recipes/install', 
                        '/recipes/recipes/https', 
                        '/recipes/recipes/guessing', 
                    ]
                },
            ]
        },
      lastUpdated: '最后一次更新',
    }
  }
  