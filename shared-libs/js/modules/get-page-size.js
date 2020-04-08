import $ from "jquery";

// 翻页器全屏获取 pagesize 方法
// @param lineHeight {Number}表格每行的高度
// @param otherHeight {Number} 非表格部分高度
// @param minPageSize {Number} 可选  默认为 10
export default (lineHeight, otherHeight, minPageSize = 10) => {
  let tempPageSize = Math.floor(
    ($(window).height() - otherHeight) / lineHeight
  );

  return tempPageSize < minPageSize ? minPageSize : tempPageSize;
};
