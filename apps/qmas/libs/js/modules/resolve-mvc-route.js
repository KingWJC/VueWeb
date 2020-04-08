import resolvePath from "__shared-libs/js/modules/resolve-path";
import { mvcRoutes } from "__app/routes";

/**
 *  解析一个 mvc 路由地址(并不能解析前端路由部分！需要手动解析)
 *
 *  @params {String} routeName  路由名称
 *  @params {Object:optional} params  路由参数(可选)
 */
export default (routeName, params) => {
  let mvcRoute = mvcRoutes[routeName];

  if (!mvcRoute) {
    return null;
  }

  // /UnGrPatientDetail/:PatientNo ->
  // /UnGrPatientDetail/1232323
  return resolvePath(mvcRoute, params);
};
