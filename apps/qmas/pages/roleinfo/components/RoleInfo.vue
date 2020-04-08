<template>
  <div v-if="roleList"
    class="role-info">
    <table class="role-info__table">
      <thead class="role-info__table-header">
        <tr>
          <th>角色名称</th>
          <th>角色描述</th>
          <th>更新时间</th>
          <th>操作</th>
        </tr>
      </thead>
    </table>

    <div class="role-info__bodyctn">
      <table class="role-info__table">
        <tbody class="role-info__table-body">
          <tr v-for="(item, index) in roleList"
            :key="index"
            class="role-info__table-body-review">
            <td :title="item.ROLE_NAME">{{ item.ROLE_NAME }}</td>
            <td :title="item.REMARK">{{ item.REMARK }}</td>
            <td :title="item.UPD_TIME">{{ item.UPD_TIME }}</td>
            <td>
              <a href="javascript:;"
                class="role-info__table-edit"
                @click="editUserInfo(item)">编辑</a>
              <a href="javascript:;"
                class="role-info__table-del"
                @click="deleteUserInfo(item)">删除</a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="role-info__addbtnbox">
      <a href="javascript:;"
        class="btn role-info__addbtnbox-addbtn"
        @click="addRole">添加角色</a>
    </div>

    <!--确定删除吗？ -->
    <confirm-dialog
      :display="displayDeletDialog"
      :dialogBody="axiosDeletStatusText"
      dialogHeaderTitle="删除"
      @okClicked="delCustom"
      @closeDialog="displayDeletDialog=false"
    ></confirm-dialog>

    <role-info-dialog
      :display="displayRoleDialog"
      :dialogHeaderCloseBtn="true"
      :roleInfoData="roleInfoData"
      :view="roleDialogView"
      @closeDialog="displayRoleDialog=false"
      @roleAdded="roleAdded"
      @roleEdited="roleEdited"
    ></role-info-dialog>
  </div>
</template>

