import "./styles";
import "./view";

import Vue from "vue";
import CertificateView from "./components/CertificateView";
import GlobalHeader from "__libs/components/GlobalHeader";
import QaBreadcrumb from "__libs/components/QaBreadcrumb";
import store from "__libs/js/vuex";
import VueRouter from "vue-router";
Vue.use(VueRouter);

import htmlToPdf from "__shared-libs/js/modules/htmlToPdf";
Vue.use(htmlToPdf);

const router = new VueRouter({
  // mode: "history",导致无法显示路由组件。
  routes: []
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
  el: "certificate-view",
  router,
  render: (fn) => fn(CertificateView)
});
