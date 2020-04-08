<template>
  <div class="date-dimention clearfix">
    <!--维度下拉框-->
    <div class="date-dimention__statistics">
      <select-dropdown-v2
        v-model="selectedStatisticsObj"
        :options="statisticsOptions"
        :dropDownMaxHeight="124"
        label="STATISTICS_NAME"
        trackBy="STATISTICS_CODE"
        @optionChanged="changeRangeDDL">
      </select-dropdown-v2>
    </div>

    <!--年下拉框-->
    <div class="date-dimention__year">
      <select-dropdown-v2
        v-model="selectedYearObj"
        :options="yearOptions"
        :dropDownMaxHeight="124"
        label="YEAR_NAME"
        trackBy="YEAR_CODE"
        @optionChanged="resetChildRange">
      </select-dropdown-v2>
    </div>

    <!--范围下拉框-->
    <div :class="{'hide': displayRangeDDL}"
      class="date-dimention__range">
      <select-dropdown-v2
        v-model="selectedRangeObj"
        :options="rangeOptions"
        :dropDownMaxHeight="124"
        label="RANGE_NAME"
        trackBy="RANGE_CODE"
        optionsLogicClassName="date-dimention-select"
        @optionChanged="getDate">
      </select-dropdown-v2>
    </div>
  </div>
</template>

