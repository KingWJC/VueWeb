<template>
  <div class="single-column-diagram">
    <div class="single-column-diagram__stack-wrapper">
      <div :style="{width: '1119px', height: '340px'}"
        class="single-column-diagram__stack"></div>
    </div>
  </div>
</template>

<script>
  import ECharts from "echarts";
  import tooltipPointColor from "__shared-libs/js/modules/tooltip-point-color";
  import getYaxisSize from "__shared-libs/js/modules/get-yaxis-sizes";
  import { dataZoomSvgPath } from "__shared-libs/js/modules/build-icon-path";
  import colors from "__shared-libs/js/modules/color-list";
  import appColors from "__libs/js/modules/color-list";

  export default {
    name: "single-column-diagram",

    props: {
      diagramData: {
        type: Object,
        default() {
          return {};
        }
      },

      // 指标的比值模式
      sdEkpiConver: {
        type: Number,
        default: null
      },

      // 图例类别（dept/group/doctor)
      legendType: {
        type: String,
        default: ""
      },

      // 指标类型
      sdEkpiType: {
        type: Number,
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

      // 指标单位
      sdEkpiUnit: {
        type: String,
        default: null
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
      // 过滤echart能使用的数据（父组件传过来的是api原始数据）
      filterEchartsOfData(diagramData) {
        let xAxis = diagramData.xAxis;
        let yAxis = diagramData.yAxis;
        let seriesData = [];

        // map过滤出Y轴点值的扁平数组,使用math.max求得最大描点值
        let yMaxValue = Math.max.apply(null, yAxis.map((item) => {
          return item;
        }));

        // 悬浮tips显示的内容可以放到datas里,在formatter中可取到
        for (let i = 0; i < xAxis.length; i++) {
          seriesData.push({
            value: diagramData.yAxis[i],
            datas: [
              diagramData.seriesData[i].Rate,
              diagramData.seriesData[i].Numerator,
              diagramData.seriesData[i].Denominator
            ],
            sdEkpiType: this.sdEkpiType,
            sdEkpiUnit: this.sdEkpiUnit,
            denominatorName: this.denominatorName,
            numeratorName: this.numeratorName,
            yMaxValue: yMaxValue
          });
        }

        return {
          xAxis,
          yAxis,
          seriesData
        };
      },

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
          .init(this.$el.querySelector(".single-column-diagram__stack"));

        let {
          xAxis,
          yAxis,
          seriesData
        } = this.filterEchartsOfData(this.diagramData);
        let length = yAxis.length;
        let maxLeg = 0;

        if (length !== 0) {
          if (length > 0 && length <= 9) {
            maxLeg = yAxis.length - 1;
          } else {
            maxLeg = 9;
          }
        }

        let unit = "";
        let withinValue = {
          max: null,
          intervalValue: null
        };

        if (seriesData.length !== 0 ) {
          unit = seriesData[0].sdEkpiUnit
            ? seriesData[0].sdEkpiUnit
            : "";

          // 比值模式:0数值， 1百分比  2千分比
          if (this.sdEkpiConver === 1) {
            withinValue = getYaxisSize(100);
          } else {
            withinValue = getYaxisSize(seriesData[0].yMaxValue);
          }
        }

        let {
          max,
          intervalValue
        } = withinValue;
        let legend = this.legendType === "dept"
          ? "各科室"
          : (this.legendType === "group"
            ? "各诊疗组"
            : "各医生");
        let type = this.sdEkpiType === 1 ? "可疑率" : "指标值";

        let _this1 = this;
        // 绘制图表
        let option = {
          color: [colors["echart-blue"], appColors["theme-green"]],
          tooltip: {
            trigger: "axis",
            formatter: function(params) {
              if (params.length > 0) {
                let valueFilter = "";
                // 判断单位为 null 时转为空串
                let kpiUnit = params[0].data.sdEkpiUnit
                  ? params[0].data.sdEkpiUnit
                  : "";

                // 统计和非统计展示不同的tips
                // 1:非统计类(率或比例)     2:统计类
                if (params[0].data.sdEkpiType === 1) {
                  valueFilter = `${params[0].name}<br/>
                    ${params[0].marker}可疑率: ${params[0].data.value}${kpiUnit}<br/>
                    ${tooltipPointColor(colors["echart-blue"])}可疑病例：${params[0].data.datas[1]}<br/>
                    ${tooltipPointColor(appColors["dark-blue"])}总监测：${params[0].data.datas[2]}`;
                } else if (params[0].data.sdEkpiType === 2) {
                  // 统计指标,如果指标是百分比形式的,要带上(分子/分母)
                  let showNumDenValue = _this1.sdEkpiConver === 1
                    ? `(${params[0].data.datas[1]}/${params[0].data.datas[2]})`
                    : "";

                  let valContent = `${params[0].name}<br/>
                    ${params[0].marker}指标值: ${params[0].data.value}${kpiUnit}${showNumDenValue}<br/>`;

                  // 两个描述都不为空时
                  if (
                    params[0].data.numeratorName &&
                    params[0].data.denominatorName
                  ) {
                    valueFilter = `${valContent}
                        ${tooltipPointColor(colors["echart-blue"])}${params[0].data.numeratorName}
                        ：${params[0].data.datas[1]}<br>
                        ${tooltipPointColor(appColors["dark-blue"])}${params[0].data.denominatorName}
                        ：${params[0].data.datas[2]}`;
                  }

                  // 分子描述为空时
                  if (
                    !params[0].data.numeratorName &&
                    params[0].data.denominatorName
                  ) {
                    valueFilter = `${valContent}
                        ${tooltipPointColor(appColors["dark-blue"])}${params[0].data.denominatorName}
                        ：${params[0].data.datas[2]}`;
                  }

                  // 分母描述为空时
                  if (
                    params[0].data.numeratorName &&
                    !params[0].data.denominatorName
                  ) {
                    valueFilter = `${valContent}
                        ${tooltipPointColor(colors["echart-blue"])}${params[0].data.numeratorName}
                        ：${params[0].data.datas[1]}<br>`;
                  }

                  // 分子和分母描述都为空时
                  if (
                    !params[0].data.numeratorName &&
                    !params[0].data.denominatorName
                  ) {
                    valueFilter = `${valContent}`;
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
            data: [legend + type],
            orient: "vertical",
            itemHeight: 12,
            itemWidth: 20,
            left: 0,
            top: -3,
            textStyle: {
              color: appColors["echart-legend-text"]
            }
          },

          grid: {
            left: "8%",
            top: "18%",
            right: "7%",
            bottom: "10%",
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
              formatter: function(val) {
                // 横轴信息文字超出 7 个字的时候 截取为 6 个 + ...
                // x 轴有值的时候才截取
                return val && val.length > 6
                  ? val.substring(0, 5) + "..."
                  : val;
              },
              color: appColors["echart-axis-color"]
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
            interval: intervalValue,
            min: 0,
            max,
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
                return value + unit;
              },
              color: appColors["echart-axis-color"]
            },
            axisLine: {
              lineStyle: {
                color: colors["border-gray"]
              }
            }
          }],

          dataZoom: [{
            show: true,
            height: 20,
            width: 930,
            left: "11%",
            xAxisIndex: [
              0
            ],
            bottom: "1%",
            startValue: 0,
            endValue: maxLeg,
            // 选中区域颜色
            fillerColor: appColors["in-gray"],
            handleIcon: dataZoomSvgPath,
            handleSize: "110%",
            handleStyle: {
              color: appColors["in-gray"],
              borderColor: appColors["light-gray-icon-border"]
            },
            // handle条字体超出截取
            labelFormatter: function(value) {
              // 横轴信息文字 超出7个字的时候 截取为6个+...
              if (xAxis.length > 0) {
                return xAxis[value].length > 6
                  ? xAxis[value].substring(0, 5) + "..."
                  : xAxis[value];
              }
            },
            showDataShadow: false,
            borderColor: appColors["light-gray-border"]
          }],

          series: [{
            name: legend + type,
            type: "bar",
            barMaxWidth: 40,
            barMinHeight: 1,
            data: seriesData
          }]
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
