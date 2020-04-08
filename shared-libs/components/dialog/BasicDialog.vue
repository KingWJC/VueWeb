<template>
  <teleporter>
    <div :style="dialogStyles"
      :class="[
        {
          'hide': !display,
          'dialog--fullscreen': fullscreen
        },
        logicClassName
      ]"
      class="dialog">
      <template v-if="dialogHeader">
        <div class="dialog__header clearfix">
          <slot name="header">
            <template v-if="dialogHeaderTitle">
              <h3>{{ dialogHeaderTitle }}</h3>
            </template>

            <template v-if="dialogHeaderCloseBtn">
              <a :title="dialogFooterCancelBtnText"
                href="javascript:;"
                class="dialog__closebtn"
                @click="headerCloseBtnClick">×</a>
            </template>
          </slot>
        </div>
      </template>

      <template v-if="dialogBody">
        <div class="dialog__body">
          <slot name="body">{{ dialogBody }}</slot>
        </div>
      </template>

      <template v-if="dialogFooter">
        <div class="dialog__footer">
          <slot name="footer">
            <template v-if="dialogFooterCancelBtn">
              <a href="javascript:;"
                class="btn dialog__footer-btn dialog__footer-btn-cancel"
                @click="cancelBtnClick">
                {{ dialogFooterCancelBtnText }}
              </a>
            </template>

            <template v-if="dialogFooterOkBtn">
              <a href="javascript:;"
                class="btn dialog__footer-btn dialog__footer-btn-ok"
                @click="okBtnClick">
                {{ dialogFooterOkBtnText }}
              </a>
            </template>
          </slot>
        </div>
      </template>
    </div>
  </teleporter>
</template>

<script>
  import Vue from "vue";
  import $ from "jquery";
  import getDomSize from "__shared-libs/js/modules/get-dom-size";
  import toggleBodyOverflow from "__shared-libs/js/modules/toggle-body-overflow";

  import {
    requestOverlay,
    removeOverlay
  } from "__shared-libs/js/modules/overlay";

  import {
    getTopZIndex,
    getNextZIndex,
    pushZIndex,
    pullZIndex
  } from "__shared-libs/js/modules/zindex-stack";

  const BasicDialog = Vue.extend({
    name: "basic-dialog",

    props: {
      display: {
        type: Boolean,
        default: true
      },

      // 是否全屏模式（无滚动条情况下全屏占满视口）
      // 如果是全屏模式，对话框不可给宽高，确认取消按钮可能需要手工维护到 dialog__body 区
      fullscreen: {
        type: Boolean,
        default: false
      },

      logicClassName: {
        type: String,
        default: null
      },

      // whether the dialog is allowed to be closed, if set to true, any
      // 'close' event will not get emitted.
      allowClosing: {
        type: Boolean,
        default: true
      },

      dialogHeader: {
        type: Boolean,
        default: true
      },

      dialogHeaderTitle: {
        type: String,
        default: "提示"
      },

      dialogHeaderCloseBtn: {
        type: Boolean,
        default: false
      },

      // allow clicking on the header button to close the dialog
      // only works when dialogHeaderCloseBtn set to true
      dialogHeaderCloseBtnClickToClose: {
        type: Boolean,
        default: true
      },

      dialogBody: {
        type: String,
        default: "body content goes here"
      },

      dialogFooter: {
        type: Boolean,
        default: true
      },

      dialogFooterOkBtn: {
        type: Boolean,
        default: true
      },

      dialogFooterOkBtnText: {
        type: String,
        default: "确定"
      },

      dialogFooterCancelBtn: {
        type: Boolean,
        default: true
      },

      dialogFooterCancelBtnText: {
        type: String,
        default: "取消"
      },

      dialogMask: {
        type: Boolean,
        default: true
      },

      // allow clicking on the dialog to close the dialog
      dialogMaskClickToClose: {
        type: Boolean,
        default: false
      },

      // only works with dialogMask set to `true`
      dialogMaskOpacity: {
        type: Number,
        default: 0.5
      }
    },

    data() {
      return {
        // {
        //   top <Number + px>
        //   z-index {Number}
        //   margin-top {Number + px:Optional, default: 'auto'}
        // }
        dialogStyles: null
      };
    },

    watch: {
      // make sure the dialog always shows at the same position in the viewport
      display(newV) {
        // 对话框被打开
        if (newV) {
          // 默认从最初层级开始，然后隔2递增（留1层给遮罩）
          pushZIndex(getNextZIndex());

          requestOverlay({opacity: this.dialogMaskOpacity});

          this.resetPosition();
          this.initDialog();
        } else {
          // restore to previous dialog's z-index(if any)
          pullZIndex();
          removeOverlay();
        }

        toggleBodyOverflow();
      }
    },

    methods: {
      // will be called everytime the dialog shows.
      initDialog() {
        // NO-OP
      },

      okBtnClick() {
        this.$emit("okClicked");
        this.close();
      },

      cancelBtnClick() {
        this.$emit("cancelClicked");
        this.close();
      },

      // remove the instance
      close() {
        if (this.allowClosing) {
          this.$emit("closeDialog");
        }
      },

      // dialog clicked
      maskClick() {
        if (this.dialogMaskClickToClose) {
          this.close();
        }
      },

      // close button of the header clicked
      headerCloseBtnClick() {
        if (this.dialogHeaderCloseBtnClickToClose) {
          this.close();
        }
      },

      // reset the position of the dialog when it is open.
      resetPosition() {
        // this functions exists to override the parent method, and return
        // a no-op since it's 'absolute'-positioned and no need to re-caculate
        // it's position.
        // TODO: make an abstract layer to put this logic for 'absolutely'
        // positioned dialogs
        this.$nextTick(() => {
          // dom更新以后获取宽高
          let domEl = getDomSize($(this.$el));
          let domHeight = domEl.height;
          let domWidth = domEl.width;
          let styles = {
            "margin-top": `${-domHeight / 2}px`,
            "margin-left": `${-domWidth / 2}px`,
            "z-index": getTopZIndex()
          };

          // 如果是全屏模式，归零 margin，top，left
          if (this.fullscreen) {
            Object.assign(styles, {
              "margin-left": "0px",
              "margin-top": "0px",
              left: "0px",
              top: "0px"
            });
          }

          this.dialogStyles = styles;
        });
      }
    }
  });

  export default BasicDialog;
