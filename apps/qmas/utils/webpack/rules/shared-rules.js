import * as sharedRules from "@@arch/webpack/rules/shared";
import * as config from "../../../config";

export default [
  sharedRules.plainCss(),
  sharedRules.images(config),
  sharedRules.fonts(config),
  sharedRules.plainJs(config)
];
