### 环境安装
----------------

安装nodejs

git clone项目代码

npm install

bower install


### 脚本介绍
-----------------
```
build.sh: dev\test环境前端打包脚本。
build_release: www环境打包脚本。
server.sh: 开启本地服务脚本。 支持传入参数，输入入口文件名，只提供此入口文件的服务。
```

### 注意
------------------
在线上环境
由于nginx寻址的原因
首页是使用page中的html
其他页面使用的是server中的view


开发环境中
server.sh启动的服务使用html
globalServer.sh启动的服务使用的view


### 规范
------------------
[开发流程规范](http://redmine.9sand.cn:10086/projects/dev/wiki/%E5%BC%80%E5%8F%91%E6%B5%81%E7%A8%8B%E8%A7%84%E8%8C%83)

[代码规范](http://redmine.9sand.cn:10086/projects/dev/wiki/%E5%89%8D%E7%AB%AF%E8%A7%84%E8%8C%83)


