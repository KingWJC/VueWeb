import "./styles";
import "./view";

import Vue from "vue";
import GlobalHeader from "__libs/components/GlobalHeader";
import QaBreadcrumb from "__libs/components/QaBreadcrumb";
import OpinionFeedBack from "./components/OpinionFeedBack";
import store from "__libs/js/vuex";
import VueRouter from "vue-router";
Vue.use(VueRouter);
import ElementUI from "element-ui";
Vue.use(ElementUI);

const router = new VueRouter({
  mode: "history",
  routes: [
    {
      name: "opinion-feedback",
      path: "/OpinionFeedBack",
      meta: { name: "main" },
      components: {
        view: OpinionFeedBack
      }
    },
    {
      path: "/",
      redirect: "/opinionfeedback"
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
  el: "opinion-feedback",
  router,
  render: (fn) => fn(OpinionFeedBack)
});
