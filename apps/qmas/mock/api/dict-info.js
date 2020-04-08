const Data = [
  {
    ITEM_ID: "1",
    LEVEL: "1",
    ITEM_NAME: "字典类型1",
    ORDER_NO: 1,
    IS_VALID: 1,
    IS_TYPE: 1,
    UPD_USER: "admin",
    UPD_TIME: "2010-03-04 11:11:11",
    CHILDREN: [
      {
        ITEM_ID: "4",
        LEVEL: "2",
        ITEM_NAME: "字典值1-1",
        ORDER_NO: 1,
        IS_TYPE: 2,
        IS_VALID: 1,
        UPD_USER: "admin",
        UPD_TIME: "2010-03-04 11:11:11"
      },
      {
        ITEM_ID: "5",
        ITEM_NAME: "字典值1-2",
        LEVEL: "2",
        ORDER_NO: 1,
        IS_VALID: 1,
        IS_TYPE: 2,
        UPD_USER: "admin",
        UPD_TIME: "2010-03-04 11:11:11"
      },
      {
        ITEM_ID: "6",
        LEVEL: "2",
        ITEM_NAME: "字典值1-3",
        ORDER_NO: 1,
        IS_VALID: 1,
        IS_TYPE: 2,
        UPD_USER: "admin",
        UPD_TIME: "2010-03-04 11:11:11"
      }
    ]
  },
  {
    ITEM_ID: "2",
    LEVEL: "1",
    ITEM_NAME: "字典类型2",
    ORDER_NO: 1,
    IS_VALID: 1,
    IS_TYPE: 1,
    UPD_USER: "admin",
    UPD_TIME: "2010-03-04 11:11:11"
  },
  {
    ITEM_ID: "3",
    LEVEL: "1",
    ITEM_NAME: "字典类型3",
    ORDER_NO: 1,
    IS_VALID: 1,
    IS_TYPE: 1,
    UPD_USER: "admin",
    UPD_TIME: "2010-03-04 11:11:11",
    CHILDREN: [
      {
        ITEM_ID: "7",
        LEVEL: "2",
        ITEM_NAME: "字典值3-1",
        ORDER_NO: 1,
        IS_VALID: 1,
        IS_TYPE: 2,
        UPD_USER: "admin",
        UPD_TIME: "2010-03-04 11:11:11"
      }
    ]
  }
];

export default {
  // 字典管理
  route: "/DictInfo",

  verbs: {
    // 可直接返回JSON
    post: {
      Code: 0,
      Msg: "Ok!",
      Data: Data
    }
  }
};
