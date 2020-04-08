import loaderUtils from "loader-utils";

// -> path/to/master.liquid
// [[liquid.import master from "~__shared-libs/liquids/master.liquid"]]
// -> path/to/logo.png?
// [[liquid.import "~__shared-libs/imgs/logo"]]
// -> emitted assets by webpack
const searchingPatt = /(\[{2}\s*liquid\.(?:output|import)\s+(?:[\w\d]+\s+from\s+){0,1}('|")[^\2]+?\2\s*\]{2})/;
// the only difference between the two patterns is that the searching pattern
// doesn't record the found match groups to improve performance
const workingPatt = /(\[{2}\s*liquid\.(output|import)\s+(([\w\d]+)\s+from\s+){0,1}('|")([^\5]+?)\5\s*\]{2})/;

function processFoundPattern(matchInput) {
  // by default we return the input as is, if no handle is found for the given
  // input
  let resStr = JSON.stringify(matchInput);
  let resDeps = [];
  let matchDetails = matchInput.match(workingPatt);

  if (matchDetails) {
    const verb = matchDetails[2];
    const namedImportDef = matchDetails[3];
    const namedImport = matchDetails[4];
    const moduleRef = matchDetails[6];

    if (verb === "import") {
      // use syntax: [[liquid.import foo from "path/to/bar"]]
      if (namedImportDef && namedImport) {
        resStr = JSON.stringify(namedImport);

        // 压入依赖表
        resDeps.push(`require("${loaderUtils.urlToRequest(moduleRef)}")`);
      } else {
        // else: use plain import syntax: [[liquid.import "path/to/bar"]]
        resStr = `require("${loaderUtils.urlToRequest(moduleRef)}")`;
      }
    }
  }

  return [resStr, resDeps];
}

export default function(liquidStr) {
  // make it asynchronous
  const callback = this.async();

  let compiledPartials = [];
  let depModules = [];
  let reducerStr = liquidStr;
  let foundPatt;

  while ((foundPatt = reducerStr.match(searchingPatt))) {
    const foundPattIdx = foundPatt.index;
    const [processedStr, processedDeps] = processFoundPattern(
      reducerStr.substr(foundPattIdx, foundPatt[1].length)
    );

    compiledPartials.push(
      JSON.stringify(reducerStr.substr(0, foundPattIdx)),
      processedStr
    );

    depModules.push.apply(depModules, processedDeps);
    reducerStr = reducerStr.substr(foundPattIdx + foundPatt[1].length);
  }

  // push the remaining string(which may not contain any matches)
  compiledPartials.push(JSON.stringify(reducerStr));

  compiledPartials = compiledPartials.join(" + ");
  depModules = depModules.join(";\n");

  // callback(null, `module.exports = ${JSON.stringify(liquidStr)};`);
  callback(null, `${depModules}\n\nmodule.exports = ${compiledPartials};`);
}
