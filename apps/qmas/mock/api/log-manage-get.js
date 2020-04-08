const results = [];
const TotalRecord = 25;

for (let i = 1; i < 10; i++) {
  results.push({
    ID: i,
    OPER_TIME: i > 9 ? `2017-12-${i} 00:12:23` : `2017-12-0${i} 00:22:23`,
    MODULE: "操作模块_" + i,
    IP: "221.168.1.2",
    MODULE_NAME: "模块" + i,
    OPER_USER_NAME: "操作用户" + i,
    OPER_USER_REAL_NAME: "用户姓名" + i,
    OPER_DESC: "用户登录成功"
  });
}

const logInfo = {
  TotalRecord: TotalRecord,
  Data: results
};

export default {
  // 日志管理
  route: "/Log/LogManage",

  verbs: {
    // 可直接返回JSON
    post: {
      Code: 0,
      Msg: "Ok!",
      Data: logInfo
    }
  }
};
