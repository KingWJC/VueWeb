import "./styles";
import "./view";

import Vue from "vue";
import OrgFilter from "./components/OrgFilter";
import OrgInfo from "./components/OrgInfo";
import OrgView from "./components/OrgView";
import OrgDetail from "./components/OrgDetail";
import GlobalHeader from "__libs/components/GlobalHeader";
import QaBreadcrumb from "__libs/components/QaBreadcrumb";
import store from "__libs/js/vuex";
import VueRouter from "vue-router";
Vue.use(VueRouter);
import uploader from "vue-simple-uploader";
Vue.use(uploader);

const router = new VueRouter({
  mode: "history",
  routes: [
    {
      name: "org-info",
      path: "/orginfo",
      meta: { name: "wjc" },
      components: {
        filter: OrgFilter,
        info: OrgInfo
      }
    },
    {
      name: "org-detail",
      path: "/OrgDetail",
      meta: { name: "lsy" },
      component: OrgDetail
    },
    {
      path: "",
      redirect: "/orginfo"
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

// 注意保持和 liquid 内组件挂载点的顺序完全一样
// new Vue({
//   el: "org-filter",
//   render: (fn) => fn(OrgFilter)
// });

new Vue({
  el: "org-view",
  router,
  render: (fn) => fn(OrgView)
});
