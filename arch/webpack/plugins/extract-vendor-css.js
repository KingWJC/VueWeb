import ExtractTextPlugin from "extract-text-webpack-plugin";
import createAssetsNameTpl from "../create-assets-name-tpl";

const plugin = new ExtractTextPlugin({
  filename: createAssetsNameTpl("css/[name]{hmark}.css"),
  allChunks: true
});

export default plugin;
