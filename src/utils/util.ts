import { getLogger } from "./log";
const logger = getLogger("util");

/**
 * 为一个 async 函数添加单例保护功能功能
 * @param {*} asyncFunc
 */
export function singleInstancePromise(asyncFunc) {
  let promiseInstance = undefined;
  return function(this: any, ...args) {
    if (promiseInstance) {
      return promiseInstance;
    }
    promiseInstance = asyncFunc
      .bind(this)(...args)
      .then(resp => {
        promiseInstance = undefined;
        return Promise.resolve(resp);
      })
      .catch(e => {
        promiseInstance = undefined;
        return Promise.reject(e);
      });
    return promiseInstance;
  };
}

export function getLaunchOptions(): WechatMiniprogram.LaunchOptionsApp {
  try {
    const options = wx.getLaunchOptionsSync();
    return options;
  } catch (error) {
    logger.ERROR("getLaunchOptions error", error);
    return {} as any;
  }
}

export function getRandomId() {
  // 时间戳（9位） + 随机串（10位）
  return (
    Date.now().toString(32) +
    Math.random()
      .toString(32)
      .substring(2)
  );
}

/**
 * 深拷贝
 * @param {object} obj 需要copy的对象
 */
export function objectCopy(obj) {
  if (typeof obj == "undefined") {
    return obj;
  }
  return JSON.parse(JSON.stringify(obj));
}

/**
 * 给URL添加参数
 * @param {object} obj 需要copy的对象
 */
export function addUrlParams(url: string = "", params) {
  url += url.indexOf("?") >= 0 ? "&" : "?";
  url += Object.keys(params)
    .map(key => {
      return `${key}=${params[key]}`;
    })
    .join("&");
  return url;
}

/**
 * 将JSON转换成字符串
 * @param {object} obj 需要转换的对象
 */
export function encodeJSON(obj: object) {
  try {
    return encodeURIComponent(JSON.stringify(obj));
  } catch (error) {
    logger.ERROR("encodeJSON error", error);
    return "";
  }
}

/**
 * 将字符串恢复成JSON
 * @param {string} str 需要转换的字符串
 */
export function decodeJSON(str: string) {
  try {
    return JSON.parse(decodeURIComponent(str));
  } catch (error) {
    logger.ERROR("decodeJSON error", error);
    return "";
  }
}
