<template>
  <div class="org-info">
    <org-table-filter></org-table-filter>

    <div class="org-info__tablecontent">
      <template v-if="bodyData">
        <div class="org-info__tablecontent-body">
          <org-table-body
            :bodyData="bodyData"
            @orgVerify="changeVerifyStatus"
            @orgDelete="deleteOrg"
            @orgEdit="editOrgInfo"
            @orgPay="changePayStatus"
          ></org-table-body>
        </div>
        <!-- 分页 -->
        <paginator
          :totalRecords="totalRecords"
          :pageSize="pageSize"
          :curPage="curPage"
          @changePage="changePage"
        ></paginator>
      </template>
      <template v-else>
        <qa-no-content title="暂无机构数据"></qa-no-content>
      </template>
    </div>

    <!--确定删除吗？ -->
    <confirm-dialog
      :display="displayDeletDialog"
      :dialogBody="axiosDeletStatusText"
      dialogHeaderTitle="删除"
      @okClicked="delCustom"
      @closeDialog="displayDeletDialog=false"
    ></confirm-dialog>

    <!--确定缴费吗？ -->
    <confirm-dialog
      :display="displayPayDialog"
      :dialogBody="axiosPayStatusText"
      dialogHeaderTitle="缴费"
      @okClicked="payCustom"
      @closeDialog="displayPayDialog=false"
    ></confirm-dialog>

    <!--确定审核吗？ -->
    <!-- <confirm-dialog
      :display="displayVerifyDialog"
      :dialogBody="axiosVerifyStatusText"
      dialogHeaderTitle="审核"
      @okClicked="verifyCustom"
      @closeDialog="displayVerifyDialog=false"
    ></confirm-dialog>-->

    <org-audit-dialog
      :display="displayVerifyDialog"
      :dialogHeaderCloseBtn="true"
      :userData="userData"
      @closeDialog="displayVerifyDialog=false"
      @dialogOkClicked="verifyCustom"
    ></org-audit-dialog>
  </div>
</template>

