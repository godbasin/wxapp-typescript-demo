import { doLogin } from "./login";
import { SESSION_KEY } from "../../config/global-config";

let isCheckingSession = false;
let isSessionFresh = false;

export function checkSession(): Promise<string> {
  return new Promise((resolve, reject) => {
    const session = wx.getStorageSync(SESSION_KEY);
    if (isCheckingSession) {
      setTimeout(() => {
        checkSession()
          .then(res => {
            resolve(res);
          })
          .catch(err => {
            reject(err);
          });
      }, 500);
    } else if (!isSessionFresh && session) {
      isCheckingSession = true;
      wx.checkSession({
        success: () => {
          // session_key 未过期，并且在本生命周期一直有效
          isSessionFresh = true;
          resolve();
        },
        fail: () => {
          // session_key 已经失效，需要重新执行登录流程
          wx.removeStorage({
            key: "skey",
            complete: () => {
              doLogin()
                .then(() => {
                  resolve();
                })
                .catch(err => {
                  reject(err);
                });
            }
          });
        },
        complete: () => {
          isCheckingSession = false;
        }
      });
    } else {
      doLogin()
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    }
  });
}
