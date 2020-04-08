/**
 * 筛饼图和柱图数据的方法
 * @param {Object} data API 返回的 x 轴 和 y 轴原始数据
 * @param {String} id 用于区分不同的x轴上的属性,有的是 Id 或者 Code
 */
function groupingData(data, xAxisId = "Id") {
  // 构建基础结构
  let pie = {
      pieLegend: [],
      pieSeries: []
    },
    col = {
      X: {
        id: [],
        val: []
      },
      Y: []
    },
    yArr = data.Y;

  // 构建X轴渲染数据结构
  for (let k = 0; k < data.X.length; k++) {
    // 饼图
    pie.pieLegend.push(data.X[k].Name);

    // 柱图
    col.X.id.push(data.X[k][xAxisId]);
    col.X.val.push(data.X[k].Name);
  }

  // 构建Y轴渲染数据结构
  for (let j = 0; j < 3; j++) {
    let denominatorTemp = [];
    let numeratorTemp = [];
    let rateTemp = [];
    let tempPieDataArr = [];

    // 饼图
    if (j === 0) {
      for (let i = 0; i < yArr.length; i++) {
        tempPieDataArr.push(yArr[i].Numerator[j]);
        pie.pieSeries.push({
          name: pie.pieLegend[i],
          value: yArr[i].Rate[j],
          data: tempPieDataArr
        });
      }
    } else {
      // else:柱图
      for (let i = 0; i < yArr.length; i++) {
        denominatorTemp.push(yArr[i].Denominator[j]);
        numeratorTemp.push(yArr[i].Numerator[j]);
        rateTemp.push(yArr[i].Rate[j]);
      }

      col.Y.push({
        rate: rateTemp,
        numerator: numeratorTemp,
        denominator: denominatorTemp
      });
    }
  }

  return [pie, col];
}

/**
 * 柱图数据重新组装
 * @param {Object} data API 返回的 x 轴 和 y 轴原始数据
 * @param {String} id 用于区分不同的x轴上的属性,有的是 Id 或者 Code
 */
function groupDeptDataRefactor(data) {
  let groupDeptList = sdLayerBubbleSort(data);

  // 构建基础结构
  let col = {
      X: {
        id: [],
        val: []
      },
      Y: []
    },
    yArr = groupDeptList.Y;

  // 构建X轴渲染数据结构
  for (let k = 0; k < groupDeptList.X.length; k++) {
    // 柱图
    col.X.id.push(groupDeptList.X[k].Code);
    col.X.val.push(groupDeptList.X[k].Name);
  }

  // 构建Y轴渲染数据结构
  for (let j = 0; j < 2; j++) {
    let denominatorTemp = [];
    let numeratorTemp = [];
    let rateTemp = [];

    for (let i = 0; i < yArr.length; i++) {
      denominatorTemp.push(yArr[i].Denominator[j]);
      numeratorTemp.push(yArr[i].Numerator[j]);
      rateTemp.push(yArr[i].Rate[j]);
    }

    col.Y.push({
      rate: rateTemp,
      numerator: numeratorTemp,
      denominator: denominatorTemp
    });
  }

  return col;
}

// 患者分组数据排序
function sdLayerBubbleSort(data) {
  // 简化变量信息
  let len = data.X.length,
    xAxis = data.X.slice(0),
    yAxis = data.Y.slice(0);

  for (let i = 0; i < len; i++) {
    for (let j = 0; j < len - 1 - i; j++) {
      if (Number(yAxis[j].Rate[1]) < Number(yAxis[j + 1].Rate[1])) {
        // 元素交换
        let tempY = yAxis[j + 1];
        yAxis[j + 1] = yAxis[j];
        yAxis[j] = tempY;

        // 元素交换
        let tempX = xAxis[j + 1];
        xAxis[j + 1] = xAxis[j];
        xAxis[j] = tempX;
      }
    }
  }

  return {
    X: xAxis,
    Y: yAxis
  };
}

export default (data, xAxisId) => {
  return groupingData(sdLayerBubbleSort(data), xAxisId);
};

export { sdLayerBubbleSort, groupDeptDataRefactor, groupingData };
