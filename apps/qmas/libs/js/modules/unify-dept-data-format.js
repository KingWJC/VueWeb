// 匹配后端科室级联api返回结果为前端统一格式
// @param xAxisData Array 科室级联api返回的 X 轴数据（科室/诊疗组、医生）
// @param legendType String 当前科室图渲染模式 dept/group/doctor
export default (xAxisData, legendType) => {
  return xAxisData.reduce((tmpList, curItem) => {
    let codeField, nameField;

    // 如果是科室视图，返回 DEPT_CODE / DEPT_NAME
    if (legendType === "dept") {
      codeField = "DEPT_CODE";
      nameField = "DEPT_NAME";
    } else if (legendType === "group") {
      // else:诊疗组视图
      codeField = "GROUP_ID";
      nameField = "GROUP_NAME";
    } else if (legendType === "doctor") {
      // else:医生视图
      codeField = "DOCTOR_CODE";
      nameField = "DOCTOR_NAME";
    }

    tmpList.push({
      // es6 动态声明对象 key
      // 注意 GROUP_ID 当前前端处理为整型，需要把字符串转换一下
      [codeField]:
        legendType === "group" ? parseInt(curItem.Code) : curItem.Code,
      [nameField]: curItem.Name
    });

    return tmpList;
  }, []);
};
