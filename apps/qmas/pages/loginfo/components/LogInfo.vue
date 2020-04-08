<template>
  <div class="log-info">
    <template v-if="filterParams">
      <log-table-filter
        :filterParams="filterParams"
        :disabled="filterDisabled"
        @typeChanged="changeType"
        @eventChanged="changeEvent"
        @operatorChanged="changeOperator"
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

        this.setApiPara("actionTypeCode", codes);
        this.changePage(1);
      },

      changeEvent(codes) {
        this.updateDropdownOptions("event", codes);

        if (codes.length === this.filterParams.actionEvent.length) {
          codes = [];
        }

        this.setApiPara("actionEventCode", codes);
        this.changePage(1);
      },

      changeOperator(codes) {
        this.updateDropdownOptions("user", codes);

        if (codes.length === this.filterParams.actionUser.length) {
          codes = [];
        }

        this.setApiPara("userCode", codes);
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
          // 可选 默认操作时间
          OrderField: "",
          // 可选 0正序，1倒序 默认为1倒序排序类型
          OrderWay: "",
          // 当前页码
          PageIndex: this.curPage,
          // 每页条数
          PageSize: this.pageSize
        };

        if (this.selectedParams) {
          // 可选 搜索内容
          if (this.selectedParams.searchContent) {
            Object.assign(
              combined,
              {Content: this.selectedParams.searchContent}
            );
          }

          // 可选操作时间
          if (this.selectedParams.dateRange) {
            Object.assign(combined, {
              StartTime: this.selectedParams.dateRange[0],
              EndTime: this.selectedParams.dateRange[1]
            });
          }

          // 可选操作类型
          if (this.selectedParams.actionTypeCode) {
            Object.assign(
              combined,
              {ActionTypeCode: this.selectedParams.actionTypeCode}
            );
          }

          // 可选操作事件
          if (this.selectedParams.actionEventCode) {
            Object.assign(
              combined,
              {ActionEventCode: this.selectedParams.actionEventCode}
            );
          }

          // 可选操作人排序字段
          if (this.selectedParams.userCode) {
            Object.assign(combined, {UserCode: this.selectedParams.userCode});
          }
        }

        return combined;
      },

      // 同步下游props
      updateDropdownOptions(type, codes) {
        let actName,
            codeField;

        if (type === "type") {
          actName = "actionType";
          codeField = "ACTION_TYPE";
        } else if (type === "event") {
          actName = "actionEvent";
          codeField = "ACTION_EVENT";
        } else if (type === "user") {
          actName = "actionUser";
          codeField = "USER_CODE";
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

      // 更新筛选器选项
      updateFilterParams(resData) {
        // 填充筛选器参数
        this.filterParams = Object.assign({}, this.filterParams, {
          actionType: resData.ActionType.map((item) => {
            item.isChecked = true;

            return item;
          }),

          actionEvent: resData.ActionEvent.map((item) => {
            item.isChecked = true;

            return item;
          }),

          actionUser: resData.ActionUser.map((item) => {
            item.isChecked = true;

            return item;
          }),

          // api 返回的日期范围
          dateRange: resData.TimeRange.slice(0),

          // 当前选择器已选择的范围（如果等于api返回的范围，显示“操作日期”）
          // api 进行 “搜索” 请求的时候返回的范围与 dateRange 完全相同
          selectedDateRange: resData.TimeRange.slice(0)
        });
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
          resolveApiRoute("log-info"),
          this.getApiPara()
        ).then((res) => {
          this.$hideLoading();
          this.isShowLoading = false;

          if (res.data.Code === 0 ) {
            // 过滤器是否禁用（搜索没有结果就禁用，筛选没有结果不禁用）
            let filterDisabled = false;

            this.totalRecords = res.data.Data.Data.length > 0
              ? res.data.Data.Data[0].TotalResult
              : 0;

            if (res.data.Data.Data.length > 0) {
              this.bodyData = res.data.Data.Data[0].Actions;

              if (type === "search") {
                this.updateFilterParams(res.data.Data.Data[0]);
              }
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
