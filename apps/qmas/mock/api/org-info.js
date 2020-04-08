export default {
  route: "/OrgInfo",

  verbs: {
    get: {
      Code: 0,
      Msg: "ok",
      Data: null
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
