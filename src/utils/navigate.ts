import { getLogger } from "./log";
import wxp from "./wxp";
import { objectCopy, addUrlParams, getRandomId } from "./util";
const logger = getLogger("navigate");

// 处理是否有当前路由
function matchOriginPath(originPageUrl: string) {
  let currentPages = getCurrentPages();
  const currentPage = currentPages[currentPages.length - 1].route;
  // 判断是否设置了特定页面才进行跳转
  // 如果设置了，判断当前页面是否特定页面，是才跳转
  // 用于判断当前页面是否已经被跳转走（用户手动关闭等）
  const isMatch =
    !originPageUrl ||
    (originPageUrl && currentPage.indexOf(originPageUrl) > -1);
  if (!isMatch) {
    logger.ERROR(
      "matchOriginPath do not match",
      `currentPage: ${currentPage}, originPageUrl: ${originPageUrl}`
    );
  }
  return isMatch;
}

let globalPageParams = undefined; // 全局页面跳转参数
let globalPageParamsId: any = undefined; // 全局页面跳转参数Id，用于标识某一次跳转的数据

interface IOptions {
  /* url参数，在URL中体现 */
  urlParams?: object;
  /* 页面参数，需要从 getPageParams 中获取 */
  pageParams?: object;
}

// 跳转时参数处理
function mangeUrl(url, options: IOptions = {}) {
  const { urlParams, pageParams } = options;

  // url参数处理
  if (urlParams) {
    url = addUrlParams(url, urlParams);
  }

  // 页面参数处理
  if (pageParams) {
    globalPageParams = objectCopy(pageParams);
    globalPageParamsId = getRandomId();
    url = addUrlParams(url, { randomId: globalPageParamsId });
  } else {
    globalPageParams = undefined;
    globalPageParamsId = undefined;
  }
  return url;
}

/**
 * 跳转到页面
 * @param {object} url 要跳转的页面地址
 * @param {object} options 要携带的参数信息
 * @param {object} originPageUrl 原始页面地址，用于判断来源是否符合
 */
export async function navigateTo(
  url: string,
  options: IOptions = {},
  originPageUrl?: string
) {
  url = mangeUrl(url, options);

  // 不符合源页面条件则不跳转
  if (!matchOriginPath(originPageUrl!)) {
    logger.RUN("navigateTo", "originPageUrl != currentPage, return");
    return Promise.resolve();
  }
  console.log(url);
  return await wxp.navigateTo({ url });
}

/**
 * 重定向到页面
 * @param {object} url 要跳转的页面地址
 * @param {object} options 要携带的参数信息
 * @param {object} originPageUrl 原始页面地址，用于判断来源是否符合
 */
export async function redirectTo(
  url: string,
  options: IOptions = {},
  originPageUrl?: string
) {
  url = mangeUrl(url, options);

  // 不符合源页面条件则不跳转
  if (!matchOriginPath(originPageUrl!)) {
    logger.RUN("redirectTo", "originPageUrl != currentPage, return");
    return Promise.resolve();
  }
  return await wxp.redirectTo({ url });
}

/**
 * 回退到前页
 * @param {number} delta 回退的页面数量，默认为1，上一页
 * @param {object} originPageUrl 原始页面地址，用于判断来源是否符合
 */
export async function navigateBack(delta = 1, originPageUrl?: string) {
  // 不符合源页面条件则不跳转
  if (!matchOriginPath(originPageUrl!)) {
    logger.RUN("navigateBack", "originPageUrl != currentPage, return");
    return Promise.resolve();
  }
  return await wxp.navigateBack({ delta });
}

/**
 * 关闭所有页面，打开到应用内的某个页面
 * @param {object} url 要跳转的页面地址
 * @param {object} options 要携带的参数信息
 * @param {object} originPageUrl 原始页面地址，用于判断来源是否符合
 */
export async function reLaunch(
  url: string,
  options: IOptions = {},
  originPageUrl?: string
) {
  url = mangeUrl(url, options);

  // 不符合源页面条件则不跳转
  if (!matchOriginPath(originPageUrl!)) {
    logger.RUN("reLaunch", "originPageUrl != currentPage, return");
    return Promise.resolve();
  }
  return await wxp.reLaunch({ url });
}

/**
 * 获取页面传参
 */
export function getPageParams(randomId) {
  if (globalPageParamsId === randomId) {
    return globalPageParams || {};
  }
  return {};
}

/**
 * 清除页面传参
 */
export function clearPageParams() {
  globalPageParams = undefined;
}
