import { REPO_ROOT, APP_ROOT, NODE_ENV } from "@@arch/env";
import createAssetsNameTpl from "@@arch/webpack/create-assets-name-tpl";
import cssExtractorTpl from "@@arch/webpack/css-extractor-tpl";
import webpackPathJoin from "@@arch/webpack/webpack-path-join";
import extractVendorCss from "@@arch/webpack/plugins/extract-vendor-css";

const vendorCssExtractor = extractVendorCss.extract(cssExtractorTpl);

// vendor css
function vendorScss() {
  return {
    test: /vendor\.(sass|scss)$/,
    include: [webpackPathJoin(APP_ROOT, "libs/scss")],
    use: vendorCssExtractor
  };
}

// output raw files for 3rd-party libs
// echarts
// it will also expose the echarts variable so that we dont' need to config
// externals in webpack any more, simply import the full path given
// in vendor.js
function echarts({ publicPath, sharedDeps }) {
  return {
    test: /\.js$/,
    include: [webpackPathJoin(sharedDeps, "echarts")],
    use: [
      {
        loader: webpackPathJoin(REPO_ROOT, "arch/replace-exports-loader"),
        options: {
          // module.exports = echarts
          val: "echarts"
        }
      },
      {
        loader: "file-loader",
        options: {
          name: createAssetsNameTpl("js/[name]{hmark}.js", { isChunk: false }),
          publicPath
        }
      }
    ]
  };
}

// output raw files for 3rd-party libs
// babelHelpers
// it will also expose the babelHelpers variable so that we dont' need to
// config externals in webpack any more, simply import the full path given
// in vendor.js
function babelHelpers({ publicPath }) {
  return {
    test: /babel-helpers\.js$/,
    include: [webpackPathJoin(REPO_ROOT, "shared-libs/js")],
    use: [
      {
        loader: webpackPathJoin(REPO_ROOT, "arch/replace-exports-loader"),
        options: {
          // module.exports = babelHelpers
          val: "babelHelpers"
        }
      },
      {
        loader: "file-loader",
        options: {
          name: createAssetsNameTpl("js/[name]{hmark}.js", { isChunk: false }),
          publicPath
        }
      },
      /* eslint-disable prettier/prettier */
      ...(NODE_ENV === "production"
        ? [
          {
            loader: webpackPathJoin(REPO_ROOT, "arch/uglify-loader"),
            options: { exclude: /\.min\.js/ }
          }
        ]
        : []),
      /* eslint-enable prettier/prettier */
      {
        loader: webpackPathJoin(
          REPO_ROOT,
          "arch/webpack-liquid-plugin/lib/extract-loader"
        )
      },
      {
        loader: webpackPathJoin(REPO_ROOT, "arch/compile-babel-helpers-loader")
      }
    ]
  };
}

// output raw files for es6-shim libs
// es6-shim
function es6Shim({ publicPath, sharedDeps }) {
  return {
    test: /\.js$/,
    include: [webpackPathJoin(sharedDeps, "es6-shim")],
    use: [
      {
        loader: "file-loader",
        options: {
          name: createAssetsNameTpl("js/[name]{hmark}.js", { isChunk: false }),
          publicPath
        }
      },

      /* eslint-disable prettier/prettier */
      ...(NODE_ENV === "production"
        ? [
          {
            loader: webpackPathJoin(REPO_ROOT, "arch/uglify-loader"),
            options: { exclude: /\.min\.js/ }
          }
        ]
        : [])
    /* eslint-enable prettier/prettier */
    ]
  };
}

// load 3rd-party Vue
function vue({ sharedDeps, appDeps, babelOptions }) {
  return {
    test: /\.vue$/,
    include: [sharedDeps, appDeps],
    use: {
      loader: "vue-loader",
      options: {
        loaders: {
          scss: vendorCssExtractor,
          js: {
            loader: "babel-loader",
            options: babelOptions
          }
        }
      }
    }
  };
}

export { vendorScss, echarts, babelHelpers, es6Shim, vue };
