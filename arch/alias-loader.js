import path from "path";
import loaderUtils from "loader-utils";

export default function(source) {
  this.cacheable();

  const options = loaderUtils.getOptions(this) || {};

  // require('abc/def')
  // require('abc/def.js')
  // require("abc/def.js");

  // do not set g flag at first round of matching(otherwise no child group will
  // be captured)
  // do not set i flag(Require or reQuire should be ignored)
  // set m flag to capture cross line results
  // search require from word boundary, which means we will not count
  // `abcrequire('xx.js')` into a module reference, but we still can't tell
  // whether `abc require('xx.js')` is a valid module(which might acutally
  // be a plain string).
  let searchingPatt = /\brequire\(\s*('|")([^\1]+?)\1\s*\)/gm;
  let copySource = source.replace(
    searchingPatt,
    (fullStr, quotation, modPath) => {
      let fullModPath = modPath;

      // if it's a aliased path, reverse it's original path
      for (let aPath in options.alias) {
        // found an alias at beginning
        if (modPath.indexOf(aPath) === 0) {
          fullModPath = modPath.replace(aPath, "");
          fullModPath = path.join(options.alias[aPath], fullModPath);
          fullModPath = JSON.parse(
            loaderUtils.stringifyRequest(this, fullModPath)
          );

          break;
        }
      }

      // not changed, return old path
      if (fullModPath === modPath) {
        return fullStr;
      }

      return fullStr.replace(modPath, fullModPath);
    }
  );

  return copySource;
}
