# 跑起来  
> 开发模式及命令行, 了解了前面的FKP的基本编译规则，这篇开始进行实操编译

## ly命令
没有使用npm自带的命令方式，因为也想经常练习下`bash`，`ly`本是原来公司的名字缩写，自离开公司后，也想改个其他的名字，后来一想，我本人
姓`Yao`，索性依旧是`ly`了  

`ly`命令需要执行权限，在`linux/mac`下请`chmod +x ./ly`  


## 开发模式  

#### ly demo
小前端开发，适合模板开发  
- watch  // webpack-dev-server
- html/css/js
- 端口：3000
- url: localhost:3000

#### ly dev
大前端开发，也是本人用的最多的环境
- watch  // webpack-dev-server
- html/css/js/node/api
- 端口：3000
- url: localhost:3000

#### ly pro
大前端开发，用来上生产前本地检测一次
- watch  // 性能不好
- uglify
- html/css/js/node/api
- 端口：3000
- url: localhost:3000

## 生产模式
生产环境使用PM2来启动服务
```
gulp build
pm2 start index.js
```     


- uglify
- html/css/js/node/api
- 端口：8070
- url: //IP:8070
- node 反向代理
