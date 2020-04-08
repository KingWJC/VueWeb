<template>
  <div class="advanced-case-filter clearfix" >
    <div class="advanced-case-filter__left clearfix">
      <div class="advanced-case-filter__left-top clearfix" >
        <span class="advanced-case-filter__left-top-words1">查找符合下列</span>

        <div class="advanced-case-filter__left-top-mul">
          <select-dropdown-v2
            v-model="selectedJoinType"
            :dropDownMaxHeight="210"
            :dropDownTopMargin="6"
            :searchable="false"
            :options="searchJoinTypes"
            label="Text"
            trackBy="Value"
            optionsLogicClassName="advanced-case-filter-dropdown">
          </select-dropdown-v2>
        </div>

        <span class="advanced-case-filter__left-top-words2">条件的病例</span>

        <a href="javascript:;"
          class="advanced-case-filter__left-top-searchbutton"
          @click="changeSearchMode">简单搜索</a>
      </div>

      <div class="advanced-case-filter__conditions">
        <advanced-case-filter-condition
          v-for="uid in conditionList"
          :key="uid"
          :orphanCond="conditionList.length === 1"
          :conditionLimit="conditionList.length === 5"
          v-model="conditionMap[uid]"
          :filterParams="filterParams"
          @addCondition="addCondition(uid)"
          @removeCondition="removeCondition(uid)">
        </advanced-case-filter-condition>
      </div>
    </div>

    <div class="advanced-case-filter__right">
      <div class="advanced-case-filter__right-buttongroup">
        <a href="javascript:;"
          class="btn advanced-case-filter__right-buttongroup-but"
          @click="search">搜索</a>
        <a href="javascript:;"
          class="btn btn--white advanced-case-filter__right-buttongroup-but"
          @click="reset">重置</a>
      </div>
    </div>
  </div>
</template>

<script>
  import AdvancedCaseFilterCondition from "./AdvancedCaseFilterCondition";
  import generateUUID from "__shared-libs/js/modules/generate-uuid";

  export default {
    name: "advanced-case-filter",

    components: {
      AdvancedCaseFilterCondition
    },

    props: {
      // 高级搜索可用筛选选项
      filterParams: {
        type: Object,
        default() {
          return {};
        }
      }
    },

    data() {
      return {
        // 查找类型
        searchJoinTypes: this.filterParams.searchJoinTypes,
        selectedJoinType: this.filterParams.searchJoinTypes[0],

        // 当前条件列表(只包含 uid)
        conditionList: [],
        // 动态模型，用于存储条件合集
        conditionMap: {}
      };
    },

    mounted() {
      // 添加初始条件
      this.addInitialCondition();
    },

    methods: {
      // 添加初始条件（确保始终有一个条件，即使被重置）
      addInitialCondition() {
        let newUid = generateUUID();
        let tmpMap = {};
        tmpMap[newUid] = this.newCondTemplate();

        this.conditionList = [newUid];
        this.conditionMap = tmpMap;
      },

      // 生成新行的时候的初始模型值
      newCondTemplate() {
        return {
          // 默认搜索：“患者姓名”
          ContentType: 0,
          // 默认内容：空
          Content: "",
          // 默认：包含
          Way: 0
        };
      },

      // 添加高级搜索条件
      addCondition(uid) {
        let tmpList = this.conditionList.slice(0);
        let idx = tmpList.findIndex((item) => {
          return item === uid;
        });

        let newUid = generateUUID();
        tmpList.splice(idx + 1, 0, newUid);
        this.conditionList = tmpList;
        this.conditionMap[newUid] = this.newCondTemplate();
        this.conditionMap = Object.assign({}, this.conditionMap);

        // 搜索高度发生变更
        this.$emit("heightChange");
      },

      // 移除高级搜索条件
      removeCondition(uid) {
        let tmpList = this.conditionList.slice(0);
        let idx = tmpList.findIndex((item) => {
          return item === uid;
        });

        tmpList.splice(idx, 1);
        this.conditionList = tmpList;

        // 删除动态模型里面对应行
        delete this.conditionMap[uid];
        // 使用 delete 关键字删除对象内部属性不会触发响应式更新，必须 assign！
        this.conditionMap = Object.assign({}, this.conditionMap);

        // 搜索高度发生变更
        this.$emit("heightChange");
      },

      // 点击高级搜索切换窗口
      changeSearchMode() {
        // simple: 简单搜索
        // advanced：高级搜索
        this.$emit("changeSearchMode", "simple");
      },

      // 重置
      reset() {
        // 清空所有已存在条件
        this.conditionList = [];
        this.conditionMap = {};
        // 然后添加一个初始条件
        this.addInitialCondition();

        // 调用search
        this.search();
      },

      // 从条件列表提取api搜索参数
      extractParams() {
        let params = {
          // 查找符合 全部/任一
          SearchWay: this.selectedJoinType.Value,
          // 每一行条件
          Conditions: [],
          // 指标列表（只有选择了指标之后才有）
          Kpis: []
        };

        // 遍历每一个条件
        for (let uid in this.conditionMap) {
          // 当前行
          let curRow = this.conditionMap[uid];

          if (
            // 患者姓名
            curRow.ContentType === 0 ||
            // 住院流水号
            curRow.ContentType === 1 ||
            // 医生
            curRow.ContentType === 2 ||
            // 反馈原因
            curRow.ContentType === 6 ||
            // 患者编号
            curRow.ContentType === 7
          ) {
            // 如果搜索内容为空，静默忽略此条件，禁止应用于搜索
            if (curRow.Content !== "") {
              params.Conditions.push({
                ContentType: curRow.ContentType,
                Content: curRow.Content,
                Way: curRow.Way
              });
            }
          } else if (curRow.ContentType === 5) {
            // else-if： 当遇到 “质控点” 类别，就单独放到 Kpis 里面
            // 把当前行的质控点添加到已经存在的质控点列表里面去
            params.Kpis = params.Kpis.concat(curRow.Kpis);
          }
        }

        // 高级搜索参数包含在 As 字段里面
        return {As: params};
      },

      // 搜索
      search() {
        this.$emit("search", this.extractParams());
      }
    }
  };