<script>
  import Axios from "axios";
  import RoleInfoDialog from "./RoleInfoDialog";
  import resolveApiRoute from "__libs/js/modules/resolve-api-route";

  export default {
    name: "role-info",

    components: {
      RoleInfoDialog
    },

    data() {
      return {
        // 角色列表
        roleList: null,
        delRoleId: null,

        // 角色权限对话框
        displayRoleDialog: false,
        roleDialogView: "create",

        // 确定删除对话框吗？
        displayDeletDialog: false,
        axiosDeletStatusText: null,

        // 角色对话框数据
        roleInfoData: null
      };
    },

    mounted() {
      this.fetchData();
    },

    methods: {
      // 编辑
      editUserInfo(roleObj) {
        this.roleDialogView = "edit";
        this.fetchRoleData(roleObj);
      },

      // 添加角色
      addRole() {
        this.roleDialogView = "create";
        this.fetchRoleData({
          // 为 0 表示新建角色
          ID: 0
        });
      },

      // 获取角色对应数据
      fetchRoleData(roleObj) {
        this.$showLoading();

        Axios.get(
          resolveApiRoute("role-info-author-setting", {
            RoleId: roleObj.ID
          })
        ).then(
          (res) => {
            this.$hideLoading();

            if (res.data.Code === 0) {
              this.roleInfoData = Object.assign(
                {
                  ID: roleObj.ID,
                  REMARK: roleObj.REMARK
                },
                res.data.Data.Data
              );

              this.displayRoleDialog = true;
            } else {
              this.$showNotice("服务器异常", "failed");
            }
          },
          () => {
            this.$hideLoading();
            this.$showNotice("网络异常", "failed");
          }
        );
      },

      // 角色添加后返回内容
      roleAdded(roleObj) {
        this.roleList.splice(0, 0, roleObj);
        this.displayRoleDialog = false;
      },

      roleEdited(roleObj) {
        this.roleList = this.roleList
          .map((item) => {
            if (item.ID === roleObj.ID) {
              item.ROLE_NAME = roleObj.ROLE_NAME;
            }

            return item;
          })
          .sort(function(a, b) {
            return b.UPD_TIME > a.UPD_TIME ? 1 : -1;
          });
        this.displayRoleDialog = false;
        window.location.href = `/Roleinfo`;
      },

      // 确定删除吗？
      deleteUserInfo(obj) {
        // 点击取消按钮后数组里会有刚刚选中的那条ID,所以要先清空
        this.delRoleId = null;
        this.axiosDeletStatusText = `删除角色${obj.ROLE_NAME}，是否继续？`;
        this.delRoleId = obj.ID;
        this.displayDeletDialog = true;
      },

      // 删除角色
      delCustom() {
        Axios.delete(
          resolveApiRoute("role-info-operation", {
            RoleId: this.delRoleId
          })
        ).then(
          (res) => {
            if (res.data.Code === 0) {
              this.$showNotice("删除成功");

              // 找到已删除的原因
              let index = this.roleList.findIndex((item) => {
                return item.ID === this.delRoleId;
              });

              // 建立副本，用来删除操作
              let workedList = this.roleList.slice(0);
              // 删掉原来位置的原因
              workedList.splice(index, 1);

              this.roleList = workedList;
              window.location.href = `/Roleinfo`;
            } else if (res.data.Code === 2) {
              // 该角色下有用户，不能删除
              this.$showNotice(
                "本角色下有用户，请先更改用户角色权限再删除",
                "failed"
              );
            } else if (res.data.Code === 3) {
              // 该角色下有用户，不能删除
              this.$showNotice("内置角色不可删除。", "failed");
            } else {
              this.$showNotice("删除失败", "failed");
            }
          },
          () => {
            this.$showNotice("网络异常", "failed");
          }
        );
      },

      // 角色列表
      fetchData() {
        this.$showLoading();

        Axios.get(resolveApiRoute("role-info-list")).then(
          (res) => {
            this.$hideLoading();

            if (res.data.Code === 0) {
              // 过滤掉超级管理员,超级管理员不出现在角色列表中
              this.roleList = res.data.Data.Data.filter((item) => {
                // 0: 普通用户
                return item.RoleType !== 1;
              });
            } else {
              this.$showNotice("服务器异常", "failed");
            }
          },
          () => {
            this.$hideLoading();
            this.$showNotice("网络异常", "failed");
          }
        );
      }
    }
  };
</script>

<style lang="scss">
  @import "~__libs/scss/lib-common-utils";

  .role-info {
    padding: sz(10);
    border: 1px solid map-get($colors, dialog-cancel-border);
    background: map-get($colors, pure-white);

    &__bodyctn {
      // title 41 btn 76
      height: calc(100% - 117px);
      overflow: auto;
    }

    &__addbtnbox {
      width: sz(100);
      margin: 0 auto;

      &-addbtn {
        width: sz(100);
        height: sz(34);
        line-height: sz(34);
        margin: sz(30) 0 sz(10) 0;
      }
    }

    &__table {
      @include unify-table-ui();
      table-layout: fixed;
      &-del {
        margin-left: sz(16);
      }

      span,
      b,
      a {
        display: inline-block;
      }

      tr {
        th,
        td {
          @include table-sizes(200, 200, 200, 200);
          white-space: nowrap; //禁止td换行
          overflow: hidden; //隐藏X,Y滚动条
          text-overflow: ellipsis; //将显示不完的以...显示
          padding: 0;

          &:first-child {
            padding: 0 sz(8);
            text-indent: sz(100 - 8);
            width: sz(200);
          }
          &:nth-child(2),
          &:nth-child(3),
          &:nth-child(4) {
            > p {
              @include word-hidden(sz(200));

              margin: 0;
            }

            > div {
              margin-left: sz(8);
            }
            a {
              margin-right: sz(5);

              #{get-bem-root()} & {
                color: map-get($colors, theme-blue);
              }
            }
          }
        }
      }
    }

    // 重置checkbox的样式
    .customize-checkbox {
      margin-top: sz(5);
    }
  }
</style>
