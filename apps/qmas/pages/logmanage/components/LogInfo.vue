<template>
  <div class="log-info">
    <template v-if="filterParams">
      <log-table-filter
        :filterParams="filterParams"
        :disabled="filterDisabled"
        @typeChanged="changeType"
        @dateRangeChanged="changeDateRange">
      </log-table-filter>
    </template>

    <div class="log-info__tablecontent">
      <template v-if="!isShowLoading">
        <template v-if="bodyData">
          <div class="log-info__tablecontent-body">
            <log-table-body :bodyData="bodyData"></log-table-body>
          </div>

          <paginator
            :totalRecords="totalRecords"
            :pageSize="pageSize"
            :curPage="curPage"
            @changePage="changePage">
          </paginator>
        </template>
        <template v-else>
          <qa-no-content title="暂无日志数据"></qa-no-content>
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
  import LogTableBody from "./LogTableBody";
  import LogTableFilter from "./LogTableFilter";
  import resolveApiRoute from "__libs/js/modules/resolve-api-route";

  export default {
    name: "log-info",

    components: {
      Paginator,
      LogTableBody,
      LogTableFilter,
      QaNoContent
    },

    data() {
      return {
        totalRecords: 0,
        // 页面初始时设置每页展示条数
        /* 50 header
         35 面包屑
         50 搜索
         10 margin
         30 margin
         2 border
         40 thead
         20 padding
         38 翻页  = 275*/
        pageSize: getPageSize(40, 275),
        curPage: 1,

        bodyData: null,

        // 是否正在加载数据
        isShowLoading: true,

        // 无返回数据筛选条件置灰禁点
        filterDisabled: false,
        // 已选择的条件
        selectedParams: null,

        // 筛选模式下筛选器可用选项
        filterParams: {
          actionType: [],

          actionEvent: [],

          actionUser: [],

          // 当前api返回的日期范围（每次发搜索请求之后更新）
          // -- 表示不限制范围
          dateRange: ["--", "--"],

          // 当前筛选器选择的日期范围（下游上报时间变更事件之后更新），用来
          // 和 api 返回的范围进行对比，来确定是否显示 "操作时间" 标题
          selectedDateRange: ["--", "--"]
        }
      };
    },

    mounted() {
      this.fetchData("search");

      EventBus.$on("searchContent", (searchContent) => {
        this.selectedParams = {searchContent};

        this.curPage = 1;
        this.fetchData("search");
      });
    },

    methods: {
      changeType(codes) {
        this.updateDropdownOptions("type", codes);

        if (codes.length === this.filterParams.actionType.length) {
          codes = [];
        }

        this.setApiPara("SearchModuletype", codes);
        this.changePage(1);
      },

      changeDateRange(range) {
        // 更新本地已选择范围
        this.selectedParams = Object.assign(
          {},
          this.selectedParams,
          {dateRange: range}
        );

        // 同步下游已选择的日期范围
        this.filterParams = Object.assign(
          {},
          this.filterParams,
          {selectedDateRange: range}
        );

        this.changePage(1);
      },

      // 读取下拉框参数
      setApiPara(type, codes) {
        this.selectedParams = Object.assign(
          {},
          this.selectedParams,
          {[type]: codes}
        );
      },

      getApiPara() {
        let combined = {

          // 查询参数
          SelectedParams: this.selectedParams === null ?
            "" : this.selectedParams.searchContent,
          // 可选 默认操作时间
          OrderField: "",
          // 可选 0正序，1倒序 默认为1倒序排序类型
          OrderWay: "",
          // 当前页码
          PageIndex: this.curPage,
          // 每页条数
          PageSize: this.pageSize
        };

        return combined;
      },

      // 同步下游props
      updateDropdownOptions(type, codes) {
        let actName,
            codeField;

        if (type === "type") {
          actName = "actionType";
          codeField = "ACTION_TYPE";
        }

        this.filterParams[actName] = this.filterParams[actName].map((item) => {
          // 首先默认为未选
          item.isChecked = false;

          // 然后条件成立才选上
          if (codes.findIndex((subItem) => {
            return subItem === item[codeField];
          }) > -1) {
            item.isChecked = true;
          }

          return item;
        });

        // 触发一下更新
        this.filterParams = Object.assign(
          {},
          this.filterParams
        );
      },

      changePage(pageIndex) {
        this.curPage = pageIndex;
        this.fetchData();
      },

      // 获取数据方法
      fetchData(type) {
        this.$showLoading();
        this.isShowLoading = true;

        Axios.post(
          resolveApiRoute("log-manage-get"),
          this.getApiPara()
        ).then((res) => {
          this.$hideLoading();
          this.isShowLoading = false;

          if (res.data.Code === 0 ) {
            // 过滤器是否禁用（搜索没有结果就禁用，筛选没有结果不禁用）
            let filterDisabled = false;

            this.totalRecords = res.data.Data.Data.length > 0
              ? res.data.Data.TotalRecord
              : 0;

            if (res.data.Data.Data.length > 0) {
              this.bodyData = res.data.Data.Data;
            } else {
              this.bodyData = null;

              if (type === "search") {
                filterDisabled = true;
              }
            }

            // 重置筛选器状态(启用/禁用）
            this.filterDisabled = filterDisabled;
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

  .log-info {
    @include border-radius(5px);

    min-width: 58.9rem;
    max-width: 58.9rem;
    margin: 0 auto;
    margin: 0.5rem auto 1rem;
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
