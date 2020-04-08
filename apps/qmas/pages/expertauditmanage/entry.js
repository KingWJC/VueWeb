import "./styles";
import "./view";

import Vue from "vue";
import GlobalHeader from "__libs/components/GlobalHeader";
import QaBreadcrumb from "__libs/components/QaBreadcrumb";
import ExpertAuditFilter from "./components/ExpertAuditFilter";
import ExpertAuditManage from "./components/ExpertAuditManage";
import ExpertAuditProgress from "./components/ExpertAuditProgress";
import ExpertAuditView from "./components/ExpertAuditView";
import store from "__libs/js/vuex";
import VueRouter from "vue-router";
Vue.use(VueRouter);

const router = new VueRouter({
  routes: [
    {
      name: " expert-audit-manage",
      path: "/expertAuditManage",
      meta: { name: "main" },
      components: {
        filter: ExpertAuditFilter,
        manage: ExpertAuditManage
      }
    },
    {
      name: "expert-audit-progress",
      path: "/expertAuditProgress",
      meta: { name: "progress" },
      component: ExpertAuditProgress
    },
    {
      path: "",
      redirect: "/expertAuditManage"
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
