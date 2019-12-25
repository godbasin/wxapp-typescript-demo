// import { getLogger } from "../../utils/log";
import autologBehavior from "../../behaviors/autolog-behavior";

const PAGE_NAME = "watch";
// const logger = getLogger(PAGE_NAME);

Component({
  behaviors: [autologBehavior],
  data: {
    PAGE_NAME,

    propA: 0
  },
  methods: {
    onUpdate() {
      this.setData!({
        propA: ++this.data.propA
      });
    }
  }
});
