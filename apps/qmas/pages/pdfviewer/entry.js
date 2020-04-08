import "./styles";
import "./view";

import Vue from "vue";
import PdfViewer from "./components/PdfViewer";

new Vue({
  el: "pdf-viewer",
  render: (fn) => fn(PdfViewer)
});
