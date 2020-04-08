<template>
  <span
    :class="{
      'switch-btn--disabled': disabled,
      'switch-btn--on': checked,
      'switch-btn--off': !checked
    }"
    class="switch-btn"
    @click="clickHandler">

    <template v-if="checked">
      {{ activeText }}
    </template>
    <template v-else>
      {{ disactiveText }}
    </template>
  </span>
</template>

<script>
  export default {
    name: "switch-btn",

    props: {
      // 样式选择
      checked: {
        type: Boolean,
        default: false
      },
      // 禁用
      disabled: {
        type: Boolean,
        default: false
      },
      // 启用文本
      activeText: {
        type: String,
        default: "ON"
      },
      // 关闭文本
      disactiveText: {
        type: String,
        default: "OFF"
      }
    },

    methods: {
      // 停用启用
      clickHandler() {
        if (!this.disabled) {
          this.$emit("changeValue", !this.checked);
        }
      }
    }
  };
</script>

<style lang="scss">
  @import "~__shared-libs/scss/lib-common-utils";

  .switch-btn {
    @include border-radius(20px);

    display: inline-block;
    cursor: pointer;
    font-weight: normal;
    width: sz(52);
    height: sz(22);
    line-height: sz(22);
    font-size: map-get($font-sizes, xs);
    color: map-get($colors, pure-white);

    &::after {
      @include border-radius(50%);

      content: "";
      display: block;
      width: sz(16);
      height: sz(16);
      background: map-get($colors, pure-white);
      margin-top: sz(3);
    }

    &--disabled {
      cursor: not-allowed;
    }

    &--off {
      background: map-get($colors, border-gray);
      text-indent: sz(2);

      &::after {
        margin-left: sz(3);
        float: left;
      }
    }

    &--on {
      background: map-get($colors, theme-blue);
      text-indent: sz(8);

      &::after {
        margin-right: sz(3);
        float: right;
      }
    }
  }
</style>
