// 使用新的原因更新质控点列表
export default function(pointList, reasonObj) {
  // 修改前端质控点反馈原因
  let retList = pointList.map((item) => {
    if (item.KPI_ID === reasonObj.kpiCode) {
      item.RSN_FLAG = 1;
      item.Reasons = reasonObj.selectedArr;
    }

    return item;
  });

  return retList;
}
