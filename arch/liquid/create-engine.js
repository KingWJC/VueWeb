import Liquid from "liquidjs";

// 创建liquid引擎实例
export default (root) => {
  // 建立 liquid 渲染引擎实例
  return Liquid({
    // include / extends 遍历的目录
    root: root || []
  });
};
