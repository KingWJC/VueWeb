import path from "path";
import { to_json } from "./filters";
import createLiquidEngine from "./create-engine";
import registerLiquidFilters from "./register-filters";

export default (options) => {
  const { globalSession, outputPath, mvcRoutes, appPath } = options;

  // 建立引擎实例（用于当前 APP，每一个 APP都应该建立自己的实例，因为运行环境不一样，
  // 实例上可能使用不同的过滤器，不同的全局方法，等等）
  const liquidEngine = createLiquidEngine([
    path.join(outputPath, `liquids`),
    path.join(outputPath, `liquids/Shared`)
  ]);

  // 挂载 liquid filters
  registerLiquidFilters(liquidEngine, { to_json });

  // 使用session渲染liquid
  // @return {Promise} 渲染 liquid 返回 Promise 对象
  const renderLiquidFile = (tplPath, renderData) => {
    return liquidEngine.renderFile(tplPath, renderData).then((html) => {
      return html;
    });
  };

  // 渲染 liquid
  // @param routeId String 当前app下注册的mvc路由的id
  return (routeId) => {
    return new Promise((resolve) => {
      // 用于 liquid 渲染的全局数据
      let renderData = Object.assign({}, globalSession);

      // 尝试导入页面session，如果有，就使用
      import(path.join(appPath, `pages/${routeId}/session`)).then(
        (ssMod) => {
          let tmpData = ssMod.default;

          // 如果是一个函数，执行并使用结果(目前只支持同步函数)
          // 使用函数的好处是每次返回的数据都不一样，每次都是计算过的，可以增加仿真度
          if (typeof tmpData === "function") {
            tmpData = tmpData();
          }

          // 合并全局session和页面session
          renderData = Object.assign({}, renderData, tmpData);

          resolve(
            renderLiquidFile(
              `${mvcRoutes[routeId].liquidName}/Index`,
              renderData
            )
          );
        },
        () => {
          // 无论是否载入成功，我们都要渲染，至少全局session
          resolve(
            renderLiquidFile(
              `${mvcRoutes[routeId].liquidName}/Index`,
              renderData
            )
          );

          console.error(`failed to load session data for page ${routeId}`);
        }
      );
    });
  };
};
