const resultConfirm = {
  TotalRecord: 4,

  Data: [
    {
      ID: "ID",
      STATE_ID: "流程状态ID",
      EXPERT_ID: "专家ID",
      EXPERT_NAME: "专家姓名",
      AUDIT_STATE: "已审核",
      AUDIT_RESULT: "审核结果",
      UPD_TIME: "审核时间",
      REMARK: "备注"
    },
    {
      ID: "ID",
      STATE_ID: "流程状态ID",
      EXPERT_ID: "专家ID",
      EXPERT_NAME: "专家姓名",
      AUDIT_STATE: "已审核",
      AUDIT_RESULT: "审核结果",
      UPD_TIME: "审核时间",
      REMARK: "备注"
    },
    {
      ID: "ID",
      STATE_ID: "流程状态ID",
      EXPERT_ID: "专家ID",
      EXPERT_NAME: "专家姓名",
      AUDIT_STATE: "已审核",
      AUDIT_RESULT: "审核结果",
      UPD_TIME: "审核时间",
      REMARK: "备注"
    },
    {
      ID: "ID",
      STATE_ID: "流程状态ID",
      EXPERT_ID: "专家ID",
      EXPERT_NAME: "专家姓名",
      AUDIT_STATE: "已审核",
      AUDIT_RESULT: "审核结果",
      UPD_TIME: "审核时间",
      REMARK: "备注"
    },
    {
      ID: "ID",
      STATE_ID: "流程状态ID",
      EXPERT_ID: "专家ID",
      EXPERT_NAME: "专家姓名",
      AUDIT_STATE: "已审核",
      AUDIT_RESULT: "审核结果",
      UPD_TIME: "审核时间",
      REMARK: "备注"
    }
  ]
};

// 培训管理表格
export default {
  route: "/ResultConfirm",

  verbs: {
    get: {
      Code: 0,
      Msg: "ok",
      Data: {
        expertAuditList: resultConfirm.Data,
        adviceLevel: "初级"
      }
    },

    post: {
      Code: 0,
      Msg: "保存培训课程成功!",
      // USER_CODE: 字符串！
      Data: {}
    }
  }
};
