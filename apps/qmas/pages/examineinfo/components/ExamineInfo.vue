<template>
  <div v-if="roleList" 
    class="examine-info">
    <div>
      <div>说明：</div>
      <div style="height:100px">
        <p>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;审核标准中填写的分数为对应级别
          需要达到的最低分，如材料评审标准设置为初级60分、
          中级70分、高级80分，那么当某机构材料审核得分为75时，系统判定其该项评审级别为中级
          系统最终建议评级为基本要求、材料评审、数据评审、现场评审四项评审内容中级别最低的结果，
          如某机构四项评审级别分别为中级、高级、高级、中级，那么该机构的系统最终建议级别为中级。
        </p>
      </div>
    </div>
    <h3>审核标准</h3>
    <table class="examine-info__table">
      <thead class="examine-info__table-header">
        <tr>
          <th>审核类型</th>
          <th>初级</th>
          <th>中级</th>
          <th>高级</th>
        </tr>
      </thead>
      <tbody class="examine-info__table-body">
        <tr v-for="(item, index) in roleList" 
          :key="index" 
          class="examine-info__table-body-review">
          <td>{{ item.STAND_NAME }}</td>
          <td>
            <input
              v-model="item.BASE_VALUE"
              type="number"
              class="examine-info__body-userloginname-editinput"
              @mouseleave="handleInput1(item)"
            />
          </td>
          <td>
            <input
              v-model="item.MIDDLE_VALUE"
              type="number"
              class="examine-info__body-userloginname-editinput"
              @mouseleave="handleInput2(item)"
            />
          </td>
          <td>
            <input
              v-model="item.HIGH_VALUE"
              type="number"
              class="examine-info__body-userloginname-editinput"
              @mouseleave="handleInput3(item)"
            />
          </td>
        </tr>
      </tbody>
    </table>
    <br />
    <div class="dialog__footer">
      <a
        href="javascript:;"
        class="btn btn--white dialog__footer-btn dialog__footer-btn-cancel"
        @click="cancel"
      >取消</a>
      <a href="javascript:;" 
        class="btn dialog__footer-btn dialog__footer-btn" 
        @click="update">确定修改</a>
    </div>

    <!-- <template-control-dialog
      :display="displayRoleDialog"
      :dialogHeaderCloseBtn="true"
      :roleInfoData="roleInfoData"
      :view="roleDialogView"
      @closeDialog="displayRoleDialog=false"
      @roleAdded="roleAdded"
      @roleEdited="roleEdited">
    </template-control-dialog>-->
  </div>
</template>

