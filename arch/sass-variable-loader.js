import gonzales from "gonzales-pe";

// 解析尺寸类型
function parseDim(node) {
  let ret = [];

  node.forEach(function(cnode) {
    ret.push(cnode.content);
  });

  return ret.join("");
}

// 解析函数类型
function parseFn(node) {
  let args = [],
    fnName = node.content[0].content;

  node.content[1].forEach(function(cnode) {
    if (cnode.is("string") || cnode.is("number") || cnode.is("ident")) {
      args.push(cnode.content);
    }
  });

  return `${fnName}(${args.join(",")})`;
}

// 解析 map 类型
function parseMap(node) {
  let tmap = {},
    prevKey;

  // 遍历直系子树，匹配键值对
  node.forEach(function(cnode) {
    // map 的 key 可以是 'base', 也可以是 base, 有无引号都可
    if (cnode.is("string") || cnode.is("ident")) {
      // 删除引号
      prevKey = cnode.content.replace(/['"]/gim, "");
    }

    // 如果是括号，说明值是 map
    if (cnode.is("parentheses")) {
      tmap[prevKey] = parseMap(cnode);
    } else if (cnode.is("function")) {
      // else: 如果是函数
      tmap[prevKey] = parseFn(cnode);
    } else if (cnode.is("dimension")) {
      // else: 如果是尺寸
      tmap[prevKey] = parseDim(cnode);
    } else if (cnode.is("color")) {
      // else: 如果是颜色，直接使用值
      tmap[prevKey] = parseColor(cnode);
    }
  });

  return tmap;
}

// 解析颜色
// TODO: open issue under gonzales-pe for not parsing hex color
// with a hash tag.
function parseColor(node) {
  let color;

  // 如果是十六进制值，添加 #
  // gonzales-pe 有一个 issue：颜色值解析之后丢失了 # 号
  if (/[0-9A-Fa-f]{6}|[0-9A-Fa-f]{3}/gi.test(node.content)) {
    color = `#${node.content}`;
  } else {
    // else: 否则，诸如 rgb, rgba 之类，直接使用
    color = node.content;
  }

  return color;
}

// 解析 node
function parseNode(node) {
  let parsedValue;
  let con = node.content;

  // value 只有一个值，例如：20px, 999, sz(20), sprite
  if (con.length === 1) {
    let subCon = con[0].content;

    // 20px: 20 + px
    if (con[0].is("dimension")) {
      parsedValue = `${subCon[0].content}${subCon[1].content}`;
    } else if (con[0].is("function")) {
      // else: sz(20): sz [ 20 ]
      parsedValue = `${subCon[0].content}(${subCon[1].content})`;
    } else if (con[0].is("number")) {
      // else: 999: 999
      parsedValue = parseFloat(con[0].content);
    } else if (con[0].is("ident")) {
      // else: $base-sprite-name: sprite
      // else: 只有一个节点，且 type 为 ident，例如字符串，就直接使用
      parsedValue = con[0].content;
    }
  } else {
    // else:
    // value 有多个，例如：
    // 一个列表：20px 38px
    // 一个 map：('a': 3, b: 4)
    // 一个带修饰符的 map：('a': 3, b: 4) !global
    // 如果第一个子节点是括号，则视为一个 map
    if (con[0].is("parentheses")) {
      parsedValue = parseMap(con[0]);
    }
  }

  return parsedValue;
}

export default function(source) {
  this.cacheable();

  let parsedAST = gonzales.parse(source, {
    syntax: "scss",
    tabSize: 2
  });

  let sassVars = {};

  // declaration 表示赋值语句
  // 注意，一旦解析即视为全局变量，函数内部定义变量也会被解析！
  parsedAST.traverseByTypes(["declaration"], function(node) {
    let varName = node.content[0].content[0].content[0].content;
    let varNode = node.last();

    Object.assign(sassVars, { [varName]: parseNode(varNode) });
  });

  return `module.exports = ${JSON.stringify(sassVars, null, 2)};`;
}
