/** 用于Echart图表上的画图基线
 * @param {Object} fields 当前 kpiId 下的所有属性
 */
export default (fields) => {
  let baselineMap;

  if (fields.IS_DYNAMIC === 0) {
    baselineMap = fields.BaseLine;
  } else {
    let minBaseLine = fields.MinBaseLine.trim();

    if (minBaseLine !== "-") {
      baselineMap = String(Number(fields.MinBaseLine) * 7);
    } else {
      baselineMap = "-";
    }
  }

  return baselineMap;
};
