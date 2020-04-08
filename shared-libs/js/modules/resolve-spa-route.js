import VueRouter from "vue-router";

/**
 *  挂载抽象 Vue 路由表，据此获取真实前端路由地址
 *
 *  @params {Object} routeMap   页面路由注册表
 *  @params {String} routeName  跳转前端路由名
 *  @params {String} params  前端路由参数
 *  @return {String} 拼接完成的路由地址，e.g. /cases/index/3/sd/1002
 *
 *  注意：返回的 href 是不带 # 号的，需要手动添加！
 */
export default (routeMap, routeName, params = {}) => {
  let abstractRouter = new VueRouter({
    // 使用抽象模式挂载，不接管浏览器路由系统
    mode: "abstract",

    routes: Object.keys(routeMap).reduce((accList, curName) => {
      accList.push({
        // 对应无序路由表里面的路由名
        name: curName,
        path: routeMap[curName].route
      });

      return accList;
    }, [])
  });

  let resolved = abstractRouter.resolve({
    name: routeName,
    params
  });

  // 注销路由实例
  abstractRouter = null;

  return resolved.href;
};
