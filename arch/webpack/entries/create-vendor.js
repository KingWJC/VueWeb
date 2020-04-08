import webpack from "webpack";
import UglifyWebpackPlugin from "uglifyjs-webpack-plugin";
import WebpackLiquidAssetsPlugin from "@@arch/webpack-liquid-plugin/lib/assets-plugin";
import createAssetsNameTpl from "@@arch/webpack/create-assets-name-tpl";
import webpackPathJoin from "@@arch/webpack/webpack-path-join";
import extractVendorCss from "@@arch/webpack/plugins/extract-vendor-css";
import { NODE_ENV, APP_ROOT } from "@@arch/env";

export default ({ config, sharedRules, vendorRules }) => {
  return {
    context: APP_ROOT,

    entry: {
      vendor: ["./libs/js/vendor"]
    },

    // TODO：不生效？使用浏览器模式编译（模拟浏览器模式，没有 fs，path 等模块）
    target: "web",

    output: {
      path: config.outputPath,
      publicPath: config.publicPath,
      filename: createAssetsNameTpl("js/[name]{hmark}.js"),
      library: `[name]${config.vendorLibSuffix}`
    },

    // should modules from Node.js included as well in the bundle?
    node: {
      Buffer: false,
      // compile vue in browser mode
      global: false,
      setImmediate: false
    },

    // resolve loaders(e.g. used for inline loaders)
    resolveLoader: {
      alias: config.loaderAlias
    },

    // 解析方式
    resolve: {
      alias: config.alias,
      // modules: [APP_ROOT, "node_modules"],
      // import st from 'style.css' -> import st frm 'style'
      extensions: config.knownExts
    },

    module: {
      // 跳过解析列表（提高编译速度）
      noParse: (ctx) => config.noParseReg.test(ctx),
      rules: [...sharedRules, ...vendorRules]
    },

    // apply plugins
    plugins: [
      extractVendorCss,

      new webpack.HashedModuleIdsPlugin(),
      new webpack.optimize.OccurrenceOrderPlugin(),

      // by default we'll run in development version
      new webpack.DefinePlugin({
        process: {
          env: {
            NODE_ENV: `"${NODE_ENV || "development"}"`
          }
        }
      }),

      // extract manifest as a single script
      // new webpack.optimize.CommonsChunkPlugin({
      //   name: 'manifest',
      //   filename: 'js/manifest.js',
      //   minChunks: Infinity
      // }),

      new webpack.DllPlugin({
        // The path to the manifest file which maps between
        // modules included in a bundle and the internal IDs
        // within that bundle
        // do not use static file name since webpack will generate corrupted
        // json file in parallel mode
        // @see https://github.com/webpack/webpack/issues/5867
        // This can happen if you write multiple times to a file in parallel.
        // You need to have different manifest files for each entry
        path: webpackPathJoin(config.outputPath, `[name]-dllref.json`),
        name: `[name]${config.vendorLibSuffix}`
      }),

      new WebpackLiquidAssetsPlugin({
        outputPath: config.outputPath,
        filename: "vendor-assets.json"
      }),

      new webpack.NoEmitOnErrorsPlugin(),

      ...(NODE_ENV === "production" ? [new UglifyWebpackPlugin()] : [])
    ]
  };
};
