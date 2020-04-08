import unifyWinPath from "./webpack/unify-win-path";
import webpackPathJoin from "./webpack/webpack-path-join";

// 定义常量用于解析项目根目录（es6 不支持 __dirname 全局变量）
// 如果没有办法解析unix动态环境变量，说明是win环境
// 否则，是unix环境
const REPO_ROOT =
  process.platform === "win32"
    ? unifyWinPath(process.env.REPO_ROOT_WIN)
    : process.env.REPO_ROOT_UNIX;
const NODE_ENV = process.env.NODE_ENV;
const APP = process.env.APP;
const APP_ROOT = webpackPathJoin(REPO_ROOT, `apps/${APP}`);

export { REPO_ROOT, NODE_ENV, APP_ROOT, APP };
