/**
 *  resolve a path from given endpoint
 *
 *  @params {String} path  the given endpoint
 *  @params {Object} params  fields to be used to resolve the path
 *  @return {String|null} resolved path
 *
 *  e.g.
    path: /disease/{disease_id}/cad
    params: {disease_id: 123456}
    return: /disease/123456/cad
 */
export default (path, params) => {
  if (!path) {
    return null;
  }

  if (path.indexOf("?") > -1 || path.indexOf("&") > -1) {
    throw new Error(`An endpoint should never include ? or & naturally,
      instead the querystring will be formed from the given
      params dict automatically.`);
  }

  // no placeholder vars given, return the original path instead.
  if (typeof params !== "object") {
    return path;
  }

  return path.replace(/(?:{([a-z|A-Z|_]\w*)})/gi, function(a, b) {
    let ret = "";

    // 如果存在对应字段（不能直接用属性判断，有为 0 的情况出现）
    // a -> :product_id
    // b -> product_id
    if (params.hasOwnProperty(b)) {
      ret = params[b];
    }

    return ret;
  });
};
