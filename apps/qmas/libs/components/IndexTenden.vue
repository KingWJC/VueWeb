<template>
  <div class="index-tenden">
    <div :style="{width: '1095px', height: '270px'}"
      class="index-tenden__lineStck"></div>
  </div>
</template>

<script>
  import ECharts from "echarts";
  // echarts 画预警值箭头用的图片
  import arrowImgPath from "__libs/imgs/red_arrow.png";
  import tooltipPointColor from "__shared-libs/js/modules/tooltip-point-color";
  import Moment from "moment";
  import getTrendsYaxisSizes from "__libs/js/modules/get-trends-yaxis-sizes";
  import colors from "__shared-libs/js/modules/color-list";
  import appColors from "__libs/js/modules/color-list";

  export default {
    name: "index-tenden",

    props: {
      // 区分是预警指标 还是评价指标(默认值是预警)
      indexType: {
        type: String,
        default: null
      },

      // 何种类型 0 数值 1 百分比 2 千分比,3 中位数
      sdEkpiConver: {
        type: Number,
        default: null
      },

      // 单位类型
      sdEkpiUnit: {
        type: String,
        default: null
      },

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

      // 类型
      sdEkpiType: {
        type: Number,
        default: null
      },

      // 分子描述
      numeratorName: {
        type: String,
        default: null
      },

      // 分母描述
      denominatorName: {
        type: String,
        default: null
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
      // 格式化预警值给 echarts
      formatBaselineData() {
        // 使用预警值
        if (this.isDisplay === 1) {
          // 预警值未设置
          if (this.baseline === "-") {
            return null;
          }

          return [{
            yAxis: this.baseline,
            symbol: "none"
          }];
        }

        // 不使用预警值
        return null;
      },

      // 根据预警值获取警戒线上下两部分
      getSplitedParts(baseline) {
        // 没有预警值？
        if (baseline) {
          // 预警指标都是上红下绿
          // gt的值： 如果基线设置为0的话，折线会变成黑色 所以写成-1.
          if (this.indexType === "war") {
            return [{
              gt: -1,
              lte: parseFloat(baseline[0].yAxis),
              // 没有超出部分是绿色
              color: appColors["theme-green"]
            }, {
              gt: parseFloat(baseline[0].yAxis),
              // 超出部分是红色
              color: appColors["echart-orange"]
            }];
          } else {
            let topColor = null,
                bottomColor = null;

            // 正向指标
            if (this.isPositive === 1) {
              topColor = appColors["echart-orange"];
              bottomColor = appColors["theme-green"];
            } else if (this.isPositive === 0) {
              // else: 负向指标
              topColor = appColors["theme-green"];
              bottomColor = appColors["echart-orange"];
            } else if (this.isPositive === 3) {
              // else: 非正非负指标但是有基线
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
              // 正向指标上绿下红
              color: bottomColor
            }];
          }
        }

        return null;
      },

      // 获取seriesData数据
      getSeriesData() {
        return this.diagramData.seriesData.map((item, index) => {
          let lineType = "solid";
          let markLine = null;

          if (index < 1) {
            markLine = {
              silent: true,
              symbol: `image://${arrowImgPath}`,
              symbolSize: [16, 54],

              label: {
                normal: {
                  formatter: this.sdEkpiType === 1
                    ? "       预警值"
                    : "       基线",
                  position: "end"
                }
              },
              lineStyle: {
                normal: {
                  color: appColors["sd-base-line"],
                  type: "dashed"
                }
              },
              // 预警值数据（可能为 null)
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
                width: 1,
                type: lineType
              }
            },
            data: item,
            markLine: markLine
          };
        });
      },

      // legendMap设置
      getLegendMap(data) {
        return data.reduce((legendMap, item, index) => {
          legendMap[item] = index;

          return legendMap;
        }, {});
      },

      getColorsMap(legendList, colorsList) {
        return legendList.reduce((colorsMap, item, index) => {
          colorsMap[item] = colorsList[index];

          return colorsMap;
        }, {});
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
          .init(this.$el.querySelector(".index-tenden__lineStck"));

        let {
          legendList,
          xAxisValue,
          sectionTime,
          seriesData,
          originalX
        } = this.diagramData;

        let firstLegendColor = (this.isPositive === 3 || this.isPositive === 2)
          ? colors["echart-blue"]
          : appColors["theme-green"];

        let colorsList = [
          firstLegendColor,
          appColors["dark-blue"],
          appColors["echart-purple"],
          appColors["echart-red"],
          appColors["echart-light-blue"],
          appColors["echart-yellow"]
        ];

        let legendMap = this.getLegendMap(legendList);
        let colorsMap = this.getColorsMap(legendList, colorsList);

        // 当前显示的页数
        let pageCurrent = 1,
            // 总页数
            pageTotal = Math.ceil(seriesData.length / 10);

        // 预警值数据（可能为 null)
        let baselineData = this.formatBaselineData();
        // 警告区（上下部分，如果没有预警值，直接为 null，一个颜色）
        let visualMapPieces = this.getSplitedParts(baselineData);

        // 警告区颜色（如果没有预警值，直接为 null）
        let visualMapWarningColor =
          visualMapPieces ? {color: appColors["theme-green"]} : null;

        let lineColor = appColors["theme-green"];

        let unit = "";
        let withValue = {
          max: null,
          intervalValue: null
        };
        let yMaxValue = null;

        // 如果指标的 isPositive 为 2 或者 3 时,线显示蓝色,不管有没有基线
        if (this.isPositive === 2 || this.isPositive === 3) {
          lineColor = colors["echart-blue"];
        }

        if (seriesData.length > 0) {
          unit = this.sdEkpiUnit ? this.sdEkpiUnit : "";
          yMaxValue = seriesData.yMaxValue;

          withValue = getTrendsYaxisSizes(
            this.isDisplay,
            yMaxValue,
            this.baseline,
            this.sdEkpiConver
          );
        }
        let {
          max,
          intervalValue
        } = withValue;

        let option = {
          color: colorsList,
          tooltip: {
            // 是否节点触发
            trigger: "axis",
            formatter: (params) => {
              let ed = sectionTime.filter((item) => {
                let minRanges = item.MinRange,
                    dataIndexs = originalX[params[0].dataIndex],
                    flags = null;

                // 月
                if (this.activeAccuracyCode === "1") {
                  flags = Moment(minRanges).format("YYYY-MM") ===
                    Moment(dataIndexs).format("YYYY-MM");
                } else {
                  // 周/季度（直接使用 YYYY-MM-DD）
                  flags = minRanges === dataIndexs;
                }

                return flags;
              });

              let valueFilter = `<p style="line-height: 18px; font-size: 12px; margin: 0;">`;

              if (this.sdEkpiType === 1) {
                valueFilter += `${ed[0].MinRange}~${ed[0].MaxRange}<br/>`;

                params.forEach((everyLine, index) => {
                  let legendIndex = legendMap[everyLine.seriesName],
                      dataIndex = everyLine.dataIndex,
                      color = colorsMap[everyLine.seriesName],
                      seriesNa = everyLine.seriesName.slice(0, -3),
                      datas = everyLine.data.datas;

                  if (index === 0) {
                    color = everyLine.color;
                  }

                  valueFilter += `${seriesNa}<br/>
                      ${tooltipPointColor(color)}可疑率：${everyLine.data.value}${unit}
                      (${datas[0][legendIndex][dataIndex]}/${datas[1][legendIndex][dataIndex]})<br>`;
                });
              } else if (this.sdEkpiType === 2) {
                // 统计指标,如果指标是百分比形式的,要带上(分子/分母)
                valueFilter += `${ed[0].MinRange}~${ed[0].MaxRange}<br/>`;

                params.forEach((everyLine, index) => {
                  let legendIndex = legendMap[everyLine.seriesName],
                      dataIndex = everyLine.dataIndex,
                      color = colorsMap[everyLine.seriesName],
                      seriesNa = everyLine.seriesName.slice(0, -1),
                      datas = everyLine.data.datas,
                      showNumDenValue = this.sdEkpiConver === 1
                        ? `(${datas[0][legendIndex][dataIndex]}/${datas[1][legendIndex][dataIndex]})`
                        : "";

                  if (index === 0) {
                    color = everyLine.color;
                  }

                  let valueBase = `${tooltipPointColor(color)}值：
                      ${everyLine.data.value}${unit}${showNumDenValue}`;

                  valueFilter += `${seriesNa}<br/>${valueBase}<br/>`;

                  if (this.numeratorName && this.denominatorName) {
                    valueFilter += `${tooltipPointColor(appColors["red-pie"])}
                        ${this.numeratorName}：
                        ${datas[0][legendIndex][dataIndex]}<br/>
                        ${tooltipPointColor(appColors["dark-blue"])}${this.denominatorName}：
                        ${datas[1][legendIndex][dataIndex]}<br>`;
                  } else if (!this.numeratorName && this.denominatorName) {
                    valueFilter += `${tooltipPointColor(appColors["dark-blue"])}
                        ${this.denominatorName}：
                        ${datas[1][legendIndex][dataIndex]}<br>`;
                  } else if (this.numeratorName && !this.denominatorName) {
                    valueFilter += `${tooltipPointColor(appColors["red-pie"])}
                        ${this.numeratorName}：
                        ${datas[0][legendIndex][dataIndex]}<br>`;
                  }
                });
              }

              valueFilter += `</p>`;

              return valueFilter;
            },
            axisPointer: {
              type: "none",
              showContent: false
            }
          },

          grid: {
            left: "13%",
            right: "7%",
            top: "17%",
            bottom: "0%",
            containLabel: true
          },

          legend: {
            type: "scroll",
            height: 245,
            pageIconColor: appColors["dark-gray-triangle"],
            pageIconInactiveColor: appColors["light-gray-triangle"],
            pageIconSize: [6, 9],
            pageButtonItemGap: 10,
            pageFormatter: `${pageCurrent}/${pageTotal}`,
            data: legendList,
            orient: "vertical",
            left: "left",
            // 图例高度 在火狐中不设置的话平均值的“平”字会显示不全
            itemHeight: 12,
            itemWidth: 20,
            top: -3,
            textStyle: {
              color: appColors["echart-legend-text"]
            },
            tooltip: {
              show: true
            },
            formatter: (params) => {
              if (this.indexType === "war") {
                if (params.length > 7) {
                  params = `${params.substr(0, 4)}...${params.substr(-3)}`;
                }
              } else if (this.indexType === "eva") {
                if (params.length > 5) {
                  params = `${params.substr(0, 4)}...${params.substr(-1)}`;
                }
              }

              return params;
            }
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
            max,
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
            seriesIndex: 0,
            top: 10,
            right: 10,
            color: [lineColor],
            pieces: visualMapPieces,
            outOfRange: visualMapWarningColor
          },

          series: this.getSeriesData()
        };

        // 绘制图表
        this.echartsInstance.setOption(option);
      }
    }
  };
</script>

<style lang="scss"></style>
