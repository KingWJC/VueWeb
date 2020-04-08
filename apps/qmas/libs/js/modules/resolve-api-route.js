import resolvePath from "__shared-libs/js/modules/resolve-path";
import { apiRoutes } from "__app/routes";
import Config from "__libs/js/modules/config";

/**
 *  解析一个 api 路由地址
 *
 *  @params {String} apiName  api 名称
 *  @params {Object:optional} params  路由参数(可选)
 */
export default (apiName, params) => {
  let apiRoute = apiRoutes[apiName];

  if (!apiRoute) {
    return null;
  }

  // `${this.$config.API_PREFIX}/SdFeeEffect/${this.$pagePayload.SdId}/DRG` ->
  // /api/SdFeeEffect/100024/DRG
  let apiPath = resolvePath(apiRoute, params);

  return `${Config.API_PREFIX}${apiPath}`;
};
