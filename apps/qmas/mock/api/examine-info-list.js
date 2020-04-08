const roleinfo = {
  TotalRecord: 3,

  Data: [
    {
      ID: 1,
      STAND_NAME: "材料评审",
      BASE_VALUE: 60,
      MIDDLE_VALUE: 70,
      HIGH_VALUE: 90
    },
    {
      ID: 1,
      STAND_NAME: "数据评审",
      BASE_VALUE: 60,
      MIDDLE_VALUE: 70,
      HIGH_VALUE: 90
    },
    {
      ID: 1,
      STAND_NAME: "现场评审",
      BASE_VALUE: 60,
      MIDDLE_VALUE: 70,
      HIGH_VALUE: 90
    }
  ]
};

// 角色管理表格
export default {
  route: "/examineinfo",

  verbs: {
    get: {
      Code: 0,
      Msg: "ok",
      Data: roleinfo
    }
  }
};
