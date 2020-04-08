import fs from "fs";

// @author Dylan Mao <maverickpuss@gmail.com>
// usage:
// install this plugin after all your css been processed:
// new WebpackLiquidPlugin({
// })

// [[liquid.output(assets.dll[0])]]
const searchingPatt = /(\[{2}liquid\.(?:output)\([^)]+?\)\]{2})/gi;
const workingPatt = /\[{2}liquid\.(output)\(([^)]+?)\)\]{2}/i;

function WebpackLiquidPlugin(options) {
  this.options = Object.assign(
    {
      // file to record assets extracted from vendor lib
      // since this plugin is based on the conception of the use of DLLReference
      // plugin, the assets map should also be loaded in to track references
      // generated within the vender lib.
      vendorAssetsJson: null,

      // regexp to check if an assets is liquid
      liquidTester: /\.liquid$/
    },
    options
  );
}

function replaceAssets(liquidStr, chunkNamesMap, publicPath) {
  const rawPartials = liquidStr.split(searchingPatt);
  let compiledPartials = [];

  for (let i = 0; i < rawPartials.length; i++) {
    let curPartial = rawPartials[i];
    let matchList = curPartial.match(workingPatt);

    if (matchList) {
      let verb = matchList[1],
        value = matchList[2];

      if (verb === "output") {
        try {
          // run in current context with access to `chunkNamesMap` object
          let jsExpFn = new Function(
            "chunkMap",
            "publicPath",
            `with (chunkMap) { return publicPath + ${value}; }`
          );

          compiledPartials.push(jsExpFn(chunkNamesMap, publicPath));
        } catch (e) {
          // failed to resolve, keep the original partial untouched.
          compiledPartials.push(curPartial);
        }
      }
    } else {
      compiledPartials.push(curPartial);
    }
  }

  return compiledPartials.join("");
}

WebpackLiquidPlugin.prototype.apply = function(compiler) {
  // only in `after-emit` can we get the real path of the emitted file
  compiler.plugin(
    "after-emit",
    function(compilation, callback) {
      let { assetsByChunkName, assets } = compilation.getStats().toJson({
        hash: false,
        publicPath: false,
        version: false,
        filteredAssets: false,
        modules: false,
        children: false,
        chunks: false,
        entrypoints: false
      });

      let vendorAssetsByChunkName = JSON.parse(
        fs.readFileSync(this.options.vendorAssetsJson, "utf-8")
      );

      let entryAssets = Object.keys(assetsByChunkName).reduce(
        (accObj, curEntry) => {
          let jsList = [],
            cssList = [],
            othersList = [];

          assetsByChunkName[curEntry].forEach((item) => {
            if (/\.js$/.test(item)) {
              jsList.push(item);
            } else if (/\.css$/.test(item)) {
              cssList.push(item);
            } else {
              othersList.push(item);
            }
          });

          accObj[curEntry] = {
            js: jsList,
            css: cssList,
            others: othersList
          };

          return accObj;
        },
        {}
      );

      let mergedChunkNames = {
        entryAssets,

        assetsByChunkName: Object.assign(
          {},
          vendorAssetsByChunkName.assetsByChunkName,
          assetsByChunkName
        ),

        assets: {
          // assets provided by dll reference plugin
          dll: vendorAssetsByChunkName.assets,
          // assets provided by app
          app: assets
        }
      };

      // console.log(Object.keys(compilation.entrypoints))
      for (let item in compilation.assets) {
        // only process liquid files
        if (this.options.liquidTester.test(item)) {
          // convert Buffer into utf8 string
          const liquidStr = compilation.assets[item].source().toString();
          const processedStr = replaceAssets(
            liquidStr,
            mergedChunkNames,
            compilation.outputOptions.publicPath
          );

          // synchronously write to disk, so that the downstream(express, koa)
          // can render updated liquid asap.
          fs.writeFileSync(compilation.assets[item].existsAt, processedStr);
        }
      }

      callback(null);
    }.bind(this)
  );
};

export default WebpackLiquidPlugin;
