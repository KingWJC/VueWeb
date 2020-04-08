<template>
  <div v-if="roleList"
    class="template-info">
    <table class="template-info__table">
      <thead class="template-info__table-header">
        <tr>
          <th>应用页面</th>
          <th>当前模板</th>
          <th>模板数量</th>
          <th>操作人</th>
          <th>更新时间</th>
          <th>操作</th>
        </tr>
      </thead>
    </table>

    <div class="template-info__bodyctn">
      <table class="template-info__table">
        <tbody class="template-info__table-body">
          <tr
            v-for="(item, index) in roleList"
            :key="index"
            class="template-info__table-body-review"
          >
            <td>{{ item.TMP_CODE }}</td>
            <td>
              <template v-if="item.DOC_LIST">
                <p
                  v-for="(item1, index) in item.DOC_LIST.split(',')"
                  :key="index"
                  :title="index+1+'、'+item1"
                  v-text="index+1+'、'+item1"
                ></p>
              </template>
            </td>
            <td>{{ item.TemplateCount }}</td>
            <td>{{ item.CREATE_USER_ID }}</td>
            <td>{{ item.UPD_TIME }}</td>
            <td>
              <a
                href="javascript:;"
                class="template-info__table-edit"
                @click="editUserInfo(item)"
              >编辑</a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="template-info__addbtnbox">
      <!-- <a href="javascript:;"
        class="btn template-info__addbtnbox-addbtn"
        @click="addRole">添加模板</a> -->
    </div>
    <template-dialog
      :display="showTemplateDialog"
      :dialogHeaderCloseBtn="true"
      :userData="userData"
      @closeDialog="showTemplateDialog=false"
      @dialogOkClicked="dialogOkClicked"
    ></template-dialog>
  </div>
</template>

<script>
  import Axios from "axios";
  import resolveApiRoute from "__libs/js/modules/resolve-api-route";
  import TemplateDialog from "./TemplateDialog";
  export default {
    name: "role-info",

    components: {
      TemplateDialog
    },

    data() {
      return {
        userData: null,
        // 角色列表
        roleList: null,
        checkModels: [],
        delRoleId: null,

        // 角色权限对话框
        displayRoleDialog: false,
        roleDialogView: "create",

        // 确定删除对话框吗？
        displayDeletDialog: false,
        axiosDeletStatusText: null,

        // 确定清空密码对话框吗？
        displayEmptyDialog: false,
        axiosEmptyStatusText: null,
        showTemplateDialog: false,
        // 角色对话框数据
        roleInfoData: null
      };
    },

    mounted() {
      this.fetchData();
    },

    methods: {
      // 专家审核
      editUserInfo(roleObj) {
        this.userData = {
          id: roleObj.ID,
          templateName: roleObj.TMP_CODE,
          title: "模板编辑"
        };
        this.showTemplateDialog = true;
      },
      // 编辑
      // editUserInfo(roleObj) {
      //   let name = encodeURI(encodeURI(roleObj.TMP_CODE));
      //   window.location.href =
      // `/TemplateDetail?id=${roleObj.ID}&name=${name}`;
      // },
      // 添加角色
      addRole() {
        window.location.href = `/TemplateDetail`;
      },
      // 刷新数据
      dialogOkClicked() {
        this.fetchData();
      },
      // 角色列表
      fetchData() {
        this.$showLoading();

        Axios.get(resolveApiRoute("template-info-list")).then(
          (res) => {
            this.$hideLoading();

            this.roleList = res.data.Data.Data.filter((temp) => {
              return temp.ID !== "1";
            });
            // this.roleList = res.data.Data.Data;
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

  .template-info {
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
      // margin: 0 auto;

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
          @include table-sizes(150, 200, 100, 100, 100, 80);

          &:first-child {
            padding: 0 sz(8);
            text-indent: sz(10);
          }
          &:nth-child(2) {
            // text-align: left;
            > p {
              @include word-hidden(sz(300));
              line-height: 30px;
              margin: 0;
            }
          }

          &:nth-child(3) {
            text-align: center;
          }
          &:nth-child(4) {
            > p {
              @include word-hidden(sz(150));

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
