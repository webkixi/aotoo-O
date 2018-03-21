# aotoo-O 
JS全栈脚手架，大前端架构，前后端同构react

## 启动说明
```bash
 yarn run dev  # 测试环境，不编译公共，带启动
 yarn run dev-clean  # 测试环境，编译公共，带启动
 yarn run build  # 生产编译，不带启动
 yarn run build-clean  # 生产编译，编译公共，不带启动
 yarn run node  # 生产环境，完成编译，纯node启动
  
 yarn run dev -- --port 8080  # 指定端口
 yarn run dev -- --config test  # 指定配置文件
 yarn run dev -- --eval # 编译使用cheap-module-eval-source-map
 
 # node启动
 node index.js -d --port 3000 # 开发环境，带编译，带启动，指定端口
 node index.js -d -n --port 3000  #开发环境，纯Node，指定端口
 node index.js -d -n --port 3000 --config xxx # 同上+指定xxx配置
 node index.js --port 3000 # 生产环境，指定端口
 node index.js --port 3000 --config xxx #同上+指定xxx配置
 
 # PM2启动
 pm2 start index.js -- --config xxx #xxx环境， 指定配置
 pm2 start index.js -- --port 3000 --config xxx #xxx环境，指定配置，指定端口
 
 # 版本启动
 node index.js --version 1.0.3  # 指定版本启动，一般用于线上回滚
 pm2 start index.js -- --version 1.0.3
```