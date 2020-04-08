// 从 sass 反向解析出颜色值
import sassVars from "sass-variable-loader!__shared-libs/scss/utils/_colors";

// 导出颜色值列表
export default sassVars.colors;
