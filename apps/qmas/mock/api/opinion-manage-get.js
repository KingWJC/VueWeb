const results = [];
const TotalRecord = 25;

for (let i = 1; i < 25; i++) {
  results.push({
    ID: i + 1,
    OP_GUID: i,
    ROLE_ID: 2,
    ROLE_NAME: "平台管理员",
    USER_ID: "账号的ID",
    USER_NAME: "测试1",
    OPINION_DESC: "测试意见描述",
    CONTACT_WAY: "1333333",
    CONTACT_NAME: "HHHH",
    IS_FEEDBACK: 0,
    IS_FEEDBACK_NAME: "未反馈",
    COMMIT_TIME: "2020-02-26 00:12:12",
    FB_USER_ID: "123",
    FB_USER_NAME: "FB123",
    FB_CON: "正在协商解决",
    FB_TIME: "2020-02-26 00:12:12"
  });
}

const opinionManage = {
  TotalRecord: TotalRecord,
  Data: results
};

export default {
  // 日志管理
  route: "/Opinion/GetOpinionData",

  verbs: {
    // 可直接返回JSON
    post: {
      Code: 0,
      Msg: "Ok!",
      Data: opinionManage
    }
  }
};
