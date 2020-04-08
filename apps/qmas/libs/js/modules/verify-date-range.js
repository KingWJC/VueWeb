import Moment from "moment";

// 检查一个日期范围是否是合法范围（5年内）
export default function(rgObj) {
  // 当前范围是否合法，不合法需要立即跳转到合法日期
  let isValidRange = true;

  const curEndDateMmt = Moment().subtract(1, "days");
  const curStartDateMmt = curEndDateMmt.clone().subtract(5, "years");

  // 检查当前传入的日期范围是否是合法日期
  const rgStartDate = rgObj.startDate;
  const rgEndDate = rgObj.endDate;

  // 范围未传入日期
  if (!rgStartDate || !rgEndDate) {
    isValidRange = false;
  } else if (!Moment(rgStartDate).isValid() || !Moment(rgEndDate).isValid()) {
    // else：范围传入日期，但不是合法日期格式, e.g. 2017-83-32

    isValidRange = false;
  } else if (Moment(rgStartDate) > Moment(rgEndDate)) {
    // else：范围传入合法日期，但范围颠倒（起大于止）

    isValidRange = false;
  } else if (
    Moment(rgStartDate) < curStartDateMmt ||
    Moment(rgEndDate) > curEndDateMmt
  ) {
    // else：范围传入合法日期，范围正常，但越界（小于5年，大于昨天）

    isValidRange = false;
  }

  return isValidRange;
}
