<template>
  <div class="data-examine-table-filter">
    <table class="data-examine-table-filter__table">
      <thead class="data-examine-table-filter__table-header">
        <tr>
          <th>认证医院</th>
          <th>认证科室</th>
          <th>认证类型</th>
          <th>数据评分</th>
          <th>数据评审级别</th>
          <th>状态</th>
          <th>审核人</th>
          <th>审核日期</th>
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
    name: "data-examine-table-filter",

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
      return {};
    },

    computed: {},

    watch: {},

    mounted() {},

    methods: {}
  };
</script>

<style lang="scss">
  @import "~__libs/scss/lib-common-utils";

  .data-examine-table-filter {
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
            @include table-sizes(160, 140, 70, 100, 100, 100, 80, 90, 80);

            text-align: left;
            padding: 0;

            &:nth-child(1) {
              padding-left: sz(10);
            }

            &:nth-child(4) {
              text-align: center;
            }

            &:nth-child(3) {
              text-align: center;
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
