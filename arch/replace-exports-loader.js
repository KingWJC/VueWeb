// replace the upstream exports to a new module.
// often used together with file-loader or extract-text-webpack-plugin
// which will expose an meaningless string instead of a
// useful js module/variable

import loaderUtils from "loader-utils";

export default function() {
  // arguments[0]: module.exports = '// extracted by extract-text-blabla'
  const callback = this.async();
  const options = loaderUtils.getOptions(this) || {};

  // throw an error if the module-to-be-replaced is not given
  if (!options.val) {
    callback("the module-to-be-replaced is not given!");
  }

  callback(null, `module.exports=${options.val};`);
}
