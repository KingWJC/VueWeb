import "./styles";
import "./view";

import Vue from "vue";
import RegisterForm from "./components/RegisterForm";
import QaBreadcrumb from "__libs/components/QaBreadcrumb";
import uploader from "vue-simple-uploader";
Vue.use(uploader);

new Vue({
  el: "qa-breadcrumb",
  render: (fn) => fn(QaBreadcrumb)
});

new Vue({
  el: "register-form",
  render: (fn) => fn(RegisterForm)
});
