/**
 * 指标计算规则验证
 *  @params {String} kpiName  kpi 名称
 *  @params {String} kpiDesc  计算规则描述
 */
export default (kpiName, kpiDesc) => {
  // 如果没有计算规则,不再界面展示
  let title = kpiName,
    newDescStrArr = [],
    desc;

  if (kpiDesc !== null && kpiDesc !== "") {
    // 截取规则: 分子:blabla$$分母:blabla$$计算规则:blabla, 按照$$进行截取换行
    // 先拆成数组, 字太多换行,再用'\n'连接起来
    let len = kpiName.length > 26 ? kpiName.length : 26,
      newCalRuleArr = kpiDesc.split("$$");

    for (let index = 0; index < newCalRuleArr.length; index++) {
      desc = newCalRuleArr[index];

      if (desc.length > len) {
        // 超过指标长度,进行截取
        for (let i = len; i < desc.length; i + len) {
          newDescStrArr.push(`${desc.slice(0, i)}`);
          desc = desc.slice(i, desc.length);
        }

        // 把最后一次余下的字符串放入数组
        newDescStrArr.push(desc);
      } else {
        // 字数没有超过长度直接压栈
        newDescStrArr.push(desc);
      }
    }

    // 数组转字符串
    desc = newDescStrArr.join("\n");
    title = `${kpiName}\n${desc}`;
  }

  return title;
};
