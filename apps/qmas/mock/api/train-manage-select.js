export default {
  route: "/TrainManage/Select",

  verbs: {
    get: {
      Code: 0,
      Msg: "ok",
      Data: {
        selectMaterialType: [
          {
            ID: "1",
            DICT_VAL_NAME: "基础课"
          },
          {
            ID: "2",
            DICT_VAL_NAME: "进阶课"
          }
        ],
        selectFileType: [
          {
            ID: "3",
            DICT_VAL_NAME: "视频"
          },
          {
            ID: "4",
            DICT_VAL_NAME: "文件"
          },
          {
            ID: "5",
            DICT_VAL_NAME: "文本"
          }
        ]
      }
    }
  }
};
