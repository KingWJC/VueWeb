import "./styles";
import "./view";

import Vue from "vue";
import GlobalHeader from "__libs/components/GlobalHeader";
import QaBreadcrumb from "__libs/components/QaBreadcrumb";
import MaterialExamineDetail from "__libs/components/examinedetail/MaterialExamineDetail";
import MaterialExamineView from "./components/MaterialExamineView";
import MaterialExamineFilter from "./components/MaterialExamineFilter";
import MaterialExamineInfo from "./components/materialExamineInfo";

import store from "__libs/js/vuex";
import VueRouter from "vue-router";
import ElementUI from "element-ui";
Vue.use(ElementUI);
Vue.use(VueRouter);
import uploader from "vue-simple-uploader";
Vue.use(uploader);

const router = new VueRouter({
  routes: [
    {
      name: " material-eaxmine-info",
      path: "/materialExamineInfo",
      meta: { name: "main" },
      components: {
        filter: MaterialExamineFilter,
        manage: MaterialExamineInfo
      }
    },
    {
      name: "material-eaxmine-detail",
      path: "/materialExamineDetail",
      meta: { name: "progress" },
      component: MaterialExamineDetail
    },
    {
      path: "",
      redirect: "/materialExamineInfo"
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
  el: "material-examine-view",
  router,
  render: (fn) => fn(MaterialExamineView)
});
