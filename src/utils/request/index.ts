import { login } from "./login";
import { SESSION_KEY, LOGIN_FAIL_CODES } from "../../config/global-config";
import wxp from "../wxp";
import { ICgiConfig, getHost } from "../../config/cgi-config";
import { getLogger } from "../log";
import { IRequestOption } from "../../api/common";
import { reLaunch } from "../navigate";
const logger = getLogger("request");

const TRY_LOGIN_LIMIT = 1; // 登录态重试次数
const TRY_RETRY_LIMIT = 3; // 网络原因重试次数

export async function request(
  cgiConfig: ICgiConfig,
  data: any = {},
  options: IRequestOption = {}
) {
  logger.RUN("request invoke, ", { cgiConfig, data, options });
  // 非登录接口，则走 login()
  if (cgiConfig.url != "/login") {
    await login();
  }
  // login过后，可以从缓存中取出session
  let session = wx.getStorageSync(SESSION_KEY);
  let tryLoginCount = options.tryLoginCount || 0;
  // 如果需要通过data把登录态session带上
  const dataWithSession = { ...data, [SESSION_KEY]: session };
  const requestOption: WechatMiniprogram.RequestOption = {
    url: getHost() + cgiConfig.url,
    method: cgiConfig.method,
    data: dataWithSession,
    header: {
      "content-type": cgiConfig.contentType || "application/json"
    }
  };
  logger.RUN("before wx.request, ", { requestOption });
  // 检查是否需要显示加载中
  if (options.showLoading) {
    wx.showLoading({ title: options.loadingText || "加载中" });
  }
  const res = await wxp.request(requestOption);
  logger.RUN("after wx.request");
  // 关闭加载中
  if (options.showLoading) {
    wx.hideLoading();
  }
  if (res.statusCode === 200) {
    const data: any = res.data;
    // 登陆态失效特定错误码判断，且重试次数未达到上限
    if (
      LOGIN_FAIL_CODES.indexOf(data.return_code) > -1 &&
      tryLoginCount <= TRY_LOGIN_LIMIT
    ) {
      // 此时需要重置session
      wx.removeStorageSync(SESSION_KEY);
      // 然后再重试，此时会重新拉起登录
      options.tryLoginCount = ++tryLoginCount;
      return request(cgiConfig, data, options);
    } else if (data.ret_code == 0) {
      return Promise.resolve(data);
    } else {
      if (options.showNetworkRetry) {
        reLaunch("/pages/result/result", {
          urlParams: {
            type: "warn",
            title: "页面异常",
            info: "系统繁忙，请稍后再试"
          }
        });
      } else if (options.showErrorToast) {
        wx.showToast({
          title: options.errorText || "系统繁忙，请稍后再试"
        });
      }
      return Promise.reject(data.return_code);
    }
  } else {
    // 展示由于网络原因失败的重试
    if (options.showNetworkRetry) {
      if (options.tryRetryCount && options.tryRetryCount < TRY_RETRY_LIMIT) {
        const res = await wxp.showModal({
          title: options.networkRetryText || "网络异常，请稍后再试",
          showCancel: false,
          confirmText: "点击重试"
        });
        if (res.confirm) {
          return await request(cgiConfig, data, {
            ...options,
            tryRetryCount: options.tryRetryCount ? options.tryRetryCount + 1 : 1
          });
        }
      } else {
        // 重试次数满，跳转到异常页面
        reLaunch("/pages/result/result", {
          urlParams: {
            type: "warn",
            title: "网络异常",
            info: "系统繁忙，请稍后再试"
          }
        });
      }
    } else if (options.showErrorToast) {
      wx.showToast({
        title: options.errorText || "系统繁忙，请稍后再试"
      });
    }
    return Promise.reject(res.statusCode);
  }
}
