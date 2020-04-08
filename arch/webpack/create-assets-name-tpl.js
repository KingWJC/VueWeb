import { NODE_ENV } from "@@arch/env";

// createAssetsNameTpl('js/[name]{hmark}.js') -> js/base-03a3eb89.js
export default (originTpl, params) => {
  params = Object.assign(
    {
      // where to place the hash tpl in the original filename string?
      mark: "{hmark}",
      // use chunkhash?
      isChunk: true,
      tpl: "-[{type}:{len}]",
      // how long will be the generated hash?
      len: 8
    },
    params
  );

  let retStr = originTpl;
  let calcedTpl = "";

  if (NODE_ENV === "production") {
    calcedTpl = params.tpl.replace(
      "{type}",
      params.isChunk ? "chunkhash" : "hash"
    );
    calcedTpl = calcedTpl.replace("{len}", params.len);
  }

  return retStr.replace(params.mark, calcedTpl);
};
