import "./styles";
import "./view";

import Vue from "vue";
import GlobalHeader from "__libs/components/GlobalHeader";
import QaBreadcrumb from "__libs/components/QaBreadcrumb";
import SceneExamineDetail from "__libs/components/examinedetail/SceneExamineDetail";
import SceneExamineView from "./components/SceneExamineView";
import SceneExamineFilter from "./components/SceneExamineFilter";
import SceneExamineInfo from "./components/SceneExamineInfo";
import store from "__libs/js/vuex";
import VueRouter from "vue-router";
Vue.use(VueRouter);
import ElementUI from "element-ui";
Vue.use(ElementUI);
import uploader from "vue-simple-uploader";
Vue.use(uploader);

const router = new VueRouter({
  routes: [
    {
      name: " scene-eaxmine-info",
      path: "/sceneExamineInfo",
      meta: { name: "main" },
      components: {
        filter: SceneExamineFilter,
        manage: SceneExamineInfo
      }
    },
    {
      name: "scene-eaxmine-detail",
      path: "/sceneExamineDetail",
      meta: { name: "progress" },
      component: SceneExamineDetail
    },
    {
      path: "",
      redirect: "/sceneExamineInfo"
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
  el: "scene-examine-view",
  router,
  render: (fn) => fn(SceneExamineView)
});
