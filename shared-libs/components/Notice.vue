<template>
  <div :style="noticeStyles"
    :class="[
      `notice--${noticeType}`,
      logicClassName
    ]"
    class="notice">
    <slot name="body">
      <p class="notice__text">{{ noticeText }}</p>
    </slot>
  </div>
</template>

<script>
  export default {
    name: "notice",

    props: {
      // 超时自动发送关闭事件，默认1秒后关闭
      timeout: {
        type: Number,
        default: 1000
      },

      logicClassName: {
        type: String,
        default: null
      },

      // 提示类型：successful / failed
      noticeType: {
        type: String,
        default: "successful",
        // only support the given types
        validator(type) {
          return [
            "successful",
            "failed"
          ].indexOf(type) > -1;
        }
      },

      // 提示内容
      noticeText: {
        type: String,
        default: "提示"
      },

      // Notice 设计为异步组件，noticeStyles 从外部传入
      noticeStyles: {
        type: Object,
        default() {
          return null;
        }
      }
    },

    data() {
      return {
        // set a reference to the automatic close timer.
        debounceTimer: null
      };
    },

    // 一旦被挂载，就触发定时器
    mounted() {
      if (this.debounceTimer) {
        clearTimeout(this.debounceTimer);
      }

      // 触发关闭事件
      this.debounceTimer = setTimeout(() => {
        this.$emit("removeNotice");
      }, this.timeout);
    }
  };
</script>

<style lang="scss">
  @import "~__shared-libs/scss/lib-common-utils";

  .notice {
    @include border-radius(10px);

    position: fixed;
    left: 50%;
    top: 70px;
    width: sz(578);
    margin-left: sz(-578 / 2);
    border-style: solid;
    border-width: 1px;

    &__text {
      margin: 0;
      padding: 0 sz(20);
      height: sz(50 - 2);
      line-height: sz(50 - 2);
      text-align: center;
    }

    // 成功状态：绿色系
    &--successful {
      background: map-get($colors, notice-ok-bg);
      border-color: map-get($colors, notice-ok-border);
      color: map-get($colors, success-green);
    }

    // 不成功状态: 粉色系
    &--failed {
      background: map-get($colors, notice-bar-cancel-bg);
      border-color: map-get($colors, notice-bar-cancel-border);
      color: map-get($colors, notice-bar-cancel-text);
    }
  }
</style>
