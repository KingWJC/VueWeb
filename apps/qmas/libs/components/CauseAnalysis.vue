<template>
  <div class="cause-analysis">
    <div class="cause-analysis__echarts">
      <div class="cause-analysis__echarts-pie-wrapper">
        <div :style="{width: '500px', height: '320px'}"
          class="cause-analysis__echarts-pie"></div>
      </div>

      <div class="cause-analysis__echarts-stack">
        <div :style="{width: '480px', height: '320px'}"
          class="cause-analysis__echarts-pillar"></div>
      </div>
    </div>
  </div>
</template>

<script>
  import ECharts from "echarts";
  import tooltipPointColor from "__shared-libs/js/modules/tooltip-point-color";
  import colors from "__shared-libs/js/modules/color-list";
  import appColors from "__libs/js/modules/color-list";

  export default {
    name: "cause-analysis",

    props: {
      caseAll: {
        type: Object,
        default() {
          return {};
        }
      }
    },

    data() {
      return {
        reasonTypeData: [],
        reasonTypeLegend: [],
        reasonTypeSeries: [],
        reasonYAxis: [],
        reasonSeries: [],
        clickColor: colors["echart-blue"],

        echartsInstancePie: null,
        echartsInstancePillar: null,
        clickArea: "",
        topTwelveData: []
      };
    },

    mounted() {
      this.getChartData();
    },

    // 销毁组件前销毁 echarts 实例
    beforeDestroy() {
      // 销毁实例，避免内存泄漏
      if (this.echartsInstancePie) {
        this.echartsInstancePie.dispose();
      }

      // 销毁实例，避免内存泄漏
      if (this.echartsInstancePillar) {
        this.echartsInstancePillar.dispose();
      }
    },

    methods: {
      getChartData() {
        this.reasonTypeData = this.caseAll.ReasonType;
        this.topTwelveData = this.getTopTwelve();
        this.getPieData();
        this.initPieEcharts();
        this.getStackDataByCode();
        this.initStackEcharts();
      },

      getPieData() {
        let TypeData = this.caseAll.ReasonType;
        let typeLenth = TypeData.length;

        // 清空之前的参数（不然却换日期会重复画图）
        this.reasonTypeLegend = [];
        this.reasonTypeSeries = [];

        for (let i = 0; i < typeLenth; i++) {
          this.reasonTypeLegend.push(TypeData[i].RSN_TYPE_NAME);
          this.reasonTypeSeries.push({
            seriesId: [TypeData[i].RSN_TYPE_CODE],
            value: TypeData[i].RSN_RATE,
            name: TypeData[i].RSN_TYPE_NAME
          });
        }
      },

      getTopTwelve(type) {
        let ReasonData = this.caseAll.Reason;
        let ReasonDataFu = [];

        if (type) {
          ReasonData = ReasonData.filter((data) => {
            return data.RSN_TYPE_CODE === type;
          });
        }
        // 从大到小排序
        ReasonData = ReasonData.sort((reasonA, reasonB) => {
          if (reasonA.RSN_COUNT < reasonB.RSN_COUNT) {
            return -1;
          } else if (reasonA.RSN_COUNT > reasonB.RSN_COUNT) {
            return 1;
          }

          return 0;
        });

        if (ReasonData.length > 12) {
          for (let i = 0, j = ReasonData.length - 1; i < 12; i++, j--) {
            ReasonDataFu.push(ReasonData[j]);
          }
        } else {
          for (let i = 0; i < ReasonData.length; i++) {
            ReasonDataFu.push(ReasonData[i]);
          }
        }
        // 从大到小排序
        ReasonDataFu = ReasonDataFu.sort((reasonA, reasonB) => {
          let retVal = 0;

          if (reasonA.RSN_COUNT < reasonB.RSN_COUNT) {
            retVal = -1;
          } else if (reasonA.RSN_COUNT > reasonB.RSN_COUNT) {
            retVal = 1;
          }

          return retVal;
        });

        return ReasonDataFu;
      },
      getStackDataByCode(typecode) {
        this.reasonYAxis = [];
        this.reasonSeries = [];
        // let data=[];

        // 点击饼图中具体的某一类型
        if (typecode !== "" && typecode !== null && typecode !== undefined) {
          if (typecode.length === 1) {
            for (let i = 0; i < this.topTwelveData.length; i++) {
              if (typecode[0] === this.topTwelveData[i].RSN_TYPE_CODE) {
                this.reasonYAxis.push(this.topTwelveData[i].RSN_NAME);
                this.reasonSeries.push(this.topTwelveData[i].RSN_COUNT);
              }
            }
          } else {
            let count = 0;

            for (let i = 0; i < typecode.length; i++) {
              count += Number(this.topTwelveData[i].RSN_COUNT);
            }
            this.reasonYAxis.push("其他");
            this.reasonSeries.push(count);
          }
        } else {
          // else: 初始进来显示的全部前12条数据
          for (let i = 0; i < this.topTwelveData.length; i++) {
            this.reasonYAxis.push(this.topTwelveData[i].RSN_NAME);
            this.reasonSeries.push(this.topTwelveData[i].RSN_COUNT);
          }
        }
      },
      initPieEcharts() {
        // 销毁实例，避免内存泄漏
        if (this.echartsInstancePie) {
          this.echartsInstancePie.dispose();
        }

        // 基于准备好的dom，初始化echarts实例
        this.echartsInstancePie = ECharts
          .init(this.$el.querySelector(".cause-analysis__echarts-pie"));

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
              let newstr = val.name.trim().split(/(.{15})/gi)
                .filter((str) => {
                  return str !== "";
                })
                .join("<br />");

              return `${tooltipPointColor(val.color)}${newstr}：${val.value}%`;
            }
          },

          legend: {
            orient: "vertical",
            itemHeight: 12,
            itemWidth: 20,
            left: "left",
            formatter: function(params) {
              if (params.length > 6) {
                params = params.substring(0, 6) + "...";
              }

              return params;
            },
            textStyle: {
              color: appColors["echart-legend-text"]
            },
            data: this.reasonTypeLegend
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
              radius: "40%",
              center: ["65%", "50%"],
              label: {
                normal: {
                  formatter: function(params) {
                    let value = params.data.name;

                    if (params.data.name.length > 6) {
                      value = value.substring(0, 6) + "...";
                    }

                    return value;
                  }
                }
              },
              data: this.reasonTypeSeries,
              hoverAnimation: false,
              selectedMode: "single"
            }
          ]
        };

        let that = this;
        // 绘制图表
        this.echartsInstancePie.setOption(option);
        this.echartsInstancePie.on("click", function(param) {
          if (that.clickArea !== param.data.seriesId[0]) {
            that.clickColor = param.color;
            that.clickArea = param.data.seriesId[0];
            that.topTwelveData = that.getTopTwelve(param.data.seriesId[0]);
            that.getStackDataByCode(param.data.seriesId);
            that.initStackEcharts();
          } else {
            that.topTwelveData = that.getTopTwelve();
            that.getStackDataByCode();
            that.clickColor = colors["echart-blue"];
            that.initStackEcharts();
            that.clickArea = "";
          }
        });
      },

      initStackEcharts() {
        // 销毁实例，避免内存泄漏
        if (this.echartsInstancePillar) {
          this.echartsInstancePillar.dispose();
        }

        this.echartsInstancePillar = ECharts.
          init(this.$el.querySelector(".cause-analysis__echarts-pillar"));

        let option = {
          title: {
            text: "",
            subtext: ""
          },

          color: [this.clickColor],

          tooltip: {trigger: "axis"},

          legend: {
            data: ["发生次数"],
            itemHeight: 12,
            itemWidth: 20,
            top: "20",
            textStyle: {
              color: appColors["echart-legend-text"]
            }
          },

          grid: {
            left: "3%",
            right: "4%",
            bottom: "3%",
            containLabel: true
          },

          toolbox: {
            show: true,
            feature: {
              mark: { show: false },
              dataView: {
                show: false,
                readOnly: false
              },
              magicType: {
                show: false,
                type: ["line", "bar"]
              },
              restore: { show: false },
              saveAsImage: { show: false }
            }
          },

          calculable: true,

          xAxis: [
            {
              type: "value",
              boundaryGap: [0, 0.01],
              minInterval: 1,
              axisLabel: {
                color: appColors["echart-axis-color"]
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
            }
          ],

          yAxis: [
            {
              type: "category",
              data: this.reasonYAxis,
              axisLabel: {
                formatter: function(val) {
                  if (val.length > 15) {
                    return val.substr(0, 15) + "...";
                  } else {
                    return val;
                  }
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

          series: [
            {
              name: "发生次数",
              type: "bar",
              barMaxWidth: 20,
              data: this.reasonSeries
            }
          ]
        };
        // 绘制图表
        this.echartsInstancePillar.setOption(option);
      }
    }
  };
</script>

<style lang="scss">
  @import "~__libs/scss/lib-common-utils";

  .cause-analysis {
    &__echarts {
      &-pie-wrapper {
        float: left;
      }

      &-stack {
        float: left;
        margin-left: sz(30);
      }
    }
  }
</style>
