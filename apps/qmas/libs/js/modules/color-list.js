// 从 sass 反向解析出颜色值
import sassVars from "sass-variable-loader!__libs/scss/utils/_app-colors";

// 导出颜色值列表（应用颜色名为 app-colors）
export default sassVars["app-colors"];
