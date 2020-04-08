import chalk from "chalk";
import path from "path";

// 注册单条路由
// @params {String} prefix 路由前缀
function registerRoute(router, routeName, routeDef, verb, prefix) {
  // mvc 路由默认挂载到根目录下
  prefix = prefix || "/";

  // http protocol uses posix style path definition, which
  // always use / as separator.
  let routePath = path.posix.join(prefix, routeDef.route);

  // In our .NET backend architecture, we use curly braces `{params}` to
  // mark RESTful route params, while in nodejs the colon `:params` is used,
  // so here we should convert curly braces into colons before passing them
  // to Koa router.
  //
  // e.g.
  // /Hos/{Ab}/x/Cd/{Xyx} -> /Hos/:Ab/x/Cd/:Xyx
  routePath = routePath.replace(/(?:{([a-z|A-Z|_]\w*)})/gi, function(a, b) {
    return `:${b}`;
  });

  /* eslint-disable space-before-function-paren */
  router[verb](routePath, async (ctx) => {
    /* eslint-enable space-before-function-paren */
    try {
      // 执行路由回调，获得结果
      // 回调定义标准：
      // 1. 普通文本或对象（对象将被序列化输出为JSON格式）
      // 2. 函数，返回同步结果
      // 3. 函数，返回异步 Promise 对象
      let cbRes = routeDef.verbs[verb];

      // 如果是函数，执行
      // 如果是函数，支持调用 ? 查询参数，用于生成更加精确的 mocking data
      // TODO: 如有必要，也可添加 params (路由参数) 和 post JSON 支持
      // 99% 常规模式不建议使用，避免产生不必要的耦合逻辑，考虑使用场景：
      // 创建级联数据或者关联数据（即 mock session 数据必须完全匹配 mock api 数据的场景）
      if (typeof cbRes === "function") {
        cbRes = cbRes(ctx.query);
      }

      // 如果返回 Promise， 就直接 await
      if (cbRes instanceof Promise) {
        ctx.body = await cbRes;
      } else {
        // else: 否则，显示转换为 Promise
        ctx.body = await Promise.resolve(cbRes);
      }
    } catch (e) {
      console.log(
        "Error:",
        chalk.bold.red(`failed to call handler for route: "${routeName}"`),
        "\nOriginal error from Koa-router:",
        chalk.bold.red(e.message)
      );
    }
  });
}

// 循环注册所有路由(mvc + api)，根据不同 HTTP verb（get,put,post...)
export default (appRouter, runtimeRoutes, prefix) => {
  for (let routeName in runtimeRoutes) {
    // 遍历注册当前路由所有 http 方法（get，post, put ...etc.)
    for (let verb in runtimeRoutes[routeName].verbs) {
      registerRoute(
        appRouter,
        routeName,
        runtimeRoutes[routeName],
        verb,
        prefix
      );
    }
  }
};
