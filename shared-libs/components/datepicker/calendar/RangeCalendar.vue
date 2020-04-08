<template>
  <div
    :class="{'hide': !display}"
    class="range-calendar">
    <div class="range-calendar__pickers clearfix">
      <calendar
        :selectedDate="cachedSelectedStart"
        :availableStart="availableStart"
        :availableEnd="reactiveAvailableEndDate"
        :isRange="true"
        :dateFormat="dateFormat"
        rangeDir="right"
        @dateChanged="startDateChanged">
      </calendar>

      <calendar
        :selectedDate="cachedSelectedEnd"
        :availableStart="reactiveAvailableStartDate"
        :availableEnd="availableEnd"
        :isRange="true"
        :dateFormat="dateFormat"
        rangeDir="left"
        @dateChanged="endDateChanged">
      </calendar>
    </div>

    <div class="range-calendar__footer clearfix">
      <p class="range-calendar__footer-feedback">
        <slot name="mainTips">
          已选择：
          <span class="range-calendar__footer-feedback-range">
            <template
              v-if="
                cachedSelectedStart === cachedSelectedEnd &&
                  cachedSelectedStart === '--'
              ">
              无
            </template>
            <template v-else-if="cachedSelectedStart === cachedSelectedEnd">
              {{ cachedSelectedEnd }}(同一天)</template>
            <template v-else>
              {{ cachedSelectedStart }} - {{ cachedSelectedEnd }}
            </template>
          </span>
        </slot>
      </p>

      <div class="range-calendar__footer-btns clearfix">
        <a class="btn range-calendar__footer-ok"
          href="javascript:;"
          title="确定"
          @click="confirmSelected">确定</a>
        <a class="btn btn--white range-calendar__footer-cancel"
          href="javascript:;"
          title="取消"
          @click="cancelSelecting">取消</a>
      </div>
    </div>
  </div>
</template>

<script>
  import $ from "jquery";
  import isClickOutsideEl from "__shared-libs/js/modules/is-click-outside-el";
  import Calendar from "./Calendar";

  export default {
    name: "range-calendar",

    components: {
      Calendar
    },

    props: {
      // 是否显示
      display: {
        type: Boolean,
        default: false
      },

      dateFormat: {
        type: String,
        default: "YYYY-MM-DD"
      },

      // range start shoulde be equal to or larger than
      availableStart: {
        type: String,
        // no start date is specified, use `--` instead
        default: "--"
      },

      // range start shoulde be equal to or smaller than
      availableEnd: {
        type: String,
        // no start date is specified, use `--` instead
        default: "--"
      },

      // range start shoulde be equal to or larger than
      selectedStartDate: {
        type: String,
        // no start date is specified, use `--` instead
        default: "--"
      },

      // range start shoulde be equal to or larger than
      selectedEndDate: {
        type: String,
        // no start date is specified, use `--` instead
        default: "--"
      }
    },

    data() {
      return {
        cachedSelectedStart: this.selectedStartDate,
        cachedSelectedEnd: this.selectedEndDate
      };
    },

    computed: {
      reactiveAvailableStartDate() {
        return this.cachedSelectedStart;
      },

      reactiveAvailableEndDate() {
        return this.cachedSelectedEnd;
      }
    },

    watch: {
      display() {
        // 事件节流，只有对话框打开的时间才响应全局事件
        if (this.display) {
          // 异步触发，因为在当前瞬间视图还没更新完成，props状态也还没同步完成
          // 但是我们不能用
          setTimeout(() => {
            $(document).on("click", this.docClickDebouncer);
          }, 0);
        } else {
          $(document).off("click", this.docClickDebouncer);
        }
      },

      selectedStartDate(value) {
        this.startDateChanged(value);
      },

      selectedEndDate(value) {
        this.endDateChanged(value);
      }
    },

    methods: {
      startDateChanged(date) {
        this.cachedSelectedStart = date;
      },

      endDateChanged(date) {
        this.cachedSelectedEnd = date;
      },

      // 用户确认了选区
      confirmSelected() {
        this.$emit("dateRangeChanged", [
          this.cachedSelectedStart,
          this.cachedSelectedEnd
        ]);
      },

      // 用户取消了选择
      cancelSelecting() {
        this.cachedSelectedStart = this.selectedStartDate;
        this.cachedSelectedEnd = this.selectedEndDate;

        this.$emit("cancelRangeSelect");
      },

      // 如果点击非calendar区域，触发关闭事件
      docClickDebouncer(evt) {
        // 不是点击范围选择器本身, 取消
        if (!isClickOutsideEl(evt, this.$el)) {
          this.cancelSelecting();
        }
      }
    }
  };
</script>

<style lang="scss"></style>
