import "__libs/scss/base";

import Vue from "vue";
import Axios from "axios";
import Config from "__libs/js/modules/config";
import VueConfig from "__shared-libs/js/vue/plugins/config";
import VuePagePayload from "__shared-libs/js/vue/plugins/page-payload";
// 引入到 base.js 的包，无论用不用到，都是要被打包到一起的，所以，这里忽略 eslint 的
// 未使用变量规则
// eslint-disable-next-line no-unused-vars
import EventBus from "__shared-libs/js/vue/eventbus";
import VueDialogs from "__shared-libs/js/vue/plugins/dialogs";
import VueSelectDropdownV2 from "__shared-libs/js/vue/plugins/select-dropdown-v2";
import VueTeleporter from "__shared-libs/js/vue/plugins/teleporter";
import VueTooltipsDirective from "__shared-libs/js/vue/plugins/tooltips";
import VueShowNotice from "__shared-libs/js/vue/plugins/show-notice";
import VueLoading from "__shared-libs/js/vue/plugins/loading";
import VueLoadingAnimation from "__shared-libs/js/vue/plugins/loading-animation";
// 静态预加载路由表
import "__app/routes";
// 静态预加载跨项目共享颜色表（其他页面不用再编译）
import "__shared-libs/js/modules/color-list";
// 静态预加载应用颜色表（其他页面不用再编译）
import "__libs/js/modules/color-list";

// set up axios global api token
Axios.interceptors.request.use(
  function(cfg) {
    if (Config.USER) {
      cfg.headers.Authorization = `Bearer ${Config.USER.Token}`;
    }

    return cfg;
  },
  function() {
    // failed to setup api token, please check
    // NO-OP
  }
);

Axios.interceptors.response.use(function(res) {
  // code 为9999 token过期  跳转登陆页
  if (res.data && res.data.Code === 9999) {
    window.location.href = Config.OUT_URL;
  }

  return res;
});

Vue.use(VueConfig, Config);
Vue.use(VuePagePayload, PAGE_PAYLOAD);
Vue.use(VueShowNotice);
Vue.use(VueDialogs);
Vue.use(VueSelectDropdownV2);
Vue.use(VueTeleporter);
Vue.use(VueTooltipsDirective);
Vue.use(VueLoading);
Vue.use(VueLoadingAnimation);
