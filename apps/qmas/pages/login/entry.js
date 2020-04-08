import "./styles";
import "./view";

import Vue from "vue";
import QaLoginForm from "./components/QaLoginForm";

// 注意保持和 liquid 内组件挂载点的顺序完全一样
new Vue({
  el: "qa-login-form",
  render: (fn) => fn(QaLoginForm)
});
