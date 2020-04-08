let data = [];
data.push({
  EMP_UID: "0002",
  USER_NAME: "1姓名",
  DOCTOR_CODE: "",
  // 绑定主治医生代码
  DOCTOR_NAME: ""
  // 绑定主治医生名称
});

for (let i = 0; i < 20; i++) {
  data.push({
    EMP_UID: `0002${i + 1}`,
    USER_NAME: `姓名${i + 1}`,
    DOCTOR_CODE: `190${i + 1}`,
    // 绑定主治医生代码
    DOCTOR_NAME: `黄志新${i + 1}`
    // 绑定主治医生名称
  });
}
const autoUser = {
  TotalRecords: data.length,
  Data: data
};

export default {
  // 用户管理--导入账号联想输入
  route: "/User/AutoImportUser",

  verbs: {
    get: {
      Code: 0,
      Msg: "列表获取成功!",
      Data: autoUser
    },

    post: {
      Code: 0,
      Msg: "导入成功!",
      Data: {
        USER_CODE: "用户编号001",
        USER_CLASS: 1
      }
    }
  }
};
