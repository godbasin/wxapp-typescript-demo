import * as VLog from "../utils/log";
/**
 * 本 Behavior 会在小程序 methods 中每个方法调用前添加一个 Log 说明
 * 需要在 Component 的 data 属性中添加 PAGE_NAME，用于描述当前页面
 */

export default Behavior({
  lifetimes: {
    attached() {
      // 页面 onLoad 的时候同步一下 globalCount
      // console.log(this)
    }
  },
  definitionFilter(defFields) {
    Object.keys(defFields.methods || {}).forEach(methodName => {
      const originMethod = defFields.methods![methodName];
      defFields.methods![methodName] = function(ev, ...args) {
        if (ev && ev.target && ev.currentTarget && ev.currentTarget.dataset) {
          // 如果是事件类型，则只需要记录 dataset 数据
          VLog.RUN(
            defFields.data!.PAGE_NAME,
            `${methodName} invoke, event dataset = `,
            ev.currentTarget.dataset,
            "params = ",
            ...args
          );
        } else {
          // 其他情况下，则都记录日志
          VLog.RUN(
            defFields.data!.PAGE_NAME,
            `${methodName} invoke, params = `,
            ev,
            ...args
          );
        }
        originMethod.call(this, ev, ...args);
      };
    });
  }
});
