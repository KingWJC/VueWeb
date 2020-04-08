<template>
  <div class="org-filter clearfix">
    <div class="org-filter__counts">
      <span>机构名称:</span>
      <input v-model="searchObj"
        type="text"
        placeholder="医院/科室名称" />
    </div>

    <div class="org-filter__btnbox">
      <span>审核状态:</span>
      <select-dropdown-v2
        v-model="cachedSh"
        :dropDownMaxHeight="210"
        :options="verifystate"
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
    <div class="org-filter__btnbox">
      <span>缴费状态:</span>
      <select-dropdown-v2
        v-model="cachedPay"
        :dropDownMaxHeight="210"
        :options="paystate"
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
    <div class="org-filter__searchbox clearfix">
      <div class="org-filter__searchbox-searchbar clearfix">
        <a class="org-filter__basicbtn"
          href="javascript:;"
          @click="search">查询</a>
        <a
          href="javascript:;"
          class="org-filter__basicbtn org-filter__searchbox-reset"
          @click="reset"
        >重置</a>
      </div>
    </div>
  </div>
</template>

<script>
  import EventBus from "__shared-libs/js/vue/eventbus";
  import SelectDropdownV2 from "__shared-libs/components/select-dropdown/SelectDropdownV2";

  export default {
    name: "org-filter",

    components: {
      SelectDropdownV2
    },

    data() {
      return {
        searchObj: "",
        cachedSh: null,
        cachedPay: null,

        paystate: [
          {
            ITEM_CODE: "0",
            ITEM_NAME: "待缴费"
          },
          {
            ITEM_CODE: "1",
            ITEM_NAME: "已缴费"
          }
        ],
        verifystate: [
          {
            ITEM_CODE: "0",
            ITEM_NAME: "待审核"
          },
          {
            ITEM_CODE: "1",
            ITEM_NAME: "审核通过"
          },
          {
            ITEM_CODE: "2",
            ITEM_NAME: "审核不通过"
          }
        ]
      };
    },

    methods: {
      // 搜索时间
      search() {
        let searchOption = {};
        searchOption.SearchText = this.searchObj.trim();
        searchOption.Pay = this.cachedPay
          ? this.cachedPay.ITEM_CODE.trim() : "";
        searchOption.Verify = this.cachedSh
          ? this.cachedSh.ITEM_CODE.trim() : "";
        EventBus.$emit("searchChanged", searchOption);
      },

      // 重置input
      reset() {
        this.searchObj = "";
        this.cachedSh = "";
        this.cachedPay = "";
        this.search();
      }
    }
  };
</script>

<style lang="scss">
  @import "~__libs/scss/lib-common-utils";

  .org-filter {
    @include border-radius(4px);
    @include custom-container(sz(22));

    margin-top: sz(10);
    position: relative;
    border: 1px solid map-get($colors, dialog-cancel-border);
    padding: sz(8) sz(10) sz(6) sz(10);
    background: map-get($colors, pure-white);

    &__counts {
      float: left;
      margin-top: sz(3);
      margin-left: sz(11);
      width: sz(280);
      span {
        float: left;
        color: black;
        font-weight: bolder;
        line-height: sz(34);
      }
      input {
        @include border-radius(4px 4px 4px 4px);
        @include placeholder-color(map-get($colors, placeholder-text-color));

        border: 1px solid map-get($colors, dropdown-box-border);
        height: sz(32);
        width: sz(200);
        padding-left: sz(10);
        float: right;
        color: map-get($colors, placeholder-text-color);

        &:focus {
          border: 1px solid map-get($colors, theme-blue);
        }
      }
      &-no {
        margin-left: sz(5);
      }

      .customize-checkbox {
        position: relative;
        top: sz(4);
      }
    }

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
        margin-left: sz(40);
        color: black;
        font-weight: bolder;
        line-height: sz(34);
      }
      .select-dropdown-v2 {
        width: sz(200);
        float: right;

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
