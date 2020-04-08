import Config from "__libs/js/modules/config";

export default {
  getters: {
    // 专病分组相关病例
    layerRelCasesSd() {
      if (
        Config.USER.PageMenu.find((item) => {
          return item.PAGE_CODE === "layercasesrel";
        })
      ) {
        return true;
      } else {
        return false;
      }
    },

    // 专病分组相关可疑病例
    layerRelSuspCasesSd() {
      if (
        Config.USER.PageMenu.find((item) => {
          return item.PAGE_CODE === "layercasesrelsusp";
        })
      ) {
        return true;
      } else {
        return false;
      }
    },

    // 专病相关可疑病例是否显示控制
    relSuspCasesSd() {
      if (
        Config.USER.PageMenu.find((item) => {
          return item.PAGE_CODE === "casesrelsusp";
        })
      ) {
        return true;
      } else {
        return false;
      }
    },
    // 全院相关病例是否显示控制
    relCasesHosp() {
      if (
        Config.USER.PageMenu.find((item) => {
          return item.PAGE_CODE === "hosppatientrel";
        })
      ) {
        return true;
      } else {
        return false;
      }
    },

    // 专科相关病例是否显示控制
    relCasesDept() {
      if (
        Config.USER.PageMenu.find((item) => {
          return item.PAGE_CODE === "deptpatientrel";
        })
      ) {
        return true;
      } else {
        return false;
      }
    },

    // 专病相关病例是否显示控制
    relCasesSd() {
      if (
        Config.USER.PageMenu.find((item) => {
          return item.PAGE_CODE === "casesrel";
        })
      ) {
        return true;
      } else {
        return false;
      }
    },

    // 控制任务中心显示的tab标签
    isShowReview() {
      if (
        Config.USER.PageMenu.find((item) => {
          return item.PAGE_CODE === "reasoninfo";
        })
      ) {
        return true;
      } else {
        return false;
      }
    },

    // 是否拥有设置基线的权限
    allowSetBaseline() {
      if (
        Config.USER.Permission.IsAdmin ||
        Config.USER.Permission.Func.find((item) => {
          return item === "setbaseline";
        })
      ) {
        return true;
      } else {
        return false;
      }
    },

    // 全院昆儿相关住院病例是否显示控制
    relCasesInHospKr() {
      if (
        Config.USER.PageMenu.find((item) => {
          return item.PAGE_CODE === "hosppatientreli";
        })
      ) {
        return true;
      } else {
        return false;
      }
    },

    // 全院昆儿相关门急诊病例是否显示控制
    relCasesOEHospKr() {
      if (
        Config.USER.PageMenu.find((item) => {
          return item.PAGE_CODE === "hosppatientrele";
        })
      ) {
        return true;
      } else {
        return false;
      }
    }
  }
};
