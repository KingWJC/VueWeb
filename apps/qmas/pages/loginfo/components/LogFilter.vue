<template>
  <div class="log-filter clearfix">
    <input v-model="inputContent"
      class="log-filter__input"
      type="text"
      placeholder="请输入记录ID或操作人用户名" />
    <a href="javascript:;"
      class="log-filter__search"
      @click="search">搜索</a>
    <a href="javascript:;"
      class="log-filter__advanced"
      @click="reset">重置</a>
  </div>
</template>

<script>
  import EventBus from "__shared-libs/js/vue/eventbus";

  export default {
    name: "log-filter",

    data() {
      return {
        // 输入框内容
        inputContent: ""
      };
    },

    methods: {
      // 搜索
      search() {
        EventBus.$emit("searchContent", this.inputContent.trim());
      },

      // 重置
      reset() {
        // 输入框内容
        this.inputContent = "";

        // 调用search
        this.search();
      }
    }
  };
</script>

<style lang="scss">
  @import "~__libs/scss/lib-common-utils";

  .log-filter {
    @include border-radius(5px);

    border: 1px solid map-get($colors, dialog-cancel-border);
    padding: sz(7) sz(10);
    background: map-get($colors, pure-white);

    a {
      height: sz(34);
      line-height: sz(34);
      text-align: center;
    }

    &__input {
      @include border-radius(4px 0 0 4px);
      @include placeholder-color(map-get($colors, placeholder-text-color));

      float: left;
      width: sz(400);
      height: sz(34);
      border: 1px solid map-get($colors, input-lighter-border);
      vertical-align: middle;
      padding: 0 sz(10);
      color: map-get($colors, dialog-text-color);

      &::-ms-clear {
        display: none;
      }

      &:focus {
        border: 1px solid map-get($colors, theme-blue);
      }
    }

    &__search {
      @include border-radius(0 4px 4px 0);

      float: left;
      width: sz(90);
      margin-left: 0;
      background-color: map-get($colors, theme-blue);
      vertical-align: middle;

      @at-root #{get-bem-root()} & {
        color: map-get($colors, pure-white);
      }
    }

    &__advanced {
      float: left;
      padding-left: sz(10);
      line-height: sz(34);

      @at-root #{get-bem-root()} & {
        color: map-get($colors, theme-blue);
      }
    }
  }
</style>
