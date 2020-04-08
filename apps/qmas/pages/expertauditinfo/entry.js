import "./styles";
import "./view";

import Vue from "vue";
import GlobalHeader from "__libs/components/GlobalHeader";
import QaBreadcrumb from "__libs/components/QaBreadcrumb";
import ExpertAuditFilter from "./components/ExpertAuditFilter";
import ExpertAuditInfo from "./components/ExpertAuditInfo";
import ExpertAuditDetail from "./components/ExpertAuditDetail";
import ExpertAuditView from "./components/ExpertAuditView";
import MaterialExamineDetail from "__libs/components/examinedetail/MaterialExamineDetail";
import DataExamineDetail from "__libs/components/examinedetail/DataExamineDetail";
import SceneExamineDetail from "__libs/components/examinedetail/SceneExamineDetail";
import store from "__libs/js/vuex";
import VueRouter from "vue-router";
Vue.use(VueRouter);
import ElementUI from "element-ui";
Vue.use(ElementUI);

const router = new VueRouter({
  routes: [
    {
      name: " expert-audit-info",
      path: "/expertAuditInfo",
      meta: { name: "main" },
      components: {
        filter: ExpertAuditFilter,
        manage: ExpertAuditInfo
      }
    },
    {
      name: "expert-audit-detail",
      path: "/expertAuditDetail",
      meta: { name: "progress" },
      component: ExpertAuditDetail
    },
    {
      name: "material-eaxmine-detail",
      path: "/materialExamineDetail",
      meta: { name: "material" },
      component: MaterialExamineDetail
    },
    {
      name: "data-eaxmine-detail",
      path: "/dataExamineDetail",
      meta: { name: "data" },
      component: DataExamineDetail
    },
    {
      name: "scene-eaxmine-detail",
      path: "/sceneExamineDetail",
      meta: { name: "scene" },
      component: SceneExamineDetail
    },
    {
      path: "",
      redirect: "/expertAuditInfo"
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
  el: "expert-audit-view",
  router,
  render: (fn) => fn(ExpertAuditView)
});
