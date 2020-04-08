import bootup from "@@arch/bootup";
import * as runtimeConfig from "../config";
import * as runtimeRoutes from "../routes";
import runtimeWebpackConfig from "./webpack/base";

bootup({
  runtimeWebpackConfig,
  runtimeConfig,
  runtimeRoutes
});
