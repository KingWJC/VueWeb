<template>
  <div>
    <div class="certification-detail"
      style="height:200px">
      <h2 style="margin-left:5px">
        申请人：
        <span>{{ acInfo.AcOrgName }}</span>
      </h2>
      <div class="top-left">
        <p>
          认证类型：
          <span>{{ acInfo.AcType }}</span>
        </p>
        <p>
          申请级别：
          <span>{{ acInfo.AcLevel }}</span>
        </p>
        <p>
          申请日期：
          <span>{{ acInfo.ApplyTime }}</span>
        </p>
      </div>
      <div :class="{hide:isHide}"
        class="top-right">
        <p>
          当前阶段：
          <span style="font-size:23px;font-weight:500">
            {{ acInfo.CurrentSection }}</span>
        </p>
        <p>
          状态：
          <span style="font-size:23px;font-weight:500">
            {{ acInfo.State }}</span>
        </p>
      </div>
    </div>

    <div class="certification-detail"
      style="height:200px">
      <h2 style="margin-left:5px">认证进度</h2>

      <el-steps
        :space="190"
        :active="progressData.Active"
        :processStatus="progressData.ProcessStatus"
        alignCenter
        finishStatus="success"
      >
        <template v-if="acInfo.AcType=='初审'">
          <el-step title="认证申请"></el-step>
          <el-step title="材料审核"></el-step>
          <el-step title="数据审核"></el-step>
          <el-step title="现场审核"></el-step>
          <el-step title="专家组审核"></el-step>
          <el-step title="完成"></el-step>
        </template>
        <template v-else>
          <el-step title="认证申请"></el-step>
          <el-step title="材料审核"></el-step>
          <el-step title="数据审核"></el-step>
          <el-step title="专家组审核"></el-step>
          <el-step title="完成"></el-step>
        </template>

      </el-steps>
      <div style="margin:0 auto">
        <template v-for="(item,index) in progressData.SteptInfo">
          <div
            v-if="index<=progressData.Active"
            :key="index"
            class="step-div"
            style="margin-left:0px"
          >
            <p>{{ item.StateName }}</p>
            <p v-if="item.StateName!=null&&item.StateName!=''">
              {{ item.FinishTime }}</p>
            <p>
              <a v-if="item.IsViewDetail"
                href="javascript:;"
                @click="viewDetail(item)">查看详情</a>
              &nbsp;&nbsp;
              <a
                v-if="item.IsReapply"
                href="javascript:;"
                @click="reapply(item)"
              >重新申请</a>
            </p>
          </div>
        </template>
      </div>
    </div>

    <div class="certification-detail">
      <h3 style="margin-left:5px">审核记录</h3>

      <template v-if="AuditRecord">
        <template v-if="AuditRecord.length > 0">
          <table class="certification-detail__table">
            <thead class="certification-detail__table-header">
              <tr>
                <th>审核类型</th>
                <th>评分</th>
                <th>审核结果</th>
                <th>不通过原因</th>
                <th>审核人</th>
                <th>审核日期</th>
                <th>备注</th>
                <th>操作</th>
              </tr>
            </thead>
          </table>

          <div class="certification-detail__tablectn">
            <table class="certification-detail__table">
              <tbody class="certification-detail__table-body">
                <tr
                  v-for="(item, index) in AuditRecord"
                  :key="index"
                  class="certification-detail__table-body-review"
                >
                  <td>
                    <p :title="item.STATE_TYPE_NAME">
                      {{ item.STATE_TYPE_NAME }}</p>
                  </td>
                  <td>
                    <p :title="item.GRADE">{{ item.GRADE }}</p>
                  </td>
                  <td>
                    <p :title="item.STATE_VALUE">{{ item.STATE_VALUE }}</p>
                  </td>
                  <td>
                    <p :title="item.FEEDBACK_MSG">{{ item.FEEDBACK_MSG }}</p>
                  </td>
                  <td>
                    <p v-if="item.STATE_VALUE!='审核中'&&item.STATE_VALUE!='待审核'"
                      :title="item.AUDIT_USER_NAME">
                      {{ item.AUDIT_USER_NAME }}</p>
                  </td>
                  <td>
                    <p v-if="item.STATE_VALUE!='审核中'&&item.STATE_VALUE!='待审核'"
                      :title="item.AUDIT_TIME"
                    >{{ item.AUDIT_TIME }}</p>
                  </td>
                  <td>
                    <p :title="item.REMARK">{{ item.REMARK }}</p>
                  </td>
                  <td>
                    <template v-if="item.STATE_TYPE=='材料审核'">
                      <a href="javascript:;"
                        @click="viewDetail(item)">查看</a>
                      <a
                        v-if="item.STATE_VALUE=='不通过'"
                        href="javascript:;"
                        @click="viewDetail(item)"
                      >编辑</a>
                    </template>
                    <template v-else-if="item.STATE_TYPE=='专家组审核'"></template>
                    <template v-else>
                      <a href="javascript:;"
                        @click="viewDetail(item)">查看</a>
                    </template>
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
  </div>
