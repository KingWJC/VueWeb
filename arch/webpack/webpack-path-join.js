import path from "path";

// 将 windows 下路径（基于 git bash 运行环境）转换为 webpack 绝对路径（盘符打头）
// e.g. /d/arch-new -> d:/arch-new
// @param {String} basePath   基准路径
// @param {String} joinPath   用于 join 的路径
export default (basePath, joinPath) => {
  let patchedPath = path.join(basePath, joinPath);

  if (process.platform === "win32") {
    // already converted to c:/xxx | c:\\xx, return
    if (/^[A-Za-z]:/.test(patchedPath)) {
      return patchedPath;
    }

    // webpack requires all paths in WIN platform begin with a capital as
    // driver name.
    // e.g.
    //  d:\d\arch-new  is invalid
    //  D:\d\arch-new  is valid
    // extract-text-webpack-plugin will emit an error caused by "NS not found"
    // if we don't use capital as driver name.
    let driverName = patchedPath.substr(1, 1).toUpperCase(),
      absPath = patchedPath.substr(2);

    patchedPath = `${driverName}:${absPath}`;
  }

  return patchedPath;
};
