const roleinfo = {
  TotalRecord: 3,

  Data: [
    {
      ID: 1,
      ITEM_NAME: "项目名称",
      ITEM_DESC: "项目描述",
      FILE_REQUIRE: "证明文件要求",
      ITEM_LEVEL: 1,
      IS_VALID: 1
    },
    {
      ID: 1,
      ITEM_NAME: "项目名称",
      ITEM_DESC: "项目描述",
      FILE_REQUIRE: "证明文件要求",
      ITEM_LEVEL: 2,
      IS_VALID: 2
    }
  ]
};

// 角色管理表格
export default {
  route: "/indexbase",

  verbs: {
    get: {
      Code: 0,
      Msg: "ok",
      Data: roleinfo
    }
  }
};
