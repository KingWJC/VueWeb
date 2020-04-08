<template>
  <div class="log-table-filter">
    <table class="log-table-filter__table">
      <thead class="log-table-filter__table-header">
        <tr>
          <th>操作时间</th>
          <th>IP地址</th>
          <th>操作用户</th>
          <th>姓名</th>
          <th>操作模块</th>
          <th>操作内容</th>
        </tr>
      </thead>
    </table>
  </div>
</template>

<script>
  import CustomizeCheckbox from "__shared-libs/components/CustomizeCheckbox";
  import RangeCalendar from "__shared-libs/components/datepicker/calendar/RangeCalendar";
  import OptionsDropdown from "__shared-libs/components/OptionsDropdown";
  import Moment from "moment";

  export default {
    name: "log-table-filter",

    components: {
      CustomizeCheckbox,
      RangeCalendar,
      OptionsDropdown
    },

    props: {
      // 当前可用参数
      // {
      //   deptsList,
      //   doctorsList,
      //   sdsList,
      //   suspRate: [0, 100],
      //   dateRange: ['2017-03-11', '2017-12-15']
      //   selectedDateRange: ['2017-03-11', '2017-12-15']
      // }
      filterParams: {
        type: Object,
        default() {
          return {};
        }
      },

      disabled: {
        type: Boolean,
        default: false
      }
    },

    data() {
      // 可查看过去一年日志（截止到今天）
      let oneYearAgo = Moment()
        .add(-1, "year")
        .format("YYYY-MM-DD");
      let nowDate = Moment().format("YYYY-MM-DD");

      return {
        // 日期控件是否打开
        showCalendar: false,

        // 当前已选择日期范围
        dateRangeStart: "--",
        dateRangeEnd: "--",

        // 真正可用日志可能没有这么多，最多三个月，可以比三个月少
        availableDateRangeStart: oneYearAgo,
        availableDateRangeEnd: nowDate,

        // 类型
        showType: false,
        // 类型可选项
        typeList: [],

        // 事件
        showEvent: false,
        // 事件可选项
        eventList: [],

        // 操作人
        showOperator: false,
        // 操作人可选项
        operatorList: []
      };
    },

    computed: {
      // 出院时间动态标题（如果可用范围和已选范围一样，直接返回出院时间，否则显示当前范围
      outDateTitle() {
        let title;

        if (
          this.dateRangeStart === this.filterParams.dateRange[0] &&
          this.dateRangeEnd === this.filterParams.dateRange[1] ||
          this.disabled
        ) {
          title = "操作时间";
        } else {
          title = `${this.dateRangeStart} - ${this.dateRangeEnd}`;
        }

        return title;
      },

      // 类型下拉框显示文本
      allTypeTitle() {
        return this.getDropdownTitle("typeselect");
      },

      // 事件下拉框显示文本
      allEventTitle() {
        return this.getDropdownTitle("eventselect");
      },

      // 操作人下拉框显示文本
      allOperatorTitle() {
        return this.getDropdownTitle("operator");
      }
    },

    watch: {
      filterParams: "updateCache"
    },

    mounted() {
      this.updateCache();
    },

    methods: {
      // 获取下拉框标题（需要用逗号分隔，还是显示默认标题）
      getDropdownTitle(type) {
        let originList,
            defaultTitle,
            nameField;

        if (type === "typeselect") {
          originList = this.filterParams.actionType;
          defaultTitle = "操作类型";
          nameField = "ACTION_TYPE_NAME";
        } else if (type === "eventselect") {
          originList = this.filterParams.actionEvent;
          defaultTitle = "操作事件";
          nameField = "ACTION_EVENT_NAME";
        } else if (type === "operator") {
          originList = this.filterParams.actionUser;
          defaultTitle = "操作人";
          nameField = "USER_NAME";
        }
        // 筛选出所有已选择的
        let checkedItems = originList.filter((item) => {
          return item.isChecked;
        });

        // 若筛选条件禁止，直接返回标题
        if (this.disabled) {
          return defaultTitle;
        }

        // 可选项和已选项长度相等
        if (originList.length === checkedItems.length) {
          return defaultTitle;
        }

        let selectedNames = originList.reduce((tmpList, item) => {
          if (item.isChecked) {
            tmpList.push(item[nameField]);
          }

          return tmpList;
        }, []);

        return selectedNames.join("，");
      },

      // 选择类型
      typeCheckboxAll(codes) {
        this.showType = false;
        this.$emit("typeChanged", codes);
      },

      // 选择事件
      eventCheckboxAll(codes) {
        this.showEvent = false;
        this.$emit("eventChanged", codes);
      },

      // 选择操作人
      operatorCheckboxAll(codes) {
        this.showOperator = false;
        this.$emit("operatorChanged", codes);
      },

      // 操作时间
      changeDateRange(range) {
        this.showCalendar = false;
        this.$emit("dateRangeChanged", range);
      },

      // 切换当前激活的选择条件
      changeActiveCondition(conditionName) {
        if (this.disabled) {
          return;
        }

        if (conditionName === "date") {
          this.showCalendar = true;
        } else if (conditionName === "typeselect") {
          this.showType = true;
        } else if (conditionName === "eventselect") {
          this.showEvent = true;
        } else if (conditionName === "operator") {
          this.showOperator = true;
        }
      },

      // 上游参数变更之后更新本地缓存
      updateCache() {
        this.typeList = this.filterParams.actionType.slice(0);
        this.eventList = this.filterParams.actionEvent.slice(0);
        this.operatorList = this.filterParams.actionUser.slice(0);

        // 当前已选日期范围
        this.dateRangeStart = this.filterParams.selectedDateRange[0];
        this.dateRangeEnd = this.filterParams.selectedDateRange[1];
      }
    }
  };
