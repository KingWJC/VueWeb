import "./styles";
import "./view";

import Vue from "vue";
import GlobalHeader from "__libs/components/GlobalHeader";
import QaBreadcrumb from "__libs/components/QaBreadcrumb";
import DictFilter from "./components/DictFilter";
import DictManage from "./components/DictManage";
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
  el: "dict-filter",
  render: (fn) => fn(DictFilter)
});

new Vue({
  el: "dict-manage",
  render: (fn) => fn(DictManage)
});
