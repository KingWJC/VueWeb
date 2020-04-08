const dataInfo = [
  {
    ID: 1,
    ITEM_NAME: "项目名称",
    ITEM_DESC: "项目描述",
    FILE_REQUIRE: "证明文件要求",
    ITEM_LEVEL: 1,
    IS_VALID: 1
  }
];

export default {
  route: "/IndexTempManage/SubmitBaseData",

  verbs: {
    post: {
      Code: 0,
      Msg: "ok!",
      Data: dataInfo
    }
  }
};
