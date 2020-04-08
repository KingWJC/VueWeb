import Moment from "moment";

// @param rangeType {String} 范围类型（年/月/周）
// @return {Array} [开始日期(YYYY-MM-DD), 结束日期(YYYY-MM-DD)]
export default function(type, year, range) {
  // 已选择的年
  const selectedYear = Moment()
    .year(year)
    .format("YYYY");

  // 年
  if (type === "year") {
    let endMmt = Moment()
      .year(selectedYear)
      .month(11);
    // 获得当月最后一天
    let endMmtLastDate = endMmt.endOf("month").date();

    return {
      startDate: Moment()
        .year(selectedYear)
        .month(0)
        .date(1)
        .format("YYYY-MM-DD"),
      endDate: endMmt.date(endMmtLastDate).format("YYYY-MM-DD")
    };
  } else if (type === "halfyear") {
    // else:半年

    let startDay = Moment()
      .year(selectedYear)
      .quarter(range === 0 ? 1 : 3)
      .startOf("quarter")
      .format("YYYY-MM-DD");
    let lastDay = Moment()
      .year(selectedYear)
      .quarter(range === 0 ? 2 : 4)
      .endOf("quarter")
      .format("YYYY-MM-DD");

    return {
      startDate: startDay,
      endDate: lastDay
    };
  } else if (type === "season") {
    // else:季度

    let startDay = Moment()
      .year(selectedYear)
      .quarter(range + 1)
      .startOf("quarter")
      .format("YYYY-MM-DD");
    let lastDay = Moment()
      .year(selectedYear)
      .quarter(range + 1)
      .endOf("quarter")
      .format("YYYY-MM-DD");

    return {
      startDate: startDay,
      endDate: lastDay
    };
  } else if (type === "month") {
    // else:月

    let endMmt = Moment()
      .year(selectedYear)
      .month(range);
    // 获得当月最后一天
    let endMmtLastDate = endMmt.endOf("month").date();

    return {
      startDate: Moment()
        .year(selectedYear)
        .month(range)
        .date(1)
        .format("YYYY-MM-DD"),
      endDate: endMmt.date(endMmtLastDate).format("YYYY-MM-DD")
    };
  }
}
