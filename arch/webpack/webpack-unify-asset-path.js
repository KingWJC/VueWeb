import createAssetsNameTpl from "./create-assets-name-tpl";
import { REPO_ROOT, APP_ROOT } from "../env";

// @param {String} absPath F:\d\arch-new\imgs\aa.jpg
// @param {String} type imgs/fonts
export default (absPath, type) => {
  // convert the absolute path into relative path but still
  // keep the original file tree structure
  // e.g.
  //  /Users/dylan/arch-new/apps/qmas/pages/home/imgs/home-pic.png
  // will become:
  //  /static/imgs/pages/home/home-pic.png
  // which will not keep the last redundant level of `imgs`
  let tmpPath = absPath.replace(APP_ROOT, "");
  tmpPath = tmpPath.replace(REPO_ROOT, "");
  tmpPath =
    process.platform === "win32" ? tmpPath.replace(/\\/g, "/") : tmpPath;
  // remove the redundant `imgs`
  tmpPath = tmpPath.replace(`/${type}`, "");
  // remove the file name part
  tmpPath = tmpPath.replace(/\/[^/]+$/, "");
  // remove the leading slash
  tmpPath = tmpPath.replace(/^\//, "");

  return createAssetsNameTpl(`${type}/${tmpPath}/[name]{hmark}.[ext]`, {
    isChunk: false
  });
};
