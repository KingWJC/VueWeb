export default {
  //
  route: "/SelectDictValue",

  verbs: {
    // 可直接返回JSON
    get: {
      Code: 0,
      Msg: "Ok!",
      Data: [
        {
          code: "1",
          name: "一级"
        },
        {
          code: "2",
          name: "二级"
        },
        {
          code: "3",
          name: "三级"
        },
        {
          code: "4",
          name: "四级"
        }
      ]
    }
  }
};
