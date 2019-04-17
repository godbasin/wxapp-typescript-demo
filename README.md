小程序 DEMO

- 使用 gulp 构建（支持 typescript 和 less）
- 使用 typescript 编译
- 使用 tslint + prettier 格式代码规范
- 使用小程序官方 typing 库

```bash
# 安装依赖
npm install

# 全局安装依赖
npm install gulp prettier typescript --global

# 启动代码
npm run dev

# 需要在小程序开发工具里【工具】-【构建npm】

# 打包代码
npm run build
```

## 项目结构

```
├─dist                              //编译之后的项目文件（带 sorcemap，支持生产环境告警定位）
├─src                               //开发目录
│  │  app.ts                        //小程序起始文件
│  │  app.json
│  │  app.less
│  │
│  ├─assets                     	//静态资源
│     ├─less						//公共less
│     ├─img						    //图片资源
│  ├─components                     //组件
│  ├─utils                           //工具库
│  ├─config                           //配置文档
│     ├─cgi-config.ts                //cgi接口配置
│     ├─we-request.ts                //请求配置
│  ├─pages                          //小程序相关页面
│
│  project.config.json              //小程序配置文件
│  gulpfile.js                      //工具配置
│  package.json                     //项目配置
│  README.md                        //项目说明
│  tsconfig.json                     //typescript配置
│  tslint.json                     //代码风格配置
```

## 公共库使用说明

**注意：`package.json`中的`dependencies`字段，依赖的包会被自动打包到`dist`里。**

## we-request 使用说明

### config/we-request

通用请求，处理包括 session 过期自动拉取登录接口续期等逻辑。
使用方式请查阅：https://github.com/IvinWu/weRequest/tree/2.x.x

若项目适用于有单个登录接口来获取 session 的场景，请自行修改 `src/package.json`，将`we-request`版本修改为`1.2.0`，其使用方式请查阅：https://github.com/IvinWu/weRequest/tree/1.2.0
