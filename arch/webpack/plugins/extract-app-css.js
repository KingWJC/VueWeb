import ExtractTextPlugin from "extract-text-webpack-plugin";
import createAssetsNameTpl from "../create-assets-name-tpl";

const plugin = new ExtractTextPlugin({
  filename: (getPath) => {
    let targetFile = getPath(createAssetsNameTpl("[name]{hmark}.css"));

    // begins with 'base', but not something like 'baseabc'
    if (/^\bbase\b/.test(targetFile)) {
      return `css/${targetFile}`;
    } else {
      // else: otherwise regard it as a page css
      return `css/pages/${targetFile}`;
    }
  },

  allChunks: true
});

export default plugin;
