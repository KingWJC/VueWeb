import $ from "jquery";

// 获取dom元素的尺寸（宽高）
// @return Object {width:Number, height:Number}
export default (dom) => {
  let $dom = $(dom);

  return {
    width: $dom.outerWidth(),
    height: $dom.outerHeight()
  };
};