<script>
  import reportGetDateRange from "__libs/js/modules/report-get-date-range";
  import Moment from "moment";

  export default {
    name: "date-dimention",

    props: {
      // 维度所有选项
      statisticsOptions: {
        type: Array,
        default() {
          return [
            {
              STATISTICS_CODE: "year",
              STATISTICS_NAME: "年报表"
            },
            {
              STATISTICS_CODE: "halfyear",
              STATISTICS_NAME: "半年报表"
            },
            {
              STATISTICS_CODE: "season",
              STATISTICS_NAME: "季度报表"
            },
            {
              STATISTICS_CODE: "month",
              STATISTICS_NAME: "月报表"
            }
          ];
        }
      },

      // 所有可用年(默认10年)
      totalYears: {
        type: Number,
        default: 10
      }
    },

    data() {
      let currentYear = Moment().get("year");

      return {
        rangeOptions: [],
        // 已选择的维度年度/季度/月对象
        selectedStatisticsObj: Object.assign({}, this.statisticsOptions[0]),
        // 已选择的年对象
        selectedYearObj: {
          YEAR_CODE: currentYear,
          YEAR_NAME: currentYear
        },
        // 已选择的范围对象
        selectedRangeObj: {},

        // 是否显示最后一级
        displayRangeDDL: true,

        // 用当前维度和选项计算出来的日期范围
        dateRange: null,
        // 精度1为月 0为周
        accuracy: 1
      };
    },

    computed: {
      yearOptions() {
        let yearArr = [];
        let currentYear = Moment().get("year");

        for (let i = 0; i < this.totalYears; i++) {
          yearArr.push({
            YEAR_CODE: currentYear - i,
            YEAR_NAME: currentYear - i
          });
        }

        return yearArr;
      }
    },

    mounted() {
      this.changeRangeDDL();
    },

    methods: {
      // 选择年之后重置下一级range
      resetChildRange() {
        // 如果不是年,就要重置下级
        if (this.selectedStatisticsObj.STATISTICS_CODE !== "year") {
          this.setRangeByStatisticOrYear();
          this.selectedRangeObj = Object.assign({}, this.rangeOptions[0]);

          this.getDate();
        } else {
          this.getDate();
        }
      },

      // 初始化及修改范围下拉框
      changeRangeDDL() {
        // 当维度为年或者半年时粒度为月1,否则为周0
        if (
          this.selectedStatisticsObj.STATISTICS_CODE === "year" ||
          this.selectedStatisticsObj.STATISTICS_CODE === "halfyear"
        ) {
          this.accuracy = 1;
        } else {
          this.accuracy = 0;
        }

        this.selectedYearObj = Object.assign({}, this.yearOptions[0]);
        this.displayRangeDDL = false;
        this.setRangeByStatisticOrYear();

        this.getDate();
      },

      setRangeByStatisticOrYear() {
        let rangeOptions = [];
        // 维度类型
        let statisticType = this.selectedStatisticsObj.STATISTICS_CODE;
        let currentYear = Moment().get("year");
        let currentMonth = Moment().get("month");

        // 年报
        if (statisticType === "year") {
          this.displayRangeDDL = true;
        } else if (statisticType === "halfyear") {
          // eles: 半年报
          let obj = {
            0: "上",
            1: "下"
          };
          let length = 2;

          if (
            currentMonth < 6 &&
            currentYear === this.selectedYearObj.YEAR_CODE
          ) {
            length = 1;
          }

          for (let i = 0; i < length; i++) {
            rangeOptions.push({
              RANGE_CODE: i,
              RANGE_NAME: obj[i] + "半年"
            });
          }
        } else if (statisticType === "season") {
          // else: 季度报
          let obj = {
            0: "一",
            1: "二",
            2: "三",
            3: "四"
          };
          let length = 4;

          if (currentYear === this.selectedYearObj.YEAR_CODE) {
            length = parseInt(currentMonth / 3) + 1;
          }

          for (let i = 0; i < length; i++) {
            rangeOptions.push({
              RANGE_CODE: i,
              RANGE_NAME: obj[i] + "季度"
            });
          }
        } else if (statisticType === "month") {
          // else: 月报
          let obj = {
            0: "一",
            1: "二",
            2: "三",
            3: "四",
            4: "五",
            5: "六",
            6: "七",
            7: "八",
            8: "九",
            9: "十",
            10: "十一",
            11: "十二"
          };
          let length = 12;

          if (currentYear === this.selectedYearObj.YEAR_CODE) {
            length = currentMonth + 1;
          }

          for (let i = 0; i < length; i++) {
            rangeOptions.push({
              RANGE_CODE: i,
              RANGE_NAME: obj[i] + "月"
            });
          }
        }

        this.rangeOptions = rangeOptions;
        this.selectedRangeObj = this.rangeOptions[0];
      },

      getDateRange() {
        return reportGetDateRange(
          this.selectedStatisticsObj.STATISTICS_CODE,
          this.selectedYearObj.YEAR_CODE,
          this.selectedRangeObj ? this.selectedRangeObj.RANGE_CODE : ""
        );
      },

      // 更改范围后的时间范围
      getDate() {
        this.researchProModify();
        this.dateRange = this.getDateRange();
        this.$emit(
          "changeParams",
          Object.assign(
            {accuracy: this.accuracy},
            this.dateRange
          )
        );
      },

      // 科研项目下 数据返回形式处理
      researchProModify() {
        let timePattern = 0;
        let year = this.selectedYearObj.YEAR_CODE;
        let time = 0;

        if (this.selectedStatisticsObj.STATISTICS_CODE === "halfyear") {
          time = this.selectedRangeObj.RANGE_CODE + 1;
          timePattern = 1;
        } else if (this.selectedStatisticsObj.STATISTICS_CODE === "season") {
          time = this.selectedRangeObj.RANGE_CODE + 1;
          timePattern = 2;
        } else if (this.selectedStatisticsObj.STATISTICS_CODE === "month") {
          time = this.selectedRangeObj.RANGE_CODE + 1;
          timePattern = 3;
        }

        let obj = {
          timePattern,
          year,
          time
        };

        this.$emit("reasearchChangeParams", obj);
      },

      // 修改类别
      changeType() {
        this.submitParams();
      }
    }
  };
</script>

<style lang="scss">
  @import "~__shared-libs/scss/lib-common-utils";

  .date-dimention {
    @include border-radius(6px);

    padding: sz(3) 0;
    height: sz(40);

    &__statistics,
    &__year,
    &__range {
      height: sz(28);
      float: left;
      margin-top: sz(4);
      margin-right: sz(15);
      .select-dropdown-v2 {
        @include blue-select-dropdown(sz(100));

        &__triangle {
          top: sz(13);
        }
      }
    }

    @at-root {
      .date-dimention-select {
        .select-dropdown-v2-options__items-item {
          padding: 0 sz(9);
        }
      }
    }
  }
</style>
