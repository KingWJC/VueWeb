import UglifyJS from "uglify-js";
import loaderUtils from "loader-utils";

export default function(rawJsText) {
  const callback = this.async();
  const options = loaderUtils.getOptions(this) || {};
  const ctx = loaderUtils.getCurrentRequest(this);

  let minifiedStr;

  // excluded files
  // e.g. jquery.min.js, can be excluded as /\.min\.js/
  if (options.exclude && options.exclude.test(ctx)) {
    minifiedStr = rawJsText;
  } else {
    let minifyRes = UglifyJS.minify(rawJsText, options.uglifyOptions);
    minifiedStr = minifyRes.code;
  }

  callback(null, minifiedStr);
}
