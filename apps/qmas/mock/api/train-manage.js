const trainList = {
  TotalRecord: 4,

  Data: [
    {
      MATERIAL_ID: "1rtrgetrhrth1",
      TRAIN_ACT_ID: "fgsdfgdfg",
      MATERIAL_TYPE: "1",
      MATERIAL_TYPE_NAME: "基础课",
      VIEW_TITLE: "课程一",
      FILE_TYPE: "3",
      FILE_TYPE_NAME: "视频",
      MATERIAL_PATH: "C://fdsdfsd",
      HTML_CONTENT: "",
      CREATE_USER_ID: "sdagdfghdghfgh",
      CREATE_USER_NAME: "admin",
      CREATE_TIME: "2019-08-08",
      ORDER: 1,
      COUR_ORDER: 1,
      ALL_CNT: 4
    },
    {
      MATERIAL_ID: "1rtrgetrhrthwerwer1",
      TRAIN_ACT_ID: "fgsdfgdfg",
      MATERIAL_TYPE: "1",
      MATERIAL_TYPE_NAME: "基础课",
      VIEW_TITLE: "课程二",
      FILE_TYPE: "5",
      FILE_TYPE_NAME: "文本",
      MATERIAL_PATH: "C://fdsdfsd",
      HTML_CONTENT: "",
      CREATE_USER_ID: "sdagdfghdghfgh",
      CREATE_USER_NAME: "admin",
      CREATE_TIME: "2019-08-08",
      ORDER: 2,
      COUR_ORDER: 2,
      ALL_CNT: 4
    },
    {
      MATERIAL_ID: "1rtrgetrhrth1",
      TRAIN_ACT_ID: "fgsdfgdfg",
      MATERIAL_TYPE: "1",
      MATERIAL_TYPE_NAME: "基础课",
      VIEW_TITLE: "课程三",
      FILE_TYPE: "4",
      FILE_TYPE_NAME: "文件",
      MATERIAL_PATH: "C://fdsdfsd",
      HTML_CONTENT: "",
      CREATE_USER_ID: "sdagdfghdghfgh",
      CREATE_USER_NAME: "admin",
      CREATE_TIME: "2019-08-08",
      ORDER: 3,
      COUR_ORDER: 3,
      ALL_CNT: 4
    },
    {
      MATERIAL_ID: "1rtrgetrhrth1",
      TRAIN_ACT_ID: "fgsdfgdfg",
      MATERIAL_TYPE: "1",
      MATERIAL_TYPE_NAME: "基础课",
      VIEW_TITLE: "课程四",
      FILE_TYPE: "3",
      FILE_TYPE_NAME: "视频",
      MATERIAL_PATH: "C://fdsdfsd",
      HTML_CONTENT: "",
      CREATE_USER_ID: "sdagdfghdghfgh",
      CREATE_USER_NAME: "admin",
      CREATE_TIME: "2019-08-08",
      ORDER: 4,
      COUR_ORDER: 4,
      ALL_CNT: 4
    }
  ]
};

// 培训管理表格
export default {
  route: "/TrainManage",

  verbs: {
    get: {
      Code: 0,
      Msg: "ok",
      Data: trainList.Data
    },

    post: {
      Code: 0,
      Msg: "保存培训课程成功!",
      // USER_CODE: 字符串！
      Data: {
        MATERIAL_ID: "1rtrgetrhrth1",
        TRAIN_ACT_ID: "fgsdfgdfg",
        MATERIAL_TYPE: "1",
        MATERIAL_TYPE_NAME: "基础课",
        VIEW_TITLE: "课程二",
        FILE_TYPE: "3",
        FILE_TYPE_NAME: "视频",
        MATERIAL_PATH: "C://fdsdfsd",
        HTML_CONTENT: "",
        CREATE_USER_ID: "sdagdfghdghfgh",
        CREATE_USER_NAME: "admin",
        CREATE_TIME: "2019-08-08",
        ORDER: 1
      }
    }
  }
};
