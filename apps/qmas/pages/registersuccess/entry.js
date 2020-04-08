import "./styles";
import "./view";

import Vue from "vue";
import RegisterSuccess from "./components/RegisterSuccess";
import QaBreadcrumb from "__libs/components/QaBreadcrumb";

// 注意保持和 liquid 内组件挂载点的顺序完全一样

new Vue({
  el: "qa-breadcrumb",
  render: (fn) => fn(QaBreadcrumb)
});

new Vue({
  el: "register-success",
  render: (fn) => fn(RegisterSuccess)
});
