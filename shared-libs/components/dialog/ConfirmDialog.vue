<template>
  <teleporter>
    <div :style="dialogStyles"
      :class="[
        'confirm-dialog',
        {'hide': !display},
        logicClassName
      ]"
      class="dialog">
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

      <div class="dialog__body">
        <slot name="body">
          <div class="confirm-dialog__text">
            <b class="confirm-dialog__text-icon">
              <img src="~__shared-libs/imgs/exclamation.png" />
            </b>

            <p
              :class="{
                'confirm-dialog__text-conter--verbose': dialogBodyVerbose
              }"
              class="confirm-dialog__text-conter">
              {{ dialogBody }}
            </p>
          </div>
        </slot>
      </div>

      <div class="dialog__footer clearfix">
        <slot name="footer">
          <template v-if="dialogFooterOkBtn">
            <a href="javascript:;"
              class="btn dialog__footer-btn dialog__footer-btn-ok"
              @click="okBtnClick">
              {{ dialogFooterOkBtnText }}
            </a>
          </template>

          <template v-if="dialogFooterCancelBtn">
            <a href="javascript:;"
              class="
                btn
                btn--white
                dialog__footer-btn
                dialog__footer-btn-cancel
              "
              @click="cancelBtnClick">
              {{ dialogFooterCancelBtnText }}
            </a>
          </template>
        </slot>
      </div>
    </div>
  </teleporter>
</template>

<script>
  import BasicDialog from "__shared-libs/components/dialog/BasicDialog";

  export default {
    name: "confirm-dialog",

    mixins: [BasicDialog],

    props: {
      dialogHeaderCloseBtn: {
        type: Boolean,
        default: true
      }
    },

    computed: {
      // 内容太长？超过25个汉字（75个字节）则文案相对icon要下移
      // 如果容器宽度变了，就要重新计算可以显示下的字节数（以及字体发生变化）
      dialogBodyVerbose() {
        // 一行 25 个字（75个字节）
        let oneline = 25 * 3;

        return encodeURI(this.dialogBody).split(/%..|./).length - 1 <= oneline;
      }
    }
  };
</script>

<style lang="scss">
  @import "~__shared-libs/scss/lib-common-utils";

  .confirm-dialog {
    width: sz(420);
    height: sz(180);

    .dialog__header {
      padding: sz(20) sz(20) 0 sz(20);
      height: sz(16);
      text-align: left;
      background: none;

      h3 {
        float: left;
        text-align: left;
        height: sz(16);
        line-height: sz(16);
        color: map-get($colors, text-main);
        font-size: map-get($font-sizes, sm);
      }
    }

    .dialog__closebtn {
      // 确定对话框使用浮动布局，取消绝对定位布局
      position: static;
      float: right;
      padding: 0;
      font-size: sz(28);
      color: map-get($colors, text-light);
      line-height: sz(12);
      height: sz(12);
      width: sz(12);
    }

    .dialog__body {
      padding: 0;
      margin: sz(20) sz(20) 0;
      height: sz(70);
      text-align: left;
    }

    .dialog__footer {
      margin-top: 0;
      padding: 0 sz(20) 0 0;

      &-btn {
        width: sz(58);
        float: right;

        &-cancel {
          margin-right: sz(10);
        }
      }
    }

    &__text {
      position: relative;
      border: 1px solid transparent;

      &-icon {
        position: absolute;
        top: 0;
        left: 0;

        img {
          display: block;
          width: sz(35);
          height: sz(35);
        }
      }

      &-conter {
        margin: sz(7) 0 0 0;
        padding-left: sz(35 + 10);
        line-height: sz(23);
        color: map-get($colors, dialog-text-color);
      }
    }
  }
</style>