<script>
  import Axios from "axios";
  import Paginator from "__shared-libs/components/paginator/Paginator";
  import getPageSize from "__shared-libs/js/modules/get-page-size";
  import QaNoContent from "__libs/components/QaNoContent";
  import resolveApiRoute from "__libs/js/modules/resolve-api-route";
  import OrgAuditDialog from "./OrgAuditDialog";
  import EventBus from "__shared-libs/js/vue/eventbus";
  import OrgTableFilter from "./OrgTableFilter";
  import DotsPaginator from "__shared-libs/components/paginator/DotsPaginator";
  import orgTableBody from "./orgTableBody";

  export default {
    name: "org-info",

    components: {
      Paginator,
      OrgAuditDialog,
      QaNoContent,
      OrgTableFilter,
      DotsPaginator,
      orgTableBody
    },

    data() {
      return {
        totalRecords: 0,
        pageSize: getPageSize(40, 275),
        curPage: 1,
        dialogFooterOkBtnText: "",

        bodyData: [],
        opOrgId: null,
        userData: null,

        // 确定删除对话框吗？
        displayDeletDialog: false,
        axiosDeletStatusText: null,

        // 确定缴费对话框吗？
        displayPayDialog: false,
        axiosPayStatusText: null,

        // 确定审核对话框吗？
        displayVerifyDialog: false,
        axiosVerifyStatusText: null,

        // 以何种方式打开用户操作对话框
        controlModel: "",
        // 已选择的条件
        selectedParams: null,

        // 是否显示 导入/编辑/添加账号 对话框
        showUserControlDialog: false,

        // 编辑模式下 原始渲染对象
        editBaseData: {},

        // 是否正在加载数据
        isShowLoading: true,

        // 无返回数据筛选条件置灰禁点
        filterDisabled: false,

        commonDicts: null
      };
    },

    mounted() {
      this.fetchData("search");
      // 接受事件
      EventBus.$on("searchChanged", (evt) => {
        // else: 获取搜索字段
        this.selectedParams = evt;
        this.curPage = 1;
        this.fetchData("search");
      });
    },

    methods: {
      getApiPara() {
        let combined = {
          // 可选 默认操作时间
          OrderField: "",
          // 可选 0正序，1倒序 默认为1倒序排序类型
          OrderWay: "",
          // 当前页码
          PageIndex: this.curPage,
          // 每页条数
          PageSize: this.pageSize
        };

        if (this.selectedParams) {
          // 可选 搜索内容
          if (this.selectedParams.SearchText) {
            Object.assign(combined, {
              Content: this.selectedParams.SearchText
            });
          }

          // 可选操作类型
          if (this.selectedParams.Pay) {
            Object.assign(combined, {
              PayState: this.selectedParams.Pay
            });
          }

          if (this.selectedParams.Verify) {
            Object.assign(combined, {
              VerifyState: this.selectedParams.Verify
            });
          }
        }

        return combined;
      },
      // 用户管理表格
      fetchData(type) {
        this.$showLoading();
        this.isShowLoading = true;

        // 清空已选择的
        Axios.post(resolveApiRoute("org-info"), this.getApiPara()).then(
          (res) => {
            this.$hideLoading();
            this.isShowLoading = true;

            if (res.data.Code === 0) {
              let filterDisabled = false;

              this.totalRecords =
                res.data.Data.Data.length > 0 ? res.data.Data.TotalRecord : 0;

              if (res.data.Data.Data.length > 0) {
                this.bodyData = res.data.Data.Data;
              } else {
                this.bodyData = null;

                if (type === "search") {
                  filterDisabled = true;
                }
              }

              // 重置筛选器状态(启用/禁用）
              this.filterDisabled = filterDisabled;
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
      changePage(pageIndex) {
        this.curPage = pageIndex;
        this.fetchData();
      },

      // 确定缴费吗？
      changePayStatus(obj) {
        // 点击取消按钮后数组里会有刚刚选中的那条ID,所以要先清空
        this.opOrgId = null;
        this.axiosPayStatusText = "确认该机构已缴费？";
        this.opOrgId = obj.ID;
        this.displayPayDialog = true;
      },
      // 点击 "缴费" 按钮
      payCustom() {
        Axios.put(
          resolveApiRoute("org-pay-state", {
            OrgID: this.opOrgId
          })
        ).then(
          (res) => {
            if (res.data.Code === 0) {
              // 不刷新页面 需要手动更新这个用户的状态,
              let newOrgData = this.bodyData.slice(0);

              newOrgData.map((item) => {
                if (item.ID === this.opOrgId) {
                  item.PAY_STATE = res.data.Data.PayState;
                  item.PAY_DATE = res.data.Data.PayDate;
                }

                return item;
              });

              this.bodyData = newOrgData;
            } else if (res.data.Code === 99) {
              // 步骤1：A用户删除用户
              // 步骤2：B用户没有刷新页面，操作已经删除的用户，会报服务器异常
              this.$showNotice("数据变动，请刷新重试!", "failed");
            } else {
              this.$showNotice("服务器异常", "failed");
            }
          },
          () => {
            this.$showNotice("网络异常", "failed");
          }
        );
      },
      // 确定审核吗？
      changeVerifyStatus(obj) {
        // 点击取消按钮后数组里会有刚刚选中的那条ID,所以要先清空
        this.opOrgId = null;
        this.axiosVerifyStatusText = "确定审核通过吗？";
        this.opOrgId = obj.ID;
        this.displayVerifyDialog = true;
      },
      verifyCustom(obj) {
        Axios.put(
          resolveApiRoute("org-verify-state", {
            OrgID: this.opOrgId
          }),
          null,
          {
            params: {
              VerifyState: obj.AdResult,
              Remark: obj.Remark
            }
          }
        ).then(
          (res) => {
            if (res.data.Code === 0) {
              this.displayVerifyDialog = false;
              // 不刷新页面 需要手动更新这个用户的状态,
              let newOrgData = this.bodyData.slice(0);

              newOrgData.map((item) => {
                if (item.ID === this.opOrgId) {
                  item.VERIFY_STATE = res.data.Data.VerifyState;
                  item.VERIFY_DATE = res.data.Data.VerifyDate;
                }

                return item;
              });

              this.bodyData = newOrgData;
            } else if (res.data.Code === 99) {
              // 步骤1：A用户删除用户
              // 步骤2：B用户没有刷新页面，操作已经删除的用户，会报服务器异常
              this.$showNotice("数据变动，请刷新重试!", "failed");
            } else {
              this.$showNotice("服务器异常", "failed");
            }
          },
          () => {
            this.$showNotice("网络异常", "failed");
          }
        );
      },

      // 导入/编辑/删除账号确定操作
      dialogOkClicked(newUser) {
        let freshUser = {
          ID: newUser.UserCode,
          USER_LOGIN_NAME: newUser.UserLoginName,
          USER_NAME: newUser.UserName,
          GENDER_CODE: newUser.GenderCode,
          BIRTH_DATE: newUser.BirthDate,
          TITLE: newUser.Title,
          USE_FLAG: newUser.UseFlag,
          DOCTOR_NAME: newUser.DoctorName,
          DOCTOR_CODE: newUser.DoctorCode,
          IS_USER_DOC: newUser.IsUserDoc,
          USER_CLASS: newUser.UserClass
        };

        if (this.controlModel === "edit") {
          freshUser.USE_FLAG = newUser.UseFlag;
          freshUser.LastLoginDate = newUser.LastLoginDate;
          freshUser.ROLE_TYPE = newUser.RoleType;
          freshUser.DOCTOR_NAME = newUser.DoctorName;
          freshUser.DOCTOR_CODE = newUser.DoctorCode;
          freshUser.IS_USER_DOC = newUser.IsUserDoc;

          let newUserData = this.userData;
          let tmpList = newUserData.slice(0);

          tmpList.map((item) => {
            if (item.ID === freshUser.ID) {
              item.ID === freshUser.ID;
              item.USE_FLAG = freshUser.USE_FLAG;
              item.LastLoginDate = freshUser.LastLoginDate;
              item.ROLE_TYPE = freshUser.ROLE_TYPE;
              item.GENDER_CODE = freshUser.GENDER_CODE;
              item.TITLE = freshUser.TITLE;
              item.USER_NAME = freshUser.USER_NAME;
              item.BIRTH_DATE = freshUser.BIRTH_DATE;
              item.DOCTOR_NAME = freshUser.DOCTOR_NAME;
              item.DOCTOR_CODE = freshUser.DOCTOR_CODE;
              item.IS_USER_DOC = freshUser.IS_USER_DOC;
            }

            return item;
          });

          this.updateUserList(tmpList);
        } else {
          // 如果是添加或者是导入操作,就需要手动将页面渲染,并在用户列表的最后添加这个用户
          freshUser.USE_FLAG = 1;
          freshUser.LastLoginDate = "";
          freshUser.ROLE_TYPE = 0;

          let newUserData = this.userData.slice(0);
          newUserData.push(freshUser);
          this.updateUserList(newUserData);
        }
      },

      // 编辑
      editOrgInfo(obj) {
        this.$router.push({
          path: "/orgdetail",
          query: { editdata: obj }
        });
      },

      // 确定删除吗？
      deleteOrg(obj) {
        // 点击取消按钮后数组里会有刚刚选中的那条ID,所以要先清空
        this.opOrgId = null;
        this.axiosDeletStatusText = `删除该记录${obj.HOSP_NAME}，是否继续？`;
        this.opOrgId = obj.ID;
        this.displayDeletDialog = true;
      },

      // 删除
      delCustom() {
        Axios.delete(
          resolveApiRoute("org-delete", {
            OrgID: this.opOrgId
          })
        ).then(
          (res) => {
            if (res.data.Code === 0) {
              this.$showNotice("删除成功");
              this.fetchData("search");
            // // 找到已删除的原因
            // let index = this.bodyData.findIndex((item) => {
            //   return item.ID === this.opOrgId;
            // });
            // // 建立副本，用来删除操作
            // let workedList = this.bodyData.slice(0);
            // // 删掉原来位置的原因
            // workedList.splice(index, 1);
            // this.bodyData = workedList;
            } else if (res.data.Code === 99) {
              // 步骤1：A用户删除用户
              // 步骤2：B用户没有刷新页面，操作已经删除的用户，会报服务器异常
              this.$showNotice("数据变动，请刷新重试!", "failed");
            } else {
              this.$showNotice("服务器异常", "failed");
            }
          },
          () => {
            this.$showNotice("网络异常", "failed");
          }
        );
      }
    }
  };
</script>

<style lang="scss">
  @import "~__libs/scss/lib-common-utils";

  .org-info {
    @include border-radius(5px);
    @include custom-container(sz(22));

    margin: sz(10) auto sz(20);
    // 导航50  面包屑 35  margin 30 filter 50 filter-margin 10 padding 20
    // border 2
    height: calc(100% - 90px);
    padding: sz(10);
    border: 1px solid map-get($colors, dialog-cancel-border);
    background: map-get($colors, pure-white);

    &__tablecontent {
      // log-filter 39px
      height: calc(100% - 39px);

      &-body {
        // paginator 28px margin 10px
        height: calc(100% - 38px);
        overflow: auto;
      }

      .paginator {
        margin: sz(10) 0 0 0;
      }
    }

    .qa-no-content {
      border: 1px solid map-get($colors, dialog-cancel-border);
      background: map-get($colors, pure-white);
      margin-top: sz(10);
    }
  }
</style>
