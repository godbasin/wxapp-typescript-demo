//logs.js
const computedBehavior = require("miniprogram-computed");
import autologBehavior from "../../behaviors/autolog-behavior";
const PAGE_NAME = "logs";

Component({
  behaviors: [computedBehavior, autologBehavior],
  data: {
    PAGE_NAME,
    logs: [] as string[]
  },
  computed: {
    logsAfterComputed: function() {
      // 计算属性同样挂在 data 上，每当进行 setData 的时候会重新计算
      // 比如此字段可以通过 this.data.b 获取到
      return this.data.logs.map((x: string) => {
        return {
          logAfterCompute: x + "logAfterCompute"
        };
      });
    }
  },
  methods: {
    onLoad() {
      this.setData({
        logs: wx.getStorageSync("logs") || []
      });
    }
  }
});
