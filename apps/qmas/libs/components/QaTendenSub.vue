<template>
  <div class="qa-tenden-sub">
    <div :style="{width: '1095px', height: '270px'}"
      class="qa-tenden-sub__lineStck"></div>
  </div>
</template>

<script>
  import ECharts from "echarts";
  // echarts 画预警值箭头用的图片
  import arrowImgPath from "__libs/imgs/red_arrow.png";
  import tooltipPointColor from "__shared-libs/js/modules/tooltip-point-color";
  import Moment from "moment";
  import colors from "__shared-libs/js/modules/color-list";
  import appColors from "__libs/js/modules/color-list";

  export default {
    name: "qa-tenden-sub",

    props: {
      // 图表数据
      diagramData: {
        type: Object,
        default() {
          return null;
        }
      },

      // 是否显示基线（选项：0不显示；1显示）
      isDisplay: {
        type: Number,
        default: 0
      },

      // 基线值
      baselineValue: {
        type: String,
        default: ""
      },

      // 选择当前的统计精度
      activeAccuracyCode: {
        type: String,
        default: ""
      }
    },

    data() {
      return {
        echartsInstance: null,
        selected: []
      };
    },

    // TODO: 目前还是不能监测到 props 变化，只能 watch
    watch: {
      diagramData: "initEchartsData"
    },

    mounted() {
      this.initEchartsData();
    },

    // 销毁组件前销毁 echarts 实例
    beforeDestroy() {
      // 销毁实例，避免内存泄漏
      if (this.echartsInstance) {
        this.echartsInstance.dispose();
      }
    },

    methods: {
      // 初始化,在此方法里面画图
      initEchartsData() {
        let data = this.diagramData.seriesData.map((item, index) => {
          return this.tiqu(item, index);
        });

        // 初始用组件传来的值
        this.selected =
          this.diagramData.legendList.reduce((temp, item, index) => {
            if (!this.diagramData.legendMap[item]) {
              temp.push(index);
            }

            return temp;
        }, []);

        this.initEcharts(data);
      },

      // 提取seriesData结构
      tiqu(param, index) {
        let lineType = "",
            markLine = null;

        if (index % 2 === 0) {
          lineType = "solid";
        } else {
          lineType = "dashed";
        }

        // 只有总趋势的可疑率和反馈率有基线
        if (index < 2) {
          markLine = {
            silent: true,
            symbol: `image://${arrowImgPath}`,
            symbolSize: [16, 54],

            label: {
              normal: {
                formatter: "       预警值",
                position: "end"
              }
            },
            lineStyle: {
              normal: {
                color: appColors["sd-base-line"],
                type: "dotted"
              }
            },
            data: this.formatBaselineData()
          };
        } else {
          markLine = null;
        }

        return {
          name: this.diagramData.legendList[index],
          type: "line",
          lineStyle: {
            normal: {
              width: 1.5,
              type: lineType
            }
          },
          data: param,
          markLine: markLine
        };
      },

      // 格式化预警值给 echarts
      formatBaselineData() {
        // 使用预警值
        if (this.isDisplay === 1) {
          // 预警值未设置
          if (this.baselineValue === "-") {
            return null;
          }

          return [{
            yAxis: this.baselineValue,
            symbol: "none"
          }];
        }

        // 不使用预警值
        return null;
      },

      // 初始化图表
      initEcharts(series) {
        // 如果父组件没有传入合法数据，返回
        if (!this.diagramData) {
          return;
        }

        // 销毁实例，避免内存泄漏
        if (this.echartsInstance) {
          this.echartsInstance.dispose();
        }

        // 基于准备好的dom，初始化echarts实例
        this.echartsInstance = ECharts
          .init(this.$el.querySelector(".qa-tenden-sub__lineStck"));

        let {
          xAxisValue,
          sectionTime,
          originalX,
          legendList,
          legendMap
        } = this.diagramData;

        // 当前显示的页数
        let pageCurrent = 1,
            // 总页数
            pageTotal = Math.ceil(legendList.length / 12),
            // 上一个索引值
            tempIndex = 0;

        let option = {
          color: [
            colors["echart-blue"],
            colors["echart-blue"],
            appColors["echart-orange"],
            appColors["echart-orange"],
            appColors["theme-green"],
            appColors["theme-green"],
            appColors["echart-yellow"],
            appColors["echart-yellow"],
            appColors["echart-red"],
            appColors["echart-red"],
            appColors["echart-light-blue"],
            appColors["echart-light-blue"],
            appColors["echart-purple"],
            appColors["echart-purple"]
          ],
          tooltip: {
            trigger: "axis",
            formatter: (params) => {
              let ed = sectionTime.filter((item) => {
                // 月
                if (this.activeAccuracyCode === "1") {
                  return Moment(item.MinRange).format("YYYY-MM") ===
                    Moment(originalX[params[0].dataIndex]).format("YYYY-MM");
                } else {
                  // else: 周/季度（直接使用 YYYY-MM-DD）
                  return item.MinRange === originalX[params[0].dataIndex];
                }
              });

              let valueFliter = null,
                  // 创建参数副本
                  newParams = params.slice(0);

              // 构建符合的参数结构
              // 使得关闭图例的参数项用空 {} 占位
              this.selected.filter((item) => {
                newParams.splice(item, 0, {});
              });

              let arr = [],
                  styleStr = `
                    style="line-height: 18px;
                    font-size: 12px;
                    padding-right: 5px;"`;

              for (let i = 0; i < newParams.length; i += 2) {
                let newParamsTemp1 = newParams[i],
                    newParamsTemp2 = newParams[i + 1],
                    dataIndexTemp1 = newParamsTemp1.dataIndex,
                    dataIndexTemp2 = newParamsTemp2.dataIndex,
                    newParamsValTemp1 = newParamsTemp1.value,
                    newParamsValTemp2 = newParamsTemp2.value,
                    legendTemp1 = legendList[i].slice(-3),
                    legendTemp2 = legendList[i + 1].slice(-3),
                    legendTitle = legendList[i].slice(0, -3),
                    paramsColor1 = newParamsTemp1.color,
                    paramsColor2 = newParamsTemp2.color;

                // 显示科室行
                if (!(!newParamsValTemp1 && !newParamsValTemp2)) {
                  let temp = [];

                  // 科室名字行
                  arr.push(`<tr>
                      <td colspan="2"
                        style="line-height: 18px;
                        font-size: 12px;">
                        ${legendTitle}
                      </td>
                    </tr>`);

                  // 可疑反馈行
                  temp.push(`<tr>`);

                  if (newParamsValTemp1 && !newParamsValTemp2) {
                    let datasArr = newParamsTemp1.data.datas,
                        num = datasArr[0][0 + i][dataIndexTemp1],
                        den = datasArr[1][0 + i][dataIndexTemp1];
                    temp.push(`<td ${styleStr}>
                        ${tooltipPointColor(paramsColor1)}
                        ${legendTemp1} ：${newParamsValTemp1}% (${num}/${den})
                      </td>
                      <td ${styleStr}>
                        ${tooltipPointColor(paramsColor1, "empty")}
                        ${legendTemp2} ：--
                      </td>`);
                  }

                  if (!newParamsValTemp1 && newParamsValTemp2) {
                    let datasArr = newParamsTemp2.data.datas,
                        num = datasArr[0][1 + i][dataIndexTemp2],
                        den = datasArr[1][1 + i][dataIndexTemp2];

                    temp.push(`<td ${styleStr}>
                        ${tooltipPointColor(paramsColor2)}
                        ${legendTemp1} ：--
                      </td>
                      <td ${styleStr}>
                        ${tooltipPointColor(paramsColor2, "empty")}
                        ${legendTemp2} ：${newParamsValTemp2}% (${num}/${den})
                      </td>`);
                  }

                  if (newParamsValTemp1 && newParamsValTemp2) {
                    let datasArr = newParamsTemp1.data.datas,
                        numSusp = datasArr[0][0 + i][dataIndexTemp1],
                        denSusp = datasArr[1][0 + i][dataIndexTemp1],
                        numFac = datasArr[0][1 + i][dataIndexTemp2],
                        denFac = datasArr[1][1 + i][dataIndexTemp2];

                    temp.push(`<td ${styleStr}>
                        ${tooltipPointColor(paramsColor2)}
                        ${legendTemp1} ：${newParamsValTemp1}% (${numSusp}/${denSusp})
                      </td>
                      <td ${styleStr}>
                        ${tooltipPointColor(paramsColor2, "empty")}
                        ${legendTemp2} ：${newParamsValTemp2}% (${numFac}/${denFac})
                      </td>`);
                  }

                  temp.push(`<tr>`);

                  arr.push(temp.join(""));
                } else {
                  // else: 不显示科室行
                  // else: 没有科室行   代表没有 可疑反馈行
                  arr.push(`<tr>
                      <td colspan="2"></td>
                    </tr>
                    <tr>
                      <td></td>
                      <td></td>
                    </tr>`);
                }
              }

              valueFliter =
                `<table cellspacing="0" cellpadding="0">
                <tr>
                  <td colspan="2" style="line-height: 18px; font-size: 12px;">
                    ${ed[0].MinRange}~${ed[0].MaxRange}
                  </td>
                </tr>
                ${arr.join("")}
              </table>`;

              return valueFliter;
            },

            axisPointer: {
              type: "none",
              showContent: false
            }
          },

          legend: {
            type: "scroll",
            height: 266,
            // 图例高度 在火狐中不设置的话平均值的“平”字会显示不全
            itemHeight: 9,
            itemWidth: 20,
            itemGap: 9,
            tooltip: {
              show: true
            },

            // 图例开关图片样式交替变化
            data: legendList.reduce((temp, item, index) => {
              temp.push({
                name: item,
                icon: index % 2 === 0 ? "circle" : "emptycircle"
              });

              return temp;
            }, []),
            pageIconColor: appColors["dark-gray-triangle"],
            pageIconInactiveColor: appColors["light-gray-triangle"],
            pageIconSize: [6, 9],
            pageButtonItemGap: 10,
            pageButtonGap: 2,
            pageFormatter: `${pageCurrent}/${pageTotal}`,
            formatter: function(params) {
              if (params.length > 7) {
                params = `${params.substr(0, 4)}...${params.substr(-3)}`;
              }

              return params;
            },
            selected: legendMap,
            textStyle: {
              color: appColors["echart-legend-text"]
            },
            orient: "vertical",
            left: "left",
            top: "0"
          },

          toolbox: {
            show: true,
            feature: {
              mark: {
                show: false
              },
              dataView: {
                show: false,
                readOnly: false
              },
              magicType: {
                show: false,
                type: ["line", "bar", "stack", "tiled"]
              },
              restore: {
                show: false
              },
              saveAsImage: {
                show: false
              }
            }
          },

          calculable: false,

          grid: {
            left: "12%",
            right: "7%",
            top: "17%",
            bottom: "0%",
            containLabel: true
          },

          xAxis: [{
            type: "category",
            boundaryGap: false,
            splitLine: {
              show: false
            },
            axisLabel: {
              color: appColors["echart-axis-color"]
            },
            axisLine: {
              lineStyle: {
                color: colors["border-gray"]
              }
            },
            data: xAxisValue
          }],

          yAxis: [{
            type: "value",
            scale: true,
            min: 0,
            max: 100,
            splitNumber: 5,
            splitArea: {
              show: false
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: appColors["echart-splitline-color"]
              }
            },
            axisLabel: {
              show: true,
              interval: "auto",
              formatter: function(value) {
                return value + "%";
              },
              color: appColors["echart-axis-color"]
            },
            axisLine: {
              lineStyle: {
                color: colors["border-gray"]
              }
            }
          }],

          series
        };

        // 绘制图表
        this.echartsInstance.setOption(option);

        // 点击图例时  重新构建 图例选中 map
        this.echartsInstance.on("legendselectchanged", (param) => {
          let tempMap = param.selected;

          this.selected = legendList.reduce((temp, item, index) => {
            if (!tempMap[item]) {
              temp.push(index);
            }

            return temp;
          }, []);
        });

        // 点击滚动的时候，修复翻页，echarts有bug，不能正确计算页数，bug #1796
        this.echartsInstance.on("legendscroll", (data) => {
          let echartScatter = this.echartsInstance.getOption();

          // 向后翻页，不是最后一页就增页数
          if (tempIndex <= data.scrollDataIndex) {
            if (pageCurrent !== pageTotal) {
              pageCurrent++;
            }
          } else {
            // 向前翻页，不是第一页就减页数
            if (pageCurrent !== 1) {
              pageCurrent--;
            }
          }

          tempIndex = data.scrollDataIndex;
          echartScatter.legend[0].pageFormatter = `${pageCurrent}/${pageTotal}`;

          this.echartsInstance.setOption(echartScatter, true);
        });
      }
    }
  };
</script>

<style lang="scss">
</style>
