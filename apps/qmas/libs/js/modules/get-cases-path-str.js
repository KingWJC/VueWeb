import resolveMvcRoute from "__libs/js/modules/resolve-mvc-route";

/**
 *  拼接一个路由到病例列表, 带上维度和时间范围信息
 *
 *  @param dimentions {Object} 维度
 *  @param dateRange {Object} 日期范围
 *  @param extraParams {Object} 其它参数（原因类型/是否可疑）（可选）
 */
export default (dimentions, dateRange, extraParams) => {
  let dimList = [];

  // 传入了日期范围
  if (dateRange) {
    dimList.push("/start/", dateRange.startDate);
    dimList.push("/end/", dateRange.endDate);
  }

  // 指标（必须带病种）
  if (dimentions.indexList && dimentions.indexList.length > 0) {
    dimList.push("/index/", dimentions.indexList.join("|"));
    dimList.push("/sd/", dimentions.indexSdId);
  } else if (dimentions.diseaseList && dimentions.diseaseList.length > 0) {
    // else:病种

    dimList.push("/sd/", dimentions.diseaseList.join("|"));
  }

  // 医生
  if (dimentions.doctorList && dimentions.doctorList.length > 0) {
    dimList.push("/doctor/", dimentions.doctorList.join("|"));
  }

  // 科室
  if (dimentions.deptList && dimentions.deptList.length > 0) {
    dimList.push("/dept/", dimentions.deptList.join("|"));
  }

  // 诊疗组
  if (dimentions.groupList && dimentions.groupList.length > 0) {
    dimList.push("/group/", dimentions.groupList.join("|"));
  }

  // 如果传入了原因数据，说明是原因分析页面，判断并使用
  if (extraParams) {
    // 路由跳转的基础部分（后端路由）
    let routeBase,
      // 解析 mvc 路由
      mvcRoute;

    // 从原因分析过来
    if (extraParams.isRsn) {
      // 带上标识, 1
      dimList.push("/from/1");

      // 传入了原因类型
      if (extraParams.RsnTypeCode && extraParams.RsnTypeCode.length > 0) {
        dimList.push("/rsnTypeCode/", extraParams.RsnTypeCode.join("|"));
      }

      // 传入了具体原因
      if (extraParams.RsnIds) {
        dimList.push("/rsnIds/", extraParams.RsnIds.join("|"));
      }
    }

    // 从专病/指标过来
    if (extraParams.isDisOrIdx) {
      // 带上标识, 2
      dimList.push("/from/2");

      // 可疑病例(只有专病，指标才有)
      if (extraParams.isSusp) {
        // 带上标识, 1 表示可疑病例
        dimList.push("/isSusp/1");
      }
    }

    // 从收藏过来
    if (extraParams.isFav) {
      dimList.push("/from/3");
    }

    // 从患者分组过来
    if (extraParams.isLayer) {
      dimList.push("/layerId/", extraParams.layerId);

      if (extraParams.sdId) {
        dimList.push("/sd/", extraParams.sdId);
      }

      if (extraParams.kpiId) {
        dimList.push("/index/", extraParams.kpiId);
      }

      // 带上标识, 4
      dimList.push("/from/4");

      // 可疑病例(只有专病，指标才有)
      if (extraParams.isSusp) {
        // 带上标识, 1 表示可疑病例
        dimList.push("/isSusp/1");
      }

      if (extraParams.isSusp) {
        mvcRoute = resolveMvcRoute("layercasesrelsusp");
        routeBase = `${mvcRoute}#/headerfilter`;
      } else {
        mvcRoute = resolveMvcRoute("layercasesrel");
        routeBase = `${mvcRoute}#/headerfilter`;
      }
    } else {
      // 否则是专病相关

      if (extraParams.isSusp) {
        mvcRoute = resolveMvcRoute("casesrelsusp");
        routeBase = `${mvcRoute}#/headerfilter`;
      } else {
        mvcRoute = resolveMvcRoute("casesrel");
        routeBase = `${mvcRoute}#/headerfilter`;
      }
    }

    // 添加基础路由
    dimList.unshift(routeBase);
  }

  return dimList.join("");
};
