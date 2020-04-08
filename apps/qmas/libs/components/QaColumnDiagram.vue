<template>
  <div class="qa-column-diagram">
    <div :style="{width: `${widthCanvas}px`, height: '330px'}"
      class="qa-column-diagram__stack"></div>
  </div>
</template>

<script>
  import ECharts from "echarts";
  import tooltipPointColor from "__shared-libs/js/modules/tooltip-point-color";
  import colors from "__shared-libs/js/modules/color-list";
  import { dataZoomSvgPath } from "__shared-libs/js/modules/build-icon-path";
  import appColors from "__libs/js/modules/color-list";

  export default {
    name: "qa-column-diagram",

    props: {
      diagramData: {
        type: Object,
        default() {
          return {};
        }
      },

      // handle高
      dataZoomHeight: {
        type: Number,
        default: 20
      },

      // handle宽
      dataZoomWidth: {
        type: Number,
        default: 900
      },

      // handle位移
      dataZoomPositionLeft: {
        type: String,
        default: "14%"
      },

      dataZoomPositionBottom: {
        type: String,
        default: "1%"
      },

      // 默认显示多少柱子  从0开始
      zoomEndValue: {
        type: Number,
        default: 4
      },

      // 轴标文字截取数
      axisLabelCount: {
        type: Number,
        default: 15
      },

      widthCanvas: {
        type: Number,
        default: 1050
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
          .init(this.$el.querySelector(".qa-column-diagram__stack"));

        let myxAxisData = this.diagramData.myxAxisData;
        let suspData = this.diagramData.Susp.map((item) => {
          return {
            value: item,
            suspAll: this.diagramData.SuspAll
          };
        });

        let factorialData = this.diagramData.Factorial.map((item) => {
          return {
            value: item,
            factorialAll: this.diagramData.FactorialAll
          };
        });

        // 绘制图表
        let option = {
          color: [colors["echart-blue"], appColors["theme-green"]],

          tooltip: {
            trigger: "axis",
            formatter: function(params) {
              let a = null,
                  b = null;

              if (params.length > 0) {
                let valueFilter = "";

                if (params.length === 2) {
                  let suspItem = params[0].data.suspAll[params[0].dataIndex],
                      factorialItem =
                        params[1].data.factorialAll[params[1].dataIndex];

                  // 可疑率数据处理
                  a = `${suspItem.SuspCount}/${suspItem.QualityPointCount}`;

                  valueFilter = `${params[0].name}<br/>
                    ${tooltipPointColor(params[0].color)}${params[0].seriesName}
                    ：${params[0].value}% (${a})<br/>`;

                  // 反馈率数据处理
                  b = `${factorialItem.FactorialCount}/${factorialItem.SuspCount}`;

                  valueFilter = `${valueFilter}${tooltipPointColor(params[1].color)}${params[1].seriesName}
                    ：${params[1].value}% (${b})`;
                } else {
                  if (params[0].seriesName === "可疑率") {
                    let suspItem = params[0].data.suspAll[params[0].dataIndex];

                    // 可疑率数据处理
                    a = `${suspItem.SuspCount}/${suspItem.QualityPointCount}`;

                    valueFilter = `${params[0].name}<br/>
                      ${tooltipPointColor(params[0].color)}
                      ${params[0].seriesName}：${params[0].value}% (${a})<br/>`;
                  } else {
                    let factorialItem =
                      params[0].data.factorialAll[params[0].dataIndex];

                    // 反馈率数据处理
                    b = `${factorialItem.FactorialCount}/${factorialItem.SuspCount}`;

                    valueFilter = `${params[0].name}<br/>
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
            data: ["可疑率", "反馈率"],
            orient: "vertical",
            left: 0,
            top: -3,
            itemHeight: 12,
            itemWidth: 20,
            textStyle: {
              color: appColors["echart-legend-text"]
            }
          },

          grid: {
            left: "10%",
            right: "0%",
            bottom: "10%",
            containLabel: true
          },

          xAxis: [{
            type: "category",
            data: myxAxisData,
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
              formatter: function(value) {
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
              endValue: myxAxisData.length <= 4
                ? myxAxisData.length - 1
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
                // 横轴信息文字 超出6个字的时候 截取为5个+...
                if (myxAxisData.length > 0) {
                  return myxAxisData[value].length > 6
                    ? myxAxisData[value].substring(0, 5) + "..."
                    : myxAxisData[value];
                }
              },
              showDataShadow: false,
              borderColor: appColors["light-gray-border"]
            }
          ],
          series: [
            {
              name: "可疑率",
              type: "bar",
              barMaxWidth: 40,
              barMinHeight: 1,
              data: suspData
            }, {
              name: "反馈率",
              type: "bar",
              barMaxWidth: 40,
              barMinHeight: 1,
              data: factorialData
            }
          ]
        };

        this.echartsInstance.setOption(option);

        let mythis = this;
        this.echartsInstance.on("click", function(params) {
          mythis.$emit("levelMenu", params.dataIndex);
        });
      }
    }
  };
</script>

<style lang="scss"></style>
