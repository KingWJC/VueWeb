import { publicPath, apiRoot } from "../config";

// 所有页面共用，全局数据
export default {
  // 静态文件路径
  static_url: publicPath,
  service_url: apiRoot,
  // 用户当前科研队列病历总数
  case_count: 187,
  out_url: "https://www.bing.com",
  setting: [
    {
      ItemCode: "PWD_ONTIME_UPD",
      ItemVal: "1",
      ItemName: "用户口令定期更换"
    },
    {
      ItemCode: "PWD_STRONG",
      ItemVal: "1",
      ItemName: "高强度密码"
    },
    {
      ItemCode: "AUTO_EXIT_TIME",
      ItemVal: 5,
      ItemName: "自动退出时间"
    }
  ],
  // 登录上下文(请咨询后端同学获得额外需要的字段名，必须与后端输出字段完全统一)
  login_context: {
    // 任务数
    TaskCount: 23,
    DefaultScqId: 1,
    UserClass: 2,
    // 用户 ID/名称/API token
    UserId: "00",
    UserName: "加菲",
    Token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9",

    // 用户当前科研队列 代码/名称
    SCQ_ID: 2,
    SCQ_NAME: "加菲的科研A",

    // 用户当前病种 代码/名称
    SD_ID: 1,
    SD_CODE: "HD",
    SD_NAME: "先天性巨结肠",

    // 用户当前科研项目 代码/名称
    SC_ID: 1,
    SC_NAME: "巨结肠研究小组项目",

    Permission: {
      // 为 true，所有菜单可见链接都显示
      IsAdmin: false,
      Func: ["setbaseline"]
    },

    //  menu-type:1 文件夹 2页面 3内容关联页面
    PageMenu: [
      {
        MENU_CODE: "opinion",
        MENU_NAME: "意见",
        DISPLAY_ORDER: null,
        HOME_ORDER: null,
        PARENT_CODE: null,
        MENU_TYPE: 1,
        PAGE_URL: null,
        PAGE_CODE: "opinion"
      },
      {
        MENU_CODE: "opinionfeedback",
        MENU_NAME: "意见反馈",
        DISPLAY_ORDER: 1,
        HOME_ORDER: null,
        PARENT_CODE: "opinion",
        MENU_TYPE: 2,
        PAGE_URL: "/OpinionFeedBack",
        PAGE_CODE: "OpinionFeedBack"
      },
      {
        MENU_CODE: "opinionmanage",
        MENU_NAME: "意见管理",
        DISPLAY_ORDER: 2,
        HOME_ORDER: null,
        PARENT_CODE: "opinion",
        MENU_TYPE: 2,
        PAGE_URL: "/OpinionManage",
        PAGE_CODE: "opinionmanage"
      },
      {
        MENU_CODE: "certification",
        MENU_NAME: "证书",
        DISPLAY_ORDER: null,
        HOME_ORDER: null,
        PARENT_CODE: null,
        MENU_TYPE: 1,
        PAGE_URL: null,
        PAGE_CODE: "certification"
      },
      {
        MENU_CODE: "certificateview",
        MENU_NAME: "我的证书",
        DISPLAY_ORDER: 1,
        HOME_ORDER: null,
        PARENT_CODE: "certification",
        MENU_TYPE: 2,
        PAGE_URL: "/CertificateView",
        PAGE_CODE: "certificateview"
      },
      {
        MENU_CODE: "loginsso",
        MENU_NAME: "单点登录异常页面",
        DISPLAY_ORDER: null,
        HOME_ORDER: null,
        PARENT_CODE: null,
        MENU_TYPE: 3,
        PAGE_URL: "/LoginSso",
        PAGE_CODE: "loginsso"
      },
      {
        MENU_CODE: "specdept",
        MENU_NAME: "专科评价",
        DISPLAY_ORDER: 2,
        HOME_ORDER: null,
        PARENT_CODE: null,
        MENU_TYPE: 2,
        PAGE_URL: "/SpecDept",
        PAGE_CODE: "specdept"
      },
      {
        MENU_CODE: "hospassess",
        MENU_NAME: "全院评价",
        DISPLAY_ORDER: 1,
        HOME_ORDER: null,
        PARENT_CODE: null,
        MENU_TYPE: 2,
        PAGE_URL: "/HospAssess",
        PAGE_CODE: "hospassess"
      },

      {
        MENU_CODE: "hospassessdept",
        MENU_NAME: "全院评价(昆儿)",
        DISPLAY_ORDER: 1,
        HOME_ORDER: null,
        PARENT_CODE: null,
        MENU_TYPE: 2,
        PAGE_URL: "/HospAssessDept",
        PAGE_CODE: "hospassessdept"
      },

      {
        MENU_CODE: "sdfeeeffect",
        MENU_NAME: "专病费效",
        DISPLAY_ORDER: 2,
        HOME_ORDER: null,
        PARENT_CODE: "sdspecialassess",
        MENU_TYPE: 2,
        PAGE_URL: "/SdFeeEffect",
        PAGE_CODE: "sdfeeeffect"
      },
      {
        MENU_CODE: "sdspecialassess",
        MENU_NAME: "专病评价",
        DISPLAY_ORDER: 3,
        HOME_ORDER: null,
        PARENT_CODE: null,
        MENU_TYPE: 1,
        PAGE_URL: null,
        PAGE_CODE: "sdspecialassess"
      },
      {
        MENU_CODE: "sdspecialquality",
        MENU_NAME: "专病质量",
        DISPLAY_ORDER: 1,
        HOME_ORDER: 1,
        PARENT_CODE: "sdspecialassess",
        MENU_TYPE: 2,
        PAGE_URL: "/SdSpecialQuality",
        PAGE_CODE: "sdspecialquality"
      },
      {
        MENU_CODE: "sdindex",
        MENU_NAME: "专病指标",
        DISPLAY_ORDER: 0,
        HOME_ORDER: null,
        PARENT_CODE: "sdspecialquality",
        MENU_TYPE: 3,
        PAGE_URL: "/SdIndex/{SdCode}",
        PAGE_CODE: "sdindex"
      },
      {
        MENU_CODE: "sdlayerindex",
        MENU_NAME: "指标分组",
        DISPLAY_ORDER: 0,
        HOME_ORDER: null,
        PARENT_CODE: "sdspecialquality",
        MENU_TYPE: 3,
        PAGE_URL: "/SdLayerIndex/{LayerId}",
        PAGE_CODE: "sdlayerindex"
      },
      {
        MENU_CODE: "sdlayer",
        MENU_NAME: "患者分组",
        DISPLAY_ORDER: 0,
        HOME_ORDER: null,
        PARENT_CODE: "sdspecialquality",
        MENU_TYPE: 3,
        PAGE_URL: "/SdLayer/{SdCode}",
        PAGE_CODE: "sdlayer"
      },
      {
        MENU_CODE: "sdfeeeffectdrg",
        MENU_NAME: "费效分组",
        DISPLAY_ORDER: 0,
        HOME_ORDER: null,
        PARENT_CODE: "sdfeeeffect",
        MENU_TYPE: 3,
        PAGE_URL: "/SdFeeEffectDrg/{SdId}",
        PAGE_CODE: "sdfeeeffectdrg"
      },
      {
        MENU_CODE: "reasonanalysis",
        MENU_NAME: "原因分析",
        DISPLAY_ORDER: 4,
        HOME_ORDER: null,
        PARENT_CODE: null,
        MENU_TYPE: 2,
        PAGE_URL: "/ReasonAnalysis",
        PAGE_CODE: "reasonanalysis"
      },
      {
        MENU_CODE: "report",
        MENU_NAME: "报表",
        DISPLAY_ORDER: 5,
        HOME_ORDER: null,
        PARENT_CODE: null,
        MENU_TYPE: 2,
        PAGE_URL: "/Report",
        PAGE_CODE: "report"
      },
      {
        MENU_CODE: "patient",
        MENU_NAME: "病例",
        DISPLAY_ORDER: 6,
        HOME_ORDER: null,
        PARENT_CODE: null,
        MENU_TYPE: 1,
        PAGE_URL: null,
        PAGE_CODE: "patient"
      },
      {
        MENU_CODE: "cases",
        MENU_NAME: "专病病例",
        DISPLAY_ORDER: 3,
        HOME_ORDER: null,
        PARENT_CODE: "patient",
        MENU_TYPE: 2,
        PAGE_URL: "/Cases",
        PAGE_CODE: "cases"
      },
      {
        MENU_CODE: "hosppatient",
        MENU_NAME: "全院病例",
        DISPLAY_ORDER: 1,
        HOME_ORDER: null,
        PARENT_CODE: "patient",
        MENU_TYPE: 2,
        PAGE_URL: "/HospDeptPatient/Hosp",
        PAGE_CODE: "hosppatient"
      },
      {
        MENU_CODE: "hosppatientkr",
        MENU_NAME: "全院病例(昆儿)",
        DISPLAY_ORDER: 1,
        HOME_ORDER: null,
        PARENT_CODE: "patient",
        MENU_TYPE: 2,
        PAGE_URL: "/HospPatientKr/Hosp",
        PAGE_CODE: "hosppatientkr"
      },
      {
        MENU_CODE: "deptpatient",
        MENU_NAME: "专科病例",
        DISPLAY_ORDER: 2,
        HOME_ORDER: null,
        PARENT_CODE: "patient",
        MENU_TYPE: 2,
        PAGE_URL: "/HospDeptPatient/Dept",
        PAGE_CODE: "deptpatient"
      },
      {
        MENU_CODE: "setting",
        MENU_NAME: "设置",
        DISPLAY_ORDER: 7,
        HOME_ORDER: null,
        PARENT_CODE: null,
        MENU_TYPE: 1,
        PAGE_URL: null,
        PAGE_CODE: "setting"
      },
      {
        MENU_CODE: "reasoninfo",
        MENU_NAME: "原因设置",
        DISPLAY_ORDER: 2,
        HOME_ORDER: null,
        PARENT_CODE: "setting",
        MENU_TYPE: 2,
        PAGE_URL: "/ReasonInfo",
        PAGE_CODE: "reasoninfo"
      },
      {
        MENU_CODE: "systemsetting",
        MENU_NAME: "系统管理",
        DISPLAY_ORDER: 7,
        HOME_ORDER: null,
        PARENT_CODE: "setting",
        MENU_TYPE: 2,
        PAGE_URL: "/SystemSetting",
        PAGE_CODE: "systemsetting"
      },
      {
        MENU_CODE: "groupinfo",
        MENU_NAME: "诊疗组管理",
        DISPLAY_ORDER: 3,
        HOME_ORDER: null,
        PARENT_CODE: "setting",
        MENU_TYPE: 2,
        PAGE_URL: "/GroupInfo",
        PAGE_CODE: "groupinfo"
      },
      {
        MENU_CODE: "userinfo",
        MENU_NAME: "用户管理",
        DISPLAY_ORDER: 4,
        HOME_ORDER: null,
        PARENT_CODE: "setting",
        MENU_TYPE: 2,
        PAGE_URL: "/UserInfo",
        PAGE_CODE: "userinfo"
      },
      {
        MENU_CODE: "roleinfo",
        MENU_NAME: "角色管理",
        DISPLAY_ORDER: 5,
        HOME_ORDER: null,
        PARENT_CODE: "setting",
        MENU_TYPE: 2,
        PAGE_URL: "/RoleInfo",
        PAGE_CODE: "roleinfo"
      },
      {
        MENU_CODE: "loginfo",
        MENU_NAME: "日志管理",
        DISPLAY_ORDER: 6,
        HOME_ORDER: null,
        PARENT_CODE: "setting",
        MENU_TYPE: 2,
        PAGE_URL: "/LogInfo",
        PAGE_CODE: "loginfo"
      },
      {
        MENU_CODE: "logmanage",
        MENU_NAME: "日志管理2",
        DISPLAY_ORDER: 6,
        HOME_ORDER: null,
        PARENT_CODE: "setting",
        MENU_TYPE: 2,
        PAGE_URL: "/LogManage",
        PAGE_CODE: "logmanage"
      },
      {
        MENU_CODE: "indexmanagement",
        MENU_NAME: "指标管理",
        DISPLAY_ORDER: 7,
        HOME_ORDER: null,
        PARENT_CODE: "setting",
        MENU_TYPE: 2,
        PAGE_URL: "/IndexManagement",
        PAGE_CODE: "indexmanagement"
      },
      {
        MENU_CODE: "templateinfo",
        MENU_NAME: "模板管理",
        DISPLAY_ORDER: 8,
        HOME_ORDER: null,
        PARENT_CODE: "setting",
        MENU_TYPE: 2,
        PAGE_URL: "/TemplateInfo",
        PAGE_CODE: "templateinfo"
      },
      {
        MENU_CODE: "templatedetail",
        MENU_NAME: "模板详情",
        DISPLAY_ORDER: 9,
        HOME_ORDER: null,
        PARENT_CODE: "setting",
        MENU_TYPE: 2,
        PAGE_URL: "/TemplateDetail",
        PAGE_CODE: "templatedetail"
      },
      {
        MENU_CODE: "examineinfo",
        MENU_NAME: "审核标准管理",
        DISPLAY_ORDER: 10,
        HOME_ORDER: null,
        PARENT_CODE: "setting",
        MENU_TYPE: 2,
        PAGE_URL: "/ExamineInfo",
        PAGE_CODE: "examineinfo"
      },
      {
        MENU_CODE: "indexinfo",
        MENU_NAME: "指标设置-数据",
        DISPLAY_ORDER: 11,
        HOME_ORDER: null,
        PARENT_CODE: "setting",
        MENU_TYPE: 2,
        PAGE_URL: "/IndexInfo",
        PAGE_CODE: "indexinfo"
      },
      {
        MENU_CODE: "indexmaterial",
        MENU_NAME: "指标设置-材料、现场",
        DISPLAY_ORDER: 12,
        HOME_ORDER: null,
        PARENT_CODE: "setting",
        MENU_TYPE: 2,
        PAGE_URL: "/IndexMaterial",
        PAGE_CODE: "indexmaterial"
      },
      {
        MENU_CODE: "indexbase",
        MENU_NAME: "项目指标设置",
        DISPLAY_ORDER: 13,
        HOME_ORDER: null,
        PARENT_CODE: "setting",
        MENU_TYPE: 2,
        PAGE_URL: "/IndexBase",
        PAGE_CODE: "indexbase"
      },
      {
        MENU_CODE: "dictmanage",
        MENU_NAME: "字典管理",
        DISPLAY_ORDER: 14,
        HOME_ORDER: null,
        PARENT_CODE: "setting",
        MENU_TYPE: 2,
        PAGE_URL: "/DictManage",
        PAGE_CODE: "dictmanage"
      },

      {
        MENU_CODE: "patientdetail",
        MENU_NAME: "病例详情",
        DISPLAY_ORDER: 0,
        HOME_ORDER: null,
        PARENT_CODE: "patient",
        MENU_TYPE: 3,
        PAGE_URL: "/PatientDetail/{sdCpatNo}",
        PAGE_CODE: "patientdetail"
      },
      {
        MENU_CODE: "ungrpatientdetail",
        MENU_NAME: "全院专科病例详情",
        DISPLAY_ORDER: 1,
        HOME_ORDER: null,
        PARENT_CODE: "patient",
        MENU_TYPE: 3,
        PAGE_URL: "/UnGrPatientDetail/{PatientNo}/{SdTypeCode}",
        PAGE_CODE: "ungrpatientdetail"
      },
      {
        MENU_CODE: "casesrel",
        MENU_NAME: "专病相关病例",
        DISPLAY_ORDER: 2,
        HOME_ORDER: null,
        PARENT_CODE: "patient",
        MENU_TYPE: 3,
        PAGE_URL: "/Cases/Rel",
        PAGE_CODE: "casesrel"
      },
      {
        MENU_CODE: "casesrelsusp",
        MENU_NAME: "专病相关可疑病例",
        DISPLAY_ORDER: 3,
        HOME_ORDER: null,
        PARENT_CODE: "patient",
        MENU_TYPE: 3,
        PAGE_URL: "/Cases/RelSusp",
        PAGE_CODE: "casesrelsusp"
      },
      {
        MENU_CODE: "layercasesrel",
        MENU_NAME: "专病分组相关病例",
        DISPLAY_ORDER: 2,
        HOME_ORDER: null,
        PARENT_CODE: "patient",
        MENU_TYPE: 3,
        PAGE_URL: "/LayerCases/Rel",
        PAGE_CODE: "layercasesrel"
      },
      {
        MENU_CODE: "layercasesrelsusp",
        MENU_NAME: "专病分组相关可疑病例",
        DISPLAY_ORDER: 3,
        HOME_ORDER: null,
        PARENT_CODE: "patient",
        MENU_TYPE: 3,
        PAGE_URL: "/LayerCases/RelSusp",
        PAGE_CODE: "layercasesrelsusp"
      },
      {
        MENU_CODE: "hosppatientrel",
        MENU_NAME: "全院相关病例",
        DISPLAY_ORDER: 4,
        HOME_ORDER: null,
        PARENT_CODE: "patient",
        MENU_TYPE: 3,
        PAGE_URL: "/HospDeptPatient/Hosp/Rel",
        PAGE_CODE: "hosppatientrel"
      },
      {
        MENU_CODE: "deptpatientrel",
        MENU_NAME: "专科相关病例",
        DISPLAY_ORDER: 5,
        HOME_ORDER: null,
        PARENT_CODE: "patient",
        MENU_TYPE: 3,
        PAGE_URL: "/HospDeptPatient/Dept/Rel",
        PAGE_CODE: "deptpatientrel"
      },
      {
        MENU_CODE: "hosppatientreli",
        MENU_NAME: "全院昆儿住院相关可疑病例",
        DISPLAY_ORDER: 3,
        HOME_ORDER: null,
        PARENT_CODE: "patient",
        MENU_TYPE: 3,
        PAGE_URL: "/HospPatientRelI",
        PAGE_CODE: "hosppatientreli"
      },
      {
        MENU_CODE: "hosppatientrele",
        MENU_NAME: "专病相关可疑病例",
        DISPLAY_ORDER: 3,
        HOME_ORDER: null,
        PARENT_CODE: "patient",
        MENU_TYPE: 3,
        PAGE_URL: "/HospPatientRelE",
        PAGE_CODE: "hosppatientrele"
      },
      {
        MENU_CODE: "personalinfo",
        MENU_NAME: "个人信息",
        DISPLAY_ORDER: 8,
        HOME_ORDER: null,
        PARENT_CODE: null,
        MENU_TYPE: 1,
        PAGE_URL: null,
        PAGE_CODE: "personalinfo"
      },
      {
        MENU_CODE: "favinfo",
        MENU_NAME: "我的收藏",
        DISPLAY_ORDER: 0,
        HOME_ORDER: null,
        PARENT_CODE: "personalinfo",
        MENU_TYPE: 2,
        PAGE_URL: "/FavInfo",
        PAGE_CODE: "favinfo"
      },
      {
        MENU_CODE: "taskcenter",
        MENU_NAME: "任务中心",
        DISPLAY_ORDER: 0,
        HOME_ORDER: null,
        PARENT_CODE: "personalinfo",
        MENU_TYPE: 2,
        PAGE_URL: "/TaskCenter",
        PAGE_CODE: "taskcenter"
      },
      {
        MENU_CODE: "loginout",
        MENU_NAME: "退出",
        DISPLAY_ORDER: 2,
        HOME_ORDER: null,
        PARENT_CODE: "personalinfo",
        MENU_TYPE: 2,
        PAGE_URL: "/LoginOut",
        PAGE_CODE: "loginout"
      },
      {
        MENU_CODE: "changepwd",
        MENU_NAME: "修改密码",
        DISPLAY_ORDER: 1,
        HOME_ORDER: null,
        PARENT_CODE: "personalinfo",
        MENU_TYPE: 2,
        PAGE_URL: null,
        PAGE_CODE: "changepwd"
      },
      {
        MENU_CODE: "register",
        MENU_NAME: "注册",
        DISPLAY_ORDER: 2,
        HOME_ORDER: null,
        PARENT_CODE: "personalinfo",
        MENU_TYPE: 2,
        PAGE_URL: "/Register",
        PAGE_CODE: "register"
      },
      {
        MENU_CODE: "registersuccess",
        MENU_NAME: "注册成功",
        DISPLAY_ORDER: 2,
        HOME_ORDER: null,
        PARENT_CODE: "personalinfo",
        MENU_TYPE: 2,
        PAGE_URL: "/RegisterSuccess",
        PAGE_CODE: "registersuccess"
      },
      {
        MENU_CODE: "trainmanage",
        MENU_NAME: "培训管理",
        DISPLAY_ORDER: 2,
        HOME_ORDER: null,
        PARENT_CODE: "personalinfo",
        MENU_TYPE: 2,
        PAGE_URL: "/TrainManage",
        PAGE_CODE: "trainmanage"
      },
      {
        MENU_CODE: "traincourse",
        MENU_NAME: "培训课程",
        DISPLAY_ORDER: 2,
        HOME_ORDER: null,
        PARENT_CODE: "personalinfo",
        MENU_TYPE: 2,
        PAGE_URL: "/TrainCourse",
        PAGE_CODE: "traincourse"
      },
      {
        MENU_CODE: "expertauditmanage",
        MENU_NAME: "专家审核管理",
        DISPLAY_ORDER: 2,
        HOME_ORDER: null,
        PARENT_CODE: "personalinfo",
        MENU_TYPE: 2,
        PAGE_URL: "/ExpertAuditManage",
        PAGE_CODE: "expertauditmanage"
      },
      {
        MENU_CODE: "expertauditinfo",
        MENU_NAME: "专家审核",
        DISPLAY_ORDER: 2,
        HOME_ORDER: null,
        PARENT_CODE: "personalinfo",
        MENU_TYPE: 2,
        PAGE_URL: "/ExpertAuditInfo",
        PAGE_CODE: "expertauditinfo"
      },
      {
        MENU_CODE: "certificationmanage",
        MENU_NAME: "认证管理",
        DISPLAY_ORDER: 2,
        HOME_ORDER: null,
        PARENT_CODE: "personalinfo",
        MENU_TYPE: 2,
        PAGE_URL: "/CertificationManage",
        PAGE_CODE: "certificationmanage"
      },
      {
        MENU_CODE: "processnavigation",
        MENU_NAME: "流程导航",
        DISPLAY_ORDER: 2,
        HOME_ORDER: null,
        PARENT_CODE: "personalinfo",
        MENU_TYPE: 2,
        PAGE_URL: "/ProcessNavigation",
        PAGE_CODE: "processnavigation"
      }
    ]
  }
};
