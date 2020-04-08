import "./styles";
import "./view";

import Vue from "vue";
import UserInfo from "./components/UserInfo";
import GlobalHeader from "__libs/components/GlobalHeader";
import QaBreadcrumb from "__libs/components/QaBreadcrumb";
import store from "__libs/js/vuex";
import UserInfoFilter from "./components/UserInfoFilter";

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
  el: "user-info-filter",
  render: (fn) => fn(UserInfoFilter)
});

new Vue({
  el: "user-info",
  render: (fn) => fn(UserInfo)
});
