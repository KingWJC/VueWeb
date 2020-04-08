const dataInfo = [
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
  }
];

export default {
  route: "/IndexTempManage/UploadData",

  verbs: {
    get: {
      Code: 0,
      Msg: "ok!",
      Data: dataInfo
    }
  }
};
