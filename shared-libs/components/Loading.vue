<template>
  <div :style="loadingStyles"
    :class="[
      logicClassName
    ]"
    class="loading">
    <!-- 全局loading -->
    <loading-animation></loading-animation>
  </div>
</template>

<script>
  export default {
    name: "loading",

    props: {
      logicClassName: {
        type: String,
        default: null
      },

      // Loading 设计为异步组件，loadingStyles 从外部传入
      loadingStyles: {
        type: Object,
        default() {
          return null;
        }
      }
    }
  };
</script>

<style lang="scss">
  @import "~__shared-libs/scss/lib-common-utils";

  .loading {
    position: fixed;
    left: 50%;
    top: 30%;
    width: sz(60);
    height: sz(60);
  }
</style>
