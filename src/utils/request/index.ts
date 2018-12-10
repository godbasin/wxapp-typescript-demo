import { ICommonResponse } from "../../api/common";
import { doLogin } from "../../api/login";
import { checkSession } from "./check-session";
import { SESSION_KEY, LOGIN_FAIL_CODES } from "../../config/global-config";

const TRY_LOGIN_LIMIT = 3;

export function request(obj: any = {}): Promise<object> {
  return new Promise((resolve, reject) => {
    checkSession()
      .then(() => {
        const session = wx.getStorageSync(SESSION_KEY);
        const { url, data, method, header, dataType } = obj;
        if (method === "POST") {
          header["content-type"] = "application/x-www-form-urlencoded";
        }
        let tryLoginCount = obj.tryLoginCount || 0;
        // 如果需要通过 data 把登录态 sessionId 带上
        const dataWithSession = { ...data, [SESSION_KEY]: session };
        console.log("check session:", dataWithSession);
        wx.request({
          url,
          data: dataWithSession,
          method,
          header,
          dataType,
          success: (res: any) => {
            if (res.statusCode === 200) {
              const dataResponse: ICommonResponse = res.data;
              console.log("dataResponse:", dataResponse);
              // 登陆态失效特定错误码判断，且重试次数未达到上限
              if (
                LOGIN_FAIL_CODES.indexOf(dataResponse.return_code) > -1 &&
                tryLoginCount < TRY_LOGIN_LIMIT
              ) {
                wx.removeStorageSync(SESSION_KEY); // 清除本地缓存
                console.log("doLogin:", obj);
                doLogin().then(() => {
                  obj.tryLoginCount = ++tryLoginCount;
                  request(obj)
                    .then(response => {
                      dealWithCode({ response, reject, resolve });
                    })
                    .catch(err => {
                      reject(err);
                    });
                });
              } else {
                dealWithCode({ response: res, reject, resolve });
              }
            } else {
              reject(res);
            }
          },
          fail: err => {
            reject(err);
          }
        });
      })
      .catch(err => {
        reject(err);
      });
  });
}

interface IDealWithCodeOption {
  response: any;
  reject: (res: any) => void;
  resolve: (err: any) => void;
}
export function dealWithCode({
  response,
  reject,
  resolve
}: IDealWithCodeOption) {
  const dataResponse: ICommonResponse = response.data;
  // 此处用作业务错误码判断和处理
  if (dataResponse.return_code === 0) {
    resolve(response);
  } else {
    wx.showModal({
      title: "接口请求出错",
      showCancel: false,
      content: dataResponse.return_msg + `(${dataResponse.return_code})`
    });
    reject(dataResponse);
  }
}
