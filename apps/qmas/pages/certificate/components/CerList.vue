<template>
  <div class="cer-list">
    <div class="cer-list__current clearfix">
      <h3>当前认证情况</h3>
      <div class="cer-list__current-child">
        <p>
          认证类型：
          <span>{{ acInfo.AC_TYPE_NAME }}</span>
        </p>
        <p>
          状态：
          <span>{{ state }}</span>
        </p>
      </div>
      <div class="cer-list__current-children">
        <p>
          有效期：
          <template v-if="acInfo.START_TIME">
            <span>{{ acInfo.START_TIME+"---"+acInfo.END_TIME }}</span>
          </template>
          <template v-else>
            <span>无</span>
          </template>
        </p>
      </div>
      <div class="cer-list__current-actions">
        <button class="cer-list__current-actions--btn"
          @click="viewProgress(acInfo)">查看详情</button>
        <button
          :class="{
            'cer-list__current-actions--enabled': isHeigher
          }"
          :disabled="isHeigher"
          class="cer-list__current-actions--btn"
          @click="applyHigher()"
        >申请提级</button>
        <button
          :class="{
            'cer-list__current-actions--enabled': isReply
          }"
          :disabled="isReply"
          class="cer-list__current-actions--btn"
          @click="reApply()"
        >申请复审</button>
      </div>
    </div>

    <div class="cer-list__license clearfix">
      <h3>认证授牌</h3>
    </div>

    <div class="cer-list__record clearfix">
      <h3>认证记录</h3>
      <table class="cer-list__record-table">
        <thead class="cer-list__record-table-header">
          <tr>
            <th>认证类型</th>
            <th>申请级别</th>
            <th>申请日期</th>
            <th>认证阶段</th>
            <th>状态</th>
            <th>认证结果</th>
            <th>生效日期</th>
            <th>失效日期</th>
            <th>操作</th>
          </tr>
        </thead>
      </table>

      <div class="cer-list__record-bodyctn">
        <table class="cer-list__record-table-body">
          <tbody>
            <tr v-for="(item, index) in bodyData"
              :key="index">
              <td :title="item.AC_TYPE_NAME">{{ item.AC_TYPE_NAME }}</td>
              <td :title="item.APPLY_LEVEL">{{ item.APPLY_LEVEL }}</td>
              <td :title="item.APPLY_TIME">{{ item.APPLY_TIME }}</td>
              <td>{{ setAcsectionState(item) }}</td>
              <td>{{ setApplyState(item) }}</td>
              <td :title="item.AC_RESULT">{{ item.AC_RESULT }}</td>
              <td :title="item.START_TIME">{{ item.START_TIME }}</td>
              <td :title="item.END_TIME">{{ item.END_TIME }}</td>
              <td>
                <a href="javascript:;"
                  @click="viewProgress(item)">查看</a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
  import Axios from "axios";
  import resolveApiRoute from "__libs/js/modules/resolve-api-route";

  export default {
    name: "cer-list",
    data() {
      return {
        acInfo: {},
        isShowLoading: false,
        bodyData: [],
        state: "",
        isHeigher: true,
        isReply: true
      };
    },
    mounted() {
      this.fetchData();
    },
    methods: {
      fetchData() {
        this.$showLoading();
        this.isShowLoading = true;

        Axios.get(resolveApiRoute("cer-current")).then(
          (res) => {
            this.$hideLoading();
            this.isShowLoading = false;

            if (res.data.Code === 0) {
              this.acInfo = res.data.Data[0];
              this.bodyData = res.data.Data;
              this.state = this.setApplyState(this.acInfo);

              if (this.state === "有效" || this.state === "无效") {
                this.isHeigher = false;
              }

              if (this.state === "无效") {
                this.isReply = false;
              }
            } else {
              this.$showNotice("服务器异常", "failed");
            }
          },
          () => {
            this.$hideLoading();
            this.isShowLoading = false;
            this.$showNotice("网络异常", "failed");
          }
        );
      },
      viewProgress(obj) {
        this.$router.push({
          path: "/CertificationDetail",
          query: { applyID: obj.AC_APPLY_ID }
        });
      },
      reApply() {
        this.$router.push({
          path: "/CerApply",
          query: {
            applyLevel: this.acInfo.AC_RESULT,
            reapply: true,
            isHeigher: false
          }
        });
      },
      applyHigher() {
        this.$router.push({
          path: "/CerApply",
          query: {
            applyLevel: this.acInfo.AC_RESULT,
            reapply: false,
            isHeigher: true
          }
        });
      },
      setApplyState(record) {
        var result = "";

        if (!(record.END_TIME === null)) {
          result = "通过";

          var myDate = new Date();
          var begin = new Date(record.START_TIME);
          var end = new Date(record.END_TIME);

          if (
            myDate.getTime() > begin.getTime() &&
            myDate.getTime() < end.getTime()
          ) {
            result = "有效";
          } else if (myDate.getTime() >= end.getTime()) {
            result = "无效";
          }
        } else if (record.STATE_VALUE_NAME === "不通过") {
          result = "不通过";
        } else {
          result = "审核中";
        }

        return result;
      },

      setAcsectionState(record) {
        if (
          record.AC_SECTION === "专家组审核" &&
          record.AC_RESULT !== "" &&
          record.AC_RESULT !== "不通过"
        ) {
          return "-";
        } else {
          return record.AC_SECTION;
        }
      }
    }
  };
</script>

<style lang="scss">
  @import "~__libs/scss/lib-common-utils";
  .cer-list {
    @include border-radius(5px);

    padding: sz(10);
    border: 1px solid map-get($colors, dialog-cancel-border);
    background: map-get($colors, pure-white);

    &__current {
      &-child {
        p {
          display: inline;
          margin-left: sz(50);
        }
      }

      &-children {
        display: inline;
        p {
          display: inline;
          margin-left: sz(50);
        }
      }

      &-actions {
        // float: right;
        display: inline;
        margin-left: sz(500);
        // width: sz(60);

        span {
          color: map-get($colors, pure-white);
        }

        &--btn {
          @include border-radius(5px);

          width: sz(80);
          height: sz(35);
          border: none;
          background: map-get($colors, theme-blue);
          color: map-get($colors, pure-white);
          cursor: pointer;
        }

        &--enabled {
          width: sz(80);
          height: sz(35);
          cursor: pointer;
          background: map-get($colors, pure-white);
          color: map-get($colors, theme-blue);

          > i {
            border-color: map-get($colors, text-color);
          }
        }
      }
    }

    &__record-table {
      width: 100%;
      border-collapse: collapse;

      &-header {
        border-bottom: 1px solid map-get($colors, dialog-cancel-border);
        font-weight: bold;

        tr {
          height: sz(38);
          color: map-get($colors, table-thead-color);

          th {
            @include table-sizes(90, 80, 80, 80, 80, 90, 80, 80, 100);

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

    &__record-table-body {
      @include unify-table-ui();

      > tbody tr {
        cursor: default;

        td {
          @include table-sizes(90, 80, 80, 80, 80, 90, 80, 80, 100);

          &:nth-child(1) {
            padding-left: sz(10);
          }

          &:nth-child(5) {
            div {
              @include word-hidden(sz(385), max-width);
            }
          }
        }
      }

      &__result {
        margin-left: sz(14);

        &--success {
          color: map-get($app-colors, gray-green);
        }

        &--failed {
          color: map-get($colors, theme-red);
        }
      }
    }
  }
</style>
