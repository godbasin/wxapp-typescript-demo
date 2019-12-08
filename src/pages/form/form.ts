import globalDataBehavior from "../../behaviors/globaldata-behavior";
import autologBehavior from "../../behaviors/autolog-behavior";
const PAGE_NAME = "form";

Component({
  behaviors: [globalDataBehavior, autologBehavior],
  data: {
    PAGE_NAME,

    qq: "",
    date: "2016-09-01",
    phone: "",
    countryCodes: ["+86", "+80", "+84", "+87"],
    countryCodeIndex: 0,

    isAgree: false
  },
  methods: {
    // 点击保存到全局
    saveToGlobalData(e) {
      const { toStorage } = e.currentTarget.dataset;
      // 设置全局
      const { date, countryCodeIndex, qq, phone, isAgree } = this.data;
      const data = { date, countryCodeIndex, qq, phone, isAgree };
      if (toStorage) {
        // 存入Storage中
        (this as any).setGlobalDataAndStorage(data);
      } else {
        // 存入GlobalData中
        (this as any).setGlobalData(data);
      }
    },
    // 从 GlobalData 取入
    getGlobalData() {
      const { date, countryCodeIndex, qq, phone, isAgree } =
        this.data.globalData || ({} as any);
      this.setData({
        date,
        countryCodeIndex,
        qq,
        phone,
        isAgree
      });
    },
    formItemChange(e) {
      const { field } = e.currentTarget.dataset;
      this.setData({
        [`${field}`]: e.detail.value
      });
    },
    bindAgreeChange: function(e) {
      this.setData({
        isAgree: !!e.detail.value.length
      });
    }
  }
});
