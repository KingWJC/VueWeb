import webpack from "webpack";
import UglifyWebpackPlugin from "uglifyjs-webpack-plugin";
import WebpackLiquidPlugin from "@@arch/webpack-liquid-plugin/lib/plugin";
import webpackPathJoin from "@@arch/webpack/webpack-path-join";
import createAssetsNameTpl from "@@arch/webpack/create-assets-name-tpl";
import extractAppCss from "@@arch/webpack/plugins/extract-app-css";
import { NODE_ENV, APP_ROOT } from "@@arch/env";

export default ({ entries, config, sharedRules, appRules }) => {
  return {
    context: APP_ROOT,

    entry: entries,

    output: {
      path: config.outputPath,
      publicPath: config.publicPath,
      filename: createAssetsNameTpl("js/pages/[name]{hmark}.js")
    },

    // 全局变量
    externals: {
      CONFIG: "CONFIG",
      PAGE_PAYLOAD: "PAGE_PAYLOAD"
    },

    // should modules from Node.js included as well in the bundle?
    node: {
      Buffer: false,
      // compile vue in browser mode
      global: false,
      setImmediate: false
    },

    // resolve loaders
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
      rules: [...sharedRules, ...appRules]
    },

    plugins: [
      extractAppCss,

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

      new webpack.DllReferencePlugin({
        manifest: webpackPathJoin(config.outputPath, `vendor-dllref.json`)
      }),

      new webpack.optimize.CommonsChunkPlugin({
        name: "base",
        // need hash
        filename: createAssetsNameTpl("js/[name]{hmark}.js"),
        minChunks: 2
      }),

      new WebpackLiquidPlugin({
        vendorAssetsJson: webpackPathJoin(
          config.outputPath,
          "vendor-assets.json"
        )
      }),

      new webpack.NoEmitOnErrorsPlugin(),

      ...(NODE_ENV === "production"
        ? [new UglifyWebpackPlugin()]
        : [new webpack.HotModuleReplacementPlugin()])
    ]
  };
};
