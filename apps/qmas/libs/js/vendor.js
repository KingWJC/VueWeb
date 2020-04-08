import "__libs/scss/vendor";

// 虚拟模块用于占位，模块内部不允许添加任何实际内容，最终
// 生成内容为 babelHelpers 全局库并独立输出文件
import "__shared-libs/js/babel-helpers";

// modularized jquery
// TODO: exclude jQuery.ajax module
import "jquery";

import "echarts";
import "es6-shim";

// axios request lib
import "axios";

// momentjs
import "moment";
// in fact we don't need this since zh-cn locale will be compiled along with
// momentjs it self(@see webpack/dll)
import "moment-locale";

// vue related
import "vue";
import "vuex";
import "vue-router";
import "pdfjs";
