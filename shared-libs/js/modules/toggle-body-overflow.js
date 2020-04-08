import $ from "jquery";
import { getTotalZIndex } from "__shared-libs/js/modules/zindex-stack";

// DOM: body下的初始 overflow 属性
const initialOverflow = $("body").css("overflow");

// 变更页面滚动条展示
export default () => {
  $("body").css(
    "overflow",
    getTotalZIndex() === 0 ? initialOverflow : "hidden"
  );
};
