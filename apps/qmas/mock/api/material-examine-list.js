const results = [];
const TotalRecord = 25;

for (let i = 1; i < 25; i++) {
  results.push({
    USER_ID: "账号的ID",
    ORG_ID: "医院id",
    HOSP_NAME: "医院名称",
    DEPT_NAME: "科室名称",
    AC_APPLY_ID: "234",
    AC_TYPE_CODE: 1,
    AC_TYPE_NAME: "初审",
    APPLY_LEVEL: "初级",
    MATERIAL_GRADE: 54,
    DATA_GRADE: 65,
    SCENE_GRADE: 78,
    STATE_ID: "sdfsd",
    STATE_VALUE: 5,
    STATE_VALUE_NAME: "待分配",
    AC_RESULT: "初级",
    UPD_USER_ID: "sdfasd",
    UPD_USER_NAME: "张三",
    UPD_TIME: "2019-2-2"
  });
}

const dataAudit = {
  TotalRecord: TotalRecord,
  Data: results
};

// 角色管理表格
export default {
  route: "/MaterialAudit",

  verbs: {
    post: {
      Code: 0,
      Msg: "ok",
      data: dataAudit
    }
  }
};
