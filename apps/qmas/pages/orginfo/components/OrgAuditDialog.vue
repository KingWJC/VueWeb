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
        <div class="org-audit-dialog__access"
          style="margin-left:20px">
          <div style="height:30px">
            <h3 class="org-audit-dialog__access-title">审结结果</h3>
          </div>
          <div class="org-audit-dialog__body-userloginname clearfix">
            <div class="checkbox-div">
              <customize-checkbox
                v-model="adResult"
                :hasText="true"
                :allowEmpty="false"
                :value="1"
                type="radio"
                txt="通过">
              </customize-checkbox>
            </div>
            <div class="checkbox-div">
              <customize-checkbox
                v-model="adResult"
                :hasText="true"
                :allowEmpty="false"
                :value="2"
                type="radio"
                txt="不通过">
              </customize-checkbox>
            </div>

          </div>


          <div class="org-audit-dialog__body-userloginname clearfix">
            <div style="height:30px">
              <h3 class="org-audit-dialog__access-title">备注</h3>
            </div>
            <textarea
              v-model="remark"
              style="height:130px;width:400px"
              class="org-audit-dialog__body-userloginname-editinput"
              type="text"
              placeholder="请输入"
              maxlength="200"
            ></textarea>
          </div>

          <div class="org-audit-dialog__access-content"></div>
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
  import BasicDialog from "__shared-libs/components/dialog/BasicDialog";
  import CustomizeCheckbox from "__shared-libs/components/CustomizeCheckbox";

  export default {
    name: "org-audit-dialog",

    components: {
      CustomizeCheckbox
    },

    mixins: [BasicDialog],

    props: {
      logicClassName: {
        type: String,
        default: "org-audit-dialog"
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

        orgId: "",
        title: "用户审核",
        // 审核结果
        adResult: "",
        // 备注
        remark: ""

      };
    },

    computed: {

    },

    methods: {

      // 编辑 初始化对话框
      initDialog() {
        if (this.userData != null) {
          (this.orgId = this.userData.OrgID);
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
          logicClassName: "org-audit-dialog-notice"
        });
      },

      // 点击确认按钮
      okBtnClick() {
        // 没选择
        if (this.adResult.length === 0) {
          this.networkExceptional("请选择审核结果");

          return false;
        }

        this.$emit("dialogOkClicked", {
          OrgID: this.orgId,
          AdResult: this.adResult,
          Remark: this.remark
        });
      }

    }
  };
</script>

<style lang="scss">
  @import "~__libs/scss/lib-common-utils";

  .checkbox-div {
    width: 150px;
    float: left;
    margin-left: 20px;
  }
  .org-audit-dialog {
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

    // 重定义 notice 在当前视图下的宽度, 使用 @at-root 编译到当前
    // BEM 最下面（具体参照css编译码）
    @at-root {
      .org-audit-dialog-notice {
        width: sz(417);
      }
    }
  }
</style>
