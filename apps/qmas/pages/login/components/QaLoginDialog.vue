<template>
  <teleporter>
    <div :style="dialogStyles"
      :class="[
        {'hide': !display},
        logicClassName
      ]"
      class="dialog">
      <div class="dialog__header clearfix">
        <h3>找回密码</h3>

        <a title="取消"
          href="javascript:;"
          class="dialog__closebtn"
          @click="headerCloseBtnClick">×</a>
      </div>

      <div class="dialog__body">
        <div class="qa-login-dialog__content">
          <p>请联系管理员020-88888888，帮您重置密码</p>
        </div>
      </div>

      <div class="dialog__footer">
        <a href="javascript:;"
          class="btn dialog__footer-btn dialog__footer-btn-ok"
          @click="okBtnClick">
          {{ dialogFooterOkBtnText }}
        </a>
      </div>
    </div>
  </teleporter>
</template>

<script>
  import BasicDialog from "__shared-libs/components/dialog/BasicDialog";

  export default {
    name: "qa-login-dialog",

    mixins: [BasicDialog],

    props: {
      logicClassName: {
        type: String,
        default: "qa-login-dialog"
      }
    }
  };
</script>

<style lang="scss">
  @import "~__libs/scss/lib-common-utils";

  .qa-login-dialog {
    width: sz(420);
    height: sz(180);

    .dialog__header {
      @include border-radius(4px);

      position: relative;
      background: map-get($colors, pure-white);

      h3 {
        font-weight: bold;
        font-size: map-get($font-sizes, sm);
        color: map-get($colors, text-main);
        padding-top: sz(20);
      }
    }

    .dialog__closebtn {
      position: absolute;
      top: 0;
      right: 0;
      color: map-get($app-colors, input-border);
      font-size: sz(30);
    }

    .dialog__body {
      padding-top: sz(30);
    }

    .dialog__footer {
      margin-top: sz(22);
      padding-bottom: sz(20);

      &-btn {
        @include border-radius(4px);

        width: sz(80);
        height: sz(34);
        line-height: sz(34);
      }
    }

    &__content {
      p {
        margin: 0;
        padding: 0;
        color: map-get($app-colors, switch-dialog-color);
      }
    }
  }
</style>
