import Moment from "moment";

export default (accuracy, defaultDate) => {
  if (accuracy === "1") {
    return {
      stTime: Moment(defaultDate.startDate)
        .date(1)
        .format("YYYY-MM-DD"),
      edTime: Moment(defaultDate.endDate)
        .endOf("month")
        .format("YYYY-MM-DD")
    };
  } else if (accuracy === "2") {
    return {
      stTime: Moment(defaultDate.startDate)
        .startOf("quarter")
        .format("YYYY-MM-DD"),
      edTime: Moment(defaultDate.endDate)
        .endOf("quarter")
        .format("YYYY-MM-DD")
    };
  } else {
    return {
      stTime: defaultDate.startDate,
      edTime: defaultDate.endDate
    };
  }
};
