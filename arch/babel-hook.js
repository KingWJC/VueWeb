const path = require("path");

require("babel-register")({
  presets: [
    [
      "env",
      {
        target: {
          // 仅针对当前运行时 node 版本 转码，已实现的feature不做转换（如 let，const 等）
          node: "current"
        }
      }
    ]
  ],

  plugins: [
    // babel alias，用于缩减引用路径，例如：
    // 注意，和webpack alias 不是一个概念，例如 __imgs
    // @@utils: path/to/utils
    // const MyUtilFn = require('../../../../utils/MyUtilFn');
    // ->
    // const MyUtilFn = require('@@utils/MyUtilFn');
    [
      "module-resolver",
      {
        root: [process.cwd()],
        alias: { "@@arch": path.resolve(process.cwd(), "arch") }
      }
    ],

    // transpile async functions to generators
    [
      "transform-runtime",
      {
        helpers: false,
        polyfill: false,
        regenerator: true
      }
    ],

    // support dynamic import via syntax: import('path/to/es6/module').then()
    ["dynamic-import-node"]
  ]
});

// 分析并用调用 babel 编译指定 entry 脚本
require(process.env.BABEL_ENTRY_SCRIPT);
