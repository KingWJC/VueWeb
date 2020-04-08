/**
 * 改变基线值,更新列表
 * @param {Object} obj 子组件上报到父亲的一系列的数据
 * @param {Object} totalData 列表数据
 * @param {String} statusField 状态字段
 * @param {String} baselineField  预警值字段
 * @param {Number} idField 唯一标识字段
 */
export default (obj, totalData, statusField, baselineField, idField) => {
  return totalData.map((item) => {
    if (item[idField] === obj.id) {
      // 强制预警值类型为字符串型
      let valueStr = String(obj.value);

      // 同步预警值到父组件
      item[baselineField] = valueStr;
      // 是否显示预警值
      item.IS_DISPLAY = obj.display;

      // 需要显示预警值 1: 显示，0: 不显示
      if (obj.display === 1) {
        // 有值 （不为 -）, 子组件在上报之前已经处理为 - 或者 有效值
        if (valueStr !== "-") {
          // 转换为浮点数再进行比较（字符串比较不准确）
          let baselineFLoat = parseFloat(valueStr);
          let suspRateFloat = parseFloat(item.SuspRate);

          // 正常 （预警值大于可疑率）
          if (baselineFLoat >= suspRateFloat) {
            item[statusField] = 1;
          } else {
            // else:报警

            item[statusField] = 0;
          }
        } else {
          // else:预警值为空 -

          item[statusField] = 2;
        }
      } else {
        // else:不需要显示预警值，直接设置为 未知（2，-）

        item[statusField] = 2;
      }
    }

    return item;
  });
};
