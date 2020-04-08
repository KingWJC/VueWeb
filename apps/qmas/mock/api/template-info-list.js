const roleinfo = {
  TotalRecord: 1,
  Data: [
    {
      ID: "1",
      TMP_CODE: "数据审核页面",
      TMP_NAME: "",
      DOC_LIST: [
        {
          docId: 1,
          docName: "文档1",
          filePath: ""
        },
        {
          docId: 2,
          docName: "文档2",
          filePath: ""
        }
      ],
      TemplateCount: 2,
      TMP_PATH: "C://windows/123",
      CREATE_USER_ID: "lcy",
      CREATE_TIME: "2019-08-26T00:00:00",
      UPD_USER_ID: "lcy",
      UPD_TIME: "2019-08-27T00:00:00",
      REMARK: null
    },
    {
      ID: "2",
      TMP_CODE: "现场审核页面",
      TMP_NAME: "",
      DOC_LIST: [
        {
          docId: 3,
          docName: "文档3",
          filePath: ""
        },
        {
          docId: 4,
          docName: "文档4",
          filePath: ""
        },
        {
          docId: 5,
          docName: "文档5",
          filePath: ""
        }
      ],
      TemplateCount: 3,
      TMP_PATH: "C://windows/1234",
      CREATE_USER_ID: "lcy",
      CREATE_TIME: "2019-08-26T00:00:00",
      UPD_USER_ID: "lcy",
      UPD_TIME: "2019-08-27T00:00:00",
      REMARK: null
    }
  ]
};

// 角色管理表格
export default {
  route: "/templateinfo",

  verbs: {
    get: {
      Code: 0,
      Msg: "ok",
      Data: roleinfo
    },
    post: {
      Code: 0,
      Msg: "ok!"
    }
  }
};