<script>
  import Axios from "axios";
  import resolveApiRoute from "__libs/js/modules/resolve-api-route";

  export default {
    name: "examine-info",

    components: {
      // TemplateControlDialog
    },

    data() {
      return {
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

        // 角色对话框数据
        roleInfoData: null,
        isSaved: true
      };
    },

    mounted() {
      this.fetchData();
    },

    methods: {
      // 输入框只能输入正整数
      handleInput1(item) {
        if (!/^\d+$/.test(item.BASE_VALUE)) {
          this.$showNotice("输入框仅支持输入正整数", "failed");
          this.isSaved = false;
        } else {
          if (
            item.BASE_VALUE >= item.MIDDLE_VALUE ||
            item.BASE_VALUE >= item.HIGH_VALUE
          ) {
            this.isSaved = false;
            this.$showNotice("初级值应小于中级值和高级之", "failed");
          }
        }
      },
      handleInput2(item) {
        if (!/^\d+$/.test(item.MIDDLE_VALUE)) {
          this.isSaved = false;
          this.$showNotice("输入框仅支持输入正整数", "failed");
        } else {
          if (
            item.BASE_VALUE >= item.MIDDLE_VALUE ||
            item.MIDDLE_VALUE >= item.HIGH_VALUE
          ) {
            this.isSaved = false;
            this.$showNotice("中级值应大于初级值且小于高级值", "failed");
          }
        }
      },
      handleInput3(item) {
        if (!/^\d+$/.test(item.HIGH_VALUE)) {
          this.isSaved = false;
          this.$showNotice("输入框仅支持输入正整数", "failed");
        } else {
          if (
            item.BASE_VALUE >= item.HIGH_VALUE ||
            item.MIDDLE_VALUE >= item.HIGH_VALUE
          ) {
            this.isSaved = false;
            this.$showNotice("高级值应大于初级值且大于中级值", "failed");
          }
        }
      },
      // 编辑
      cancel() {
        this.fetchData();
      },

      // 添加角色
      update() {
        this.isSaved = true;
        this.roleList.forEach((item) => {
          this.handleInput1(item);
          this.handleInput2(item);
          this.handleInput3(item);
        });

        if (this.isSaved) {
          Axios.post(resolveApiRoute("examine-info-list"), this.roleList).then(
            (res) => {
              if (res.data.Code === 0) {
                this.$showNotice("更新成功", "success");
                this.fetchData();
              } else {
                this.showError("操作失败");
              }
            },
            () => {
              this.$hideLoading();
              this.$showNotice("网络异常", "failed");
            }
          );
        }
      },
      // 角色列表
      fetchData() {
        this.$showLoading();

        Axios.get(resolveApiRoute("examine-info-list")).then(
          (res) => {
            this.$hideLoading();
            this.roleList = res.data.Data.Data;
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

  .examine-info {
    @include border-radius(5px);
    padding: sz(10);
    border: 1px solid map-get($colors, dialog-cancel-border);
    background: map-get($colors, pure-white);

    &__body {
      &-userloginname,
      &-doctor,
      &-doctoradd,
      &-doctorinput {
        margin: sz(12) 0 0 0;
        height: sz(34);
        line-height: sz(34);

        &-span {
          display: inline-block;
          width: sz(150);
          height: 100%;
          text-align: right;
          float: left;
        }

        &-editinput,
        &-editinputuser,
        &-editinputmm {
          font-size: map-get($font-sizes, xs);
          color: map-get($colors, dialog-text-color);
          @include placeholder-color(map-get($colors, placeholder-text-color));
          @include border-radius(5px);

          float: left;
          width: sz(180);
          height: sz(30);
          border: none;
          border: 1px solid map-get($colors, dialog-input-border);
          padding-left: sz(10);
          // margin-left: sz(10);

          &:focus {
            border: 1px solid map-get($colors, theme-blue);
          }
        }

        &-editinputuser {
          background: map-get($colors, pure-white);
          border: none;
        }

        &-editinputmm {
          color: map-get($colors, dialog-disabled-text-color);
          background: map-get($colors, dialog-input-disabled-bg);
          font-size: map-get($font-sizes, xs);
        }

        &-mustwrite {
          float: left;
          font-size: sz(25);
          margin-left: sz(10);
          color: map-get($app-colors, error-text-color);
          margin-top: sz(5);
          height: sz(27);
        }
      }

      &-userloginname {
        margin: 0;
      }

      &-gender,
      &-genderAdd,
      &-genderedit,
      &-oneself {
        margin-top: sz(30);
        height: sz(14);
        line-height: sz(14);

        &-span {
          display: inline-block;
          width: sz(150);
          height: 100%;
          text-align: right;
          float: left;
        }

        .customize-checkbox {
          float: left;
          margin-left: sz(10);

          &__radio {
            width: sz(12);
            height: sz(12);
          }

          &__label {
            vertical-align: middle;
            margin-left: sz(5);
            line-height: sz(14);
            height: sz(14);
            color: map-get($colors, dialog-text-color);
          }

          &:last-child {
            margin-left: sz(34);
          }

          &--active {
            .customize-checkbox__radio {
              width: sz(4);
              height: sz(4);
            }
          }
        }
      }

      &-genderAdd,
      &-genderedit,
      &-oneself {
        margin-top: 0;
      }

      &-oneself {
        &-span {
          width: sz(206);
        }
      }
    }

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

      > tbody tr {
        cursor: default;

        td {
          @include table-sizes(100, 200, 200, 200);

          // &:nth-child(1) {
          //   padding-left: sz(10);
          // }

          &:nth-child(5) {
            div {
              @include word-hidden(sz(385), max-width);
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
