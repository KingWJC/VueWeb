import Moment from "moment";

/**
 *  格式化X轴日期显示
 *  @param {Object} dateSource 日期范围
 *  @param {String} precision 维度
 */
export default function(dateSource, precision) {
  let result;

  if (precision === "1") {
    result = dateSource.map((item) => {
      return Moment(item.MinRange).format("YYYY-MM");
    });
  } else if (precision === "2") {
    result = dateSource.map((item) => {
      let mmtObj = Moment(item.MinRange),
        year = mmtObj.year(),
        nums = mmtObj.quarter();

      return `${year}年Q${nums}`;
    });
  } else if (precision === "3") {
    result = dateSource.map((item) => {
      let mmtObj = Moment(item.MinRange),
        year = mmtObj.year(),
        nums = mmtObj.quarter(),
        halfYear = nums === 1 || nums === 2 ? "上半年" : "下半年";

      return `${year}年${halfYear}`;
    });
  } else if (precision === "4") {
    result = dateSource.map((item) => {
      let mmtObj = Moment(item.MinRange),
        year = mmtObj.year();

      return `${year}年`;
    });
  } else {
    result = dateSource.map((item) => {
      return `${item.MinRange}\n~\n${item.MaxRange}`;
    });
  }

  return result;
}