</script>

<style lang="scss">
  @import "~__shared-libs/scss/lib-common-utils";

  /// Basic dialog
  .dialog {
    @include box-shadow(6px 6px 14px rgba(map-get($colors, pure-black), 0.2));
    @include border-radius(5px);

    // 针对于视图定位,不针对于文档定位
    position: fixed;
    top: 50%;
    left: 50%;
    z-index: $dialog-base-layer;
    background: map-get($colors, pure-white);

    &__header {
      @include border-radius(5px 5px 0 0);

      height: sz(40);
      background: map-get($colors, theme-blue);

      h3 {
        margin: 0;
        height: sz(40);
        font-weight: normal;
        font-size: map-get($font-sizes, sm);
        line-height: sz(40);
        text-align: center;
        color: map-get($colors, pure-white);
      }
    }

    &__closebtn {
      position: absolute;
      right: 0;
      top: 0;
      width: sz(40);
      height: sz(40);
      background: url("~__shared-libs/imgs/close.png") no-repeat center center;
      padding: 0;
      font-size: sz(18);
      line-height: 1;

      &:hover,
      &:active,
      &:link {
        color: inherit;
      }
    }

    &__footer {
      @include border-radius(0 0 5px 5px);

      margin: 0;
      padding: 0;
      height: sz(54);
      border-top: none;

      text-align: center;

      // display: none;
      &-btn {
        @include border-radius(5px);

        height: sz(28);
        line-height: sz(28);

        &-cancel {
          margin-right: sz(40 - 4);
        }
      }
    }

    &__body {
      background: map-get($colors, pure-white);
      padding: 0 sz(10);
      // TODO: split business-specific logic
      text-align: center;
    }

    // 全屏模式，宽高都为 100%
    &--fullscreen {
      // 全屏模式自身没有圆角
      @include border-radius(0);
      // 也没有阴影
      @include box-shadow(none);

      width: 100%;
      height: 100%;

      // 全屏模式 header 区没有圆角
      #{get-bem-root()}__header {
        @include border-radius(0);
      }
    }
  }
</style>
