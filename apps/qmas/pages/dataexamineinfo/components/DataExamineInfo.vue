<template>
  <div class="data-examine-info">
    <data-examine-table-filter
      :disabled="filterDisabled"
    ></data-examine-table-filter>

    <div class="data-examine-info__tablecontent">
      <template v-if="!isShowLoading">
        <template v-if="bodyData">
          <div class="data-examine-info__tablecontent-body">
            <data-examine-table-body :bodyData="bodyData"
              @refreshData="refreshData"></data-examine-table-body>
          </div>

          <paginator
            :totalRecords="totalRecords"
            :pageSize="pageSize"
            :curPage="curPage"
            @changePage="changePage"
          ></paginator>
        </template>
        <template v-else>
          <qa-no-content title="暂无数据审核数据"></qa-no-content>
        </template>
      </template>
    </div>
  </div>
</template>

<script>
  import Axios from "axios";
  import EventBus from "__shared-libs/js/vue/eventbus";
  import getPageSize from "__shared-libs/js/modules/get-page-size";
  import Paginator from "__shared-libs/components/paginator/Paginator";
  import QaNoContent from "__libs/components/QaNoContent";
  import resolveApiRoute from "__libs/js/modules/resolve-api-route";
  import DataExamineTableBody from "./DataExamineTableBody";
  import DataExamineTableFilter from "./DataExamineTableFilter";

  export default {
    name: "data-examine-info",

    components: {
      Paginator,
      DataExamineTableBody,
      DataExamineTableFilter,
      QaNoContent
    },

    data() {
      return {
        totalRecords: 0,

        pageSize: getPageSize(40, 275),
        curPage: 1,

        bodyData: null,

        // 是否正在加载数据
        isShowLoading: true,

        // 无返回数据筛选条件置灰禁点
        filterDisabled: false,
        // 已选择的条件
        searchText: "",
        searchType: "",
        searchState: ""

      };
    },

    mounted() {
      this.fetchData("search");

      EventBus.$on("searchContent", (searchContent) => {
        this.searchText = searchContent.SearchText;
        this.searchType = searchContent.SearchType;
        this.searchState = searchContent.SearchState;

        this.curPage = 1;
        this.fetchData("search");
      });
    },

    methods: {

      getApiPara() {
        let combined = {
          SearchText: this.searchText,
          SearchType: this.searchType,
          SearchState: this.searchState,
          // 可选 0正序，1倒序 默认为1倒序排序类型
          OrderWay: "",
          // 当前页码
          PageIndex: this.curPage,
          // 每页条数
          PageSize: this.pageSize - 1
        };

        return combined;
      },

      changePage(pageIndex) {
        this.curPage = pageIndex;
        this.fetchData();
      },

      // 刷新数据
      refreshData() {
        this.fetchData();
      },

      // 获取数据方法
      fetchData() {
        this.$showLoading();
        // this.isShowLoading = true;

        Axios.post(
          resolveApiRoute("data-examine-list"),
          this.getApiPara()
        ).then(
          (res) => {
            this.$hideLoading();
            this.isShowLoading = false;

            if (res.data.Code === 0) {
              // 过滤器是否禁用（搜索没有结果就禁用，筛选没有结果不禁用）
              let filterDisabled = false;

              this.totalRecords =
                res.data.Data.Data.length > 0 ? res.data.Data.TotalRecord : 0;

              if (res.data.Data.Data.length > 0) {
                this.bodyData = res.data.Data.Data;
              } else {
                this.bodyData = null;
              }

              // 重置筛选器状态(启用/禁用）
              this.filterDisabled = filterDisabled;
            } else {
              this.$showNotice("服务器异常", "failed");
            }
          },
          () => {
            this.$hideLoading();
            this.isShowLoading = false;
            this.$showNotice("网络异常", "failed");
          }
        );
      }
    }
  };
</script>

<style lang="scss">
  @import "~__libs/scss/lib-common-utils";

  .data-examine-info {
    @include border-radius(5px);

    padding: sz(10);
    border: 1px solid map-get($colors, dialog-cancel-border);
    background: map-get($colors, pure-white);

    &__tablecontent {
      // log-filter 39px
      height: calc(100% - 39px);

      &-body {
        // paginator 28px margin 10px
        height: calc(100% - 38px);
        overflow: auto;
      }

      .paginator {
        margin: sz(10) 0 0 0;
      }
    }
  }
</style>
