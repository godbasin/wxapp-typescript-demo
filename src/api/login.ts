// 登录接口协议
import { API } from "../config/cgi-config";
import { SESSION_KEY } from "../config/global-config";

interface ILoginRequest {
  appid?: string;
  js_code: string;
  skey?: string;
}

interface ILoginResponse {
  return_code: number;
  return_msg: string;
  skey: string;
  return_err_type: string;
}

let isLogining = false;

export function doLogin(): Promise<string> {
  return new Promise((resolve, reject) => {
    const session = wx.getStorageSync(SESSION_KEY);
    if (session) {
      // 缓存中有 session
      resolve();
    } else if (isLogining) {
      // 正在登录中，请求轮询稍后，避免重复调用登录接口
      setTimeout(() => {
        doLogin()
          .then(res => {
            resolve(res);
          })
          .catch(err => {
            reject(err);
          });
      }, 500);
    } else {
      isLogining = true;
      wx.login({
        success: res => {
          if (res.code) {
            const reqData: ILoginRequest = {
              js_code: res.code
            };
            wx.request({
              url: API.login,
              data: reqData,
              header: { "content-type": "application/x-www-form-urlencoded" },
              method: "POST",
              success: (resp: any) => {
                const data: ILoginResponse = resp.data;
                isLogining = false;
                // 保存登录态
                if (data.return_code === 0) {
                  wx.setStorageSync(SESSION_KEY, (data as any)[SESSION_KEY]);
                  resolve();
                } else {
                  wx.showToast({ title: data.return_msg, icon: "none" });
                  reject(data.return_msg);
                }
              },
              fail: err => {
                // 登录失败，解除锁，防止死锁
                isLogining = false;
                reject(err);
              }
            });
          } else {
            // 登录失败，解除锁，防止死锁
            isLogining = false;
            reject();
          }
        },
        fail: err => {
          // 登录失败，解除锁，防止死锁
          isLogining = false;
          reject(err);
        }
      });
    }
  });
}
