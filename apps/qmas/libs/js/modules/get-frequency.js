/**
 * 用于专病病例：住院流水号用入组样本号截取
 *
 * @param {String} str 入组样本号
 * @return {String} 住院流水号（从入组样本号截取）
 */
export default function(str) {
  // "IS_I_173488752_20" =》 取第二个下划线后的值
  // "IS_I_173488752"
  let arr = str.split("_");
  let arrNew = arr.slice(2, arr.length);

  return arrNew.join("_");
}
