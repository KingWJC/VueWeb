import Moment from "moment";

/**
 * 计算单日基线的值,更新列表
 * @param {String} value 基线值
 * @param {Number} limit 保留几位小数
 * @param {Object} dataRange 日期
 */
function getBaseline(value, limit, dateRange) {
  let { startDate, endDate } = dateRange;
  let num = Moment(endDate).diff(Moment(startDate), "days") + 1;

  return (num * value).toFixed(limit);
}

/**
 * 改变基线值,更新列表
 * @param {Object} obj 子组件上报到父亲的一系列的数据
 * @param {Object} totalIndices 指标列表的数据
 * @param {Object} dateRange 日期
 * @param {String} indexListType 类型为 evaluateTab 表示逻辑和
 *   评价指标一样,否则和预警一样
 */
export default function(
  obj,
  totalIndices,
  dateRange,
  indexListType = "evaluateTab"
) {
  return totalIndices.map((item) => {
    if (item.KPI_ID === obj.id) {
      // 强制值类型为字符串型
      let valueStr = String(obj.value);

      // 1代表动态基线
      if (item.IS_DYNAMIC === 1) {
        if (valueStr === "-") {
          item.BaseLine = valueStr;
          item.MinBaseLine = valueStr;
        } else {
          // else
          // 当类型不为 1 的时候为单日基线,
          // 更新列表需要乘以日期控件的天数
          // 类型为 1 是百分比,不需要乘以天数

          if (item.SD_EKPI_CONVER !== 1) {
            item.BaseLine = getBaseline(
              valueStr,
              item.NUM_PRECISION,
              dateRange
            );
          }

          item.MinBaseLine = valueStr;
        }
      } else {
        // else:同步值值到父组件
        item.BaseLine = valueStr;
      }

      // 是否显示值
      item.IS_DISPLAY = obj.display;

      // 需要显示值 1: 显示，0: 不显示
      if (obj.display === 1) {
        // 有值 （不为 -）, 子组件在上报之前已经处理为 - 或者 有效值
        if (valueStr !== "-") {
          // 转换为浮点数再进行比较（字符串比较不准确）
          let baselineFLoat = parseFloat(item.BaseLine);
          let kpiValueFloat = null;

          if (indexListType === "evaluateTab") {
            kpiValueFloat = parseFloat(item.KPI_VALUE);

            // 0 是负向指标 指标上红下绿
            if (item.IS_POSITIVE === 0) {
              // 百分比类型：(过程指标) 基线和值等于 100
              if (
                item.SD_EKPI_CONVER === 1 &&
                baselineFLoat === 100 &&
                kpiValueFloat === 100
              ) {
                // 报警指标（基线值小于等于可疑率)
                item.IndexStatus = 0;
              } else {
                // else:
                // 其他数值类（统计指标） 和 百分百类型基线和值不等于 100
                // 值＜=基线时为绿色；
                // 值＞基线时为红色

                if (baselineFLoat >= kpiValueFloat) {
                  // 正常指标（基线值大于可疑率）
                  item.IndexStatus = 1;
                } else {
                  // else:报警指标（基线值小于等于可疑率)

                  item.IndexStatus = 0;
                }
              }
            } else if (item.IS_POSITIVE === 1) {
              // else:
              // 1 是正向指标 指标上绿下红
              // 正向指标：
              // 值＜基线时为红色；
              // 值≥基线时为绿色

              if (item.BaseLine <= kpiValueFloat) {
                // 正常指标（基线值小于可疑率）
                item.IndexStatus = 1;
              } else {
                // else:报警指标

                item.IndexStatus = 0;
              }
            }
          } else {
            // else:预警指标

            kpiValueFloat = parseFloat(item.SuspRate);

            if (baselineFLoat === 100 && kpiValueFloat === 100) {
              // 报警指标
              item.IndexStatus = 0;
            } else {
              // else:指标上红下绿（预警值大于可疑率）

              if (baselineFLoat >= kpiValueFloat) {
                item.IndexStatus = 1;
              } else {
                // else:报警指标

                item.IndexStatus = 0;
              }
            }
          }
        } else {
          // else:值为空 -

          item.IndexStatus = 2;
        }
      } else {
        // else:不需要显示值，直接设置为 未知（2，-）

        item.IndexStatus = 2;
      }
    }

    return item;
  });
}
