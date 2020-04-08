import * as vendorRules from "@@arch/webpack/rules/vendor";
import * as config from "../../../config";

export default [
  vendorRules.vendorScss(),
  vendorRules.echarts(config),
  vendorRules.babelHelpers(config),
  vendorRules.es6Shim(config),
  vendorRules.vue(config)
];
