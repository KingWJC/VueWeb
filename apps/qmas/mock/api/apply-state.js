export default {
  route: "/Apply/{ApplyId}/ApplyState",

  verbs: {
    put: {
      // 0:成功 ,1:失败,2:数据已经失效
      Code: 0,
      Msg: "ok"
    }
  }
};
