// 分离原始api返回数组为 第二象限以及其他象限，用于
// 区分颜色
function filerXAndYData({ xValue, yValue, renderType, sourceData }) {
  // 筛选散点图显示的数据
  let firstData = [],
    secondData = [],
    thirdData = [],
    forthData = [],
    xBaseline = Number(xValue),
    yBaseline = Number(yValue),
    arrFee = [],
    maxFee = null,
    minFee = null,
    // 提取图例的名字
    legendName = sourceData.length > 0 ? sourceData[0].SD_CPAT_NO : "";

  sourceData.forEach((item) => {
    // 存放一个引用，准备往哪个里面push
    let dataObj = null;

    if (
      xValue !== null &&
      yValue !== null &&
      Number(item.AvgHospFee) > xBaseline &&
      (Number(item.DiagQuality) > yBaseline ||
        Number(item.DiagQuality) === yBaseline)
    ) {
      dataObj = firstData;
    } else if (
      xValue !== null &&
      yValue !== null &&
      (Number(item.AvgHospFee) < xBaseline ||
        Number(item.AvgHospFee) === xBaseline) &&
      (Number(item.DiagQuality) > yBaseline ||
        Number(item.DiagQuality) === yBaseline)
    ) {
      dataObj = secondData;
    } else if (
      xValue !== null &&
      yValue !== null &&
      Number(item.DiagQuality) < yBaseline &&
      (Number(item.AvgHospFee) < xBaseline ||
        Number(item.AvgHospFee) === xBaseline)
    ) {
      dataObj = thirdData;
    } else {
      dataObj = forthData;
    }

    // 存放tips参数
    dataObj.push([
      item.AvgHospFee,
      item.DiagQuality,
      item.FeeEffectRate,
      item.PATIENT_NO
    ]);

    arrFee.push(Number(item.AvgHospFee));
  });

  maxFee = Math.max.apply(Math, arrFee);
  minFee = Math.min.apply(Math, arrFee);

  postMessage({
    type: "filterData",
    firstData,
    secondData,
    thirdData,
    forthData,

    firstRate: ((firstData.length / sourceData.length) * 100).toFixed(1),
    secondRate: ((secondData.length / sourceData.length) * 100).toFixed(1),
    thirdRate: ((thirdData.length / sourceData.length) * 100).toFixed(1),
    forthRate: ((forthData.length / sourceData.length) * 100).toFixed(1),

    legendName,

    // 将传入的原始基线再一并回传过去
    xValue,
    yValue,

    maxFee,
    minFee,

    renderType
  });
}

// 费用，病例占比筛选
function rangeSelectDebouncer({
  params,
  firstData,
  secondData,
  thirdData,
  forthData
}) {
  // 存放圈选的点的数据
  let brushComponent = params.batch[0],
    // 统计选中项的数据值的和
    sumFee = 0,
    sumPat = 0;

  for (let sIdx = 0; sIdx < brushComponent.selected.length; sIdx++) {
    // 对于每个 series：
    // selected每个系列被选中的项
    // 用这些 dataIndex，可以去原始数据中找到真正的值。
    let dataIndices = brushComponent.selected[sIdx].dataIndex;
    sumPat += dataIndices.length;

    for (let i = 0; i < dataIndices.length; i++) {
      let dataIndex = dataIndices[i];

      // 选中区域的总费用
      if (sIdx === 0) {
        sumFee += Number(firstData[dataIndex][0]);
      } else if (sIdx === 1) {
        sumFee += Number(secondData[dataIndex][0]);
      } else if (sIdx === 2) {
        sumFee += Number(thirdData[dataIndex][0]);
      } else if (sIdx === 3) {
        sumFee += Number(forthData[dataIndex][0]);
      }
    }
  }

  postMessage({
    type: "computeFee",
    sumFee,
    sumPat
  });
}

// worker 收到消息
onmessage = function(event) {
  let data = JSON.parse(event.data);

  if (data.type === "filterData") {
    // 执行任务一
    filerXAndYData(data);
  } else {
    // 执行任务2
    rangeSelectDebouncer(data);
  }
};
