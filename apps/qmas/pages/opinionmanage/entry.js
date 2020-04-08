import "./styles";
import "./view";

import Vue from "vue";
import GlobalHeader from "__libs/components/GlobalHeader";
import QaBreadcrumb from "__libs/components/QaBreadcrumb";
import OpinionFilter from "./components/OpinionFilter";
import OpinionManage from "./components/OpinionManage";
import OpinionView from "./components/OpinionView";
import store from "__libs/js/vuex";
import VueRouter from "vue-router";
Vue.use(VueRouter);
import ElementUI from "element-ui";
Vue.use(ElementUI);

const router = new VueRouter({
  mode: "history",
  routes: [
    {
      name: "opinion-manage",
      path: "/OpinionManage",
      meta: { name: "main" },
      components: {
        filter: OpinionFilter,
        manage: OpinionManage
      }
    },
    {
      path: "",
      redirect: "/OpinionManage"
    }
  ]
});
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
  el: "opinion-view",
  router,
  render: (fn) => fn(OpinionView)
});
