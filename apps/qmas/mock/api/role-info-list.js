const roleinfo = {
  TotalRecord: 5,

  Data: [
    {
      ROLE_ID: 1,
      ROLE_NAME: "密探007",
      // 1.启用 0.未启用
      USE_FLAG: 1,
      // 1.管理员角色 0.普通角色
      ROLE_TYPE: 1
    },
    {
      ROLE_ID: 2,
      ROLE_NAME: "管理员",
      // 1.启用 0.未启用
      USE_FLAG: 1,
      // 1.管理员角色 0.普通角色
      ROLE_TYPE: 0
    },
    {
      ROLE_ID: 3,
      ROLE_NAME: "医生",
      // 1.启用 0.未启用
      USE_FLAG: 1,
      // 1.管理员角色 0.普通角色
      ROLE_TYPE: 0
    },
    {
      ROLE_ID: 4,
      ROLE_NAME: "院长",
      // 1.启用 0.未启用
      USE_FLAG: 1,
      // 1.管理员角色 0.普通角色
      ROLE_TYPE: 0
    },
    {
      ROLE_ID: 5,
      ROLE_NAME: "科主任",
      // 1.启用 0.未启用
      USE_FLAG: 1,
      // 1.管理员角色 0.普通角色
      ROLE_TYPE: 0
    }
  ]
};

// 角色管理表格
export default {
  route: "/Role",

  verbs: {
    get: {
      Code: 0,
      Msg: "ok",
      Data: roleinfo
    }
  }
};
