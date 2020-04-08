/** 计算单日基线值
 * @param {String} minBaseline 当前 kpiId 下的的最小基线值
 * @param {Object} fields 当前 kpiId 下的所有属性
 * @param {String} selectedAccuracy 当前选中的精度
 */
export default (minBaseline, fields, selectedAccuracy) => {
  let ret = null;

  if (fields.IS_DYNAMIC === 1) {
    if (minBaseline === "-") {
      ret = "-";
    } else {
      if (fields.SD_EKPI_CONVER !== 1) {
        if (selectedAccuracy === "0") {
          ret = String(minBaseline * 7);
        } else if (selectedAccuracy === "1") {
          ret = String(minBaseline * 30);
        } else if (selectedAccuracy === "2") {
          ret = String(minBaseline * 90);
        }
      } else {
        ret = String(minBaseline);
      }
    }
  } else {
    if (minBaseline === "-") {
      ret = "-";
    } else {
      ret = String(minBaseline);
    }
  }

  return ret;
};
