import "./styles";
import "./view";

import Vue from "vue";
import GlobalHeader from "__libs/components/GlobalHeader";
import QaBreadcrumb from "__libs/components/QaBreadcrumb";
import ProcessNavigation from "./components/ProcessNavigation";
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
      name: "process-navigation",
      path: "/processNavigation",
      meta: { name: "main" },
      component: ProcessNavigation
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
      redirect: "/processNavigation"
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
  el: "process-navigation",
  router,
  render: (fn) => fn(ProcessNavigation)
});
