import loaderUtils from "loader-utils";

export default function() {
  const callback = this.async();
  const options = loaderUtils.getOptions(this) || {};

  const mvcRoutes = Object.keys(options.mvcRoutes).reduce(
    (tmpMap, curPageId) => {
      tmpMap[curPageId] = options.mvcRoutes[curPageId].route;

      return tmpMap;
    },
    {}
  );

  const apiRoutes = Object.keys(options.apiRoutes).reduce(
    (tmpMap, curApiId) => {
      tmpMap[curApiId] = options.apiRoutes[curApiId].route;

      return tmpMap;
    },
    {}
  );

  // 按2个空格缩进输出路由表
  const mvcRoutesJson = JSON.stringify(mvcRoutes, null, 2);
  const apiRoutesJson = JSON.stringify(apiRoutes, null, 2);

  callback(
    null,
    `module.exports.mvcRoutes = ${mvcRoutesJson};
    module.exports.apiRoutes = ${apiRoutesJson};`
  );
}
