import { login } from "./login";
import { SESSION_KEY, LOGIN_FAIL_CODES } from "../../config/global-config";
import wxp from "../wxp";
import { ICgiConfig, getHost } from "../../config/cgi-config";
import { getLogger } from "../log";
const logger = getLogger("request");

const TRY_LOGIN_LIMIT = 1; // 登录态重试次数

export async function request(
  cgiConfig: ICgiConfig,
  data: any = {},
  options: any = {}
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
  const res = await wxp.request(requestOption);
  logger.RUN("after wx.request");
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
      return Promise.reject(data.return_code);
    }
  } else {
    return Promise.reject(res.statusCode);
  }
}
