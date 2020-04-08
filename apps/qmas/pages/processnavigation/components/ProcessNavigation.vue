<template>
  <div>
    <div class="process-navigation" 
      style="height:770px">
      <el-row :gutter="20">
        <el-col :span="5">
          <div class="grid-content bg-purple">
            <p></p>
          </div>
        </el-col>
        <el-col :span="5">
          <div class="grid-content bg-purple">
            <h2 style="margin-left:5px">初审流程</h2>
            <el-steps
              :space="120"
              :active="progressData.Active"
              :processStatus="progressData.ProcessStatus"
              direction="vertical"
              finishStatus="success"
            >
              <el-step title="认证申请">></el-step>
              <el-step title="材料审核"></el-step>
              <el-step title="数据审核"></el-step>
              <el-step title="现场审核"></el-step>
              <el-step title="专家组审核"></el-step>
              <el-step title="完成"></el-step>
            </el-steps>
          </div>
        </el-col>
        <el-col :span="5">
          <div class="grid-content bg-purple">
            <p></p>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="grid-content bg-purple">
            <h2 style="margin-left:5px">复审流程</h2>
            <el-steps
              :space="120"
              :active="progressData.Active"
              :processStatus="progressData.ProcessStatus"
              direction="vertical"
              finishStatus="success"
            >
              <el-step title="认证申请">></el-step>
              <el-step title="材料审核"></el-step>
              <el-step title="数据审核"></el-step>
              <el-step title="专家组审核"></el-step>
              <el-step title="完成"></el-step>
            </el-steps>
          </div>
        </el-col>
        <el-col :span="5">
          <div class="grid-content bg-purple">
            <p></p>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  import Axios from "axios";
  import resolveApiRoute from "__libs/js/modules/resolve-api-route";
  import QaNoContent from "__libs/components/QaNoContent";

  export default {
    name: "process-navigation",

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
        progressData: {
          Active: 3,
          ProcessStatus: ""
        },
        // 审核记录
        AuditRecord: null,
        // 是否展示专家审核对话框
        displayExpertDialog: false,
        // 专家数据
        userData: null,
        acApplyId: "",
        Edittype: 2
      };
    },

    watch: {},

    mounted() {
      // this.initData();
    },

    methods: {
      // 查看详情
      viewDetail(obj) {
        let param = {
          AC_APPLY_ID: obj.ApplyId,
          STATE_ID: obj.StateId
        };

        if (obj.StateType == 1) {
          this.$router.push({
            path: "/materialexamineDetail",
            query: {
              editdata: param,
              Edittype: this.Edittype
            }
          });
        } else if (obj.StateType == 2) {
          this.$router.push({
            path: "/DataExamineDetail",
            query: {
              editdata: param,
              Edittype: this.Edittype
            }
          });
        } else if (obj.StateType == 3) {
          this.$router.push({
            path: "/sceneexamineDetail",
            query: {
              editdata: param,
              Edittype: this.Edittype
            }
          });
        }
      },

      // 刷新数据
      freshData(obj) {
        this.initData(obj);
      },

      initData(obj) {
        this.$showLoading();
        this.isShowLoading = true;
        this.acApplyId = obj.AC_APPLY_ID;

        Axios.get(resolveApiRoute("process-navigation"), {
          params: {
            applyId: obj.AC_APPLY_ID
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
  .layout-div {
    width: 200px;
    height: 720px;
    float: left;
    margin: 0 0 0 20px;
  }

  .step-div {
    width: 190px;
    float: left;
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

  .process-navigation {
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
