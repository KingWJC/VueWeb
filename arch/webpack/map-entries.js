import { NODE_ENV } from "@@arch/env";

// 遍历 mvc 路由，建立 webpack entry 表(每个页面一个entry)
export default (mvcRoutes) => {
  return Object.keys(mvcRoutes).reduce(
    (acc, routeId) => {
      let routeObj = mvcRoutes[routeId];

      // 如果当前路由是一个 entry，才注册
      if (routeObj.isEntry) {
        // 如果显示指定了 entry 且尚未注册
        if (routeObj.entryName) {
          if (!acc[routeObj.entryName]) {
            acc[routeObj.entryName] = [`./pages/${routeObj.entryName}/entry`];
          }
        } else {
          acc[routeId] = [`./pages/${routeId}/entry`];
        }
      }

      return acc;
    },
    {
      base: [
        "./libs/js/base",

        ...(NODE_ENV === "production"
          ? []
          : ["webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000"])
      ]
    }
  );
};