</script>

<style lang="scss">
  @import "~__libs/scss/lib-common-utils";

  .advanced-case-filter {
    // 右侧按钮居中定位用
    position: relative;

    &__conditions {
      overflow-y: auto;
      max-height: sz(195);
    }

    &__left {
      padding-right: sz(30);
      float: left;
      width: sz(860);
      border-right: 1px solid map-get($colors, dialog-cancel-border);

      &-top {
        &-words1,
        &-words2 {
          float: left;
          line-height: sz(25);
        }

        &-words2 {
          margin-left: sz(5);
        }

        &-mul {
          float: left;
          margin-left: sz(5);
          width: sz(90);
        }

        &-searchbutton {
          float: right;
          display: inline-block;
          margin-right: sz(34);
          position: relative;
          top: sz(7);

          @at-root #{get-bem-root()} & {
            color: map-get($colors, theme-blue);
          }
        }
      }
    }

    &__right {
      position: absolute;
      top: 50%;
      right: sz(17);
      margin-top: sz(-29);
      width: sz(248);

      &-buttongroup {
        &-but {
          margin: sz(15) sz(0) 0 sz(30);
          width: sz(80);
          float: left;

          &:first-child {
            margin: sz(15) sz(10) 0 sz(15);
          }
        }
      }
    }

    .select-dropdown-v2 {
      width: sz(90);
      height: sz(22);

      &__selected {
        font-size: map-get($font-sizes, xs);

        &-plain {
          height: 100%;
          line-height: sz(22);
          color: map-get($colors, text-light);
          font-size: map-get($font-sizes, xs);
        }
      }
    }

    @at-root {
      .advanced-case-filter-dropdown {
        .select-dropdown-v2-options__items-item {
          height: sz(22);
          line-height: sz(22);
          font-size: map-get($font-sizes, xs);
          padding-left: sz(10);
        }
      }
    }
  }
</style>
