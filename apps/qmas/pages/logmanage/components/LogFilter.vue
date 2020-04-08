<template>
  <div class="log-filter clearfix">
    <div class="log-filter__btnbox">
      <span class="log-filter__btnbox-span">操作人:</span>
      <input
        v-model="searchUsrName"
        class="log-filter__btnbox-input"
        type="text"
        placeholder="请输入" />
    </div>
    <div class="log-filter__btnbox">
      <span class="log-filter__btnbox-span">操作时间:</span>
      <!-- <el-date-picker
        v-model="cachedDate"
        type="date"
        format="yyyy/MM/dd"
        valueFormat="yyyy-MM-dd"
        placeholder="请选择">
      </el-date-picker> -->
      <el-date-picker
        v-model="cachedDate"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        format="yyyy/MM/dd"
        valueFormat="yyyy-MM-dd">
      </el-date-picker>
    </div>
    <div class="log-filter__btnbox">
      <span class="log-filter__btnbox-span">操作模块:</span>
      <select-dropdown-v2
        v-model="cachedModolueType"
        :dropDownMaxHeight="210"
        :options="moType"
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
    <div class="log-filter__searchbox clearfix">
      <div class="log-filter__searchbox-searchbar clearfix">
        <a class="log-filter__basicbtn"
          href="javascript:;"
          @click="search">查询</a>
        <a
          href="javascript:;"
          class="log-filter__basicbtn
          log-filter__searchbox-reset"
          @click="reset"
        >重置</a>
      </div>
    </div>
  </div>
</template>

<script>
  import Axios from "axios";
  import EventBus from "__shared-libs/js/vue/eventbus";
  import resolveApiRoute from "__libs/js/modules/resolve-api-route";

  export default {
    name: "log-filter",

    data() {
      return {

        cachedDate: null,
        cachedModolueType: null,

        // 用户名
        searchUsrName: "",

        // 操作模块
        moType: null
      };
    },

    mounted() {
      this.fetchModuleType();
    },

    methods: {
      // 搜索
      search() {
        let searchOption = {};
        searchOption.SearchDate = this.cachedDate
          ? this.cachedDate
          : "";
        searchOption.SearchText = this.searchUsrName.trim();
        searchOption.SearchModuletype = this.cachedModolueType
          ? this.cachedModolueType.ITEM_CODE.trim()
          : "";

        EventBus.$emit("searchContent", searchOption);
      },

      // 重置
      reset() {
        (this.searchUsrName = ""),
        (this.cachedDate = null),
        (this.cachedModolueType = null);
        // 调用search
        this.search();
      },


      // 模型类型获取
      fetchModuleType() {
        this.$showLoading();
        this.isShowLoading = true;

        Axios.post(
          resolveApiRoute("log-manage-module")
        ).then((res) => {
          this.$hideLoading();
          this.isShowLoading = false;

          if (res.data.Code === 0 ) {
            this.moType = res.data.Data;
          } else {
            this.$showNotice("服务器异常", "failed");
          }
        }, () => {
          this.$hideLoading();
          this.isShowLoading = false;
          this.$showNotice("网络异常", "failed");
        });
      }
    }
  };
</script>

<style lang="scss">
  @import "~__libs/scss/lib-common-utils";

  .log-filter {
    @include border-radius(4px);
    @include custom-container(sz(22));

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
      // float: left;
      display: inline-block;
      margin-top: sz(2);
      // width: sz(300);
      &-span {
        margin-left: sz(30);
        color: black;
        font-weight: bolder;
        line-height: sz(34);
      }
      .select-dropdown-v2 {
        width: sz(160);
        float: right;
        height: sz(34);
        margin-left: sz(5);

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

      &-input {
        @include border-radius(4px 4px 4px 4px);
        @include placeholder-color(map-get($colors, placeholder-text-color));

        border: 1px solid map-get($colors, dropdown-box-border);
        height: sz(32);
        width: 7.7rem;
        padding-left: sz(10);
        // float: right;
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
          // float: left;
          color: map-get($colors, placeholder-text-color);

          &:focus {
            border: 1px solid map-get($colors, theme-blue);
          }
        }

        a {
          @include border-radius(4px 4px 4px 4px);

          width: sz(90);
          // float: left;
          background: map-get($colors, theme-blue);
          color: map-get($colors, pure-white);
        }
      }

      &-reset {
        margin-left: sz(6);
        // float: left;

        #{get-bem-root()} & {
          color: map-get($colors, pure-white);
        }
      }
    }
  }
</style>
