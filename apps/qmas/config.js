import { REPO_ROOT, APP_ROOT } from "@@arch/env";
import webpackPathJoin from "@@arch/webpack/webpack-path-join";

// 开发端口
const devPort = 3000;

// api路径
const apiRoot = "/api";

// webpack public 路径, 静态文件路径（liquid里面使用）
const publicPath = "/static/";

// 全局模块
const sharedDeps = webpackPathJoin(REPO_ROOT, "node_modules");

// 当前应用模块
const appDeps = webpackPathJoin(APP_ROOT, "node_modules");

// vendor lib name(dll reference)
const vendorLibSuffix = "_lib_do_not_change_me";

// webpack 输出目录（输出到当前app下）
const outputPath = webpackPathJoin(APP_ROOT, "static");

// webpack 模块缩写路径
const alias = {
  // use it in sass with "~" prefix, otherwise sass can't join the correct
  // file reference processed by webpack.
  __app: APP_ROOT,
  __repo: REPO_ROOT,
  __pages: webpackPathJoin(APP_ROOT, "pages"),
  "__shared-libs": webpackPathJoin(REPO_ROOT, "shared-libs"),
  __libs: webpackPathJoin(APP_ROOT, "libs"),
  "__shared-deps": sharedDeps,
  __deps: appDeps,

  // js libs
  jquery: webpackPathJoin(sharedDeps, "jquery/src/jquery"),
  echarts: webpackPathJoin(sharedDeps, "echarts/dist/echarts.min"),
  "es6-shim": webpackPathJoin(sharedDeps, "es6-shim/es6-shim.min"),
  axios: webpackPathJoin(sharedDeps, "axios/lib/axios"),
  moment: webpackPathJoin(sharedDeps, "moment/moment"),
  "moment-locale": webpackPathJoin(sharedDeps, "moment/locale/zh-cn"),
  vue: webpackPathJoin(sharedDeps, "vue/dist/vue.runtime.esm"),
  vuex: webpackPathJoin(sharedDeps, "vuex/dist/vuex.esm"),
  "vue-router": webpackPathJoin(sharedDeps, "vue-router/dist/vue-router.esm"),
  pdfjs: webpackPathJoin(sharedDeps, "pdfjs/lib/image/pdf")
};

// webpack loader 缩写路径
const loaderAlias = {
  "sass-variable-loader": webpackPathJoin(
    REPO_ROOT,
    "arch/sass-variable-loader"
  )
};

// 自动解析的后缀列表(import的时候可不用添加后缀)
// 但是出现歧义引用的时候仍然要后缀，例如：imgs/aaa.jpg; imgs/aaa.png
const knownExts = [
  ".js",
  ".vue",
  ".json",
  ".jpg",
  ".gif",
  ".png",
  ".svg",
  ".woff",
  ".woff2",
  ".ttf",
  ".otf",
  ".css",
  ".sass",
  ".scss",
  ".liquid"
];

// 当前项目的 babel 解析配置
const babelOptions = {
  presets: [
    [
      "env",
      {
        useBuiltIns: "usage",
        targets: {
          // transform only the latest two versions and also ie10+
          browsers: ["last 2 versions", "ie >= 10"]
        }
      }
    ]
  ],

  plugins: [
    // split helpers to external bundle(with default namespace: babelHelpers)
    ["external-helpers"],
    // support Object rest spread: ...mapGetters(['blabla'])
    ["transform-object-rest-spread"],
    // support static class prpoerties, e.g. static installed = true
    ["transform-class-properties"]
  ]
};

// 跳过解析正则
const noParseReg = /echarts|es6-shim|moment/;

export {
  apiRoot,
  vendorLibSuffix,
  devPort,
  outputPath,
  publicPath,
  sharedDeps,
  appDeps,
  alias,
  loaderAlias,
  knownExts,
  babelOptions,
  noParseReg
};
