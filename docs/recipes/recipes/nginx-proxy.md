# nginx 代理
此专题分享在 AdonisJs 应用程序使用 nginx 代理服务所需的最少步骤。

## 第一步
在开始之前，请确保你可以在定义的端口上运行你的应用程序。此外，建议使用流程管理器 pm2 来启动 Node.js 服务器。
```bash
pm2 start server.js
```
验证它是否正常工作
```
pm2 list
```
要检查应用程序日志，可以运行以下命令
```
pm2 logs
```
## Nginx代理
打开 default 服务器配置文件。
```bash
# empty the file
echo > /etc/nginx/sites-available/default

# open in editor
vi /etc/nginx/sites-available/default
```
此外，将以下代码粘贴到其中。
```json
server {
  listen 80;

  server_name myapp.com;

  location / {
      proxy_pass http://localhost:3333;
      proxy_http_version 1.1;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection 'upgrade';
      proxy_set_header Host $host;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-Proto $scheme;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_cache_bypass $http_upgrade;
  }
}
```
#### 注意事项
假设 nginx 已按预期安装并正常工作。

你的应用正在运行 PORT 3333 。如果没有，则 proxy_pas s在 nginx 文件中更改块并定义适当的端口。

请替换 myapp.com 为你应用的实际域名。

在 config / app.js 文件中将值更改 trustProxy 为 true 。

现在访问 myapp.com 显示你的 Adonisjs 应用程序，因为 nginx 它代理了对在指定端口上运行的应用程序的所有请求。

