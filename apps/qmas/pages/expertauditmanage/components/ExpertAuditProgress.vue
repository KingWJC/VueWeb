<template>
  <div>
    <div class="expert-audit-progress">
      <h2 style="margin-left:5px">
        申请人：
        <span>{{ AcOrgName }}</span>
      </h2>
      <p>
        认证类型：
        <span>{{ AcType }}</span>
      </p>
      <p>
        申请级别：
        <span>{{ AcLevel }}</span>
      </p>
      <p>
        专家组审核状态：
        <span>{{ State }}</span>
      </p>
    </div>

    <div class="expert-audit-progress">
      <h3 style="margin-left:5px">审核进度</h3>
      <template v-if="State=='审核通过'||State=='审核不通过'">
        <a
          href="javascript:;"
          style="background:#b4bccc;border:#b4bccc"
          class="btn dialog__footer-btn dialog__footer-btn-ok"
        >重新分配</a>
      </template>
      <template v-else>
        <a
          href="javascript:;"
          class="btn dialog__footer-btn dialog__footer-btn-ok"
          @click="redistributionBtnClicked"
        >重新分配</a>
      </template>

      <template v-if="trainData">
        <template v-if="trainData.length > 0">
          <div class="expert-audit-progress__tablectn">
            <table class="expert-audit-progress__table">
              <thead class="expert-audit-progress__table-header">
                <tr>
                  <th></th>
                  <th>专家姓名</th>
                  <th>状态</th>
                  <th>审核意见</th>
                  <th>审核日期</th>
                  <th>备注</th>
                </tr>
              </thead>
              <tbody class="expert-audit-progress__table-body">
                <tr
                  v-for="(item, index) in trainData"
                  :key="index"
                  class="expert-audit-progress__table-body-review"
                >
                  <td></td>
                  <td>
                    <p :title="item.EXPERT_NAME">{{ item.EXPERT_NAME }}</p>
                  </td>
                  <td>
                    <p :title="item.AUDIT_STATE">{{ item.AUDIT_STATE }}</p>
                  </td>
                  <td>
                    <p :title="item.AUDIT_RESULT">{{ item.AUDIT_RESULT }}</p>
                  </td>
                  <td>
                    <p :title="item.UPD_TIME">
                      {{ item.AUDIT_STATE=='已审核'?item.UPD_TIME:'' }}</p>
                  </td>
                  <td>
                    <p :title="item.REMARK">{{ item.REMARK }}</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </template>
      </template>
      <template v-else>
        <qa-no-content title="暂无数据"></qa-no-content>
      </template>
    </div>

    <expert-dialog
      :display="displayAccessDialog"
      :dialogHeaderCloseBtn="true"
      :userAccessData="userAccessData"
      @closeDialog="displayAccessDialog=false"
      @dialogOkClicked="dialogOkClicked"
    ></expert-dialog>
  </div>
</template>

<script>
  import Axios from "axios";
  import resolveApiRoute from "__libs/js/modules/resolve-api-route";
  import QaNoContent from "__libs/components/QaNoContent";
  import ExpertDialog from "./ExpertDialog";

  export default {
    name: "expert-audit-progress",

    components: {
      QaNoContent,
      ExpertDialog
    },

    data() {
      return {
        AcOrgName: "",
        AcType: "",
        AcLevel: "",
        State: "",
        trainData: null,

        // 是否展示分配专家对话框
        displayAccessDialog: false,
        // 专家数据
        userAccessData: null,
        StateID: ""
      };
    },

    watch: {},

    mounted() {
      this.initData(this.$route.query.editdata);
    },

    methods: {
      // 重新分配
      redistributionBtnClicked() {
        this.$showLoading();
        Axios.get(resolveApiRoute("assigment-expert"), {
          params: {
            stateId: this.StateID
          }
        }).then(
          (res) => {
            this.$hideLoading();

            if (res.data.Code === 0) {
              this.userAccessData = {
                depts: res.data.Data,
                title: "分配专家"
              };

              this.displayAccessDialog = true;
            } else {
              this.networkExceptional("服务器错误");
            }
          },
          () => {
            this.$hideLoading();
            this.networkExceptional("网络错误");
          }
        );
      },

      // 刷新数据
      dialogOkClicked(obj) {
        this.initData(obj);
      },

      initData(obj) {
        this.$showLoading();
        this.isShowLoading = true;

        Axios.get(resolveApiRoute("expert-audit-progress"), {
          params: { stateId: obj.STATE_ID }
        }).then(
          (res) => {
            this.$hideLoading();
            this.isShowLoading = false;

            if (res.data.Code === 0) {
              this.trainData = res.data.Data.expertAuditList;
              let info = res.data.Data.acInfo;
              this.AcOrgName = info.USER_REALNAME;
              this.AcType = info.AC_TYPE_NAME;
              this.AcLevel = info.APPLY_LEVEL;
              this.State = info.STATE_VALUE;
              this.StateID = info.STATE_ID;

              this.displayExpertDialog = true;
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
      }
    }
  };
</script>

<style lang="scss">
  @import "~__libs/scss/lib-common-utils";

  .expert-audit-progress {
    padding: sz(10);
    border: 1px solid map-get($colors, dialog-cancel-border);
    background: map-get($colors, pure-white);

    &__table {
      @include unify-table-ui();

      // 占位符
      &-body {
        &-hidden {
          visibility: hidden;
          display: inline-block;
        }

        &-review {
          .customize-checkbox {
            position: relative;
            top: sz(3);
          }
        }
      }

      b,
      a {
        display: inline-block;
      }

      tr {
        th,
        td {
          @include table-sizes(50, 130, 130, 130, 160, 250);

          padding: 0;

          &:first-child {
            padding: 0 sz(8);
            height: sz(40);
          }

          &:nth-child(2) {
            text-align: left;
          }
        }
      }
    }

    &__tablectn {
      height: calc(100% - 40px);
      overflow: auto;
      margin-top: 20px;
    }

    .qa-no-content {
      border: 1px solid map-get($colors, dialog-cancel-border);
      background: map-get($colors, pure-white);
      margin-top: sz(10);
    }
  }
</style>
