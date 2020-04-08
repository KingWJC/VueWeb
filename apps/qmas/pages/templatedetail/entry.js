import "./styles";
import "./view";

import Vue from "vue";
// import TemplateDetail from "./components/TemplateDetail";
import GlobalHeader from "__libs/components/GlobalHeader";
import QaBreadcrumb from "__libs/components/QaBreadcrumb";
// import UploadExample from "./components/UploadExample";
import TemplateDetail from "./components/TemplateDetail";
import store from "__libs/js/vuex";
import uploader from "vue-simple-uploader";
Vue.use(uploader);

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
  el: "template-detail",
  render: (fn) => fn(TemplateDetail)
});
// new Vue({
//   el: "upload-example",
//   render: (fn) => fn(UploadExample)
// });
