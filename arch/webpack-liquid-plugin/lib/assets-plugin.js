import fs from "fs";
import path from "path";

function WebpackLiquidAssetsPlugin(options) {
  this.options = Object.assign(
    {
      // where to put the generated json, default to current folder
      outputPath: "./",

      // filename of the json
      filename: "vendor-assets.json"
    },
    options
  );
}

WebpackLiquidAssetsPlugin.prototype.apply = function(compiler) {
  compiler.plugin("after-emit", (compilation, cb) => {
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

    fs.writeFileSync(
      path.join(this.options.outputPath, this.options.filename),

      // cache up `entrypoints`
      JSON.stringify({
        assetsByChunkName,
        assets
      })
    );

    cb(null);
  });
};

export default WebpackLiquidAssetsPlugin;
