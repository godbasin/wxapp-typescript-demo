import autologBehavior from "../../behaviors/autolog-behavior";
import { navigateTo } from "../../utils/navigate";
const PAGE_NAME = "index";

//获取应用实例
const app = getApp();

Component({
  behaviors: [autologBehavior],
  data: {
    PAGE_NAME,

    userInfo: {},
    canIUseGetUserInfo: wx.canIUse("button.open-type.getUserInfo")
  },
  methods: {
    // --------------------------------- 生命周期 -------------------------------------
    onLoad() {
      this.checkUserInfo();
    },

    // ----------------------------------- 事件 --------------------------------------
    // 兼容获取用户信息
    checkUserInfo() {
      if (app.globalData.userInfo) {
        this.setData({
          userInfo: app.globalData.userInfo,
          hasUserInfo: true
        });
      } else if (this.data.canIUseGetUserInfo) {
        // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
        // 所以此处加入 callback 以防止这种情况
        app.userInfoReadyCallback = (res: any) => {
          this.setData({
            userInfo: res,
            hasUserInfo: true
          });
        };
      } else {
        // 在没有 open-type=getUserInfo 版本的兼容处理
        wx.getUserInfo({
          success: res => {
            app.globalData.userInfo = res.userInfo;
            this.setData({
              userInfo: res.userInfo,
              hasUserInfo: true
            });
          }
        });
      }
    },

    // 兼容getUserInfo
    getUserInfo(e: any) {
      app.globalData.userInfo = e.detail.userInfo;
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      });
    },

    // 跳转去其他界面
    gotoOtherPage(e) {
      const { page } = e.currentTarget.dataset;
      navigateTo(page);
    },
    // 跳转去 result 界面，带成功相关参数
    gotoSuccess() {
      navigateTo("/pages/result/result", {
        // 直接带入参数，result组件可通过properties直接拿到
        urlParams: {
          type: "success",
          title: "操作成功",
          info: "成功就是这么简单"
        }
      });
    },
    // 跳转去 result 界面，带失败相关参数
    gotoFail() {
      navigateTo("/pages/result/result", {
        // 直接带入参数，result组件可通过properties直接拿到
        urlParams: {
          type: "warn",
          title: "操作出错",
          info: "人生也常常不如意"
        }
      });
    }
  }
});
