# 小程序 Typescript 最佳实践 DEMO

- 使用 gulp 构建（支持 typescript 和 less/sass/scss）
- 使用 typescript 编译
- 使用 tslint + prettier 格式代码规范
- 使用小程序官方 typing 库
- 使用小程序 [weui 组件库](https://developers.weixin.qq.com/miniprogram/dev/extended/weui/)
- 使用了 [conventional-changelog](https://github.com/conventional-changelog/conventional-changelog) 方案自动生成 CHANGELOG

## 封装了以下的能力

| 相关能力            | 说明                                                                                                                                          |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| watch behavior      | 使用参考 [watch-behavior](https://github.com/godbasin/watch-behavior)                                                                         |
| 日志能力            | 封装了 LogManager 和实时日志的能力 ，[参考地址](https://godbasin.github.io/2019/12/07/wxapp-logs/)                                            |
| autolog behavior    | 配合日志能力，自动在 Component 中每一个方法调用的时候打印 log，[参考地址](https://godbasin.github.io/2019/12/07/wxapp-logs/)                  |
| globalData behavior | 只需要在 Component 中引入 GlobalData，则可以使用全局状态的能力，[参考地址](https://godbasin.github.io/2019/11/09/wxapp-global-data-behavior/) |
| 页面跳转库          | 解决了带参数、锁住原跳转页面等问题，[参考地址](https://godbasin.github.io/2019/12/08/wxapp-navigate/)                                         |
| pageparams behavior | 配合页面跳转库的跳转参数使用，如果使用 pageParams 来跳转传参，使用该 behavior 可以自动更新到 data 中                                          |
| request 通用请求库  | 处理包括 session 过期自动拉取登录接口续期等逻辑                                                                                               |
| promisify 工具库    | 将类似于 wx.request 等函数转化为 Promise 调用方式                                                                                             |

**扫码可以简单体验下 DEMO：**  
![](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/kittykitty_code.jpg)

## 安装使用

```bash
# 安装依赖
npm install

# 全局安装依赖
npm install gulp prettier typescript commitizen --global

# 需要在小程序开发工具里【工具】-【构建npm】

# 启动代码
npm run dev

# 打包代码
npm run build
```

## 基本环境说明

### husky

1. 如果不希望在 git commit 的时候检查 commit 的规范，请在`package.json`文件中删掉`"commit-msg"`相关内容。
2. 如果不希望在 git commit 的时候检查代码规范，请在`package.json`文件中删掉`"pre-commit"`相关内容。

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "pretty-quick --staged",
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
    }
  }
}
```

### commit 规范

git commit 的 message 遵循 [Angular 规范](https://docs.google.com/document/d/1QrDFcIiPjSLDn3EL15IJygNPiHORgU1_OOAqWjiDU5Y/edit#heading=h.greljkmo14y0)：

```cmd
<commit 类型，不可省略>(<功能模块，可省略>): <功能内容，不可省略>
// 空一行
<详细内容，可省略>
// 空一行
<关闭Issue，此处可省略>
```

commit 类型包括：

- feat：新功能（feature）
- fix：修补 bug
- docs：文档（documentation）
- style： 格式（不影响代码运行的变动）
- refactor：重构（即不是新增功能，也不是修改 bug 的代码变动）
- test：增加测试
- chore：构建过程或辅助工具的变动

如果 commit 类型为`feat`和`fix`，则该 commit 将现在 CHANGELOG.md 之中。

该项目更多使用方式参考[前端 CHANGELOG 生成指南](https://godbasin.github.io/2019/11/10/change-log/)。

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
│  ├─behaviors                     //通用behaviors
│  ├─components                     //组件
│  ├─utils                           //工具库
│  ├─config                           //配置文档
│     ├─cgi-config.ts                //cgi接口配置
│     ├─global-config.ts                //全局配置
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

### utils/request

通用请求，处理包括 session 过期自动拉取登录接口续期等逻辑。（适用于有单个登录接口来获取 session 的场景）
使用方式：

1. 在`config/global-config.ts`文件里，更新`SESSION_KEY`的值（后台接口协议返回 key，例如`"sessionId"`）。
2. 如果有其他需要全局携带的参数，需要在`utils/request/index.ts`文件里，`dataWithSession`中带上。
3. 在`config/global-config.ts`文件里，更新`LOGIN_FAIL_CODES`的值（错误码若为该数组中的一个，则会重新拉起登录，再继续发起请求）。
