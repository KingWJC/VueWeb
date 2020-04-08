<template>
  <div class="sd-layer-tendency">
    <div :style="{width:'1095px', height:'270px'}"
      class="sd-layer-tendency__diagram"></div>
  </div>
</template>

<script>
  import ECharts from "echarts";
  import arrowImgPath from "__libs/imgs/red_arrow.png";
  import colors from "__shared-libs/js/modules/color-list";
  import tooltipPointColor from "__shared-libs/js/modules/tooltip-point-color";
  import appColors from "__libs/js/modules/color-list";

  export default {
    name: "sd-layer-tendency",

    props: {
      // 图表数据
      diagramData: {
        type: Object,
        default() {
          return null;
        }
      },

      // 是否显示基线
      isDisplay: {
        type: Number,
        default: 0
      },

      // 基线值
      baseline: {
        type: String,
        default: "0"
      }
    },

    data() {
      return {
        echartsInstance: null
      };
    },

    watch: {
      isDisplay() {
        this.initEcharts();
      },

      baseline() {
        this.initEcharts();
      }
    },

    mounted() {
      this.initEcharts();
    },

    beforeDestroy() {
      if (this.echartsInstance) {
        this.echartsInstance.dispose();
      }
    },

    methods: {
      // 构建 options 对象
      buildEchartsOptions() {
        let options = {
          legend: {
            show: this.diagramData.hasLegend,
            data: this.diagramData.legendData,
            orient: "vertical",
            left: "left",
            itemHeight: 12,
            itemWidth: 20,
            top: -3,
            textStyle: {
              color: appColors["echart-legend-text"]
            }
          },

          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "none",
              showContent: true
            },
            formatter: (params) => {
              let tooltipContent = `${params[0].data.baseTime}`;

              this.diagramData.tooltipShowContent.forEach((item, index) => {
                if (item.hasBase) {
                  let tmpData = params[index].data;
                  tooltipContent += `</br>${tooltipPointColor(params[index].color)} ${item.name}：${tmpData.value}${item.unit} (${tmpData.dependData[0]}/${tmpData.dependData[1]})`;
                } else {
                  let tmpData = params[0].data.dependData[item.depIndex];
                  tooltipContent += `</br>${tooltipPointColor(item.color)} ${item.name}：${tmpData}${item.unit}`;
                }
              });

              return tooltipContent;
            }
          },

          grid: {
            left: "8%",
            right: "7%",
            top: "17%",
            bottom: "0%",
            containLabel: true
          },

          xAxis: {
            data: this.diagramData.X,
            boundaryGap: false,
            type: "category",
            axisLabel: {
              color: appColors["echart-axis-color"]
            },
            axisLine: {
              lineStyle: {
                color: colors["border-gray"]
              }
            }
          },

          yAxis: {
            min: 0,
            max: 100,
            splitNumber: 5,
            axisLabel: {
              color: appColors["echart-axis-color"],
              formatter: (val) => {
                return `${val}${this.diagramData.yAxisUnit}`;
              }
            },
            axisLine: {
              lineStyle: {
                color: colors["border-gray"]
              }
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: appColors["echart-splitline-color"]
              }
            }
          },

          series: this.diagramData.Y.map((item) => {
            let lineColor = this.diagramData.visualMap && this.isDisplay !== 1
              ? this.diagramData.visualMap.color
              : item.lineColor;

            if (!this.diagramData.visualMap) {
              lineColor = item.lineColor;
            } else if (this.diagramData.visualMap) {
              if (this.isDisplay !== 1) {
                lineColor = this.diagramData.visualMap.color;
              } else if (this.isDisplay === 1 && this.baseline === "-") {
                lineColor = this.diagramData.visualMap.color;
              }
            }

            return {
              type: "line",
              name: item.name,
              data: item.data,
              itemStyle: {
                normal: {
                  color: lineColor
                }
              },
              lineStyle: {
                normal: {
                  color: lineColor,
                  width: 1,
                  type: "solid"
                }
              },
              markLine: {
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
                    type: "dashed"
                  }
                },

                data: this.isDisplay === 1
                  ? [{
                    yAxis: this.baseline,
                    symbol: "none"
                  }]
                  : null
              }
            };
          })
        };

        // 当: 配置了以基线值分段分颜色显示, 显示基线, 并且基线值不为 '-' 时
        // 启用 visualMap 配置
        if (
          this.diagramData.visualMap &&
          this.isDisplay === 1 &&
          this.baseline !== "-"
        ) {
          options["visualMap"] = {
            show: false,
            top: 10,
            right: 10,
            color: this.diagramData.visualMap.color,
            pieces: [
              {
                gt: -1,
                lte: parseFloat(this.baseline),
                color: this.diagramData.visualMap.lteColor
              },
              {
                gt: parseFloat(this.baseline),
                color: this.diagramData.visualMap.gtColor
              }
            ],

            outOfRange: {
              color: this.diagramData.visualMap.lteColor
            }
          };
        };

        return options;
      },

      initEcharts() {
        if (this.echartsInstance) {
          this.echartsInstance.dispose();
        }

        this.echartsInstance = ECharts
          .init(this.$el.querySelector(".sd-layer-tendency__diagram"))
          .setOption(this.buildEchartsOptions());
      }
    }
  };
</script>

<style lang="scss"></style>
