import chalk from "chalk";
import zlib from "zlib";
import Koa from "koa";
import KoaStaticServer from "koa-static-server";
import KoaCompress from "koa-compress";
import KoaRouter from "koa-router";
import webpack from "webpack";
import { hotMiddleware, devMiddleware } from "koa-webpack-hmr/dist";
import { APP } from "./env";
import routeRegister from "./route-register";

export default (options) => {
  let { runtimeWebpackConfig, runtimeConfig, runtimeRoutes } = options;

  // 建立开发服务器实例
  const devApp = new Koa();
  // 路由表实例
  const appRouter = KoaRouter();
  // webpack 编译器
  const webpackCompiler = webpack(runtimeWebpackConfig);

  // 注册当前应用的 mvc + api 路由
  routeRegister(appRouter, runtimeRoutes.mvcRoutes);
  routeRegister(appRouter, runtimeRoutes.apiRoutes, runtimeConfig.apiRoot);

  // enable gzip compressing
  // must be used as the first middleware
  devApp.use(
    KoaCompress({
      filter(contentType) {
        return /text|javascript/i.test(contentType);
      },
      threshold: 2048,
      flush: zlib.Z_SYNC_FLUSH
    })
  );

  // 挂载路由
  devApp.use(appRouter.routes());
  devApp.use(appRouter.allowedMethods());

  // webpack 热更新
  devApp.use(
    devMiddleware(webpackCompiler, {
      // display no info to console (only warnings and errors)
      noInfo: false,

      // display nothing to the console
      quiet: false,

      // switch into lazy mode
      // that means no watching, but recompilation on every request
      lazy: false,

      // watch options (only lazy: false)
      watchOptions: {
        aggregateTimeout: 300,
        poll: true
      },

      // public path to bind the middleware to
      // use the same as in webpack
      publicPath: runtimeConfig.publicPath,

      // custom headers
      // headers: { "X-Custom-Header": "yes" },

      // options for formating the statistics
      stats: {
        // do not log child plugin outputs
        children: false,
        // Makes the build much quieter
        chunks: false,
        // Shows colors in the console
        colors: true
      }
    })
  );

  // log: console.log,
  // path: '/__webpack_hmr',
  // heartbeat: 10 * 1000
  devApp.use(hotMiddleware(webpackCompiler, {}));

  devApp.use(
    KoaStaticServer({
      rootDir: runtimeConfig.outputPath,
      rootPath: runtimeConfig.publicPath
    })
  );

  // general fallback error handler
  devApp.use((ctx) => {
    let routeTable = JSON.stringify(runtimeRoutes, null, "  ");

    ctx.type = "text/html; charset=utf-8";
    ctx.status = 400;
    ctx.body = `<style>body{background:beige;}</style>
      <h3>请求失败，请检查路由是否正确(可用路由如下所示)</h3>
      <pre>${routeTable}</pre>`;
  });

  // 启动服务器
  devApp.listen(runtimeConfig.devPort);

  // 控制台提示语
  const devNotice = `/**
  ** Huaju medical system front-end project
  ** Version: 5.0
  ** be happy and have a nice working day!
  */`;

  console.log(
    chalk.green(devNotice),
    "\n\n",
    `Log: you are running APP "${chalk.red(APP)}"` +
      ` at http://localhost:${chalk.red(runtimeConfig.devPort)}\n`,
    "Log:",
    chalk.green("dev server is ready to go!")
  );
};
