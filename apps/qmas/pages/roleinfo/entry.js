import "./styles";
import "./view";

import Vue from "vue";
import RoleInfo from "./components/RoleInfo";
import GlobalHeader from "__libs/components/GlobalHeader";
import QaBreadcrumb from "__libs/components/QaBreadcrumb";
import store from "__libs/js/vuex";

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
  el: "role-info",
  render: (fn) => fn(RoleInfo)
});
