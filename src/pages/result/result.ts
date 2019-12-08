import { getLogger } from "../../utils/log";
import autologBehavior from "../../behaviors/autolog-behavior";
import { getLaunchOptions } from "../../utils/util";
import { reLaunch } from "../../utils/navigate";
const PAGE_NAME = "result";
const logger = getLogger(PAGE_NAME);

Component({
  behaviors: [autologBehavior],
  data: {
    PAGE_NAME,
    type: "success", // 结果类型，成功-success，失败-warn
    title: "成功", // 主要文案
    info: "", // 辅助文案
    isFromApp: false, // 是否来自App打开小程序
    isFromMiniProgram: false // 是否来自其他小程序打开小程序
  },
  properties: {
    type: String,
    title: String,
    info: String
  },
  methods: {
    // --------------------------------- 生命周期 -------------------------------------
    onLoad() {
      // 获取参数，发起请求
      const options = getLaunchOptions();
      logger.RUN("onLoad, this.data = ", this.data, "options = ", options);
      this.setData({
        isFromApp: options.scene === 1069,
        isFromMiniProgram: options.scene === 1037
      });
    },

    // ----------------------------------- 事件 --------------------------------------
    // 点击返回按钮
    clickReturn() {
      const { isFromMiniProgram } = this.data;
      if (isFromMiniProgram) {
        // 来自其他小程序，则回跳
        wx.navigateBackMiniProgram({
          fail() {
            wx.showToast({
              title: "无法返回小程序",
              icon: "none"
            });
          }
        });
      } else {
        // 其他情况跳回首页
        reLaunch("/pages/index/index");
      }
    },
    // 点击返回App失败
    launchAppFail() {
      wx.showToast({
        title: "无法返回App",
        icon: "none"
      });
    }
  }
});
