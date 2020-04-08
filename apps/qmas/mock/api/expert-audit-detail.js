const expertAuditDetail = {
  TotalRecord: 4,

  OtherData: [
    {
      STATE_ID: "skldjflkasdlk;",
      STATE_TYPE: "材料审核",
      GRADE: 50,
      STATE_VALUE: "通过",
      AUDIT_USER_NAME: "张三",
      AUDIT_TIME: "2019-8-3",
      REMARK: "备注啥的积分开始懂了"
    },
    {
      STATE_ID: "skldjflkasdlk;",
      STATE_TYPE: "数据审核",
      GRADE: 50,
      STATE_VALUE: "通过",
      AUDIT_USER_NAME: "张三",
      AUDIT_TIME: "2019-8-3",
      REMARK: "备注啥的积分开始懂了"
    },
    {
      STATE_ID: "skldjflkasdlk;",
      STATE_TYPE: "现场审核",
      GRADE: 50,
      STATE_VALUE: "通过",
      AUDIT_USER_NAME: "张三",
      AUDIT_TIME: "2019-8-3",
      REMARK: "备注啥的积分开始懂了"
    }
  ],

  MyData: {
    STATE_ID: "skldjflkasdlk;",
    STATE_TYPE: "我的意见",
    GRADE: 50,
    STATE_VALUE: "通过",
    AUDIT_USER_NAME: "张三",
    AUDIT_TIME: "2019-8-3",
    REMARK: "备注啥的积分开始懂了"
  },

  AcInfo: {
    AcOrgName: "中山人民医院重症科",
    AcType: "初审",
    AcLevel: "初级",
    ApplyTime: "2019-1-1",
    SystemSuggestLevel: "初级"
  }
};

// 角色管理表格
export default {
  route: "/ExpertAuditDetail",

  verbs: {
    get: {
      Code: 0,
      Msg: "ok",
      Data: {
        OtherAudit: expertAuditDetail.OtherData,
        MyAudit: expertAuditDetail.MyData,
        AcInfo: expertAuditDetail.AcInfo
      }
    }
  }
};
