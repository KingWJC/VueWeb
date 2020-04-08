const userOrgData = [
  {
    ROLE_ID: 4,
    ROLE_NAME: "机构用户",
    USER_ID: 1,
    USER_NAME: "测试机构用户",
    CONTACT_NAME: "测试联系人"
  },
  {
    ROLE_ID: 3,
    ROLE_NAME: "专家用户",
    USER_ID: 1,
    USER_NAME: "测试专家用户",
    CONTACT_NAME: "测试联系人"
  }
];

export default {
  // 日志管理
  route: "/Opinion/GetUserData",

  verbs: {
    // 可直接返回JSON
    post: {
      Code: 0,
      Msg: "Ok!",
      Data: userOrgData
    }
  }
};
