<template>
  <div>
    <table class="expert-audit-table-body">
      <tbody>
        <tr v-for="(item, index) in bodyData"
          :key="index">
          <td :title="item.HOSP_NAME">
            <div>{{ item.HOSP_NAME }}</div>
          </td>
          <td :title="item.DEPT_NAME">
            <div>{{ item.DEPT_NAME }}</div>
          </td>
          <td :title="item.AC_TYPE_NAME">{{ item.AC_TYPE_NAME }}</td>
          <td :title="item.APPLY_LEVEL">{{ item.APPLY_LEVEL }}</td>
          <td :title="item.MATERIAL_GRADE">{{ item.MATERIAL_GRADE }}</td>
          <td :title="item.DATA_GRADE">{{ item.DATA_GRADE }}</td>
          <td :title="item.SCENE_GRADE">{{ item.SCENE_GRADE }}</td>
          <td :title="item.STATE_VALUE_NAME">{{ item.STATE_VALUE_NAME }}</td>
          <td :title="item.AC_RESULT">{{ item.AC_RESULT }}</td>
          <td :title="item.UPD_USER_NAME">{{ item.UPD_USER_NAME }}</td>
          <td :title="item.UPD_TIME">{{ item.UPD_TIME }}</td>
          <template v-if="item.STATE_VALUE=='5'">
            <td title="分配专家">
              <a href="javascript:;"
                @click="allocationExpertData(item)">分配专家</a>
            </td>
          </template>
          <template v-else-if="item.STATE_VALUE=='7'">
            <td>
              <a href="javascript:;"
                @click="viewProgress(item)">查看进度</a>
              <a href="javascript:;"
                @click="resultConfirmData(item)">结果确认</a>
            </td>
          </template>
          <template v-else>
            <td>
              <a href="javascript:;"
                @click="viewProgress(item)">查看详情</a>
            </td>
          </template>
        </tr>
      </tbody>
    </table>

    <expert-dialog
      :display="displayExpertDialog"
      :dialogHeaderCloseBtn="true"
      :userAccessData="userAccessData"
      @closeDialog="displayExpertDialog=false"
      @dialogOkClicked="dialogOkClicked"
    ></expert-dialog>

    <result-confirm-dialog
      :display="displayConfirmDialog"
      :dialogHeaderCloseBtn="true"
      :confirmAccessData="confirmAccessData"
      @closeDialog="displayConfirmDialog=false"
      @dialogOkClicked="dialogOkClicked"
    ></result-confirm-dialog>
  </div>
</template>

<script>
  import ExpertDialog from "./ExpertDialog";
  import ResultConfirmDialog from "./ResultConfirmDialog";
  import BasicDialog from "__shared-libs/components/dialog/BasicDialog";
  import Axios from "axios";
  import resolveApiRoute from "__libs/js/modules/resolve-api-route";

  export default {
    name: "expert-audit-table-body",
    components: {
      ExpertDialog,
      ResultConfirmDialog,
      BasicDialog
    },

    props: {
      bodyData: {
        type: Array,
        default() {
          return [];
        }
      }
    },

    data() {
      return {
        // 编辑模式下 原始渲染对象
        editBaseData: {},
        // 是否展示分配专家对话框
        displayExpertDialog: false,
        // 是否显示结果确认对话框
        displayConfirmDialog: false,
        // 专家分配数据
        userAccessData: null,
        // 结果确认数据
        confirmAccessData: null
      };
    },

    methods: {
      // 编辑
      editTrainInfo(obj) {
        this.editBaseData = obj;
        this.controlModel = "edit";
        this.dialogFooterOkBtnText = "完成";
        this.showUserControlDialog = true;
      },
      dialogOkClicked(id) {
        this.$emit("refreshData", id);
      },

      // 查看进度
      viewProgress(obj) {
        this.$router.push({
          path: "/expertAuditProgress",
          query: { editdata: obj }
        });
      },

      // 分配专家数据
      allocationExpertData(obj) {
        this.$showLoading();
        Axios.get(resolveApiRoute("assigment-expert"), {
          params: { stateId: obj.STATE_ID }
        }).then(
          (res) => {
            this.$hideLoading();

            if (res.data.Code === 0) {
              this.userAccessData = {
                depts: res.data.Data,
                title: "分配专家"
              };
              this.displayExpertDialog = true;
            } else if (res.data.Code === 1) {
              this.$showNotice(res.data.Msg);
            } else {
              this.$showNotice("服务器异常", "failed");
            }
          },
          () => {
            this.$showNotice("网络异常", "failed");
            this.$hideLoading();
          }
        );
      },

      // 结果确认数据
      resultConfirmData(obj) {
        this.$showLoading();

        Axios.get(resolveApiRoute("result-confirm"), {
          params: {
            stateId: obj.STATE_ID
          }
        }).then(
          (res) => {
            this.$hideLoading();

            if (res.data.Code === 0) {
              this.confirmAccessData = {
                expertAudits: res.data.Data.expertAuditList,
                adviceLevel: res.data.Data.adviceLevel,
                stateId: obj.STATE_ID,
                title: "认证结果确认"
              };

              this.displayConfirmDialog = true;
            } else {
              this.$showNotice("服务器异常", "failed");
            }
          },
          () => {
            this.$showNotice("网络异常", "failed");
            this.$hideLoading();
          }
        );
      }
    }
  };
</script>

<style lang="scss">
  @import "~__libs/scss/lib-common-utils";

  .expert-audit-table-body {
    @include unify-table-ui();

    > tbody tr {
      cursor: default;

      td {
        @include table-sizes(150, 130, 90, 80, 80, 80, 80, 90, 80, 80, 100);

        &:nth-child(1) {
          padding-left: sz(10);
          div {
            @include word-hidden(sz(140), max-width);
          }
        }

        &:nth-child(2) {
          div {
            @include word-hidden(sz(125), max-width);
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
</style>
