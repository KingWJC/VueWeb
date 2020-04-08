const results = [];
const TotalRecord = 25;

for (let i = 1; i < 5; i++) {
  results.push({
    ACTION_ID: i,
    ACTION_DATE: i > 9 ? `2017-12-${i}` : `2017-12-0${i}`,
    ACTION_TYPE: "actionType_" + i,
    ACTION_TYPE_NAME: "操作类型" + i,
    ACTION_EVENT: "actionEvent_" + i,
    ACTION_EVENT_NAME: "操作事件" + i,
    ACTION_CONT:
      "操作内操作内容操作内容操作内容操作内容操作内容操作内容操作内容操作内容操作内容操作内容操作内容容" +
      i,
    USER_CODE: "userCode_" + i,
    USER_NAME: "操作人" + i,
    ACTION_VALUE: i % 2 === 0 ? "0" : "1"
  });
}

const Data = [
  {
    TimeRange: ["2017-01-01", "2017-12-25"],

    ActionType: [
      {
        ACTION_TYPE: "actionType_1",
        ACTION_TYPE_NAME: "操作类型1"
      },
      {
        ACTION_TYPE: "actionType_2",
        ACTION_TYPE_NAME: "操作类型2"
      }
    ],

    ActionEvent: [
      {
        ACTION_EVENT: "actionEvent_1",
        ACTION_EVENT_NAME: "操作事件1"
      },
      {
        ACTION_EVENT: "actionEvent_2",
        ACTION_EVENT_NAME: "操作事件2"
      }
    ],

    ActionUser: [
      {
        USER_CODE: "userCode_1",
        USER_NAME: "操作人1"
      },
      {
        USER_CODE: "userCode_2",
        USER_NAME: "操作人2"
      }
    ],

    Actions: results,
    TotalResult: TotalRecord
  }
];

const logInfo = {
  TotalRecord: TotalRecord,
  Data: Data
};

export default {
  // 日志管理
  route: "/Log",

  verbs: {
    // 可直接返回JSON
    post: {
      Code: 0,
      Msg: "Ok!",
      Data: logInfo
    }
  }
};
