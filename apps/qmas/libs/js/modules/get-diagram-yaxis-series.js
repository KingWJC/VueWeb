// 构造tips数据结构
function getTipsData(yAxisDataArr) {
  // 柱图tips显示所需数据
  let seriesData = [],
    seriesStructure = [[], [], []];

  for (let i = 0; i < yAxisDataArr[0].length; i++) {
    yAxisDataArr.forEach((item, index) => {
      if (index < yAxisDataArr.length - 1) {
        seriesData.push({
          value: yAxisDataArr[index][i],
          datas: [item, yAxisDataArr[yAxisDataArr.length - 1]],
          arr: yAxisDataArr
        });
      }
    });
  }

  // 拼装seriesStructure
  seriesData.forEach((item, index) => {
    if (index % 3 === 0) {
      seriesStructure[0].push(item);
    } else if (index % 3 === 1) {
      seriesStructure[1].push(item);
    } else {
      seriesStructure[2].push(item);
    }
  });

  return seriesStructure;
}

// @param originalData Object
// @param legendType string
export default (originalData, legendType) => {
  let xAxis = [];

  if (legendType) {
    if (legendType === "drgTrend") {
      xAxis = originalData.X.map((item) => {
        return `${item.MinRange}~${item.MaxRange}`;
      });
    } else {
      xAxis = originalData.X.map((item) => {
        let xText;

        if (legendType === "dept") {
          xText = item.DEPT_NAME;
        } else if (legendType === "group") {
          xText = item.GROUP_NAME;
        } else if (legendType === "doctor") {
          xText = item.DOCTOR_NAME;
        }

        return xText;
      });
    }
  } else {
    xAxis = originalData.X;
  }

  let yAxisData = {},
    length = originalData.Y[0].Item.length,
    seriesStructure = [[], [], []];

  // 对y轴的三根柱子依次遍历
  originalData.Y[0].Item.forEach((item, index) => {
    // 将Y轴对应柱子的数据整合（三根柱，三个数据集合）
    yAxisData[index] = originalData.Y.map((rate) => {
      return rate.Rate[index];
    });
  });

  // 渲图所需的Y轴数据格式
  let yData = Object.keys(yAxisData).reduce((yData, idx) => {
    if (idx < length - 1) {
      yData.push({
        name: originalData.Y[0].Item[idx],
        unit: idx === "0" ? "元/例" : idx === "1" ? "%" : "",
        max: idx === "1" ? 100 : null,
        data: yAxisData[idx],
        type: legendType === "drgTrend" ? (idx === "2" ? "line" : "bar") : "bar"
      });
    }

    return yData;
  }, []);

  // Object.values 不兼容IE 10
  // tips数据结构
  seriesStructure = getTipsData(
    Object.keys(yAxisData).map((idx) => {
      return yAxisData[idx];
    })
  );

  return {
    xAxis,
    yData,
    seriesStructure
  };
};
