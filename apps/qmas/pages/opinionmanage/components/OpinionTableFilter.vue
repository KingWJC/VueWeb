<template>
  <div class="opinion-table-filter">
    <table class="opinion-table-filter__table">
      <thead class="opinion-table-filter__table-header">
        <tr>
          <th>用户类型</th>
          <th>用户名</th>
          <th>联络员姓名</th>
          <th>意见描述</th>
          <th>联系方式</th>
          <th>提交时间</th>
          <th>状态</th>
          <th>反馈人</th>
          <th>反馈时间</th>
          <th>操作</th>
        </tr>
      </thead>
    </table>
  </div>
</template>

<script>
  import CustomizeCheckbox from "__shared-libs/components/CustomizeCheckbox";
  import RangeCalendar from "__shared-libs/components/datepicker/calendar/RangeCalendar";
  import OptionsDropdown from "__shared-libs/components/OptionsDropdown";

  export default {
    name: "opinion-table-filter",

    components: {
      CustomizeCheckbox,
      RangeCalendar,
      OptionsDropdown
    },

    props: {
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
      return {
        // 类型
        showType: false,
        // 类型可选项
        typeList: [],

        // 状态
        showState: false,
        // 事件可选项
        stateList: []
      };
    },

    computed: {
      // 类型下拉框显示文本
      allTypeTitle() {
        return this.getDropdownTitle("typeselect");
      },

      // 事件下拉框显示文本
      allStateTitle() {
        return this.getDropdownTitle("stateselect");
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
        let originList, defaultTitle, nameField;

        if (type === "typeselect") {
          originList = this.filterParams.actionType;
          defaultTitle = "认证类型";
          nameField = "AC_TYPE_NAME";
        } else if (type === "stateselect") {
          originList = this.filterParams.actionState;
          defaultTitle = "状态";
          nameField = "STATE_VALUE";
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

      // 选择状态
      stateCheckboxAll(codes) {
        this.showState = false;
        this.$emit("eventChanged", codes);
      },

      // 切换当前激活的选择条件
      changeActiveCondition(conditionName) {
        if (this.disabled) {
          return;
        }

        if (conditionName === "typeselect") {
          this.showType = true;
        } else if (conditionName === "stateselect") {
          this.showState = true;
        }
      },

      // 上游参数变更之后更新本地缓存
      updateCache() {
        this.typeList = this.filterParams.actionType.slice(0);
        this.stateList = this.filterParams.actionState.slice(0);
      }
    }
  };
</script>

<style lang="scss">
  @import "~__libs/scss/lib-common-utils";

  .opinion-table-filter {
    &__condition {
      height: sz(28);
      border-top: 1px solid map-get($app-colors, dropdown-options-border);
      font-size: map-get($font-sizes, base);

      &-type,
      &-state,
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
            @include table-sizes(80, 110, 90, 80, 80, 80, 45, 90, 80, 80, 100);

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
