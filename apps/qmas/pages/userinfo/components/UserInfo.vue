<template>
  <div class="user-info">
    <template v-if="filterParams">
      <user-table-filter
        :filterParams="filterParams"
        :disabled="filterDisabled"
        @typeChanged="changeType"
      ></user-table-filter>
    </template>

    <div class="user-info__tablecontent">
      <template v-if="bodyData">
        <div class="user-info__tablecontent-body">
          <user-table-body
            :bodyData="bodyData"
            :checkModels="checkModels"
            @userEmpty="emptyUserInfo"
            @userDelete="deleteUserInfo"
            @userEdit="editUserInfo"
            @statusChanged="changeUserStatus"
            @updateCheckedUsers="updateCheckedUsers"
          ></user-table-body>
        </div>

        <paginator
          :totalRecords="totalRecords"
          :pageSize="pageSize"
          :curPage="curPage"
          @changePage="changePage"
        ></paginator>
      </template>
      <template v-else>
        <qa-no-content title="暂无用户数据"></qa-no-content>
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

    <!--确定清空密码吗？ -->
    <confirm-dialog
      :display="displayEmptyDialog"
      :dialogBody="axiosEmptyStatusText"
      dialogHeaderTitle="清空密码"
      @okClicked="delCustomPwd"
      @closeDialog="displayEmptyDialog=false"
    ></confirm-dialog>

    <user-control-dialog
      :controlModel="controlModel"
      :display="showUserControlDialog"
      :editBaseData="editBaseData"
      :commonRoles="commonRoles"
      :dialogFooterOkBtnText="dialogFooterOkBtnText"
      @dialogOkClicked="dialogOkClicked"
      @closeDialog="showUserControlDialog=false"
    ></user-control-dialog>
  </div>
</template>

