<template>
  <div class="expert-audit-manage">
    <template v-if="filterParams">
      <expert-audit-table-filter
        :filterParams="filterParams"
        :disabled="filterDisabled"
        @typeChanged="changeType"
        @eventChanged="changeState"
      ></expert-audit-table-filter>
    </template>

    <div class="expert-audit-manage__tablecontent">
      <template v-if="!isShowLoading">
        <template v-if="bodyData">
          <div class="expert-audit-manage__tablecontent-body">
            <expert-audit-table-body :bodyData="bodyData"
              @refreshData="refreshData"></expert-audit-table-body>
          </div>

          <paginator
            :totalRecords="totalRecords"
            :pageSize="pageSize"
            :curPage="curPage"
            @changePage="changePage"
          ></paginator>
        </template>
        <template v-else>
          <qa-no-content title="暂无专家审核数据"></qa-no-content>
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
  import ExpertAuditTableBody from "./ExpertAuditTableBody";
  import ExpertAuditTableFilter from "./ExpertAuditTableFilter";
  import resolveApiRoute from "__libs/js/modules/resolve-api-route";

  export default {
    name: "expert-audit-manage",

    components: {
      Paginator,
      ExpertAuditTableBody,
      ExpertAuditTableFilter,
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
        searchState: "",

        // 筛选模式下筛选器可用选项
        filterParams: {
          actionType: [],

          actionState: []
        }
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
      changeType(codes) {
        this.updateDropdownOptions("type", codes);

        if (codes.length === this.filterParams.actionType.length) {
          codes = [];
        }

        this.setApiPara("actionTypeCode", codes);
        this.changePage(1);
      },

      changeState(codes) {
        this.updateDropdownOptions("state", codes);

        if (codes.length === this.filterParams.actionState.length) {
          codes = [];
        }

        this.setApiPara("actionStateCode", codes);
        this.changePage(1);
      },

      // 读取下拉框参数
      setApiPara(type, codes) {
        this.selectedParams = Object.assign({}, this.selectedParams, {
          [type]: codes
        });
      },

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
          PageSize: this.pageSize
        };

        return combined;
      },

      // 同步下游props
      updateDropdownOptions(type, codes) {
        let actName, codeField;

        if (type === "type") {
          actName = "actionType";
          codeField = "AC_TYPE_CODE";
        } else if (type === "state") {
          actName = "actionState";
          codeField = "STATE_CODE";
        }

        this.filterParams[actName] = this.filterParams[actName].map((item) => {
          // 首先默认为未选
          item.isChecked = false;

          // 然后条件成立才选上
          if (
            codes.findIndex((subItem) => {
              return subItem === item[codeField];
            }) > -1
          ) {
            item.isChecked = true;
          }

          return item;
        });

        // 触发一下更新
        this.filterParams = Object.assign({}, this.filterParams);
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
          resolveApiRoute("expert-audit-manage"),
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

  .expert-audit-manage {
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
