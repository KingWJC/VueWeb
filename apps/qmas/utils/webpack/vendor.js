import createVendor from "@@arch/webpack/entries/create-vendor";
import * as config from "../../config";
import sharedRules from "./rules/shared-rules";
import vendorRules from "./rules/vendor-rules";

const vendorConfig = createVendor({
  config,
  sharedRules,
  vendorRules
});

export default vendorConfig;
