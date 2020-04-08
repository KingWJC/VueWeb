<template>
  <div ref="heightsearch"
    class="cases-search-box">
    <template v-if="searchMode === 'simple'">
      <simple-case-filter
        :isAdvanced="isAdvanced"
        :contentTypes="contentTypes"
        @search="callSearch('simple', arguments[0])"
        @changeSearchMode="changeSearchMode">
      </simple-case-filter>
    </template>
    <template v-else>
      <advanced-case-filter
        :filterParams="advancedFilterParams"
        @heightChange="heightChange"
        @search="callSearch('advanced', arguments[0])"
        @changeSearchMode="changeSearchMode">
      </advanced-case-filter>
    </template>
  </div>
</template>

<script>
  import SimpleCaseFilter from "./SimpleCaseFilter";
  import AdvancedCaseFilter from "./AdvancedCaseFilter";
  import EventBus from "__shared-libs/js/vue/eventbus";

  export default {
    name: "cases-search-box",

    components: {
      SimpleCaseFilter,
      AdvancedCaseFilter
    },

    data() {
      return {
        // 搜索模式：simple / advanced
        searchMode: "simple",

        // 高级搜索模式下可用选项
        advancedFilterParams: {
          searchJoinTypes: this.$pagePayload.SearchJoinType,
          contentTypes: this.$pagePayload.ContentType,
          searchWayList: this.$pagePayload.SearchWay,
          doctorsList: this.$pagePayload.Doctor,
          sdsList: this.$pagePayload.Sd
        },

        // 下拉框选项
        contentTypes: [],

        // 初始渲染的时候是否可见 “高级搜索”
        isAdvanced: false
      };
    },

    mounted() {
      // 在组件挂载之后,发出事件报告一下自身高度
      this.heightChange();

      // 接收搜索框需要的数据
      EventBus.$on("changeContentType", (evtObj) => {
        this.contentTypes = evtObj.contentTypes;
        this.isAdvanced = evtObj.isAdvanced;
      });
    },

    methods: {
      // 获取组件当前高（必须通过 nextTick 进行包裹才可调用）
      getCurHeight() {
        return this.$refs.heightsearch.offsetHeight;
      },

      // 当前组件（搜索框）高度变化
      heightChange() {
        this.$nextTick(() => {
          this.sendEvent({
            name: "heightChange",
            height: this.getCurHeight()
          });
        });
      },

      // 统一事件发送接口
      sendEvent(evtObj) {
        // {
        //   name, // 事件名称
        //   可选值: modeChange, 搜索模式切换（点击了“简单搜索”或者“高级搜索”）
        //   可选值: heightChange, 搜索框高度改变（高级搜索中增删条件）
        //   可选值: paramChange, 搜索参数发生改变（点击了“搜索”或者“重置”), 不带高度
        //
        //   mode, // 搜索模式切换
        //   如果是模式切换，默认会触发高度改变，不用重复发送高度改变事件
        //   模式切换的时候要带上高度，但是高度切换的时候不需要带上模式和参数
        //
        //   params, // 搜索参数
        //   height // 搜索框高度
        // }
        EventBus.$emit("searchBoxChanged", evtObj);
      },

      // 调用搜索/重置
      callSearch(mode, params) {
        this.$nextTick(() => {
          this.sendEvent({
            name: "paramChange",
            mode,
            params,
            height: this.getCurHeight()
          });
        });
      },

      // 改变搜索模式
      changeSearchMode(mode) {
        let params;

        // 切换至高级搜索
        if (mode === "advanced") {
          params = {
            As: {
              // “全部” 模式
              SearchWay: this.$pagePayload.SearchJoinType[0].Value,
              // 初始条件为“患者姓名”，“包含”，内容为空
              Conditions: [{
                ContentType: this.$pagePayload.ContentType[0].Value,
                Way: this.$pagePayload.SearchWay[0].Value,
                Content: ""
              }],
              // 没有Kpi
              Kpis: []
            }
          };
        } else {
          // else: 切换至简单搜索
          params = {
            // 以 “患者姓名” 默认调用一次api
            ContentType: this.$pagePayload.ContentType[0].Value,
            // 内容为空
            Content: ""
          };
        }

        // 变更模式
        this.searchMode = mode;

        // 使用新模式构造一次初始搜索
        this.$nextTick(() => {
          this.sendEvent({
            name: "modeChange",
            height: this.getCurHeight(),
            mode,
            params
          });
        });
      }
    }
  };
</script>

<style lang="scss">
  @import "~__libs/scss/lib-common-utils";

  .cases-search-box {
    @include border-radius(4px);

    border: 1px solid map-get($colors, dialog-cancel-border);
    padding: sz(7) sz(10);
    background: map-get($colors, pure-white);
  }
</style>
