import createBase from "@@arch/webpack/entries/create-base";
import mapEntries from "@@arch/webpack/map-entries";
import { mvcRoutes } from "../../routes";
import * as config from "../../config";
import sharedRules from "./rules/shared-rules";
import appRules from "./rules/app-rules";

const baseConfig = createBase({
  // 遍历 mvc 路由，建立 webpack entry 表(每个页面一个entry)
  entries: mapEntries(mvcRoutes),
  config,
  sharedRules,
  appRules
});

export default baseConfig;
