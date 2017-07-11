# 混合编译
编译静态资源供HTML页面调用，FKP2的编译环境是构建在`GULP/WEBPACK`上的混合编译，使用`Coffee`开发，基于`GULP`的任务模式，使得FKP2可适用于多种环境。

## **GULP**
我们使用GULP编译、监控CSS/HTML  

gulp的优势
- 流式操作，命令可控
- 易于模块化
- 性能强，编译稳定
- 插件丰富
- 减少产出冗余代码  


我们使用 GULP 处理 CSS 的编译及 HTML 的编译处理，基于不同的任务分别产出不同的代码，以适用于压缩化的生产环境和即时的开发环境

## WEBPACK@1.3
使用 webpack  来对业务JS，组件JS 做打包和分包的处理，基于 webpack-dev-server 实现对 JS 代码的实时热更新
