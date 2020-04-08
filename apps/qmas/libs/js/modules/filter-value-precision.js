// 严格判断给出字符串是否是一个 整数 或者 双精度 数字
// @param valueStr {String} 待判断格式的值
export default (valueStr) => {
  // 没有值或者空字符串，退出
  if (!valueStr || valueStr === "") {
    return false;
  }

  // 是否非法格式，默认不是
  let isMalFormat = false;

  // 000.3 09.0 9.33 9.09 之外的值
  if (!/(^\d+\.\d{1,2}$)|(^\d+$)/gi.test(valueStr)) {
    isMalFormat = true;
  }

  // 000.3 09.0 排除上个 if 遗漏的以0开头,但是第二位不是点
  if (/^0[^.]/gi.test(valueStr)) {
    isMalFormat = true;
  }

  return isMalFormat;
};