<script>
  import Axios from "axios";
  import Paginator from "__shared-libs/components/paginator/Paginator";
  import getPageSize from "__shared-libs/js/modules/get-page-size";
  import QaNoContent from "__libs/components/QaNoContent";
  import resolveApiRoute from "__libs/js/modules/resolve-api-route";

  import EventBus from "__shared-libs/js/vue/eventbus";
  import UserControlDialog from "./UserControlDialog";
  import UserTableBody from "./UserTableBody";
  import UserTableFilter from "./UserTableFilter";

  export default {
    name: "user-info",

    components: {
      Paginator,
      UserControlDialog,
      QaNoContent,
      UserTableBody,
      UserTableFilter
    },

    data() {
      return {
        totalRecords: 0,
        pageSize: getPageSize(40, 275),
        curPage: 1,

        bodyData: null,
        checkModels: [],
        delUserId: null,
        orgId: null,

        // 确定删除对话框吗？
        displayDeletDialog: false,
        axiosDeletStatusText: null,

        // 确定清空密码对话框吗？
        displayEmptyDialog: false,
        axiosEmptyStatusText: null,

        // 以何种方式打开用户操作对话框
        controlModel: "",

        // 是否显示 导入/编辑/添加账号 对话框
        showUserControlDialog: false,

        // 编辑模式下 原始渲染对象
        editBaseData: {},

        // 是否正在加载数据
        isShowLoading: true,

        // 无返回数据筛选条件置灰禁点
        filterDisabled: false,
        // 已选择的条件
        selectedParams: null,

        // 筛选模式下筛选器可用选项
        filterParams: {
          roleName: []
        },

        commonRoles: [],
        dialogFooterOkBtnText: ""
      };
    },

    mounted() {
      this.fetchData("search");
      // 接受事件
      EventBus.$on("searchChanged", (evt) => {
        // user-info-filter中的全选状态发生变化
        if (evt.name === "searchObj") {
          // else: 获取搜索字段
          this.selectedParams = { searchContent: evt.params };
          this.curPage = 1;
          this.fetchData("search");
        } else if (evt.name === "addUser") {
          // else: 添加账号进行的操作
          this.controlModel = "add";
          this.fetchRoleData();
          this.dialogFooterOkBtnText = "添加";
        }
      });
    },

    methods: {
      // 同步下游props
      updateDropdownOptions(type, codes) {
        let actName, codeField;

        if (type === "type") {
          actName = "roleName";
          codeField = "ID";
        }

        this.filterParams[actName] = this.filterParams[actName].map((item) => {
          // 首先默认为未选
          item.isChecked = false;

          // 然后条件成立才选上
          if (
            codes.findIndex((subItem) => {
              return subItem === item[codeField];
            }) > -1
          ) {
            item.isChecked = true;
          }

          return item;
        });

        // 触发一下更新
        this.filterParams = Object.assign({}, this.filterParams);
      },
      changeType(codes) {
        this.updateDropdownOptions("type", codes);

        if (codes.length === this.filterParams.roleName.length) {
          codes = [];
        }

        this.setApiPara("roleID", codes);
        this.changePage(1);
      },
      // 读取下拉框参数
      setApiPara(type, codes) {
        this.selectedParams = Object.assign({}, this.selectedParams, {
          [type]: codes
        });
      },
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
          if (this.selectedParams.searchContent) {
            Object.assign(combined, {
              Content: this.selectedParams.searchContent
            });
          }

          // 可选操作类型
          if (this.selectedParams.roleID) {
            Object.assign(combined, {
              RoleTypeCode: this.selectedParams.roleID
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
        this.updateCheckedUsers([]);

        Axios.post(resolveApiRoute("user-info"), this.getApiPara()).then(
          (res) => {
            this.$hideLoading();
            this.isShowLoading = true;

            if (res.data.Code === 0) {
              let filterDisabled = false;

              this.totalRecords =
                res.data.Data.Data.length > 0 ? res.data.Data.TotalRecord : 0;

              if (res.data.Data.Data.length > 0) {
                this.updateUserList(res.data.Data.Data);

                if (type === "search") {
                  this.updateFilterParams(res.data.Data);
                }
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

      fetchRoleData() {
        Axios.get(resolveApiRoute("role-info-list")).then(
          (res) => {
            if (res.data.Code == 0) {
              this.commonRoles = res.data.Data.Data.filter((role) => {
                return role.ID !== "1";
              });
              this.showUserControlDialog = true;
            } else {
              this.networkExceptional("服务器错误");
            }
          },
          () => {
            this.networkExceptional("网络错误");
          }
        );
      },

      // 更新筛选器选项
      updateFilterParams(resData) {
        // 填充筛选器参数
        this.filterParams = Object.assign({}, this.filterParams, {
          roleName: resData.RoleName.map((item) => {
            item.isChecked = true;

            return item;
          })
        });
      },
      changePage(pageIndex) {
        this.curPage = pageIndex;
        this.fetchData();
      },
      // 点击 "启用/关闭" 按钮
      changeUserStatus(user) {
        Axios.put(
          resolveApiRoute("user-status", {
            UserID: user.ID
          }),
          {
            // 状态（1启用, 0未启用）
            STATE: user.STATE ? 0 : 1
          }
        ).then(
          (res) => {
            if (res.data.Code === 0) {
              // 不刷新页面 需要手动更新这个用户的停用/启用状态,
              let newUserData = this.bodyData.slice(0);

              newUserData.map((item) => {
                if (item.ID === user.ID) {
                  item.STATE = item.STATE === 1 ? 0 : 1;
                }

                return item;
              });

              this.updateUserList(newUserData);
            } else if (res.data.Code === 99) {
              // 步骤1：A用户删除用户
              // 步骤2：B用户没有刷新页面，操作已经删除的用户，会报服务器异常
              this.$showNotice("数据变动，请刷新重试!", "failed");
            } else if (res.data.Code === 11) {
              // 步骤1：A用户删除用户
              // 步骤2：B用户没有刷新页面，操作已经删除的用户，会报服务器异常
              this.$showNotice(res.data.Msg, "failed");
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
          ID: newUser.ID,
          USER_ACCOUNT: newUser.USER_ACCOUNT,
          USER_REALNAME: newUser.USER_REALNAME,
          USER_PASSWD: newUser.USER_PASSWD,
          STATE: newUser.STATE,
          REMARK: newUser.REMARK,
          USER_MOBILEPHONE: newUser.USER_MOBILEPHONE,
          RoleNames: newUser.RoleNames,
          RoleIdList: newUser.RoleIdList,
          ORG_ID: newUser.ORG_ID
        };

        if (this.controlModel === "edit") {
          let newUserData = this.bodyData;
          let tmpList = newUserData.slice(0);

          tmpList.map((item) => {
            if (item.ID === freshUser.ID) {
              item.ID === freshUser.ID;
              item.STATE = freshUser.STATE;
              item.USER_PASSWD = freshUser.USER_PASSWD;
              item.USER_REALNAME = freshUser.USER_REALNAME;
              item.USER_ACCOUNT = freshUser.USER_ACCOUNT;
              item.USER_MOBILEPHONE = freshUser.USER_MOBILEPHONE;
              item.Remark = freshUser.Remark;
              item.RoleIdList = freshUser.RoleIdList;
              item.RoleNames = freshUser.RoleNames;
              item.ORG_ID = freshUser.ORG_ID;
            }

            return item;
          });

          this.updateUserList(tmpList);
        } else {
          // 如果是添加或者是导入操作,就需要手动将页面渲染,并在用户列表的最后添加这个用户
          // let newUserData = this.bodyData.slice(0);
          // newUserData.push(freshUser);
          // this.updateUserList(newUserData);
          this.fetchData("search");
        }
      },
      // 更新原始用户列表
      updateUserList(userList) {
        this.bodyData = userList;

      // let adminUserCount = userList.filter((user) => {
      //   return user.ROLE_TYPE === 1;
      // }).length;

      // // 原始列表变更之后，通知筛选器组件，数目变更
      // this.sendDataChanged({
      //   name: "userChanged",
      //   params: {
      //     userDataCount: userList.length,
      //     adminUserCount
      //   }
      // });
      },

      // 编辑
      editUserInfo(obj) {
        this.editBaseData = obj;
        this.controlModel = "edit";
        this.dialogFooterOkBtnText = "完成";
        this.fetchRoleData();
      },

      // 确定清空密码吗？
      emptyUserInfo(obj) {
        // 点击取消按钮后数组里会有刚刚选中的那条ID,所以要先清空
        this.delUserId = null;
        this.axiosEmptyStatusText = "是否清空密码？";
        this.delUserId = obj.ID;
        this.displayEmptyDialog = true;
      },

      // 清空密码
      delCustomPwd() {
        Axios.put(
          resolveApiRoute("user-clear-pwd", {
            UserCode: this.delUserId
          })
        ).then(
          (res) => {
            if (res.data.Code === 0) {
              this.$showNotice("密码已清空");
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

      // 确定删除吗？
      deleteUserInfo(obj) {
        // 点击取消按钮后数组里会有刚刚选中的那条ID,所以要先清空
        this.delUserId = null;
        this.orgId = null;
        this.axiosDeletStatusText = `删除账号${obj.USER_ACCOUNT}，是否继续？`;
        this.delUserId = obj.ID;
        this.orgId = obj.ORG_ID;
        this.displayDeletDialog = true;
      },

      // 删除
      delCustom() {
        Axios.delete(
          resolveApiRoute("user-delete", {
            UserID: this.delUserId
          }),
          {
            params: {
              OrgID: JSON.stringify([this.orgId])
            }
          }
        ).then(
          (res) => {
            if (res.data.Code === 0) {
              this.$showNotice("删除成功");
              this.fetchData("search");

            // // 找到已删除的原因
            // let index = this.bodyData.findIndex((item) => {
            //   return item.ID === this.delUserId;
            // });
            // // 建立副本，用来删除操作
            // let workedList = this.bodyData.slice(0);
            // // 删掉原来位置的原因
            // workedList.splice(index, 1);
            // this.updateUserList(workedList);

            // let checkedUsers = this.checkModels.reduce((newModel, item) => {
            //   if (item !== this.delUserId) {
            //     newModel.push(item);
            //   }

            //   return newModel;
            // }, []);

            // this.updateCheckedUsers(checkedUsers);
            } else if (res.data.Code === 99) {
              // 步骤1：A用户删除用户
              // 步骤2：B用户没有刷新页面，操作已经删除的用户，会报服务器异常
              this.$showNotice("数据变动，请刷新重试!", "failed");
            } else if (res.data.Code === 11) {
              this.$showNotice(res.data.Msg, "failed");
            } else {
              this.$showNotice("服务器异常", "failed");
            }
          },
          () => {
            this.$showNotice("网络异常", "failed");
          }
        );
      },
      updateCheckedUsers(checkedUsers) {
        this.checkModels = checkedUsers;

        // 通知选中条数变更
        this.sendDataChanged({
          name: "modelsChanged",
          params: {
            selectedUserCount: checkedUsers.length
          }
        });
      },

      // 发送事件
      sendDataChanged(evtObj) {
        // {
        //   name, // 事件名称，
        //   params, // 参数
        // }
        EventBus.$emit("sendData", evtObj);
      }
    }
  };
</script>

<style lang="scss">
  @import "~__libs/scss/lib-common-utils";

  .user-info {
    @include border-radius(5px);

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
