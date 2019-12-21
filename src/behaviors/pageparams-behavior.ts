import { getPageParams } from "../utils/navigate";
/**
 * 本 Behavior 配合 /util/navigate.ts 的跳转参数使用
 * 如果使用 pageParams 来跳转传参，使用该 behavior 可以自动更新到 data 中
 */

export default Behavior({
  data: {
    pageParams: {}
  },
  properties: {
    randomid: String // 随机 ID，用于获取页面参数
  },
  lifetimes: {
    attached() {
      // 页面 onLoad 的时候同步一下 pageParams
      // 获取其他参数
      const randomid = this.data.randomid;
      if (randomid) {
        const pageParams = getPageParams(randomid);
        // 如果 data 中有设置该字段，则自动覆盖
        const newData = {};
        Object.keys(pageParams).forEach(key => {
          if (this.data[key] !== undefined) {
            newData[key] = pageParams[key];
          }
        });
        this.setData({ ...newData, pageParams });
      }
    }
  }
});
