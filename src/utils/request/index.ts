import { doLogin } from "./login";
import { checkSession } from "./check-session";
import {
  SESSION_KEY,
  APPID,
  LOGIN_FAIL_CODES
} from "../../config/global-config";

const TRY_LOGIN_LIMIT = 3;

export function request(obj: any = {}): Promise<object> {
  return new Promise((resolve, reject) => {
    checkSession()
      .then(() => {
        let session = wx.getStorageSync(SESSION_KEY);
        const { url, data, method, header, dataType } = obj;
        let tryLoginCount = obj.tryLoginCount || 0;
        // 如果需要通过 data 把登录态 sessionId 带上
        const dataWithSession = {
          ...data,
          [SESSION_KEY]: session,
          appid: APPID
        };
        wx.request({
          url,
          data: dataWithSession,
          method,
          header,
          dataType,
          success: (res: any) => {
            if (res.statusCode === 200) {
              const data = res.data;
              // 登陆态失效特定错误码判断，且重试次数未达到上限
              if (
                LOGIN_FAIL_CODES.indexOf(data.return_code) > -1 &&
                tryLoginCount < TRY_LOGIN_LIMIT
              ) {
                doLogin().then(() => {
                  obj.tryLoginCount = ++tryLoginCount;
                  request(obj)
                    .then(res => {
                      resolve(res);
                    })
                    .catch(err => {
                      reject(err);
                    });
                });
              } else {
                resolve(res);
              }
            } else {
              reject(res);
            }
          },
          fail: function(err) {
            reject(err);
          }
        });
      })
      .catch(err => {
        reject(err);
      });
  });
}
