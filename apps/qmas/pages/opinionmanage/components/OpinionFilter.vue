<template>
  <div class="opinion-filter clearfix">
    <div class="opinion-filter__btnbox">
      <span>用户类型:</span>
      <select-dropdown-v2
        v-model="cachedRlType"
        :dropDownMaxHeight="210"
        :options="rlType"
        label="ITEM_NAME"
        trackBy="ITEM_CODE"
      >
        <template slot="drop"
          slot-scope="dropContent">
          <p class="select-dropdown-v2-options__items-item-text">
            {{ dropContent.options.ITEM_NAME }}</p>
        </template>
      </select-dropdown-v2>
    </div>
    <div class="opinion-filter__btnbox">
      <span>用户名:</span>
      <input v-model="searchUsrName"
        type="text"
        placeholder="请输入" />
    </div>
    <div class="opinion-filter__btnbox">
      <span>意见状态:</span>
      <select-dropdown-v2
        v-model="cachedOpState"
        :dropDownMaxHeight="210"
        :options="opState"
        label="ITEM_NAME"
        trackBy="ITEM_CODE"
      >
        <template slot="drop"
          slot-scope="dropContent">
          <p class="select-dropdown-v2-options__items-item-text">
            {{ dropContent.options.ITEM_NAME }}</p>
        </template>
      </select-dropdown-v2>
    </div>
    <div class="opinion-filter__searchbox clearfix">
      <div class="opinion-filter__searchbox-searchbar clearfix">
        <a class="opinion-filter__basicbtn"
          href="javascript:;"
          @click="search">查询</a>
        <a
          href="javascript:;"
          class="opinion-filter__basicbtn
          opinion-filter__searchbox-reset"
          @click="reset"
        >重置</a>
      </div>
    </div>
  </div>
</template>

<script>
  import EventBus from "__shared-libs/js/vue/eventbus";

  export default {
    name: "opinion-filter",

    data() {
      return {

        cachedRlType: null,
        cachedOpState: null,

        // 角色类型
        rlType: [
          {
            ITEM_CODE: "3",
            ITEM_NAME: "专家用户"
          },
          {
            ITEM_CODE: "4",
            ITEM_NAME: "机构用户"
          }
        ],

        // 用户名
        searchUsrName: "",

        // 意见状态
        opState: [
          {
            ITEM_CODE: "0",
            ITEM_NAME: "待反馈"
          },
          {
            ITEM_CODE: "1",
            ITEM_NAME: "已反馈"
          }
        ]
      };
    },

    methods: {
      // 搜索
      search() {
        let searchOption = {};
        searchOption.SearchRoleType = this.cachedRlType
          ? this.cachedRlType.ITEM_CODE.trim()
          : "";
        searchOption.SearchText = this.searchUsrName.trim();
        searchOption.SearchState = this.cachedOpState
          ? this.cachedOpState.ITEM_CODE.trim()
          : "";

        EventBus.$emit("searchContent", searchOption);
      },

      // 重置
      reset() {
        (this.searchUsrName = ""),
        (this.cachedRlType = null),
        (this.cachedOpState = null);
        // 调用search
        this.search();
      }
    }
  };
</script>

<style lang="scss">
  @import "~__libs/scss/lib-common-utils";

  .opinion-filter {
    @include border-radius(4px);
    @include custom-container(sz(22));

    margin-top: sz(10);
    position: relative;
    border: 1px solid map-get($colors, dialog-cancel-border);
    padding: sz(8) sz(10) sz(6) sz(10);
    background: map-get($colors, pure-white);

    &__basicbtn {
      @include border-radius(4px);

      display: inline-block;
      vertical-align: middle;
      height: sz(34);
      line-height: sz(34);
      text-align: center;
    }

    &__btnbox {
      float: left;
      margin-top: sz(2);
      width: sz(300);
      span {
        margin-left: sz(35);
        color: black;
        font-weight: bolder;
        line-height: sz(34);
      }
      .select-dropdown-v2 {
        width: sz(200);
        float: right;
        height: sz(34);

        &__selected {
          font-size: map-get($font-sizes, xs);
          height: sz(32);
          line-height: sz(32);
          border-color: map-get($colors, dialog-input-border);

          &-placeholder {
            height: sz(32);
            line-height: sz(32);
            font-size: map-get($font-sizes, xs);
          }

          &-input,
          &-plain {
            height: sz(32);
            font-size: map-get($font-sizes, xs);
            line-height: sz(32);
          }
        }
      }

      .select-dropdown-v2-options {
        &__items-item-text {
          font-size: map-get($font-sizes, xs);
        }
      }

      &-statistics {
        font-size: map-get($font-sizes, xs);
        color: map-get($colors, text-light);
        margin-left: sz(5);
      }

      &-imports,
      &-add {
        margin-left: sz(5);
        height: sz(26);
        line-height: sz(26);
      }

      &-multichange {
        vertical-align: middle;
      }

      input {
        @include border-radius(4px 4px 4px 4px);
        @include placeholder-color(map-get($colors, placeholder-text-color));

        border: 1px solid map-get($colors, dropdown-box-border);
        height: sz(32);
        width: 10.7rem;
        padding-left: sz(10);
        float: right;
        color: map-get($colors, placeholder-text-color);

        &:focus {
          border: 1px solid map-get($colors, theme-blue);
        }
      }
    }

    &__searchbox {
      float: right;
      margin-right: sz(10);

      &-searchbar {
        float: left;

        input {
          @include border-radius(4px 4px 4px 4px);
          @include placeholder-color(map-get($colors, placeholder-text-color));

          border: 1px solid map-get($colors, dropdown-box-border);
          height: sz(34);
          width: sz(400);
          padding-left: sz(10);
          float: left;
          color: map-get($colors, placeholder-text-color);

          &:focus {
            border: 1px solid map-get($colors, theme-blue);
          }
        }

        a {
          @include border-radius(4px 4px 4px 4px);

          width: sz(90);
          float: left;
          background: map-get($colors, theme-blue);
          color: map-get($colors, pure-white);
        }
      }

      &-reset {
        margin-left: sz(10);
        float: left;

        #{get-bem-root()} & {
          color: map-get($colors, pure-white);
        }
      }
    }
  }
</style>
