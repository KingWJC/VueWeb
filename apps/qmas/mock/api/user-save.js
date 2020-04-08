// 用户管理表格
export default {
  route: "/User/SaveUser",

  verbs: {
    post: {
      Code: 0,
      Msg: "保存用户成功!",
      Data: {
        USER_CODE: "用户编号001",
        // 1. 内部用户, 2. 外部用户
        USER_CLASS: 1
      }
    }
  }
};
