import globalDataBehavior from "../../behaviors/globaldata-behavior";
import { navigateTo } from "../../utils/navigate";
import autologBehavior from "../../behaviors/autolog-behavior";
const PAGE_NAME = "global-data";

Component({
  behaviors: [globalDataBehavior, autologBehavior],
  data: {
    PAGE_NAME
  },
  methods: {
    onTap() {
      navigateTo("/pages/form/form");
    }
  }
});
