/**
 * 获取是基线还是最小基线
 * @param {Object} fields 当前 kpiId 下的所有属性
 */
export default (fields) => {
  let cachedBaseline = null;

  // 如果是预警指标返回 baseline
  if (fields.IS_DYNAMIC === 0) {
    cachedBaseline =
      fields.BaseLine === "-"
        ? ""
        : parseFloat(fields.BaseLine).toFixed(fields.NUM_PRECISION);
  } else {
    cachedBaseline =
      fields.MinBaseLine === "-"
        ? ""
        : parseFloat(fields.MinBaseLine).toFixed(fields.NUM_PRECISION);
  }

  return cachedBaseline;
};
