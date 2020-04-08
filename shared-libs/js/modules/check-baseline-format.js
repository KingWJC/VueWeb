/**
 *
 * @param { String } baselineStr  需要验证的基线字符串
 * @param { Number } max 需要验证的基线的最大值 (1*10^?)
 * @param { Number } limit 需要验证的基线值得保留小数最多位数(精度)
 *
 * return code  0:匹配 ;   不匹配: 1 ,精度异常,  2,不符合最大值(或者为非数字/非正数)
 */
export default function(baselineStr, max, limit) {
  let code = 0;

  // 首先判断 输入的内容是否为一个 数字,并且是一个正数
  let numLine = Number(baselineStr);

  if (isNaN(numLine) || numLine < 0 || numLine > max) {
    code = 2;
  } else {
    if (baselineStr !== "") {
      let maxStrLen = String(max).length,
        floatForm = limit > 0 ? `(\\.\\d{1,${limit}})?` : "",
        highForm = maxStrLen - 1,
        lessHighForm = maxStrLen - 2 < 0 ? 0 : maxStrLen - 2,
        testRegExpStr =
          `(^[1][0]{${highForm}}${floatForm}$)` +
          `|(^[0]${floatForm}$)` +
          `|(^[1-9](\\d){0,${lessHighForm}}${floatForm}$)`,
        testRegExp = new RegExp(testRegExpStr);

      if (!testRegExp.test(baselineStr)) {
        code = 1;
      }
    }
  }

  return code;
}
