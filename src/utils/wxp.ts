interface GWxApiOpts<T, K> {
  success?: (callbackPayload: T) => any;
  fail?: (callbackPayload: K) => any;
}

type WxApiOpts<T, K, V> = { [X in keyof V]: V[X] } & GWxApiOpts<T, K>;

/**
 * 本方法将类似于 wx.request 等函数转化为 Promise 调用方式
 * 被转换的函数，该类型函数只接受一个 Object 类型参数，且必须具备 success 和 fail 回调。
 * 若参数里有success这种，就不会变成Promise
 */
export function promisify<T, K, V>(fn: (options: WxApiOpts<T, K, V>) => any) {
  return function(options?: WxApiOpts<T, K, V>): Promise<T> {
    return new Promise(
      (resolve: (val: T) => void, reject: (val: K) => void) => {
        const callbacks = {
          success: resolve,
          fail: reject
        };
        options = options || ({} as WxApiOpts<T, K, V>);
        let __options = Object.assign({}, options, callbacks) as WxApiOpts<
          T,
          K,
          V
        >;
        fn(__options);
      }
    );
  };
}

const wxp = {
  request: promisify(wx.request),
  checkSession: promisify(wx.checkSession),
  login: promisify(wx.login),
  navigateTo: promisify(wx.navigateTo),
  redirectTo: promisify(wx.redirectTo),
  navigateBack: promisify(wx.navigateBack),
  reLaunch: promisify(wx.reLaunch),
  getNetworkType: promisify(wx.getNetworkType),
  getSystemInfo: promisify(wx.getSystemInfo),
  showModal: promisify(wx.showModal)
};

export default wxp;
