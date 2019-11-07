//logs.js
import { formatTime } from "../../utils/util";
import globalDataBehavior from "../../common/behavior/globaldata-behavior";
const computedBehavior = require("miniprogram-computed");

Component({
  behaviors: [computedBehavior, globalDataBehavior],
  data: {
    logs: [] as string[]
  },
  computed: {
    logsAfterComputed: function() {
      // 计算属性同样挂在 data 上，每当进行 setData 的时候会重新计算
      // 比如此字段可以通过 this.data.b 获取到
      return this.data.logs.map((x: string) => {
        return {
          log: x,
          logAfterCompute: x + "logAfterCompute"
        };
      });
    }
  },
  methods: {
    onLoad() {
      console.log("onLoad");
      this.setData({
        logs: (wx.getStorageSync("logs") || []).map((log: number) => {
          return formatTime(new Date(log));
        })
      });
    }
  }
});
