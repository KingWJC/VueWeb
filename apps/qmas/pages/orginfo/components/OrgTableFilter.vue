<template>
  <div class="org-table-filter">
    <table class="org-table-filter__table">
      <thead class="org-table-filter__table-header">
        <tr>
          <th>医院名称</th>
          <th>科室名称</th>
          <th>注册日期</th>
          <th>审核日期</th>
          <th>审核状态</th>
          <th>缴费日期</th>
          <th>缴费状态</th>
          <th>操作</th>
        </tr>
      </thead>
    </table>
  </div>
</template>

<script>
  export default {
    name: "org-table-filter"
  };
</script>

<style lang="scss">
  @import "~__libs/scss/lib-common-utils";

  .org-table-filter {
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
      @include unify-table-ui();
      width: 100%;
      border-collapse: collapse;

      &-header {
        border-bottom: 1px solid map-get($colors, diauser-cancel-border);
        font-weight: bold;

        tr {
          height: sz(38);
          color: map-get($colors, table-thead-color);

          th {
            @include table-sizes(360, 330, 130, 130, 130, 130, 130, 200);

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
