import Moment from "moment";

// 质控项目，计算一个日期范围(截止到昨天)
// @param rangeType {String} 范围类型（年/月/周）
// @return {Array} [开始日期(YYYY-MM-DD), 结束日期(YYYY-MM-DD)]
export default function(rangeType) {
  const relativeMmt = Moment().subtract(1, "days");
  const yesterday = relativeMmt.format("YYYY-MM-DD");
  const oneWeekAgo = relativeMmt
    .clone()
    .subtract(1, "weeks")
    .add(1, "days")
    .format("YYYY-MM-DD");
  const oneMonthAgo = relativeMmt
    .clone()
    .subtract(1, "months")
    .add(1, "days")
    .format("YYYY-MM-DD");
  const oneYearAgo = relativeMmt
    .clone()
    .subtract(1, "years")
    .add(1, "days")
    .format("YYYY-MM-DD");
  const fiveYearsAgo = relativeMmt
    .clone()
    .subtract(5, "years")
    .add(1, "days")
    .format("YYYY-MM-DD");
  const oneQuarterAgo = relativeMmt
    .clone()
    .subtract(3, "months")
    .add(1, "days")
    .format("YYYY-MM-DD");
  const harfYearAgo = relativeMmt
    .clone()
    .subtract(6, "months")
    .add(1, "days")
    .format("YYYY-MM-DD");

  // 今天：2017-08-15
  // 一个星期 [2017-08-08 - 2017-08-14]
  if (rangeType === "oneWeek") {
    return {
      startDate: oneWeekAgo,
      endDate: yesterday
    };
  } else if (rangeType === "oneMonth") {
    // else:一个月 [2017-07-15 - 2017-08-14]

    return {
      startDate: oneMonthAgo,
      endDate: yesterday
    };
  } else if (rangeType === "oneYear") {
    // else:一年 [2016-08-15 - 2017-08-14]

    return {
      startDate: oneYearAgo,
      endDate: yesterday
    };
  } else if (rangeType === "fiveYears") {
    // else:五年 [2012-08-15 - 2017-08-14]

    return {
      startDate: fiveYearsAgo,
      endDate: yesterday
    };
  } else if (rangeType === "oneQuarter") {
    // else:一个季度 [2017-01-01 - 2017-03-31]

    return {
      startDate: oneQuarterAgo,
      endDate: yesterday
    };
  } else if (rangeType === "harfYear") {
    // else:半年 [2017-01-01 - 2017-06-30]

    return {
      startDate: harfYearAgo,
      endDate: yesterday
    };
  }

  // 默认返回 一个月
  return {
    startDate: oneMonthAgo,
    endDate: yesterday
  };
}
