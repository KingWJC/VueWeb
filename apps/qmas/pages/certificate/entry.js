import "./styles";
import "./view";

import Vue from "vue";
import CerApply from "__libs/components/examinedetail/CerApply";
import CerView from "./components/CerView";
import CerDetail from "./components/CerDetail";
import CerList from "./components/CerList";
import CertificationDetail from "__libs/components/examinedetail/CertificationDetail";
import MaterialExamineDetail from "__libs/components/examinedetail/MaterialExamineDetail";
import DataExamineDetail from "__libs/components/examinedetail/DataExamineDetail";
import SceneExamineDetail from "__libs/components/examinedetail/SceneExamineDetail";
import GlobalHeader from "__libs/components/GlobalHeader";
import QaBreadcrumb from "__libs/components/QaBreadcrumb";
import store from "__libs/js/vuex";
import VueRouter from "vue-router";
Vue.use(VueRouter);
import uploader from "vue-simple-uploader";
Vue.use(uploader);
import ElementUI from "element-ui";
Vue.use(ElementUI);

const router = new VueRouter({
  // mode: "history",导致无法显示路由组件。
  routes: [
    {
      name: "cer-detail",
      path: "/CerDetail",
      component: CerDetail
    },
    {
      name: "cer-apply",
      path: "/CerApply",
      component: CerApply
    },
    {
      name: "cer-list",
      path: "/CerList",
      component: CerList
    },
    {
      name: "certification-detail",
      path: "/CertificationDetail",
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
  el: "cer-view",
  router,
  render: (fn) => fn(CerView)
});
