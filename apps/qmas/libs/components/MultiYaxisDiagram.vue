<template>
  <div class="multi-yaxis-diagram">
    <div
      :style="{
        height: echartsHeight + 'px' ,
        width: echartsWidth + 'px'
      }"
      class="multi-yaxis-diagram__main"></div>
  </div>
</template>
<script>
  import Echarts from "echarts";
  import getYaxisSize from "__shared-libs/js/modules/get-yaxis-sizes";
  import { dataZoomSvgPath } from "__shared-libs/js/modules/build-icon-path";
  import tooltipPointColor from "__shared-libs/js/modules/tooltip-point-color";
  import colors from "__shared-libs/js/modules/color-list";
  import appColors from "__libs/js/modules/color-list";

  export default {
    name: "multi-yaxis-diagram",

    props: {
      diagramData: {
        type: Object,
        default() {
          return {};
        }
      },

      echartsHeight: {
        type: Number,
        default: 330
      },

      echartsWidth: {
        type: Number,
        default: 1110
      },

      // tip 上显示自己单独名字或者显示和 x 轴一样的名字
      // same: 显示和 x 轴一样的名字
      // alone: 显示自己单独名字
      tipType: {
        type: String,
        default: "same"
      },

      // x 轴 label 渲染数据结构
      renderStrc: {
        type: Function,
        default: (item) => {
          return item;
        }
      }
    },

    data() {
      return {
        // echarts 实例
        echartsInstance: null,
        selectedLegend: null
      };
    },

    watch: {
      diagramData: "initEcharts"
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
      // 创建ecahts option 中需要的动态数据
      getOptions() {
        let colorList = [
          colors["echart-blue"],
          appColors["theme-green"],
          appColors["echart-orange"],
          appColors["blue-multi-yaxis"]
        ];

        let yColorList = [
          colors["theme-blue"],
          appColors["gray-green"],
          appColors["state-color"]
        ];

        let _this = this;

        let zoomEndValue = 3;

        let xAxis = this.diagramData.xAxis.reduce((tmpList, curItem) => {
          tmpList.push(this.renderStrc(curItem));

          return tmpList;
        }, []);

        if (xAxis.length <= 3) {
          zoomEndValue = xAxis.length - 1;
        }

        return {
          color: colorList,

          legend: {
            data: this.diagramData.yData.map((item) => {
              return item.name;
            }),
            padding: 0,
            itemHeight: 12,
            itemWidth: 20,
            orient: "vertical",
            left: "left",
            top: 2,
            textStyle: {
              color: appColors["echart-legend-text"]
            }
          },

          xAxis: [
            {
              type: "category",
              axisTick: {
                alignWithLabel: true
              },
              data: xAxis,
              axisLabel: {
                formatter: function(val) {
                  return val;
                },
                color: appColors["echart-axis-color"]
              },
              axisLine: {
                lineStyle: {
                  color: colors["border-gray"]
                }
              }
            }
          ],

          yAxis: this.diagramData.yData.map((item, index) => {
            let haveMax = getYaxisSize(item.max),
                noHaveMax = getYaxisSize(Math.max.apply(null, item.data));

            return {
              splitLine: {
                show: true,
                lineStyle: {
                  color: appColors["echart-splitline-color"]
                }
              },
              type: "value",
              name: item.name,
              min: 0,
              interval: item.max
                ? haveMax.intervalValue
                : noHaveMax.intervalValue,
              max: item.max
                ? haveMax.max
                : noHaveMax.max,
              position: index === 0
                ? "left"
                : "right",
              offset: index - 1 >= 0
                ? (index - 1) * 70
                : 0,
              axisLine: {
                lineStyle: {
                  color: yColorList[index]
                }
              },
              axisLabel: {
                formatter(value) {
                  return `${value}${item.unit}`;
                }
              }
            };
          }),

          series: this.diagramData.yData.map((item, index) => {
            return {
              name: item.name,
              type: item.type,
              data: this.diagramData.seriesStructure[index],
              yAxisIndex: index,
              barMaxWidth: 40,
              barMinHeight: 1
            };
          }),

          tooltip: {
            trigger: "axis",
            axisPointer: {type: "shadow"},
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            padding: [5, 10],
            formatter(params) {
              let yData = _this.diagramData.yData;
              // 构建一个 map, 用于维护图例对应的索引(当选中或取消图例时，索引会变化)
              let titleMap = {
                费用: 0,
                诊疗质量: 1,
                费效比: 2
              };
              let formatValue = params[0].name;

              // 按17个字符换行
              if (_this.tipType === "alone") {
                let effectName = xAxis.filter((item) => {
                  return item.value === params[0].name;
                })[0].name;

                formatValue = effectName
                  .trim()
                  .split(/(.{17})/gi)
                  .filter((str) => {
                    return str !== "";
                  })
                  .join("<br/>");
              }

              formatValue = params.reduce((accStr, curItem) => {
                let dataIndex = curItem.dataIndex;
                let realTitle = curItem.seriesName;
                let realIndex = titleMap[realTitle];

                accStr += `${tooltipPointColor(colorList[realIndex])}${realTitle} :
                    ${curItem.data.arr[realIndex][dataIndex]}${yData[realIndex].unit} <br/>`;

                return accStr;
              }, `${formatValue}<br/>`);

              formatValue += `${tooltipPointColor(colorList[3])}监测病例 :
                ${params[0].data.arr[3][params[0].dataIndex]} <br/>`;

              return formatValue;
            }
          },

          grid: {
            right: "11%",
            bottom: "16%",
            top: "70"
          },

          dataZoom: [
            {
              show: true,
              height: 20,
              width: 900,
              left: "10%",
              xAxisIndex: [
                0
              ],
              // zoomlock:true,
              bottom: "1%",
              startValue: 0,
              endValue: zoomEndValue,
              fillerColor: appColors["in-gray"],
              handleIcon: dataZoomSvgPath,
              handleSize: "110%",
              handleStyle: {
                color: colors["checkbox-disabled-bg"],
                borderColor: appColors["light-gray-icon-border"]
              },
              // handle条字体超出截取
              labelFormatter: function(value) {
                // 横轴信息文字 超出13个字的时候 截取为12个+...
                if (xAxis.length > 0) {
                  let valStr = xAxis[value];

                  if (_this.tipType === "alone") {
                    valStr = xAxis[value].value;
                  }

                  return valStr.length > 13
                    ? valStr.substring(0, 12) + "..."
                    : valStr;
                }
              },
              showDataShadow: false,
              borderColor: appColors["light-gray-border"]
            }
          ]
        };
      },

      // 初始化echarts 实例
      initEcharts() {
        this.echartsInstance = Echarts
          .init(this.$el.querySelector(".multi-yaxis-diagram__main"));
        this.echartsInstance.setOption(this.getOptions());

        this.echartsInstance.on("click", (data) => {
          this.$emit("drilledName", data.dataIndex);
        });
      }
    }
  };
</script>
<style lang="scss"></style>
