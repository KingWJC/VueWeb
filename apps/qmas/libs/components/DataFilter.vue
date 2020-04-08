<template>
  <div v-if="dateRange"
    class="data-filter">
    <span class="data-filter__title">时<i>占位</i>间</span>

    <div class="data-filter__calendar-wrapper">
      <p class="data-filter__calendar-wrapper-holder"
        title="单击选择日期范围"
        @click.stop="showCalendar = !showCalendar">
        {{ dateRange.startDate }} 至 {{ dateRange.endDate }}
      </p>

      <range-calendar
        :display="showCalendar"
        :selectedStartDate="dateRange.startDate"
        :selectedEndDate="dateRange.endDate"
        :availableEnd="availableEndDate"
        :availableStart="availableStartDate"
        @cancelRangeSelect="showCalendar = !showCalendar"
        @dateRangeChanged="dateRangeChanged">
      </range-calendar>
    </div>

    <statistics-accuracy
      :accuracyItems="accuracyItems"
      :hasText="false"
      :activeAccuracyCode="selectedAccuracy"
      @accuracyChange="accuracyChange">
    </statistics-accuracy>
  </div>
</template>

<script>
  import EventBus from "__shared-libs/js/vue/eventbus";
  import getDateRange from "__libs/js/modules/get-date-range";

  import StatisticsAccuracy from "__libs/components/StatisticsAccuracy";
  import RangeCalendar from "__shared-libs/components/datepicker/calendar/RangeCalendar";

  export default {
    name: "data-filter",

    components: {
      StatisticsAccuracy,
      RangeCalendar
    },

    data() {
      const availableDateRange = getDateRange("fiveYears");

      return {
        // 是否显示日期控件
        showCalendar: false,
        availableStartDate: availableDateRange.startDate,
        availableEndDate: availableDateRange.endDate,

        selectedAccuracy: null,

        dateRange: null,
        dataType: ""
      };
    },

    computed: {
      accuracyItems() {
        // 质控2.0版本-->短 精度范围
        if (this.dataType === "short") {
          return [
            {
              code: "1",
              name: "最近一周"
            },
            {
              code: "2",
              name: "最近一月"
            },
            {
              code: "3",
              name: "最近一年"
            }
          ];
        } else if (this.dataType === "long") {
          // else-if: 质控3.0版本-->长精度 范围
          return [
            {
              code: "quarter",
              name: "最近季度"
            },
            {
              code: "harfyear",
              name: "最近半年"
            },
            {
              code: "3",
              name: "最近一年"
            }
          ];
        }
      }
    },

    mounted() {
      // type {String} short or long 精度期的默认选项
      EventBus.$on("changeDateRange", (dateRange, type = "short") => {
        this.dateRange = Object.assign({}, dateRange);
        this.dataType = type;

        this.selectedAccuracy = this.getAccuracyByRange([
          this.dateRange.startDate,
          this.dateRange.endDate
        ]);
      });
    },

    methods: {
      // 日期范围切换
      dateRangeChanged(rgList) {
        this.showCalendar = false;

        // 更新选择精度状态
        this.selectedAccuracy = this.getAccuracyByRange(rgList);
        this.submitParams(rgList);
      },

      getAccuracyByRange(rgList) {
        let weekRange = this.getNewDateRange("1");
        let monthRange = this.getNewDateRange("2");
        let yearRange = this.getNewDateRange("3");
        let quarterRange = this.getNewDateRange("quarter");
        let harfYearRange = this.getNewDateRange("harfyear");
        let curRangeStr = rgList.toString();
        let accuracy = null;

        // 同步日期选择器选择器 和日期精度选择器
        if (curRangeStr === weekRange.toString()) {
          accuracy = "1";
        } else if (curRangeStr === monthRange.toString()) {
          accuracy = "2";
        } else if (curRangeStr === yearRange.toString()) {
          accuracy = "3";
        } else if (curRangeStr === quarterRange.toString()) {
          accuracy = "quarter";
        } else if (curRangeStr === harfYearRange.toString()) {
          accuracy = "harfyear";
        }

        return accuracy;
      },

      // 修改类别
      changeType() {
        this.submitParams();
      },

      // 上报参数
      submitParams(rgList) {
        let params = {
          startDate: this.dateRange.startDate,
          endDate: this.dateRange.endDate
        };

        // 有日期范围，使用
        if (rgList) {
          params.startDate = rgList[0];
          params.endDate = rgList[1];
        }

        // 修改精度日期同步变化
        this.dateRange = Object.assign({}, params);
        // 发送数据
        EventBus.$emit("receiveDateRange", params);
      },

      // 通过日期精度获得日期范围
      getNewDateRange(code) {
        let range;

        // a week
        if (code === "1") {
          range = getDateRange("oneWeek");
        } else if (code === "2") {
          // else: a month
          range = getDateRange("oneMonth");
        } else if (code === "3") {
          // else: a year
          range = getDateRange("oneYear");
        } else if (code === "quarter") {
          // else: a quarter
          range = getDateRange("oneQuarter");
        } else if (code === "harfyear") {
          // else: harf year
          range = getDateRange("harfYear");
        }

        return [range.startDate, range.endDate];
      },

      // 切换日期精度
      accuracyChange(code) {
        this.selectedAccuracy = code;

        // IE 11 has a bug which can't trigger reactive update here, so we
        // have to manually trigger the update process
        this.$nextTick(() => {
          this.showCalendar = false;
        });

        this.submitParams(this.getNewDateRange(code));
      }
    }
  };
</script>

<style lang="scss">
  @import "~__libs/scss/lib-common-utils";

  .data-filter {
    @include border-radius(6px);

    padding: sz(4) 0;
    height: sz(28);
    border: 1px solid map-get($colors, dialog-cancel-border);
    background: map-get($colors, pure-white);

    &__title {
      float: left;
      margin-left: sz(10);
      height: sz(28);
      line-height: sz(28);

      > i {
        display: none;
      }
    }

    &__calendar-wrapper {
      float: left;
      margin-left: sz(20);
      position: relative;

      &-holder {
        @include border-radius(5px);
        @include user-select(none);

        width: sz(190);
        height: sz(28);
        margin: 0;

        line-height: sz(28);
        text-align: center;
        background: map-get($colors, theme-blue);
        color: map-get($colors, pure-white);
        cursor: pointer;
      }

      .range-calendar {
        position: absolute;
        // 必须比页面上的 select-dropdown-v2(50) 层级要高
        z-index: 51;
        top: sz(32);
        left: 0;
      }
    }

    .statistics-accuracy {
      margin-left: sz(20);
      float: left;
    }
  }
</style>
