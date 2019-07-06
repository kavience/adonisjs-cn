(window.webpackJsonp=window.webpackJsonp||[]).push([[68],{208:function(a,t,s){"use strict";s.r(t);var e=s(0),n=Object(e.a)({},function(){var a=this,t=a.$createElement,s=a._self._c||t;return s("ContentSlotsDistributor",{attrs:{"slot-key":a.$parent.slotKey}},[s("h1",{attrs:{id:"nginx-代理"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#nginx-代理","aria-hidden":"true"}},[a._v("#")]),a._v(" nginx 代理")]),a._v(" "),s("p",[a._v("此专题分享在 AdonisJs 应用程序使用 nginx 代理服务所需的最少步骤。")]),a._v(" "),s("h2",{attrs:{id:"第一步"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#第一步","aria-hidden":"true"}},[a._v("#")]),a._v(" 第一步")]),a._v(" "),s("p",[a._v("在开始之前，请确保你可以在定义的端口上运行你的应用程序。此外，建议使用流程管理器 pm2 来启动 Node.js 服务器。")]),a._v(" "),s("div",{staticClass:"language-bash extra-class"},[s("pre",{pre:!0,attrs:{class:"language-bash"}},[s("code",[a._v("pm2 start server.js\n")])])]),s("p",[a._v("验证它是否正常工作")]),a._v(" "),s("div",{staticClass:"language- extra-class"},[s("pre",{pre:!0,attrs:{class:"language-text"}},[s("code",[a._v("pm2 list\n")])])]),s("p",[a._v("要检查应用程序日志，可以运行以下命令")]),a._v(" "),s("div",{staticClass:"language- extra-class"},[s("pre",{pre:!0,attrs:{class:"language-text"}},[s("code",[a._v("pm2 logs\n")])])]),s("h2",{attrs:{id:"nginx代理"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#nginx代理","aria-hidden":"true"}},[a._v("#")]),a._v(" Nginx代理")]),a._v(" "),s("p",[a._v("打开 default 服务器配置文件。")]),a._v(" "),s("div",{staticClass:"language-bash extra-class"},[s("pre",{pre:!0,attrs:{class:"language-bash"}},[s("code",[s("span",{pre:!0,attrs:{class:"token comment"}},[a._v("# empty the file")]),a._v("\n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[a._v("echo")]),a._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[a._v(">")]),a._v(" /etc/nginx/sites-available/default\n\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[a._v("# open in editor")]),a._v("\n"),s("span",{pre:!0,attrs:{class:"token function"}},[a._v("vi")]),a._v(" /etc/nginx/sites-available/default\n")])])]),s("p",[a._v("此外，将以下代码粘贴到其中。")]),a._v(" "),s("div",{staticClass:"language-json extra-class"},[s("pre",{pre:!0,attrs:{class:"language-json"}},[s("code",[a._v("server "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("{")]),a._v("\n  listen "),s("span",{pre:!0,attrs:{class:"token number"}},[a._v("80")]),a._v(";\n\n  server_name myapp.com;\n\n  location / "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("{")]),a._v("\n      proxy_pass http"),s("span",{pre:!0,attrs:{class:"token operator"}},[a._v(":")]),s("span",{pre:!0,attrs:{class:"token comment"}},[a._v("//localhost:3333;")]),a._v("\n      proxy_http_version "),s("span",{pre:!0,attrs:{class:"token number"}},[a._v("1.1")]),a._v(";\n      proxy_set_header Upgrade $http_upgrade;\n      proxy_set_header Connection 'upgrade';\n      proxy_set_header Host $host;\n      proxy_set_header X-Real-IP $remote_addr;\n      proxy_set_header X-Forwarded-Proto $scheme;\n      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;\n      proxy_cache_bypass $http_upgrade;\n  "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("}")]),a._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("}")]),a._v("\n")])])]),s("h4",{attrs:{id:"注意事项"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#注意事项","aria-hidden":"true"}},[a._v("#")]),a._v(" 注意事项")]),a._v(" "),s("p",[a._v("假设 nginx 已按预期安装并正常工作。")]),a._v(" "),s("p",[a._v("你的应用正在运行 PORT 3333 。如果没有，则 proxy_pas s在 nginx 文件中更改块并定义适当的端口。")]),a._v(" "),s("p",[a._v("请替换 myapp.com 为你应用的实际域名。")]),a._v(" "),s("p",[a._v("在 config / app.js 文件中将值更改 trustProxy 为 true 。")]),a._v(" "),s("p",[a._v("现在访问 myapp.com 显示你的 Adonisjs 应用程序，因为 nginx 它代理了对在指定端口上运行的应用程序的所有请求。")])])},[],!1,null,null,null);t.default=n.exports}}]);