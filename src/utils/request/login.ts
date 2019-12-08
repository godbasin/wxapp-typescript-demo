import wxp from "../wxp";
import { singleInstancePromise } from "../util";

// 后台吐回的session参数key
import { SESSION_KEY } from "../../config/global-config";
import { API } from "../../config/cgi-config";
import { request } from "./index";

let hasSessionChecked = false; // 是否在生命周期中检查过登录态
let session; // session

/**
 * asyncLogin 逻辑的实现，不被单例保护，不能被直接调用
 */
async function asyncLogin() {
  // 1. 检查是否过期
  if (!hasSessionChecked) {
    try {
      await wxp.checkSession();
      // session_key 未过期，并且在本生命周期一直有效
      hasSessionChecked = true;
    } catch (error) {
      // session_key 已经失效，需要重新执行登录流程
      wx.removeStorageSync(SESSION_KEY);
    }
  }
  // 2. 尝试获取到本地缓存session
  // 从缓存获取session
  session = wx.getStorageSync(SESSION_KEY);
  // 3. 缓存中有session，正常继续
  if (!session) {
    // 4. 缓存中无session，重新拉起登录
    const res = await wxp.login();
    const data = await request(API.login, { code: res.code });
    try {
      // 请求成功，将session缓存下来
      wx.setStorageSync(SESSION_KEY, data[SESSION_KEY]);
    } catch (error) {
      throw error;
    }
  }
}

// 对 asyncLogin 进行单例化
export const login = singleInstancePromise(asyncLogin);
export default login;
