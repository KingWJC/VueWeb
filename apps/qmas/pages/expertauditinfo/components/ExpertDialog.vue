<template>
  <teleporter>
    <div
      :style="dialogStyles"
      :class="[
        {'hide': !display},
        logicClassName
      ]"
      class="dialog"
    >
      <div class="dialog__header clearfix">
        <h3>{{ title }}</h3>
        <a title="取消"
          href="javascript:;"
          class="dialog__closebtn"
          @click="headerCloseBtnClick"></a>
      </div>

      <div class="dialog__body">
        <div class="expert-dialog__access"
          style="margin-left:20px">
          <div style="height:30px">
            <h3 class="expert-dialog__access-title">审核意见</h3>
            <p class="hide">{{ expertAuditId }}</p>
          </div>
          <div class="expert-dialog__body-userloginname clearfix">
            <select v-model="acResult"
              class="expert-dialog__body-userloginname-editinput">
              <option value>请选择</option>
              <option
                v-for="(item,index) in selectAcResult"
                :key="index"
                :value="item.Code"
              >{{ item.Name }}</option>
            </select>
          </div>


          <div class="expert-dialog__body-userloginname clearfix">
            <div style="height:30px">
              <h3 class="expert-dialog__access-title">备注</h3>
            </div>
            <textarea
              v-model="remark"
              style="height:130px;width:400px"
              class="expert-dialog__body-userloginname-editinput"
              type="text"
              placeholder="请输入"
              maxlength="200"
            ></textarea>
          </div>

          <div class="expert-dialog__access-content"></div>
        </div>
      </div>

      <div class="dialog__footer">
        <template>
          <a
            href="javascript:;"
            class="btn btn--white dialog__footer-btn dialog__footer-btn-cancel"
            @click="cancelBtnClick"
          >{{ dialogFooterCancelBtnText }}</a>

          <a
            href="javascript:;"
            class="btn dialog__footer-btn dialog__footer-btn-ok"
            @click="okBtnClick"
          >{{ dialogFooterOkBtnText }}</a>
        </template>
      </div>
    </div>
  </teleporter>
</template>

<script>
  import Axios from "axios";
  import BasicDialog from "__shared-libs/components/dialog/BasicDialog";
  import CheckboxGroup from "__shared-libs/components/CheckboxGroup";
  import resolveApiRoute from "__libs/js/modules/resolve-api-route";

  export default {
    name: "expert-dialog",

    components: {
      CheckboxGroup
    },

    mixins: [BasicDialog],

    props: {
      logicClassName: {
        type: String,
        default: "expert-dialog"
      },

      userData: {
        type: Object,
        default() {
          return null;
        }
      }
    },

    data() {
      return {
        // 新创建的用户如果没选择角色，需要给出提示
        isHide: true,
        selectAcResult: [
          {
            Code: 1,
            Name: "初级"
          },
          {
            Code: 2,
            Name: "中级"
          },
          {
            Code: 3,
            Name: "高级"
          },
          {
            Code: 4,
            Name: "不通过"
          }
        ],

        // 专家审核ID
        expertAuditId: "",
        // 状态ID
        stateId: "",
        title: "",
        // 认证结果
        acResult: "",
        // 备注
        remark: "",
        // 系统建议等级
        systemSuggestLevel: "",
        acApplyId: ""

      };
    },

    computed: {

    },

    methods: {

      // 编辑 初始化对话框
      initDialog() {
        if (this.userData != null) {
          (this.expertAuditId = this.userData.expertAuditId),
          (this.acApplyId = this.userData.acApplyId),
          (this.stateId = this.userData.stateId),
          (this.title = this.userData.title),
          (this.acResult = this.userData.acResult),
          (this.suggestText = this.userData.suggestText),
          (this.systemSuggestLevel = this.userData.systemSuggestLevel);
        }
      },

      close() {
        if (this.allowClosing) {
          // 关闭之前隐藏提示信息
          this.isHide = true;
          this.$emit("closeDialog");
        }
      },

      // 网络异常
      networkExceptional(titleName) {
        this.$showNotice({
          noticeText: titleName,
          noticeType: "failed",
          logicClassName: "expert-dialog-notice"
        });
      },

      // 点击确认按钮
      okBtnClick() {
        // 没选择评价科室
        if (this.acResult.length === 0) {
          this.networkExceptional("请选择审核意见");

          return false;
        }

        if (this.systemSuggestLevel == "初级" &&
        (this.acResult == "2" || this.acResult == "3")) {
          this.networkExceptional("不能选择比系统建议级别高的级别");

          return false;
        } else if (this.systemSuggestLevel == "中级" && this.acResult == "3") {
          this.networkExceptional("不能选择比系统建议级别高的级别");

          return false;
        }

        Axios.post(resolveApiRoute("expert-audit-submit"), {
          ExpertAuditId: this.expertAuditId,
          StateId: this.stateId,
          AcResult: this.acResult,
          Remark: this.remark
        }).then(
          (res) => {
            if (res.data.Code === 0) {
              // 刷新主页面
              this.$emit("dialogOkClicked", {
                STATE_ID: this.expertAuditId,
                AC_APPLY_ID: this.acApplyId
              });
              window.location.href = `/ExpertAuditInfo`;
            } else if (res.data.Code === 2) {
              this.networkExceptional("用户数据异常修改失败, 请刷新重试!");
            } else {
              this.networkExceptional("服务器错误");
            }
          },
          () => {
            this.networkExceptional("网络错误");
          }
        );
      }

    }
  };
