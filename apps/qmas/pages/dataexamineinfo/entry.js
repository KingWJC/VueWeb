import "./styles";
import "./view";

import Vue from "vue";
import GlobalHeader from "__libs/components/GlobalHeader";
import QaBreadcrumb from "__libs/components/QaBreadcrumb";
import DataExamineDetail from "__libs/components/examinedetail/DataExamineDetail";
import DataExamineView from "./components/DataExamineView";
import DataExamineFilter from "./components/DataExamineFilter";
import DataExamineInfo from "./components/DataExamineInfo";

import store from "__libs/js/vuex";
import VueRouter from "vue-router";
import ElementUI from "element-ui";
Vue.use(ElementUI);
Vue.use(VueRouter);

const router = new VueRouter({
  routes: [
    {
      name: " data-eaxmine-info",
      path: "/dataExamineInfo",
      meta: { name: "main" },
      components: {
        filter: DataExamineFilter,
        manage: DataExamineInfo
      }
    },
    {
      name: "data-eaxmine-detail",
      path: "/dataExamineDetail",
      meta: { name: "progress" },
      component: DataExamineDetail
    },
    {
      path: "",
      redirect: "/dataExamineInfo"
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
  el: "data-examine-view",
  router,
  render: (fn) => fn(DataExamineView)
});
