// 动态划分y轴为5等分
export default (maxValue) => {
  // 给y轴赋值最大值
  let max = null;
  // 间隔
  let intervalValue = null;

  if (maxValue >= 0 && maxValue <= 100) {
    // maxValue/5的商小于等于20
    if (0 <= maxValue && maxValue <= 1) {
      max = 1;
    } else if (1 < maxValue && maxValue <= 5) {
      // 大于1 到5
      max = 5;
    } else if (5 < maxValue && maxValue <= 10) {
      // 大于5-10
      max = 10;
    } else if (10 < maxValue && maxValue <= 25) {
      max = 25;
    } else if (25 < maxValue && maxValue <= 50) {
      max = 50;
    } else if (50 < maxValue && maxValue <= 100) {
      max = 100;
    }

    intervalValue = max / 5;
  } else if (maxValue > 100 && maxValue <= 500) {
    // maxValue/5的商大于20小于等于100
    // 商的个位不满五进到五,个位满五进到10;
    // 间隔
    let middleValue = Math.ceil(maxValue / 5);

    // 先判断间隔除以5,有没有余数
    if (middleValue % 5 === 0) {
      // 没有余数
      intervalValue = middleValue;
    } else {
      intervalValue = Math.floor(middleValue / 5) * 5 + 5;
    }

    max = intervalValue * 5;
  } else {
    // maxValue/5的商大于100以上的 以10为间隔进制
    // 间隔
    let middleValue = Math.ceil(maxValue / 5);

    // 先判断间隔除以10,有没有余数
    if (middleValue % 10 === 0) {
      // 没有余数
      intervalValue = middleValue;
    } else {
      intervalValue = Math.floor(middleValue / 10) * 10 + 10;
    }

    max = intervalValue * 5;
  }

  return {
    max,
    intervalValue
  };
};