</script>

<style lang="scss">
  @import "~__libs/scss/lib-common-utils";

  .log-table-filter {
    &__condition {
      height: sz(28);
      border-top: 1px solid map-get($app-colors, dropdown-options-border);
      font-size: map-get($font-sizes, base);

      &-type,
      &-event,
      &-date,
      &-operator {
        float: left;
        width: sz(120);
        height: sz(17);
        margin-top: sz(4);
        position: relative;
        background: map-get($colors, pure-white);
        cursor: pointer;
      }

      &-date {
        width: sz(150);
        position: relative;

        .range-calendar {
          position: absolute;
          left: 0;
          top: sz(23);
          z-index: 1;
        }

        @at-root #{get-bem-root()} & {
          &-title {
            width: sz(135);
          }
        }
      }

      &-select {
        background: map-get($colors, pure-white);
        height: sz(28);
        margin-top: sz(-8);

        &::after {
          @include transform(rotate(45deg));

          content: "";
          display: inline-block;
          width: sz(5);
          height: sz(5);
          border-right: 1px solid map-get($colors, text-light);
          border-bottom: 1px solid map-get($colors, text-light);
          position: absolute;
          top: sz(2);
          right: sz(9);
        }

        &--active {
          &::after {
            @include transform(rotate(-135deg));

            top: sz(6);
            right: sz(9);
          }
        }

        &--disabled {
          color: map-get($colors, border-gray);
          background-color: map-get($colors, bg-home);
          cursor: default;

          &::after {
            @include transform(rotate(45deg));

            border-right: 1px solid rgba(map-get($colors, text-light), 0.2);
            border-bottom: 1px solid rgba(map-get($colors, text-light), 0.2);
          }
        }

        > p {
          display: inline-block;
          margin: 0;
          margin-top: sz(4);
          padding-left: sz(5);
        }

        > span {
          @include word-hidden(sz(65));

          display: inline-block;
          padding: sz(5) sz(19) 0 0;
          font-size: sz(13);
        }
      }

      &-date {
        border: none;
      }

      &-option {
        width: sz(180);
        height: sz(300);
        display: none;
      }

      &--active {
        display: block;
      }
    }

    &__table {
      width: 100%;
      border-collapse: collapse;

      &-header {
        border-bottom: 1px solid map-get($colors, dialog-cancel-border);
        font-weight: bold;

        tr {
          height: sz(38);
          color: map-get($colors, table-thead-color);

          th {
            @include table-sizes(178, 178, 148, 140, 140, 240);

            text-align: left;
            padding: 0;

            &:nth-child(1) {
              padding-left: sz(10);
            }
          }
        }

        // 重置dropdown，不允许加粗
        .options-dropdown {
          font-weight: normal;

          &__names {
            &-contxt-alls {
              padding: 0;
              width: 100%;
            }

            &-alls {
              padding-left: 0;
            }
          }

          .customize-checkbox {
            width: sz(158);
            padding-left: sz(20);
            padding-right: sz(20);
          }
        }

        .range-calendar {
          font-weight: normal;

          .calendar {
            tr {
              height: auto;
            }

            //年月左边箭头位置
            &__paginator-btn--prevmon {
              left: -7px;
            }
          }
        }
      }
    }
  }
</style>
