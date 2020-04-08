import { REPO_ROOT, APP_ROOT } from "@@arch/env";
import webpackPathJoin from "@@arch/webpack/webpack-path-join";
import webpackUnifyAssetPath from "@@arch/webpack/webpack-unify-asset-path";

// css
function plainCss() {
  return {
    test: /\.css$/,
    include: [
      // 从全局进行css解析（可能有全局库）
      REPO_ROOT
    ],
    use: "css-loader"
  };
}

// 图片
function images({ publicPath }) {
  return {
    test: /\.(png|jpe?g|gif|svg|webp)$/,
    include: [
      // 全局跨项目共享
      webpackPathJoin(REPO_ROOT, "shared-libs/imgs"),

      // 当前app（mpa）共享
      webpackPathJoin(APP_ROOT, "libs/imgs"),

      // 当前页（spa），推荐：放到当前app共享 libs/imgs
      webpackPathJoin(APP_ROOT, "pages")
    ],
    use: {
      loader: "file-loader",
      options: {
        name: (file) => {
          return webpackUnifyAssetPath(file, "imgs");
        },
        publicPath
      }
    }
  };
}

// 字体
function fonts({ publicPath }) {
  return {
    test: /\.(woff2?|eot|ttf|svg|otf)$/,
    include: [
      // 全局跨项目共享
      webpackPathJoin(REPO_ROOT, "shared-libs/fonts"),

      // 当前app（mpa）共享
      webpackPathJoin(APP_ROOT, "libs/fonts"),

      // 当前页（spa），推荐：放到当前app共享 libs/fonts
      webpackPathJoin(APP_ROOT, "pages")
    ],
    use: {
      loader: "file-loader",
      options: {
        name: (file) => {
          return webpackUnifyAssetPath(file, "fonts");
        },
        publicPath
      }
    }
  };
}

// 所有js
function plainJs({ babelOptions }) {
  return {
    test: /\.js$/,
    include: [
      // 全局跨项目共享
      webpackPathJoin(REPO_ROOT, "shared-libs/js"),
      webpackPathJoin(REPO_ROOT, "shared-libs/vuex"),

      // 当前app（mpa）共享
      webpackPathJoin(APP_ROOT, "libs/js"),
      webpackPathJoin(APP_ROOT, "libs/vuex"),

      // 当前页（spa），推荐：仅一个 entry js
      webpackPathJoin(APP_ROOT, "pages")
    ],
    use: {
      loader: "babel-loader",
      options: babelOptions
    }
  };
}

export { plainCss, images, fonts, plainJs };
