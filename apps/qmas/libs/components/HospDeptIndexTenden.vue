<template>
  <div class="hosp-dept-index-tenden">
    <div :style="{width: '1095px', height: '270px'}"
      class="hosp-dept-index-tenden__lineStck"></div>
  </div>
</template>

<script>
  import ECharts from "echarts";
  // echarts 画基线箭头用的图片
  import arrowImgPath from "__libs/imgs/red_arrow.png";
  import tooltipPointColor from "__shared-libs/js/modules/tooltip-point-color";
  import Moment from "moment";
  import getTrendsYaxisSizes from "__libs/js/modules/get-trends-yaxis-sizes";
  import formatXAxisDateTime from "__libs/js/modules/format-x-axis-date-time";
  import colors from "__shared-libs/js/modules/color-list";
  import appColors from "__libs/js/modules/color-list";

  export default {
    name: "hosp-dept-index-tenden",

    props: {
      // 比值模式(int)
      sdEkpiConver: {
        type: Number,
        default: null
      },

      // 图表数据
      diagramData: {
        type: Object,
        default() {
          return null;
        }
      },

      // 是否使用基线（选项：0(不使用)；1（使用））
      isDisplay: {
        type: Number,
        default: 1
      },

      // 基线值
      baseline: {
        type: String,
        default: ""
      },

      // 是否可疑(代表指标是正向还是负向指标):1表示正向zh
      isPositive: {
        type: Number,
        default: 1
      },

      // 选择当前的统计精度
      activeAccuracyCode: {
        type: String,
        default: ""
      },

      // 指标类型
      sdEkpiType: {
        type: Number,
        default: null
      },

      // 指标单位
      sdEkpiUnit: {
        type: String,
        default: null
      },

      // 分母描述
      denominatorName: {
        type: String,
        default: ""
      },

      // 分子描述
      numeratorName: {
        type: String,
        default: ""
      },

      // 基线类型  int (是否动态，0非动态 1动态)
      isDynamic: {
        type: Number,
        default: 0
      }
    },

    data() {
      return {
        echartsInstance: null
      };
    },

    // TODO: 目前还是不能监测到 props 变化，只能 watch
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
      // 过滤echart能使用的数据（父组件传过来的是api原始数据）
      filterEchartsOfData(diagramData) {
        let xAxisValue = [];
        let seriesData = [];
        let sectionTime = diagramData.X;
        let yAxisValue = diagramData.Y;
        let originalX = [];

        // map过滤出Y轴点值的扁平数组,使用math.max求得最大描点值
        let yMaxValue = Math.max.apply(null, yAxisValue.map((item) => {
          return item.Rate;
        }));

        // 悬浮tips显示的内容可以放到datas里,在formatter中可取到
        for (let i = 0; i < diagramData.X.length; i++) {
          seriesData.push({
            name: diagramData.X[i].Item,
            value: diagramData.Y[i].Rate,
            datas: [
              diagramData.Y[i].Numerator,
              diagramData.Y[i].Denominator
            ],
            sdEkpiType: this.sdEkpiType,
            sdEkpiUnit: this.sdEkpiUnit,
            isDynamic: this.isDynamic,
            denominatorName: this.denominatorName,
            numeratorName: this.numeratorName,
            yMaxValue: yMaxValue
          });
          originalX.push(diagramData.X[i].Item);
        }

        xAxisValue = formatXAxisDateTime(sectionTime, this.activeAccuracyCode);

        return {
          xAxisValue,
          seriesData,
          sectionTime,
          yAxisValue,
          originalX
        };
      },

      // 格式化基线给 echarts
      formatBaselineData() {
        // 使用基线
        if (this.isDisplay === 1) {
          // 基线未设置
          if (this.baseline === "-") {
            return null;
          }

          return [{
            yAxis: this.baseline,
            symbol: "none"
          }];
        }

        // 不使用基线
        return null;
      },

      // 根据基线获取警戒线上下两部分
      getSplitedParts(baseline) {
        // 没有基线？
        if (baseline) {
          let topColor = null,
              bottomColor = null;

          // 正向指标
          if (this.isPositive === 1) {
            topColor = appColors["echart-orange"];
            bottomColor = appColors["theme-green"];
          } else if (this.isPositive === 0) {
            // else-if: 负向指标
            topColor = appColors["theme-green"];
            bottomColor = appColors["echart-orange"];
          } else if (this.isPositive === 3) {
            // else-if: 非正非负指标但是有基线
            topColor = colors["echart-blue"];
            bottomColor = colors["echart-blue"];
          }

          return [{
            gt: -1,
            lte: parseFloat(baseline[0].yAxis),
            // 负向指标上红下绿
            color: topColor
          }, {
            gt: parseFloat(baseline[0].yAxis),
            // lte: 100,
            // 正向指标上绿下红
            color: bottomColor
          }];
        }

        return null;
      },

      // 初始化图表
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
          .init(this.$el.querySelector(".hosp-dept-index-tenden__lineStck"));

        let that = this;
        let {
          xAxisValue,
          seriesData,
          sectionTime,
          originalX
        } = this.filterEchartsOfData(this.diagramData);

        // 基线数据（可能为 null)
        let baselineData = this.formatBaselineData();
        // 警告区（上下部分，如果没有基线，直接为 null，一个颜色）
        let visualMapPieces = this.getSplitedParts(baselineData);

        // 警告区颜色（如果没有基线，直接为 null）
        let visualMapWarningColor = visualMapPieces ? {
          color: this.isPositive === 1
            ? appColors["echart-orange"]
            : appColors["theme-green"]
        } : null;

        // 如果指标的 isPositive 为 0 或者 1 时,不显示基线的时候,线显示绿色
        let lineColor = appColors["theme-green"];

        // 单位
        let unit = "";
        let withinValue = {
          max: null,
          intervalValue: null
        };

        // 如果指标的 isPositive 为 2 或者 3 时,线显示蓝色,不管有没有基线
        if (this.isPositive === 2 || this.isPositive === 3) {
          lineColor = colors["echart-blue"];
        }

        if (seriesData.length !== 0) {
          unit = seriesData[0].sdEkpiUnit
            ? seriesData[0].sdEkpiUnit
            : "";

          withinValue = getTrendsYaxisSizes(
            this.isDisplay,
            seriesData[0].yMaxValue,
            this.baseline,
            this.sdEkpiConver
          );
        }
        let {
          max,
          intervalValue
        } = withinValue;

        let option = {
          tooltip: {
            // 是否节点触发
            trigger: "axis",
            // padding: 5,
            formatter: function(a) {
              let ed = sectionTime.filter((item) => {
                // 月
                if (that.activeAccuracyCode === "1") {
                  return Moment(item.MinRange).format("YYYY-MM") ===
                    Moment(originalX[a[0].dataIndex]).format("YYYY-MM");
                } else {
                  // else: 周/季度（直接使用 YYYY-MM-DD）
                  return item.MinRange === originalX[a[0].dataIndex];
                }
              });

              let valueFliter = "";
              // 判断单位      为null时转为空串
              let kpiUnit = a[0].data.sdEkpiUnit ? a[0].data.sdEkpiUnit : "";

              // 统计和非统计展示不同的tips
              // 1:非统计类     2:统计类
              if (a[0].data.sdEkpiType === 1) {
                valueFliter = `${ed[0].MinRange}~${ed[0].MaxRange}<br/>
                  ${tooltipPointColor(a[0].color)}值：${a[0].data.value}${kpiUnit}<br>
                  ${tooltipPointColor(colors["echart-blue"])}相关病例：${a[0].data.datas[0]}<br>
                  ${tooltipPointColor(appColors["dark-blue"])}总监测：${a[0].data.datas[1]}`;
              } else if (a[0].data.sdEkpiType === 2) {
                let valContent = `${ed[0].MinRange}~${ed[0].MaxRange}<br/>
                    ${tooltipPointColor(a[0].color)}值：${a[0].data.value}${kpiUnit}<br>`;

                // 两个描述都不为空时
                if (a[0].data.numeratorName && a[0].data.denominatorName) {
                  valueFliter = `${valContent}
                    ${tooltipPointColor(colors["echart-blue"])}${a[0].data.numeratorName}
                    ：${a[0].data.datas[0]}<br>
                    ${tooltipPointColor(appColors["dark-blue"])}${a[0].data.denominatorName}
                    ：${a[0].data.datas[1]}`;
                }

                // 分子描述为空时
                if (!a[0].data.numeratorName && a[0].data.denominatorName) {
                  valueFliter = `${valContent}
                    ${tooltipPointColor(appColors["dark-blue"])}${a[0].data.denominatorName}
                    ：${a[0].data.datas[1]}`;
                }

                // 分母描述为空时
                if (a[0].data.numeratorName && !a[0].data.denominatorName) {
                  valueFliter = `${valContent}
                    ${tooltipPointColor(colors["echart-blue"])}${a[0].data.numeratorName}
                    ：${a[0].data.datas[0]}<br>`;
                }

                // 分子和分母描述都为空时
                if (!a[0].data.numeratorName && !a[0].data.denominatorName) {
                  valueFliter = `${valContent}`;
                }
              }

              return valueFliter;
            },
            axisPointer: {
              type: "none",
              showContent: false
            }
          },

          grid: {
            left: "5%",
            right: "6%",
            top: "17%",
            bottom: "0%",
            containLabel: true
          },

          xAxis: {
            type: "category",
            // 数据从0刻度开始
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
          },

          yAxis: {
            splitLine: {
              show: true,
              lineStyle: {
                color: appColors["echart-splitline-color"]
              }
            },
            interval: intervalValue,
            min: 0,
            max: max,
            axisLabel: {
              show: true,
              interval: "auto",
              formatter: function(value) {
                return `${value}${unit}`;
              },
              color: appColors["echart-axis-color"]
            },
            axisLine: {
              lineStyle: {
                color: colors["border-gray"]
              }
            }
          },

          toolbox: {
            left: "center",
            feature: {
              dataZoom: {
                show: false,
                yAxisIndex: "none"
              }
            }
          },

          visualMap: {
            show: false,
            top: 10,
            right: 10,
            color: [lineColor],
            pieces: visualMapPieces,
            // TODO 此属性是超出了定义范围之内的值,才会显示的颜色
            outOfRange: visualMapWarningColor
          },

          series: {
            name: "可疑率",
            type: "line",
            lineStyle: {
              normal: {
                width: 1,
                type: "solid"
              }
            },

            data: seriesData,
            markLine: {
              silent: true,
              symbol: `image://${arrowImgPath}`,
              symbolSize: [16, 54],

              label: {
                normal: {
                  formatter: "       基线",
                  position: "end"
                }
              },
              lineStyle: {
                normal: {
                  color: appColors["sd-base-line"],
                  type: "dashed"

                }
              },
              data: baselineData
            }
          }
        };

        // 绘制图表
        this.echartsInstance.setOption(option);
      }
    }
  };
</script>

<style lang="scss"></style>
