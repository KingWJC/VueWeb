const results = [];
const TotalRecord = 25;

for (let i = 1; i < 25; i++) {
  results.push({
    USER_ID: "账号的ID",
    ORG_ID: "医院id",
    HOSP_NAME:
      "医院名称哒哒哒哒哒哒多多多多多多多多多多多多哒哒哒哒哒哒多多多多多",
    DEPT_NAME:
      "科室名称哒哒哒哒哒哒多多多多多多多多多多多多多多多多多多多多多多多多多多多多多多多多",
    AC_APPLY_ID: "234",
    AC_TYPE_CODE: 1,
    AC_TYPE_NAME: "初审",
    APPLY_LEVEL: "初级",
    APPLY_TIME: "2019-08-21",
    AC_SECTION: "数据审核",
    STATE_ID: "sdfsd",
    STATE_VALUE: 5,
    STATE_VALUE_NAME: "待分配",
    AC_RESULT: "初级",
    START_TIME: "2019-09-02",
    END_TIME: "2012-09-02"
  });
}

const certificationManage = {
  TotalRecord: TotalRecord,
  Data: results
};

export default {
  // 日志管理
  route: "/CertificationManage",

  verbs: {
    // 可直接返回JSON
    post: {
      Code: 0,
      Msg: "Ok!",
      Data: certificationManage
    }
  }
};
