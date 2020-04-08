import path from "path";
import { REPO_ROOT, APP_ROOT } from "@@arch/env";
import webpackPathJoin from "@@arch/webpack/webpack-path-join";
import cssExtractorTpl from "@@arch/webpack/css-extractor-tpl";
import extractAppCss from "@@arch/webpack/plugins/extract-app-css";
import webpackUnifyAssetPath from "@@arch/webpack/webpack-unify-asset-path";

const appCssExtractor = extractAppCss.extract(cssExtractorTpl);

// liquid templates
function liquid({ publicPath }, mvcRoutes) {
  return {
    test: /\.(liquid)$/,
    include: [
      webpackPathJoin(REPO_ROOT, "shared-libs/liquids"),
      webpackPathJoin(APP_ROOT, "libs/liquids"),
      webpackPathJoin(APP_ROOT, "pages")
    ],
    use: [
      {
        loader: "file-loader",
        options: {
          name: (file) => {
            let regx = new RegExp(
              process.platform === "win32"
                ? "\\b\\\\pages\\\\\\b"
                : "\\b/pages/\\b"
            );

            // is a page liquid, need to resolve it's liquid name from the route
            // table
            if (regx.test(file)) {
              // /User/arch/xxx/home/view.liquid -> /home/view.liquid
              let tmpPath = file.replace(
                webpackPathJoin(APP_ROOT, "pages"),
                ""
              );
              // find out the real entry name
              // /home/view.liquid -> home
              let entryName = tmpPath.split(path.sep)[1];

              // one page may not use it's page id as entry name, e.g.:
              // hospdeptpatient can be used as entry for both hospdept and
              // specdept pages.
              let liquidName;

              for (let pageId in mvcRoutes) {
                if (
                  // entry name is explicitly defined?
                  mvcRoutes[pageId].entryName === entryName ||
                  // page id used as entry name
                  pageId === entryName
                ) {
                  liquidName = mvcRoutes[pageId].liquidName;
                  // found, quit
                  break;
                }
              }

              return `liquids/${liquidName}/Index.liquid`;
            } else {
              // else: is a partial(include/extends)
              return "liquids/Shared/[name].liquid";
            }
          },

          publicPath
        }
      },
      {
        loader: webpackPathJoin(
          REPO_ROOT,
          "arch/webpack-liquid-plugin/lib/extract-loader"
        )
      },
      {
        loader: webpackPathJoin(
          REPO_ROOT,
          "arch/webpack-liquid-plugin/lib/liquid-loader"
        ),
        options: {
          root: [
            webpackPathJoin(REPO_ROOT, "shared-libs/liquids"),
            webpackPathJoin(APP_ROOT, `libs/liquids`)
          ]
        }
      }
    ]
  };
}

// page level css, each css per page
function pageScss() {
  return {
    test: /\.(sass|scss)$/,
    include: [webpackPathJoin(APP_ROOT, "pages")],
    use: appCssExtractor
  };
}

// base css
function baseScss() {
  return {
    test: /base\.(sass|scss)$/,
    include: [
      webpackPathJoin(REPO_ROOT, "shared-libs/scss"),
      webpackPathJoin(APP_ROOT, "libs/scss")
    ],
    use: appCssExtractor
  };
}

// 编译 js（全局 js + vue 关联js）
function plainJs({ babelOptions }) {
  return {
    test: /\.js$/,
    include: [
      webpackPathJoin(REPO_ROOT, "shared-libs/components"),
      webpackPathJoin(APP_ROOT, "libs/components"),
      webpackPathJoin(APP_ROOT, "libs/js"),
      // implicitly contains js inside components folder
      webpackPathJoin(APP_ROOT, "pages")
    ],
    use: {
      loader: "babel-loader",
      options: babelOptions
    }
  };
}

// 同构路由表
function routes({ mvcRoutes, apiRoutes }) {
  return {
    test: /routes\.js$/,
    include: [APP_ROOT],
    use: {
      loader: webpackPathJoin(REPO_ROOT, "arch/virtual-route-table-loader"),
      options: {
        mvcRoutes,
        apiRoutes
      }
    }
  };
}

// 编译异步脚本（例如 webworker）
function asyncJs({ publicPath, babelOptions }) {
  return {
    test: /\.js$/,
    include: [webpackPathJoin(APP_ROOT, "libs/js/async")],
    use: [
      {
        loader: "file-loader",
        options: {
          name: (file) => {
            return webpackUnifyAssetPath(file, "js");
          },
          publicPath
        }
      },
      {
        loader: "babel-loader",
        options: babelOptions
      }
    ]
  };
}

// load Vue
function vue({ babelOptions }) {
  return {
    test: /\.vue$/,
    include: [
      webpackPathJoin(REPO_ROOT, "shared-libs/components"),
      webpackPathJoin(APP_ROOT, "libs/components"),
      webpackPathJoin(APP_ROOT, "pages")
    ],
    use: {
      loader: "vue-loader",
      options: {
        loaders: {
          scss: appCssExtractor,
          js: {
            loader: "babel-loader",
            options: babelOptions
          }
        },
        extractCSS: true
      }
    }
  };
}

export { liquid, pageScss, baseScss, plainJs, routes, asyncJs, vue };
