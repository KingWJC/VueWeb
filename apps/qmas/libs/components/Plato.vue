<template>
  <div class="plato">
    <div :style="{width: '1119px', height: '310px'}"
      class="plato__echart">
    </div>
  </div>
</template>

<script>
  import ECharts from "echarts";
  import getYaxisSize from "__shared-libs/js/modules/get-yaxis-sizes";
  import tooltipPointColor from "__shared-libs/js/modules/tooltip-point-color";
  import colors from "__shared-libs/js/modules/color-list";
  import appColors from "__libs/js/modules/color-list";

  import {
    platoSvgPath,
    barSvgPath,
    dataZoomSvgPath
  } from "__shared-libs/js/modules/build-icon-path";

  export default {
    name: "plato",

    props: {
      diagramData: {
        type: Object,
        default() {
          return {};
        }
      },

      // 病种名称
      sdName: {
        type: String,
        default: ""
      },

      // 是否显示柏拉图
      isShowPlato: {
        type: Boolean,
        default: true
      }
    },

    data() {
      return {
        echartsInstance: null
      };
    },

    mounted() {
      this.initEcharts();
    },

    // 销毁组件前销毁 echarts 实例
    beforeDestroy() {
      // 销毁实例，避免内存泄漏
      if (this.echartsInstance) {
        this.echartsInstance.dispose();
      }
    },

    methods: {
      initEcharts() {
        // 基于准备好的dom,初始化echarts实例
        this.echartsInstance = ECharts
          .init(this.$el.querySelector(".plato__echart"));

        let {
          series,
          xAxis,
          yData,
          careCount,
          monitorIndexCount
        } = this.diagramData;

        let platoXlength = xAxis.length,
            yMax = Math.max.apply(null, yData.diagData);
        let maxLeg = 0;
        let colorList = [
          colors["echart-blue"],
          appColors["theme-green"],
          appColors["echart-orange"]
        ];

        if (platoXlength !== 0) {
          if (platoXlength > 0 && platoXlength <= 16) {
            maxLeg = platoXlength - 1;
          } else {
            maxLeg = 16;
          }
        }

        let title = `【${this.sdName}】${monitorIndexCount}个监测指标,有${careCount}个指标需要重点关注`;

        let toolbox = {
          show: true,
          feature: {
            mark: {show: true},
            magicType: {
              show: true,
              type: ["tiled", "stack"],
              title: {
                stack: "切换为柱形图",
                tiled: "切换为柏拉图"
              },
              // 自定义图标
              icon: {
                tiled: platoSvgPath,
                stack: barSvgPath
              }
            }
          },
          right: 20,
          top: -7
        };

        let option = {
          title: {
            text: "",
            left: "center",
            textStyle: {
              fontSize: 16,
              color: appColors["echart-legend-text"]
            }
          },
          tooltip: {
            trigger: "axis",
            // 坐标轴指示器，坐标轴触发有效
            axisPointer: {
              // 默认为直线，可选为：'line' | 'shadow'
              type: "line",
              lineStyle: {
                opacity: 0
              }
            },
            formatter: function(params) {
              let formatValue;

              params.forEach((item, index) => {
                formatValue = `${params[0].data.seriesData[3][params[index].dataIndex]}<br/>`;

                // 当选中或取消图例时，索引会变化
                if (item.seriesName === "发生频次") {
                  formatValue += `${tooltipPointColor(colorList[0])}可疑发生频次 : ${item.data.seriesData[0][params[index].dataIndex]}<br/>`;
                } else if (item.seriesName === "趋势") {
                  formatValue += `${tooltipPointColor(colorList[0])}可疑发生频次 : ${item.data.seriesData[0][params[index].dataIndex]}<br/>`;
                  formatValue += `${tooltipPointColor(colorList[1])}发生频次占比 : ${item.data.seriesData[1][params[index].dataIndex]}%<br/>`;
                  formatValue += `${tooltipPointColor(colorList[2])}发生频次累计占比 : ${item.data.seriesData[2][params[index].dataIndex]}%<br/>`;
                }
              });

              return formatValue;
            }
          },

          legend: {
            // 可以关闭其中一个图例
            selectedMode: true,
            orient: "vertical",
            itemHeight: 12,
            itemWidth: 20,
            left: "left",
            top: -3,
            data: ["发生频次", "趋势"],
            textStyle: {
              color: appColors["echart-legend-text"]
            }
          },

          grid: {
            left: "10%",
            top: "20%",
            right: "5.5%",
            bottom: "10%",
            containLabel: true
          },

          dataZoom: [
            {
              show: true,
              height: 20,
              width: 900,
              left: "13%",
              xAxisIndex: [
                0
              ],
              // zoomlock:true,
              bottom: "1%",
              startValue: 0,
              endValue: maxLeg,
              fillerColor: appColors["in-gray"],
              handleIcon: dataZoomSvgPath,
              handleSize: "110%",
              handleStyle: {
                color: colors["checkbox-disabled-bg"],
                borderColor: appColors["light-gray-icon-border"]
              },
              // handle条字体超出截取
              labelFormatter: function(value) {
                // 横轴信息文字 超出7个字的时候 截取为6个+...
                if (xAxis.length > 0) {
                  if (xAxis[value]) {
                    return xAxis[value].length > 7
                      ? xAxis[value].substring(0, 6) + "..."
                      : xAxis[value];
                  } else {
                    return xAxis[value];
                  }
                }
              },
              showDataShadow: false,
              borderColor: appColors["light-gray-border"]
            }
          ],

          calculable: true,

          xAxis: [
            {
              type: "category",
              data: xAxis,
              splitLine: {show: false},
              axisLine: {
                onZero: true,
                lineStyle: {
                  color: colors["border-gray"]
                }
              },
              axisLabel: {
                color: appColors["echart-axis-color"]
              }
            }
          ],

          yAxis: [
            {
              type: "value",
              name: "发生频次",
              boundaryGap: [0, 0.1],
              min: 0,
              interval: yData.max
                ? getYaxisSize(yData.max).intervalValue
                : getYaxisSize(yMax).intervalValue,
              max: yData.max
                ? getYaxisSize(yData.max).max
                : getYaxisSize(yMax).max,
              splitLine: {
                show: true,
                lineStyle: {
                  color: appColors["echart-splitline-color"]
                }
              },
              nameTextStyle: {
                padding: [0, 45, 0, 0],
                color: appColors["echart-axis-color"]
              },
              axisLabel: {
                color: appColors["echart-axis-color"]
              },
              axisLine: {
                lineStyle: {
                  color: colors["border-gray"]
                }
              }
            }
          ],

          series: [
            {
              name: "发生频次",
              type: "bar",
              // barGap:'10%',
              barCategoryGap: 10,
              barMaxWidth: 30,
              barMinHeight: 1,
              itemStyle: {
                normal: {
                  color: colors["echart-blue"],
                  label: {
                    // 柱子上是否显示数字
                    // show: true,
                    position: "insideTop"
                  }
                }
              },
              data: series[0]
            }
          ]
        };

        if (this.isShowPlato) {
          option["toolbox"] = toolbox;
        }

        let aggregateRateYAxis = {
          type: "value",
          name: "累计占比",
          min: 0,
          max: 100,
          interval: 20,
          axisLabel: {
            formatter: "{value}%",
            color: appColors["echart-axis-color"]
          },
          splitLine: false,
          nameTextStyle: {
            padding: [0, 0, 0, 45],
            color: appColors["echart-axis-color"]
          },
          axisLine: {
            lineStyle: {
              color: colors["border-gray"]
            }
          }
        };

        let tendcy = {
          name: "趋势",
          type: "line",
          // 这句就是让曲线变平滑的
          smooth: true,
          // 这句就是去掉点的
          // symbol:'none',
          symbolSize: 8,
          stack: "总量",
          xAxisIndex: 0,
          yAxisIndex: 1,
          lineStyle: {
            width: 20,
            type: "dashed"
          },
          itemStyle: {
            normal: {
              color: appColors["echart-orange"],
              label: {
                show: true,
                formatter: "{c}%"
              }
            }
          },
          data: series[1]
        };

        this.echartsInstance.setOption(option);

        this.echartsInstance.on("magictypechanged", (data) => {
          let temp = this.echartsInstance.getOption();

          if (data.currentType === "tiled") {
            if (temp.series.length === 2) {
              temp.series.pop();
              temp.yAxis.pop();
            }

            temp.series.push(tendcy);
            temp.yAxis.push(aggregateRateYAxis);
            temp.title[0].text = title;
            temp.dataZoom[0].width = 850;
          } else {
            if (temp.series.length === 2) {
              temp.series.pop();
              temp.yAxis.pop();
            }

            temp.title[0].text = "";
            temp.dataZoom[0].width = 900;
          }

          // 第二个参数:可选，是否不跟之前设置的option进行合并，默认为false，即合并。
          // 触发他的重新渲染,否则新的选项不被应用
          this.echartsInstance.setOption(temp, true);
        });
      }
    }
  };
</script>

<style lang="scss">
  @import "~__libs/scss/lib-common-utils";

  .plato {
    &__echart {
      padding-top: sz(10);
    }
  }
</style>
