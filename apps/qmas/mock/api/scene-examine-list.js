const results = [];
const TotalRecord = 25;

const dataAudit = {
  TotalRecord: TotalRecord,
  Data: results
};

// 角色管理表格
export default {
  route: "/SceneAudit",

  verbs: {
    post: {
      Code: 0,
      Msg: "ok",
      data: dataAudit
    }
  }
};
