import { APP_ROOT } from "@@arch/env";
import createRender from "@@arch/liquid/create-render";
import apiRoutes from "./mock/api";
import globalSession from "./mock/global-session";
import { outputPath } from "./config";

const mvcRoutes = {
  // 用户管理
  userinfo: {
    route: "/UserInfo",
    liquidName: "UserInfo",
    isEntry: true,

    verbs: {
      get: () => renderLiquid("userinfo")
    }
  },

  // 角色管理页面
  roleinfo: {
    route: "/RoleInfo",
    liquidName: "RoleInfo",
    isEntry: true,

    verbs: {
      get: () => renderLiquid("roleinfo")
    }
  },

  // 日志管理
  loginfo: {
    route: "/LogInfo",
    liquidName: "LogInfo",
    isEntry: true,

    verbs: {
      get: () => renderLiquid("loginfo")
    }
  },

  // 登录
  login: {
    // 路由endpoint
    route: "/Login",
    // 后端需要的liquid名称（Home/Index.liquid), 如果是一个liquid页面，一定要和
    // 后端给出名称同名
    liquidName: "Login",
    // 是否是一个 webpack entry （只有渲染了一个页面的路由才有意义成为entry）
    isEntry: true,

    verbs: {
      // 渲染登录页面
      get: () => renderLiquid("login"),

      // 发送登录请求
      post: {
        Code: 0,
        Data: {
          SETTING: [
            {
              ItemCode: "PWD_ONTIME_UPD",
              ItemName: "用户口令定期更换",
              ItemVal: "1"
            },
            {
              ItemCode: "PWD_STRONG",
              ItemName: "高强度密码",
              ItemVal: "1"
            }
          ],
          USER: {
            Permission: null,
            Token: "RHl4kZ0Q",
            UserId: "1232",
            UserName: "舒服撒发"
          },
          HomeUrl: null
        }
      }
    }
  },

  // 登出
  loginout: {
    route: "/LoginOut",
    liquidName: null,
    isEntry: false,

    verbs: {
      get: "您已成功登出"
    }
  },
  // 机构管理
  orginfo: {
    route: "/OrgInfo",
    liquidName: "OrgInfo",
    isEntry: true,

    verbs: {
      get: () => renderLiquid("orginfo")
    }
  },
  // 注册
  register: {
    route: "/Register",
    liquidName: "Register",
    isEntry: true,

    verbs: {
      get: () => renderLiquid("register")
    }
  },

  // 注册成功
  registersuccess: {
    route: "/RegisterSuccess",
    liquidName: "RegisterSuccess",
    isEntry: true,

    verbs: {
      get: () => renderLiquid("registersuccess")
    }
  },

  // 培训管理
  trainmanage: {
    route: "/TrainManage",
    liquidName: "TrainManage",
    isEntry: true,

    verbs: {
      get: () => renderLiquid("trainmanage")
    }
  },

  // 培训课程
  traincourse: {
    route: "/TrainCourse",
    liquidName: "TrainCourse",
    isEntry: true,

    verbs: {
      get: () => renderLiquid("traincourse")
    }
  },

  // 模板管理
  templateinfo: {
    route: "/TemplateInfo",
    liquidName: "TemplateInfo",
    isEntry: true,
    verbs: {
      get: () => renderLiquid("templateinfo")
    }
  },

  // 审核标准管理
  examineinfo: {
    route: "/ExamineInfo",
    liquidName: "ExamineInfo",
    isEntry: true,
    verbs: {
      get: () => renderLiquid("examineinfo")
    }
  },

  // 指标设置 / 数据
  indexinfo: {
    route: "/IndexInfo",
    liquidName: "IndexInfo",
    isEntry: true,
    verbs: {
      get: () => renderLiquid("indexinfo")
    }
  },
  // 指标设置 / 材料
  indexmaterial: {
    route: "/IndexMaterial",
    liquidName: "IndexMaterial",
    isEntry: true,
    verbs: {
      get: () => renderLiquid("indexmaterial")
    }
  },
  // 指标设置 / 现场
  indexscene: {
    route: "/IndexScene",
    liquidName: "IndexScene",
    isEntry: true,
    verbs: {
      get: () => renderLiquid("indexscene")
    }
  },
  // 指标设置 / 基本要求
  indexbase: {
    route: "/IndexBase",
    liquidName: "IndexBase",
    isEntry: true,
    verbs: {
      get: () => renderLiquid("indexbase")
    }
  },
  // 专家审核管理
  expertauditmanage: {
    route: "/ExpertAuditManage",
    liquidName: "ExpertAuditManage",
    isEntry: true,

    verbs: {
      get: () => renderLiquid("expertauditmanage")
    }
  },

  // 专家审核
  expertauditinfo: {
    route: "/ExpertAuditInfo",
    liquidName: "ExpertAuditInfo",
    isEntry: true,

    verbs: {
      get: () => renderLiquid("expertauditinfo")
    }
  },

  // 我的认证
  certificate: {
    route: "/Certificate",
    liquidName: "Certificate",
    isEntry: true,
    verbs: {
      get: () => renderLiquid("certificate")
    }
  },

  // 材料审核
  materialexamineinfo: {
    route: "/MaterialExamineInfo",
    liquidName: "MaterialExamineInfo",
    isEntry: true,

    verbs: {
      get: () => renderLiquid("materialexamineinfo")
    }
  },

  // 现场审核
  sceneexamineinfo: {
    route: "/SceneExamineInfo",
    liquidName: "SceneExamineInfo",
    isEntry: true,

    verbs: {
      get: () => renderLiquid("sceneexamineinfo")
    }
  },

  // 数据审核
  dataexamineinfo: {
    route: "/DataExamineInfo",
    liquidName: "DataExamineInfo",
    isEntry: true,

    verbs: {
      get: () => renderLiquid("dataexamineinfo")
    }
  },

  // 认证管理
  certificationmanage: {
    route: "/CertificationManage",
    liquidName: "CertificationManage",
    isEntry: true,

    verbs: {
      get: () => renderLiquid("certificationmanage")
    }
  },

  // 首页
  home: {
    route: "/Home",
    liquidName: "Home",
    isEntry: true,
    verbs: {
      get: () => renderLiquid("home")
    }
  },

  // 文件浏览
  pdfviewer: {
    route: "/PdfViewer",
    liquidName: "PdfViewer",
    isEntry: true,
    verbs: {
      get: () => renderLiquid("pdfviewer")
    }
  },

  // 字典管理
  dictmanage: {
    route: "/DictManage",
    liquidName: "DictManage",
    isEntry: true,
    verbs: {
      get: () => renderLiquid("dictmanage")
    }
  },

  // 意见反馈
  opinionfeedback: {
    route: "/OpinionFeedBack",
    liquidName: "OpinionFeedBack",
    isEntry: true,
    verbs: {
      get: () => renderLiquid("opinionfeedback")
    }
  },

  // 意见管理
  opinionmanage: {
    route: "/OpinionManage",
    liquidName: "OpinionManage",
    isEntry: true,
    verbs: {
      get: () => renderLiquid("opinionmanage")
    }
  },

  certificateview: {
    route: "/CertificateView",
    liquidName: "CertificateView",
    isEntry: true,
    verbs: {
      get: () => renderLiquid("certificateview")
    }
  },

  logmanage: {
    route: "/LogManage",
    liquidName: "LogManage",
    isEntry: true,
    verbs: {
      get: () => renderLiquid("logmanage")
    }
  }
};

const renderLiquid = createRender({
  globalSession,
  appPath: APP_ROOT,
  outputPath,
  mvcRoutes
});

export { mvcRoutes, apiRoutes };
