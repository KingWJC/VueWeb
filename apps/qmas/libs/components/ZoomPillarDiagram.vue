<template>
  <div class="zoom-pillar-diagram">
    <div :style="{width: `${widthCanvas}px`, height: `${heightCanvas}px`}"
      class="zoom-pillar-diagram__stack"></div>
  </div>
</template>

<script>
  import ECharts from "echarts";
  import tooltipPointColor from "__shared-libs/js/modules/tooltip-point-color";
  import { dataZoomSvgPath } from "__shared-libs/js/modules/build-icon-path";
  import colors from "__shared-libs/js/modules/color-list";
  import appColors from "__libs/js/modules/color-list";

  export default {
    name: "zoom-pillar-diagram",

    props: {
      diagramData: {
        type: Object,
        default() {
          return {};
        }
      },

      // 容器宽
      widthCanvas: {
        type: Number,
        default: 1130
      },

      // 容器高
      heightCanvas: {
        type: Number,
        default: 340
      },

      // handle高
      dataZoomHeight: {
        type: Number,
        default: 20
      },

      // handle宽
      dataZoomWidth: {
        type: Number,
        default: 935
      },

      // handle位移
      dataZoomPositionLeft: {
        type: String,
        default: "10%"
      },

      dataZoomPositionBottom: {
        type: String,
        default: "1%"
      },

      // 默认显示多少柱子  从0开始
      zoomEndValue: {
        type: Number,
        default: 5
      },

      // 图例的宽高
      legendHeight: {
        type: Number,
        default: 12
      },

      legendWidth: {
        type: Number,
        default: 16
      },

      // 图例的位置
      legendPositionLeft: {
        type: Number,
        default: -5
      },

      legendPositionTop: {
        type: Number,
        default: -3
      },

      // 图表距容器的位移
      gridPositionTop: {
        type: String,
        default: "9%"
      },

      gridPositionLeft: {
        type: String,
        default: "8%"
      },

      gridPositionRight: {
        type: String,
        default: "7%"
      },

      gridPositionBottom: {
        type: String,
        default: "10%"
      },

      // 柱子宽
      barMaxWidth: {
        type: Number,
        default: 40
      },

      legendName: {
        type: Array,
        default() {
          return ["可疑率", "反馈率"];
        }
      },

      // 轴标文字截取数
      axisLabelCount: {
        type: Number,
        default: 12
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
          .init(this.$el.querySelector(".zoom-pillar-diagram__stack"));

        let xAxis = this.diagramData.X.val.slice(0),
            yAxis = this.diagramData.Y.slice(0);

        // 绘制图表
        let option = {
          color: [colors["echart-blue"], appColors["theme-green"]],

          tooltip: {
            trigger: "axis",
            formatter: (params) => {
              let a = null,
                  b = null,
                  valueFilter = "";

              // 按15个字符换行
              let newNameStr = params[0].name
                .trim()
                .split(/(.{15})/gi)
                .filter((str) => {
                  return str !== "";
                })
                .join("<br />");

              if (params.length > 0) {
                a = `${yAxis[0].numerator[params[0].dataIndex]}/${yAxis[0].denominator[params[0].dataIndex]}`;
                b = `${yAxis[1].numerator[params[0].dataIndex]}/${yAxis[1].denominator[params[0].dataIndex]}`;

                if (params.length === 2) {
                  valueFilter = `${newNameStr}<br/>
                    ${tooltipPointColor(params[0].color)}${params[0].seriesName}
                    ：${params[0].value}% (${a})<br/>
                    ${tooltipPointColor(params[1].color)}${params[1].seriesName}
                    ：${params[1].value}% (${b})<br/>`;
                } else {
                  if (params[0].seriesName === "可疑率") {
                    valueFilter = `${newNameStr}<br/>
                      ${tooltipPointColor(params[0].color)}
                      ${params[0].seriesName}：${params[0].value}% (${a})`;
                  } else {
                    valueFilter = `${newNameStr}<br/>
                      ${tooltipPointColor(params[0].color)}
                      ${params[0].seriesName}：${params[0].value}% (${b})`;
                  }
                }

                return valueFilter;
              }
            },
            // 坐标轴指示器，坐标轴触发有效
            axisPointer: {
              // 默认为直线，可选为：'line' | 'shadow'
              type: "shadow"
            }
          },

          legend: {
            data: this.legendName,
            orient: "vertical",
            left: this.legendPositionLeft,
            top: this.legendPositionTop,
            itemHeight: this.legendHeight,
            itemWidth: this.legendWidth,
            textStyle: {
              color: appColors["echart-legend-text"]
            }
          },

          grid: {
            top: this.gridPositionTop,
            left: this.gridPositionLeft,
            right: this.gridPositionRight,
            bottom: this.gridPositionBottom,
            containLabel: true
          },

          xAxis: [{
            type: "category",
            data: xAxis,
            axisLabel: {
              // 横轴信息全部显示
              interval: 0,
              // 倾斜显示
              rotate: 0,
              color: appColors["echart-axis-color"],
              formatter: (val) => {
                // 横轴信息文字 超出12个字的时候 截取为12个+...
                // x轴有值的时候才截取
                return val && val.length > this.axisLabelCount
                  ? val.substring(0, this.axisLabelCount) + "..."
                  : val;
              }
            },
            axisLine: {
              onZero: false,
              lineStyle: {
                color: colors["border-gray"]
              }
            }
          }],

          yAxis: [{
            type: "value",
            max: 100,
            axisLabel: {
              show: true,
              // interval: 'auto',
              formatter: (value) => {
                return `${value}%`;
              },
              color: appColors["echart-axis-color"]
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: appColors["echart-splitline-color"]
              }
            },
            axisLine: {
              lineStyle: {
                color: colors["border-gray"]
              }
            }
          }],

          dataZoom: [
            {
              show: true,
              height: this.dataZoomHeight,
              width: this.dataZoomWidth,
              left: this.dataZoomPositionLeft,
              bottom: this.dataZoomPositionBottom,
              xAxisIndex: [
                0
              ],
              startValue: 0,
              endValue: xAxis.length <= 4
                ? xAxis.length - 1
                : this.zoomEndValue,
              fillerColor: appColors["in-gray"],
              handleIcon: dataZoomSvgPath,
              handleSize: "110%",
              handleStyle: {
                color: colors["checkbox-disabled-bg"],
                borderColor: appColors["light-gray-icon-border"]
              },
              // handle条字体超出截取
              labelFormatter: (value) => {
                value = xAxis.length && value !== 0 ? value - 1 : value;

                // 横轴信息文字 超出6个字的时候 截取为5个+...
                if (xAxis.length > 0) {
                  return xAxis[value].length > 6
                    ? xAxis[value].substring(0, 5) + "..."
                    : xAxis[value];
                }
              },
              showDataShadow: false,
              borderColor: appColors["light-gray-border"]
            }
          ],

          series: yAxis.map((item, index) => {
            return {
              name: this.legendName[index],
              type: "bar",
              data: item.rate,
              barMaxWidth: this.barMaxWidth,
              barMinHeight: 1
            };
          })
        };

        this.echartsInstance.setOption(option);
      }
    }
  };
</script>

<style lang="scss"></style>
