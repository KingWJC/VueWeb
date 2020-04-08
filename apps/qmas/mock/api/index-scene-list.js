const roleinfo = {
  TotalRecord: 3,

  Data: [
    {
      ID: 1,
      INDEX_PURPOSE: "2",
      INDEX_CODE: "ICU01",
      INDEX_ONE_LEVEL: "一级指标",
      INDEX_TWO_LEVEL: null,
      INDEX_THREE_LEVEL: null,
      IS_NEED_PROVE: 1,
      PROVE_FILE_REQ: "1",
      INDEX_DESC: "指标释义与评分标准",
      STANDARD_SCORE: "标准分值",
      IS_VALID: 1
    },
    {
      ID: 1,
      INDEX_PURPOSE: "1",
      INDEX_CODE: "ICU01",
      INDEX_ONE_LEVEL: "一级指标",
      INDEX_TWO_LEVEL: null,
      INDEX_THREE_LEVEL: "三级指标",
      IS_NEED_PROVE: 2,
      PROVE_FILE_REQ: "证明文件要求",
      INDEX_DESC: "指标释义与评分标准",
      STANDARD_SCORE: "标准分值",
      IS_VALID: 1
    },
    {
      ID: 1,
      INDEX_PURPOSE: "1",
      INDEX_CODE: "ICU01",
      INDEX_ONE_LEVEL: "",
      INDEX_TWO_LEVEL: "二级指标",
      INDEX_THREE_LEVEL: null,
      IS_NEED_PROVE: 2,
      PROVE_FILE_REQ: "证明文件要求",
      INDEX_DESC: "指标释义与评分标准",
      STANDARD_SCORE: "标准分值",
      IS_VALID: 1
    },
    {
      ID: 1,
      INDEX_PURPOSE: "4",
      INDEX_CODE: "现场",
      INDEX_ONE_LEVEL: "现场指标",
      INDEX_TWO_LEVEL: "二级指标",
      INDEX_THREE_LEVEL: null,
      IS_NEED_PROVE: 2,
      PROVE_FILE_REQ: "证明文件要求",
      INDEX_DESC: "指标释义与评分标准",
      STANDARD_SCORE: "标准分值",
      IS_VALID: 1
    }
  ]
};

// 角色管理表格
export default {
  route: "/indexscene",

  verbs: {
    get: {
      Code: 0,
      Msg: "ok",
      Data: roleinfo
    }
  }
};