</template>

<script>
  import Axios from "axios";
  import resolveApiRoute from "__libs/js/modules/resolve-api-route";
  import QaNoContent from "__libs/components/QaNoContent";

  export default {
    name: "certification-detail",

    components: {
      QaNoContent
    },

    data() {
      return {
        // 上级页面传过来的数据
        receiveData: {},
        // 头部认证信息
        acInfo: {},
        // 进度条数据
        progressData: {},
        // 审核记录
        AuditRecord: null,
        // 是否展示专家审核对话框
        displayExpertDialog: false,
        // 专家数据
        userData: null,
        acApplyId: "",
        Edittype: 1
      };
    },

    computed: {
      isHide() {
        let rt =
          this.progressData != null &&
          this.progressData.SteptInfo != null &&
          this.progressData.SteptInfo.length == 6
            ? true
            : false;

        return rt;
      }
    },

    watch: {},

    mounted() {
      this.initData(this.$route.query.applyID);
    },

    methods: {
      // 查看详情
      viewDetail(obj) {
        // 查看视图参数
        let param = {};
        // 状态类型
        let stateType = 0;

        if (obj.hasOwnProperty("ApplyId")) {
          stateType = obj.StateType;
          param = {
            AC_APPLY_ID: obj.ApplyId,
            STATE_ID: obj.StateId
          };
        } else {
          stateType = obj.STATE_TYPE;
          param = {
            AC_APPLY_ID: obj.AC_APPLY_ID,
            STATE_ID: obj.STATE_ID
          };
        }

        if (stateType == 1) {
          this.$router.push({
            path: "/materialexamineDetail",
            query: {
              editdata: param,
              Edittype: this.Edittype
            }
          });
        } else if (stateType == 2) {
          this.$router.push({
            path: "/DataExamineDetail",
            query: {
              editdata: param,
              Edittype: this.Edittype
            }
          });
        } else if (stateType == 3) {
          this.$router.push({
            path: "/sceneexamineDetail",
            query: {
              editdata: param,
              Edittype: this.Edittype
            }
          });
        }
      },

      // 重新申请
      reapply(obj) {
        if (obj.StateType == 1) {
          this.$router.push({
            path: "/cerApply",
            query: {
              applyID: obj.ApplyId,
              stateID: obj.StateId,
              applyLevel: this.acInfo.AcLevel,
              applyType: this.acInfo.AcType
            }
          });
        } else {
          Axios.post(resolveApiRoute("certification-reapply"), {
            ApplyId: obj.ApplyId,
            SectionStateType: obj.StateType,
            SectionStateId: obj.StateId
          }).then(
            (res) => {
              if (res.data.Code === 0) {
                this.freshData(this.acApplyId);
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
      },

      // 刷新数据
      freshData(obj) {
        this.initData(obj);
      },

      initData(applyID) {
        this.$showLoading();
        this.isShowLoading = true;
        this.acApplyId = applyID;

        Axios.get(resolveApiRoute("certification-detail"), {
          params: {
            applyId: applyID
          }
        }).then(
          (res) => {
            this.$hideLoading();
            this.isShowLoading = false;

            if (res.data.Code === 0) {
              this.acInfo = res.data.Data.AcInfo;
              this.AuditRecord = res.data.Data.AuditRecord;
              this.progressData = res.data.Data.ProgressData;
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
  @import "~__libs/scss/element";
  // @import "~element-ui/lib/theme-chalk/step";
  // @import "~element-ui/lib/theme-chalk/steps";
  .step-div {
    width: 190px;
    // background-color: aquamarine;
    float: left;
    // border: black;
    margin: 0px;
    text-align: center;
  }

  .step-div p {
    line-height: 8px;
  }

  .step-div a {
    color: #3789be;
  }

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

  .certification-detail {
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
          @include table-sizes(100, 100, 100, 120, 100, 120, 160, 120);

          padding: 0;

          &:first-child {
            padding: 0 sz(8);
            text-align: center;
            height: sz(40);
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
