const expertAuditDetail = {
  TotalRecord: 4,

  SepsisData: [],

  AcInfo: {
    AcOrgName: "中山人民医院重症科",
    AcType: "初审",
    AcLevel: "初级",
    ApplyTime: "2019-1-1",
    SystemSuggestLevel: "初级"
  }
};
export default {
  route: "/SceneAuditDetail",

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
