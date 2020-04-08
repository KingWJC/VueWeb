import "./styles";
import "./view";

import Vue from "vue";
import GlobalHeader from "__libs/components/GlobalHeader";
import QaBreadcrumb from "__libs/components/QaBreadcrumb";
import CertificationDetail from "__libs/components/examinedetail/CertificationDetail";
import CertificationFilter from "./components/CertificationFilter";
import CertificationManage from "./components/CertificationManage";
import CertificationView from "./components/CertificationView";
import MaterialExamineDetail from "__libs/components/examinedetail/MaterialExamineDetail";
import DataExamineDetail from "__libs/components/examinedetail/DataExamineDetail";
import SceneExamineDetail from "__libs/components/examinedetail/SceneExamineDetail";
import CerApply from "__libs/components/examinedetail/CerApply";
import store from "__libs/js/vuex";
import VueRouter from "vue-router";
Vue.use(VueRouter);
import ElementUI from "element-ui";
Vue.use(ElementUI);

const router = new VueRouter({
  mode: "history",
  routes: [
    {
      name: "certification-manage",
      path: "/certificationManage",
      meta: { name: "main" },
      components: {
        filter: CertificationFilter,
        manage: CertificationManage
      }
    },
    {
      name: "certification-detail",
      path: "/certificationDetail",
      meta: { name: "detail" },
      component: CertificationDetail
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
      name: "cer-apply",
      path: "/cerApply",
      meta: { name: "cerapply" },
      component: CerApply
    },
    {
      path: "",
      redirect: "/certificationManage"
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
  el: "certification-view",
  router,
  render: (fn) => fn(CertificationView)
});
