<template>
  <div>
    <div class="expert-audit-detail"
      style="height:200px">
      <h2 style="margin-left:5px">
        申请人：
        <span>{{ AcOrgName }}</span>
      </h2>
      <div class="top-left">
        <p>
          认证类型：
          <span>{{ AcType }}</span>
        </p>
        <p>
          申请级别：
          <span>{{ AcLevel }}</span>
        </p>
        <p>
          申请日期：
          <span>{{ ApplyTime }}</span>
        </p>
      </div>
      <div class="top-right">
        <p>
          系统建议级别：
          <span style="font-size:25px;font-weight:500">
            {{ SystemSuggestLevel }}</span>
        </p>

        <template v-if="disabled">
          <a
            href="javascript:;"
            style="background:#b4bccc;border:#b4bccc"
            class="btn dialog__footer-btn dialog__footer-btn-ok"
          >审核</a>
        </template>
        <template v-else>
          <a
            href="javascript:;"
            class="btn dialog__footer-btn dialog__footer-btn-ok"
            @click="auditBtnClicked"
          >审核</a>
        </template>

      </div>
    </div>

    <div class="expert-audit-detail">
      <h3 style="margin-left:5px">审核详情</h3>

      <template v-if="OtherAudit">
        <template v-if="OtherAudit.length > 0">
          <table class="expert-audit-detail__table">
            <thead class="expert-audit-detail__table-header">
              <tr>
                <th></th>
                <th>审核类型</th>
                <th>评分</th>
                <th>审核结果</th>
                <th>审核人</th>
                <th>审核日期</th>
                <th>备注</th>
                <th>操作</th>
              </tr>
            </thead>
          </table>

          <div class="expert-audit-detail__tablectn">
            <table class="expert-audit-detail__table">
              <tbody class="expert-audit-detail__table-body">
                <tr
                  v-for="(item, index) in OtherAudit"
                  :key="index"
                  class="expert-audit-detail__table-body-review"
                >
                  <td></td>
                  <td>
                    <p :title="item.STATE_TYPE">{{ item.STATE_TYPE }}</p>
                  </td>
                  <td>
                    <p :title="item.GRADE">{{ item.GRADE }}</p>
                  </td>
                  <td>
                    <p :title="item.STATE_VALUE">{{ item.STATE_VALUE }}</p>
                  </td>
                  <td>
                    <p :title="item.AUDIT_USER_NAME">
                      {{ item.AUDIT_USER_NAME }}</p>
                  </td>
                  <td>
                    <p :title="item.AUDIT_TIME">{{ item.AUDIT_TIME }}</p>
                  </td>
                  <td :title="item.REMARK">
                    <div>{{ item.REMARK }}</div>
                  </td>
                  <td>
                    <a href="javascript:;"
                      @click="viewAuditInfo(item)">查看</a>
                  </td>
                </tr>

                <tr v-if="MyAudit!=null"
                  class="expert-audit-detail__table-body-review">
                  <td></td>
                  <td>
                    <p :title="MyAudit.STATE_TYPE">{{ MyAudit.STATE_TYPE }}</p>
                  </td>
                  <td>
                    <p :title="MyAudit.GRADE">{{ MyAudit.GRADE }}</p>
                  </td>
                  <td>
                    <p :title="MyAudit.STATE_VALUE">
                      {{ MyAudit.STATE_VALUE }}</p>
                  </td>
                  <td>
                    <p v-if="MyAudit.STATE_VALUE!=''"
                      :title="MyAudit.AUDIT_USER_NAME">
                      {{ MyAudit.AUDIT_USER_NAME }}</p>
                  </td>
                  <td>
                    <p v-if="MyAudit.STATE_VALUE!=''"
                      :title="MyAudit.AUDIT_TIME">
                      {{ MyAudit.AUDIT_TIME }}</p>
                  </td>
                  <td :title="MyAudit.REMARK">
                    <div>{{ MyAudit.REMARK }}</div>
                  </td>
                  <td>
                    <p></p>
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
      :display="displayExpertDialog"
      :dialogHeaderCloseBtn="true"
      :userData="userData"
      @closeDialog="displayExpertDialog=false"
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
    name: "expert-audit-detail",

    components: {
      QaNoContent,
      ExpertDialog
    },

    data() {
      return {
        AcOrgName: "",
        AcType: "",
        AcLevel: "",
        ApplyTime: "",
        SystemSuggestLevel: "",
        // 其他阶段审核结果
        OtherAudit: null,
        // 我的审核
        MyAudit: null,

        // 是否展示专家审核对话框
        displayExpertDialog: false,
        // 专家数据
        userData: null,
        acApplyId: "",
        Edittype: 1
      };
    },

    computed: {
      disabled() {
        return this.MyAudit != null && this.MyAudit.STATE_VALUE != null &&
        this.MyAudit.STATE_VALUE.length > 0 ? true : false;
      }
    },

    watch: {},

    mounted() {
      this.initData(this.$route.query.editdata);
    },

    methods: {
      // 查看
      viewAuditInfo(obj) {
        let stateType = obj.STATE_TYPE;
        let param = {
          AC_APPLY_ID: obj.AC_APPLY_ID,
          STATE_ID: obj.STATE_ID
        };

        if (stateType == "材料审核") {
          this.$router.push({
            path: "/materialexamineDetail",
            query: { editdata: param,
                     Edittype: this.Edittype}
          });
        } else if (stateType == "数据审核") {
          this.$router.push({
            path: "/DataExamineDetail",
            query: { editdata: param,
                     Edittype: this.Edittype }
          });
        } else if (stateType == "现场审核") {
          this.$router.push({
            path: "/sceneexamineDetail",
            query: { editdata: param,
                     Edittype: this.Edittype }
          });
        }
      },

      // 专家审核
      auditBtnClicked() {
        this.userData = {
          expertAuditId: this.MyAudit == null ? "" : this.MyAudit.STATE_ID,
          stateId: this.OtherAudit == null ? "" : this.OtherAudit[0].STATE_ID,
          acApplyId: this.acApplyId,
          acResult: "",
          remark: "",
          systemSuggestLevel: this.SystemSuggestLevel,
          title: "专家审核"
        };
        this.displayExpertDialog = true;
      },

      // 刷新数据
      dialogOkClicked(obj) {
        this.initData(obj);
      },

      initData(obj) {
        this.$showLoading();
        this.isShowLoading = true;
        this.acApplyId = obj.AC_APPLY_ID;

        Axios.get(resolveApiRoute("expert-audit-detail"), {
          params: {
            auditExpertId: obj.STATE_ID,
            applyId: obj.AC_APPLY_ID
          }
        }).then(
          (res) => {
            this.$hideLoading();
            this.isShowLoading = false;

            if (res.data.Code === 0) {
              this.OtherAudit = res.data.Data.OtherAudit;
              this.MyAudit = res.data.Data.MyAudit;
              let info = res.data.Data.AcInfo;
              this.AcOrgName = info.AcOrgName;
              this.AcType = info.AcType;
              this.AcLevel = info.AcLevel;
              this.ApplyTime = info.ApplyTime;
              this.SystemSuggestLevel = info.SystemSuggestLevel;
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

  .top-left {
    width: 400px;
    height: 120px;
    float: left;
    margin: 0 0 0 10px;
  }
  .top-right {
    width: 300px;
    height: 120px;
    float: right;
  }

  .expert-audit-detail {
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
          @include table-sizes(40, 120, 80, 100, 100, 120, 200, 120);

          padding: 0;

          &:first-child {
            padding: 0 sz(8);
            height: sz(40);
          }

          &:nth-child(7) {
            div {
              @include word-hidden(sz(195), max-width);
            }
          }
        }
      }
    }

    &__tablectn {
      height: calc(100% - 40px);
      overflow: auto;
    }

    .qa-no-content {
      border: 1px solid map-get($colors, dialog-cancel-border);
      background: map-get($colors, pure-white);
      margin-top: sz(10);
    }
  }
</style>
