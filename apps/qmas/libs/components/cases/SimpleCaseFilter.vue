<template>
  <div class="simple-case-filter clearfix">
    <select-dropdown-v2
      v-model="selectedType"
      :dropDownMaxHeight="210"
      :dropDownTopMargin="6"
      :options="contentTypes"
      trackBy="Value"
      label="Text">
    </select-dropdown-v2>

    <input v-model="inputContent"
      class="simple-case-filter__input"
      type="text"
      placeholder="请输入" />

    <a class="simple-case-filter__search"
      href="javascript:;"
      @click="search">搜索</a>

    <template v-if="isAdvanced">
      <a class="simple-case-filter__advanced"
        href="javascript:;"
        @click="advancedSearch">高级搜索</a>
    </template>

    <a class="simple-case-filter__reset"
      href="javascript:;"
      @click="reset">重置</a>
  </div>
</template>

<script>
  export default {
    name: "simple-case-filter",

    props: {
      // 筛选类型列表
      contentTypes: {
        type: Array,
        default() {
          return [];
        }
      },

      // 是否显示高级搜索按钮 true 显示 false 不显示
      isAdvanced: {
        type: Boolean,
        default: true
      }
    },

    data() {
      return {
        // 已选择类型(默认为从事件接收到的第一个)
        selectedType: this.contentTypes[0],
        // 输入框内容
        inputContent: ""
      };
    },

    watch: {
      // 在下拉框选项列表变更之后，立即选择第一个
      // TODO: 是否需要考虑变更之后仍然保留之前选择的项目（如果完全是同一项的话）
      contentTypes(options) {
        this.selectedType = options[0];
        this.inputContent = "";
      }
    },

    methods: {
      // 搜索
      search() {
        this.$emit("search", {
          ContentType: this.selectedType.Value,
          Content: this.inputContent.trim()
        });
      },

      // 高级搜索，发出事件即可
      advancedSearch() {
        this.$emit("changeSearchMode", "advanced");
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

  .simple-case-filter {
    @include border-radius(4px);

    .select-dropdown-v2,
    &__input,
    &__search,
    &__advanced,
    &__reset {
      float: left;
    }

    .select-dropdown-v2 {
      width: sz(110);
      height: sz(34);

      &__selected {
        @include border-radius(5px 0 0 5px);

        border-right: none;
        height: sz(32);
        background: map-get($colors, tab-bg);

        &-plain,
        &-placeholder {
          height: sz(32);
          line-height: sz(32);
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
    &__advanced,
    &__reset {
      display: inline-block;
      height: sz(34);
      line-height: sz(33);
      text-align: center;
      cursor: pointer;
    }

    &__search {
      @include border-radius(0 4px 4px 0);

      width: sz(100);
      background-color: map-get($colors, theme-blue);

      @at-root #{get-bem-root()} & {
        color: map-get($colors, pure-white);
      }
    }

    &__advanced,
    &__reset {
      margin-left: sz(10);
      color: map-get($colors, theme-blue);

      #{get-bem-root()} & {
        color: map-get($colors, theme-blue);
      }
    }
  }
</style>
