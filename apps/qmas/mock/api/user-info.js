const qaUserinfo = {
  TotalRecord: 4,

  Data: [
    {
      USER_CODE: "11",
      USER_LOGIN_NAME: "admin",
      USER_NAME: "王大夫",
      // 角色ID
      ROLE_ID: 1,
      // 角色名称
      ROLE_NAME: "角色名称1",
      // 绑定主治医生代码
      DOCTOR_CODE: "1903",
      // 绑定主治医生名称
      DOCTOR_NAME: "黄志新",
      IS_USER_DOC: 0,
      GENDER_CODE: 1,
      BIRTH_DATE: "1976-07",
      TITLE: "职业",
      // 1启用, 0未启用
      USE_FLAG: 1,
      LastLoginDate: "2017-06-01",
      // 角色类型（1超级管理员, 0不是）
      ROLE_TYPE: 1,
      USER_CLASS: 1
    },
    {
      USER_CODE: "22",
      USER_LOGIN_NAME: "guan1",
      USER_NAME: "李大夫",
      // 角色ID
      ROLE_ID: 2,
      // 角色名称
      ROLE_NAME: "角色名称角色名称2角色名称22角色名称角色名称2角色名称22",
      // 绑定主治医生代码
      DOCTOR_CODE: "1904",
      // 绑定主治医生名称
      DOCTOR_NAME: "黄志新黄志新黄志新黄志新黄志新黄志新黄志新2",
      IS_USER_DOC: 1,
      GENDER_CODE: 1,
      BIRTH_DATE: "1975-06",
      TITLE: "职业",
      // 1启用, 0未启用
      USE_FLAG: 0,
      LastLoginDate: "2017-06-03",
      // 角色类型（1超级管理员, 0不是）
      ROLE_TYPE: 0,
      USER_CLASS: 2
    },
    {
      USER_CODE: "33",
      USER_LOGIN_NAME: "guan2",
      USER_NAME: "张大夫",
      // 角色ID
      ROLE_ID: 3,
      // 角色名称
      ROLE_NAME: "角色名称3",
      // 绑定主治医生代码
      DOCTOR_CODE: "1905",
      // 绑定主治医生名称
      DOCTOR_NAME: "黄志新3",
      IS_USER_DOC: 1,
      GENDER_CODE: 2,
      BIRTH_DATE: "1977-03",
      TITLE: "职业",
      // 1启用, 0未启用
      USE_FLAG: 1,
      LastLoginDate: "2017-03-01",
      // 角色类型（1超级管理员, 0不是）
      ROLE_TYPE: 0,
      USER_CLASS: 1
    },
    {
      USER_CODE: "44",
      USER_LOGIN_NAME: "guan3",
      USER_NAME: "孙大夫",
      // 角色ID
      ROLE_ID: 4,
      // 角色名称
      ROLE_NAME: "角色名称4",
      // 绑定主治医生代码
      DOCTOR_CODE: "",
      // 绑定主治医生名称
      DOCTOR_NAME: "",
      IS_USER_DOC: 0,
      GENDER_CODE: 1,
      BIRTH_DATE: "1972-09",
      TITLE: "职业",
      // 1启用, 0未启用
      USE_FLAG: 1,
      LastLoginDate: "2017-04-01",
      // 角色类型（1超级管理员, 0不是）
      ROLE_TYPE: 0,
      USER_CLASS: 1
    }
  ],

  RoleName: [
    {
      ROLE_ID: 1,
      ROLE_NAME: "超级管理员",
      // 1选择  0未选择
      IsSelect: 1,
      ROLE_TYPE: 0
    },
    {
      ROLE_ID: 2,
      ROLE_NAME: "管理员",
      // 1选择  0未选择
      IsSelect: 0,
      ROLE_TYPE: 1
    },
    {
      ROLE_ID: 3,
      ROLE_NAME: "医生",
      // 1选择  0未选择
      IsSelect: 0,
      ROLE_TYPE: 0
    },
    {
      ROLE_ID: 4,
      ROLE_NAME: "院长",
      // 1选择  0未选择
      IsSelect: 0,
      ROLE_TYPE: 0
    },
    {
      ROLE_ID: 5,
      ROLE_NAME: "科主任",
      // 1选择  0未选择
      IsSelect: 0,
      ROLE_TYPE: 0
    }
  ]
};

// 用户管理表格
export default {
  route: "/User",

  verbs: {
    get: {
      Code: 0,
      Msg: "ok",
      Data: qaUserinfo
    },

    post: {
      Code: 0,
      Msg: "保存用户成功!",
      // USER_CODE: 字符串！
      Data: {
        USER_CODE: "用户编号001",
        // 1. 内部用户, 2. 外部用户
        USER_CLASS: 1
      }
    }
  }
};
