import { NODE_ENV } from "@@arch/env";

export default {
  use: [
    {
      loader: "css-loader",
      // css can't be optimized by uglify by default, you should
      // either use `--optimize-minimize or -p` at compiling or add
      // the `minimize` option given below manually
      options: { minimize: NODE_ENV === "production" }
    },
    "sass-loader"
  ]
};
