import getYaxisSizes from "__shared-libs/js/modules/get-yaxis-sizes";

// 基线值和最大值逻辑公共逻辑提取
function getValue(baseline, yMax) {
  let value;

  if (
    baseline === null ||
    baseline === "-" ||
    Number(baseline) === 0 ||
    Number(baseline) < yMax
  ) {
    value = getYaxisSizes(yMax);
  } else {
    value = getYaxisSizes(baseline);
  }

  return value;
}

// 返回动态5等分之后,对应的y轴最大值,和间距
// useBaseline  0不使用,1不使用
// yMax 数据最大值,
// baseline 基线值,
// sdEkpiConver 数值/百分比/千分比
export default (useBaseline, yMax, baseline, sdEkpiConver) => {
  let value = {};

  if (sdEkpiConver === 1) {
    value = getYaxisSizes(100);
  } else if (
    sdEkpiConver === 0 ||
    sdEkpiConver === 2 ||
    sdEkpiConver === 3 ||
    sdEkpiConver === 4
  ) {
    if (useBaseline === 1) {
      value = getValue(baseline, yMax);
    } else if (useBaseline === 0) {
      value = getYaxisSizes(yMax);
    }
  }

  return value;
};
