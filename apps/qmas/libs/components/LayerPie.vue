<template>
  <div class="layer-pie">
    <div :style="{width: '416px', height: '320px'}"
      class="layer-pie__echarts">
    </div>
  </div>
</template>

<script>
  import ECharts from "echarts";
  import tooltipPointColor from "__shared-libs/js/modules/tooltip-point-color";
  import colors from "__shared-libs/js/modules/color-list";
  import appColors from "__libs/js/modules/color-list";

  export default {
    name: "layer-pie",

    props: {
      pieData: {
        type: Object,
        default() {
          return {};
        }
      }
    },

    data() {
      return {
        echartsInstancePie: null
      };
    },

    mounted() {
      this.initPieEcharts();
    },

    // 销毁组件前销毁 echarts 实例
    beforeDestroy() {
      // 销毁实例，避免内存泄漏
      if (this.echartsInstancePie) {
        this.echartsInstancePie.dispose();
      }
    },

    methods: {
      initPieEcharts() {
        // 初始化饼图所需数据
        let {
          pieLegend,
          pieSeries,
          selected
        } = this.pieData;

        // 销毁实例，避免内存泄漏
        if (this.echartsInstancePie) {
          this.echartsInstancePie.dispose();
        }

        // 基于准备好的dom，初始化echarts实例
        this.echartsInstancePie = ECharts
          .init(this.$el.querySelector(".layer-pie__echarts"));

        let option = {
          title: {
            text: "",
            subtext: "",
            x: "center"
          },

          tooltip: {
            trigger: "item",
            formatter: function(val) {
              // 按15个字符换行
              let newstr = val.name.trim().split(/(.{10})/gi)
                .filter((str) => {
                  return str !== "";
                })
                .join("<br />");

              return `${newstr}</br>${tooltipPointColor(val.color)}人数：${val.data.data[val.dataIndex]}</br>${tooltipPointColor(val.color)}人数占比：${val.value}%`;
            }
          },

          legend: {
            type: "scroll",
            height: 290,
            orient: "vertical",
            itemHeight: 12,
            itemWidth: 16,
            pageIconColor: appColors["dark-gray-triangle"],
            pageIconInactiveColor: appColors["light-gray-triangle"],
            pageIconSize: [6, 9],
            pageButtonItemGap: 10,
            pageButtonGap: 20,
            left: -5,
            formatter: function(params) {
              if (params.length > 4) {
                params = params.substring(0, 4) + "...";
              }

              return params;
            },
            tooltip: {
              show: true
            },
            selected: selected,
            textStyle: {
              color: appColors["echart-legend-text"]
            },
            data: pieLegend
          },

          toolbox: {
            show: false,
            feature: {
              mark: { show: false },
              dataView: {
                show: false,
                readOnly: false
              },
              magicType: {
                show: false,
                type: ["pie", "funnel"],
                option: {
                  funnel: {
                    x: "25%",
                    width: "50%",
                    funnelAlign: "left",
                    max: 1548
                  }
                }
              },
              restore: { show: false },
              saveAsImage: { show: false }
            }
          },

          color: [
            colors["echart-blue"],
            appColors["red-pie"],
            appColors["blue-violet-pie"],
            appColors["green-blackihs-pie"],
            appColors["orange-tips"],
            appColors["yellow-pie"],
            appColors["green-pie"],
            appColors["violet-pie"],
            appColors["light-blue-pie"],
            appColors["light-orange-pie"]
          ],

          calculable: true,

          series: [
            {
              seriesId: 123,
              name: "",
              type: "pie",
              radius: "50%",
              center: ["60%", "50%"],
              label: {
                normal: {
                  formatter: function(params) {
                    let value = params.data.name;

                    if (params.data.name.length > 4) {
                      value = value.substring(0, 4) + "...";
                    }

                    return value;
                  }
                }
              },
              data: pieSeries,
              hoverAnimation: false,
              selectedMode: "single"
            }
          ]
        };

        // 绘制图表
        this.echartsInstancePie.setOption(option);
      }
    }
  };
</script>

<style lang="scss"></style>
