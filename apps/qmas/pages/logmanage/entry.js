import "./styles";
import "./view";

import Vue from "vue";
import GlobalHeader from "__libs/components/GlobalHeader";
import QaBreadcrumb from "__libs/components/QaBreadcrumb";
import LogFilter from "./components/LogFilter";
import LogInfo from "./components/LogInfo";
import store from "__libs/js/vuex";

import ElementUI from "element-ui";
Vue.use(ElementUI);

// 注意保持和 liquid 内组件挂载点的顺序完全一样
new Vue({
  el: "global-header",
  store,
  render: (fn) => fn(GlobalHeader)
});

new Vue({
  el: "qa-breadcrumb",
  render: (fn) => fn(QaBreadcrumb)
});

new Vue({
  el: "log-filter",
  render: (fn) => fn(LogFilter)
});

new Vue({
  el: "log-info",
  render: (fn) => fn(LogInfo)
});
