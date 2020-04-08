<template>
  <div class="case-filter-light-v2">
    <select-dropdown-v2
      v-model="selectedType"
      :dropDownMaxHeight="210"
      :options="contentTypes"
      trackBy="Value"
      label="Text">
    </select-dropdown-v2>

    <input v-model="inputContent"
      class="case-filter-light-v2__input"
      type="text"
      placeholder="请输入" />

    <a class="case-filter-light-v2__search"
      href="javascript:;"
      @click="search">搜索
    </a>

    <a class="case-filter-light-v2__reset"
      href="javascript:;"
      @click="reset">重置
    </a>
  </div>
</template>

<script>
  import EventBus from "__shared-libs/js/vue/eventbus";

  export default {
    name: "case-filter-light-v2",

    data() {
      return {
        // 已选择类型(默认第一个)
        selectedType: null,
        // 输入框内容
        inputContent: "",
        // 筛选类型列表
        contentTypes: []
      };
    },

    mounted() {
      EventBus.$on("changeContentType", (contentTypes) => {
        this.contentTypes = contentTypes.slice();
        this.selectedType = this.contentTypes[0];
        this.inputContent = "";
      });
    },

    methods: {
      // 搜索
      search() {
        // 发送数据
        EventBus.$emit("receiveTypeChange", {
          ContentType: this.selectedType.Value,
          Content: this.inputContent.trim()
        });
      },

      // 重置
      reset() {
        // 已选择类型(默认第一个)
        this.selectedType = this.contentTypes[0];
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

  .case-filter-light-v2 {
    @include border-radius(4px);

    border: 1px solid map-get($colors, dialog-cancel-border);
    padding: sz(7) sz(10);
    background: map-get($colors, pure-white);

    .select-dropdown-v2 {
      width: sz(110);
      height: sz(34);
      float: left;

      &__selected {
        @include border-radius(5px 0 0 5px);

        border-right: none;
        height: sz(32);
        background: map-get($colors, tab-bg);

        &-plain {
          height: 100%;
          line-height: sz(32);
          overflow: visible;
        }
      }

      &--open {
        .select-dropdown-v2 {
          &__selected {
            @include border-radius(5px 0 0 0);
          }
        }
      }
    }

    &__input {
      @include placeholder-color(
        map-get($colors, placeholder-text-color-extra)
      );

      float: left;
      width: sz(550);
      height: sz(34);
      border: 1px solid map-get($colors, dropdown-box-border);
      vertical-align: middle;
      padding: 0 sz(10);

      &::-ms-clear {
        display: none;
      }

      &:focus {
        border: 1px solid map-get($colors, theme-blue);
      }
    }

    &__search,
    &__reset {
      display: inline-block;
      height: sz(34);
      line-height: sz(34);
      text-align: center;
      cursor: pointer;
    }

    &__search {
      @include border-radius(0 4px 4px 0);

      float: left;
      width: sz(100);
      background-color: map-get($colors, theme-blue);

      @at-root #{get-bem-root()} & {
        color: map-get($colors, pure-white);
      }
    }

    &__reset {
      #{get-bem-root()} & {
        color: map-get($colors, theme-blue);
      }

      margin-left: sz(20);
    }
  }
</style>
