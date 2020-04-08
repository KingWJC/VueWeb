const results = [];

for (let i = 1; i < 25; i++) {
  results.push({
    STATE_ID: "skldjflkasdlk;",
    AC_APPLY_ID: "23twefwq45324",
    STATE_TYPE: "1",
    STATE_TYPE_NAME: "材料审核",
    GRADE: 50,
    STATE_VALUE: "通过",
    FEEDBACK_MSG: "反馈信息",
    AUDIT_USER_NAME: "张三",
    AUDIT_TIME: "2019-8-3",
    REMARK: "备注啥的积分开始懂了"
  });
}

const AcInfo = {
  AcOrgName: "中山人民医院重症科",
  AcType: "初审",
  AcLevel: "初级",
  ApplyTime: "2019-1-1",
  CurrentSection: "数据审核",
  State: "审核中"
};

const ProgressData = {
  Active: 2,
  ProcessStatus: "error",
  SteptInfo: [
    {
      ApplyId: "applyid",
      StateId: "stateid",
      SteptName: "认证申请",
      StateType: 1,
      StateCode: 8,
      StateName: "完成",
      FinishTime: "2019-02-03",
      IsViewDetail: false,
      IsReapply: false
    },
    {
      ApplyId: "applyid",
      StateId: "stateid",
      SteptName: "材料审核",
      StateType: 1,
      StateCode: 8,
      StateName: "通过",
      FinishTime: "2019-02-03",
      IsViewDetail: true,
      IsReapply: true
    },
    {
      ApplyId: "applyid",
      StateId: "stateid",
      SteptName: "数据审核",
      StateType: 1,
      StateCode: 9,
      StateName: "不通过",
      FinishTime: "2019-02-03",
      IsViewDetail: true,
      IsReapply: true
    },
    {
      ApplyId: "applyid",
      StateId: "stateid",
      SteptName: "现场审核",
      StateType: 1,
      StateCode: 8,
      StateName: "通过",
      FinishTime: "2019-02-03",
      IsViewDetail: true,
      IsReapply: false
    },
    {
      ApplyId: "applyid",
      StateId: "stateid",
      SteptName: "专家组审核",
      StateType: 1,
      StateCode: 8,
      StateName: "通过",
      FinishTime: "2019-02-03",
      IsViewDetail: false,
      IsReapply: false
    },
    {
      ApplyId: "applyid",
      StateId: "stateid",
      SteptName: "完成",
      StateType: 1,
      StateCode: 8,
      StateName: "完成",
      FinishTime: "2019-02-03",
      IsViewDetail: false,
      IsReapply: false
    }
  ]
};

export default {
  route: "/CertificationDetail",

  verbs: {
    get: {
      Code: 0,
      Msg: "ok",
      Data: {
        AuditRecord: results,
        AcInfo: AcInfo,
        ProgressData: ProgressData
      }
    }
  }
};