</script>

<style lang="scss">
  @import "~__libs/scss/lib-common-utils";

  .expert-dialog {
    @include dialog-css(sz(460), sz(350));

    .dialog__body {
      padding: sz(20) 0 0;
      text-align: left;
    }

    &__body {
      &-userloginname,
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

        .select-dropdown-v2-options {
          &__items-item-text {
            font-size: map-get($font-sizes, xs);
          }
        }

        &-editinput,
        &-editinputuser,
        &-editinputmm {
          font-size: map-get($font-sizes, xs);
          color: map-get($colors, dialog-text-color);
          @include placeholder-color(map-get($colors, placeholder-text-color));
          @include border-radius(5px);

          float: left;
          width: sz(270);
          height: sz(34);
          border: none;
          border: 1px solid map-get($colors, dialog-input-border);
          padding-left: sz(10);
          margin-left: sz(10);

          &:focus {
            border: 1px solid map-get($colors, theme-blue);
          }
        }
      }
    }

    &__function {
      &-title {
        font-size: inherit;
        margin: 0 0 0 sz(22);
        height: sz(16);
        line-height: sz(16);
      }

      &-content {
        @include border-radius(5px);

        margin: sz(10) 0 0 sz(22);
        width: sz(540);
        height: sz(34);

        &-title {
          float: left;
          line-height: sz(34);
        }

        &-warning {
          margin-left: sz(10);
          line-height: sz(35);
          color: map-get($colors, theme-red);
        }

        &-mul {
          width: sz(180);
          float: left;
          margin: 0 0 0 sz(10);

          .select-dropdown-v2 {
            width: sz(180);
            height: sz(34);

            &__selected {
              height: sz(32);
              border-color: map-get($colors, dialog-input-border);

              &-plain,
              &-placeholder {
                height: sz(32);
                line-height: sz(32);
                font-size: map-get($font-sizes, xs);
              }
            }
          }

          .select-dropdown-v2-options {
            &__items-item-text {
              font-size: map-get($font-sizes, xs);
            }
          }
        }
      }
    }

    &__access {
      margin-top: sz(18);
      position: relative;
      border: 1px solid transparent;

      &-title {
        margin: 0 0 0 sz(22);
        font-size: inherit;
        position: absolute;
      }

      &-content {
        margin: sz(18) auto;
        border: 1px solid transparent;

        &-op {
          float: right;
          margin-top: sz(-3);
          line-height: sz(24);
          cursor: default;

          &:link,
          &:visited {
            color: map-get($colors, placeholder-text-color);
          }

          &--canclick {
            cursor: pointer;

            &:link,
            &:visited {
              color: map-get($colors, theme-blue);
            }
          }

          &--noindex {
            cursor: not-allowed;
          }
        }
      }
    }

    .checkbox-group {
      width: sz(555);
      margin: sz(20) sz(10) 0 sz(10);

      &__contxt {
        max-height: sz(118);
        overflow: auto;

        &-alls {
          margin-bottom: sz(10);
          padding-bottom: 0;
        }
      }

      &:nth-child(1) {
        .checkbox-group__contxt {
          max-height: sz(118);
          overflow-y: auto;
        }
      }

      &:nth-child(2) {
        margin-top: sz(30);

        .checkbox-group__contxt {
          max-height: sz(128);
          overflow-y: auto;

          &-alls {
            @extend %clearfix;

            width: sz(249);
            margin-right: 0;

            .customize-checkbox {
              float: left;

              &__label {
                @include word-hidden(sz(167), max-width);
              }
            }

            &:nth-child(even) {
              margin-left: sz(20);
            }
          }
        }
      }
    }

    // 重定义 notice 在当前视图下的宽度, 使用 @at-root 编译到当前
    // BEM 最下面（具体参照css编译码）
    @at-root {
      .expert-dialog-notice {
        width: sz(417);
      }
    }
  }
</style>
