/**
 * 本 Behavior 会在小程序 data 添加 globalData 的属性，并且添加一个 setGlobalData 的方法，例子：
 * js: this.setGlobalData({hello: 'world'});
 * js: this.setGlobalDataAndStorage({hello: 'world'}); // 会写入缓存
 * wxml: {{ globalData.hello }}
 * watch: "globalData.hello": function(val, oldVal) {...}
 */

// globalDataStore 用来全局记录 globalData，为了跨页面同步 globalData 用
export let globalDataStore = {};
// 获取本地的 gloabalData 缓存
try {
  const gloabalData = wx.getStorageSync("gloabalData");
  // 有缓存的时候加上
  if (gloabalData) {
    globalDataStore = { ...gloabalData };
  }
} catch (error) {
  console.error("gloabalData getStorageSync error", "e =", error);
}

// globalCount 用来全局记录 setGlobalData 的调用次数，为了在 B 页面回到 A 页面的时候，
// 检查页面 __setGlobalDataCount 和 globalCount 是否一致来判断在 B 页面是否有 setGlobalData,
// 以此来同步 globalData
let globalCount = 0;

export default Behavior({
  data: {
    globalData: Object.assign({}, globalDataStore)
  },
  lifetimes: {
    attached() {
      // 页面 onLoad 的时候同步一下 globalCount
      (this as any).__setGlobalDataCount = globalCount;
      // 同步 globalDataStore 的内容
      (this as any).setData({
        globalData: Object.assign(
          {},
          (this as any).data.globalData || {},
          globalDataStore
        )
      });
    }
  },
  pageLifetimes: {
    show() {
      // 为了在 B 页面回到 A 页面的时候，检查页面 __setGlobalDataCount 和 globalCount 是否一致来判断在 B 页面是否有 setGlobalData
      if ((this as any).__setGlobalDataCount != globalCount) {
        // 同步 globalData
        (this as any).__setGlobalDataCount = globalCount;
        this.setGlobalData(Object.assign({}, globalDataStore));
      }
    }
  },
  methods: {
    // setGlobalData 实现，主要内容为将 globalDataStore 的内容设置进页面的 data 的 globalData 属性中。
    setGlobalData(obj: any) {
      globalCount = globalCount + 1;
      (this as any).__setGlobalDataCount =
        (this as any).__setGlobalDataCount + 1;
      obj = obj || {};
      let outObj = Object.keys(obj).reduce((sum: any, key) => {
        let _key = "globalData." + key;
        sum[_key] = obj[key];
        return sum;
      }, {});
      (this as any).setData(outObj, () => {
        globalDataStore = (this as any).data.globalData;
      });
    },
    // setGlobalDataAndStorage 实现，先调用 setGlobalData，然后存到 storage 里
    setGlobalDataAndStorage(obj: any) {
      this.setGlobalData(obj);
      try {
        let gloabalData = wx.getStorageSync("gloabalData");
        // 有缓存的时候加上
        if (gloabalData) {
          gloabalData = { ...gloabalData, ...obj };
        } else {
          gloabalData = { ...obj };
        }
        wx.setStorageSync("gloabalData", gloabalData);
      } catch (e) {
        console.error("gloabalData setStorageSync error", "e =", e);
      }
    }
  }
});
