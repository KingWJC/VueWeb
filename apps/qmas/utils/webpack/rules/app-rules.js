import * as appRules from "@@arch/webpack/rules/app";
import * as config from "../../../config";
import { mvcRoutes, apiRoutes } from "../../../routes";

export default [
  appRules.liquid(config, mvcRoutes),
  appRules.pageScss(),
  appRules.baseScss(),
  appRules.plainJs(config),
  appRules.routes({
    mvcRoutes,
    apiRoutes
  }),
  appRules.asyncJs(config),
  appRules.vue(config)
];
