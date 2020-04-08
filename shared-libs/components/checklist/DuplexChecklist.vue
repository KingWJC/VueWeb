<template>
  <div class="duplex-checklist clearfix">
    <checklist
      v-model="leftChecked"
      :title="leftTitle"
      :inputTips="leftInputTips"
      :labelField="labelField"
      :trackByField="trackByField"
      :optionsList="leftOptions"
      :disabledList="leftDisabledList">
    </checklist>

    <div class="duplex-checklist__arrow">
      <a
        :class="{
          'duplex-checklist__arrow-first--active': rightChecked.length > 0
        }"
        href="javascript:;"
        class="duplex-checklist__arrow-first"
        @click="moveToLeft">
      </a>

      <a
        :class="{
          'duplex-checklist__arrow-send--active': leftChecked.length > 0
        }"
        href="javascript:;"
        class="duplex-checklist__arrow-send"
        @click="moveToRight">
      </a>
    </div>

    <checklist
      v-model="rightChecked"
      :title="rightTitle"
      :inputTips="rightInputTips"
      :labelField="labelField"
      :trackByField="trackByField"
      :optionsList="rightOptions"
      :disabledList="rightDisabledList">
    </checklist>
  </div>
</template>

<script>
  import Checklist from "./Checklist";

  export default {
    // 双路选择列表
    name: "duplex-checklist",

    components: {
      Checklist
    },

    // 自定义 v-model
    model: {
      prop: "checkedOptions",
      event: "syncCheckedOptions"
    },

    props: {
      // 当前选择的条目列表
      checkedOptions: {
        type: Array,
        default() {
          return [];
        }
      },

      // 左边选择器标题
      leftTitle: {
        type: String,
        default: ""
      },

      // 左边输入框提示文案
      leftInputTips: {
        type: String,
        default: ""
      },

      // 右边选择器标题
      rightTitle: {
        type: String,
        default: ""
      },

      // 右边输入框提示文案
      rightInputTips: {
        type: String,
        default: ""
      },

      // 条目文案字段
      labelField: {
        type: String,
        default: ""
      },

      // 唯一标识字段
      trackByField: {
        type: String,
        default: ""
      },

      // 全部备选项列表
      optionsList: {
        type: Array,
        default() {
          return [];
        }
      },

      // 全部禁用列表
      disabledList: {
        type: Array,
        default() {
          return [];
        }
      }
    },

    data() {
      return {
        leftChecked: [],
        rightChecked: [],
        leftOptions: [],
        rightOptions: []
      };
    },

    computed: {
      // 左部禁用列表
      leftDisabledList() {
        return this.filterDisabledList(this.leftOptions);
      },

      // 右部禁用列表
      rightDisabledList() {
        return this.filterDisabledList(this.rightOptions);
      }
    },

    watch: {
      optionsList() {
        this.updateCachedView();
      },

      // 右边所有可用项（即，已选择）变更之后，同步到上游
      rightOptions(list) {
        this.$emit("syncCheckedOptions", list);
      }
    },

    mounted() {
      this.updateCachedView();
    },

    methods: {
      // 禁用列表筛选
      filterDisabledList(target) {
        return this.disabledList.reduce((list, item) => {
          let index = target.findIndex((obj) => {
            return obj[this.trackByField] === item[this.trackByField];
          });

          if (index > -1 ) {
            list.push(item);
          }

          return list;
        }, []);
      },

      // 移动到左侧
      moveToLeft() {
        // 如果没有选择，返回
        if (this.rightChecked.length === 0) {
          return;
        }

        // 把右边已选择的移到左边
        this.leftOptions = this.leftOptions.concat(this.rightChecked);
        // 把右边可用的删除
        this.rightOptions = this.rightOptions.filter((item) => {
          let foundIndex = this.rightChecked.findIndex((itemSub) => {
            return itemSub[this.trackByField] === item[this.trackByField];
          });

          // 排除找到的已选择项
          return foundIndex < 0;
        });
        // 把右边已选的删除
        this.rightChecked = [];
      },

      // 移动到右侧
      moveToRight() {
        // 如果没有选择，返回
        if (this.leftChecked.length === 0) {
          return;
        }

        // 把左边已选择的移到右边
        this.rightOptions = this.rightOptions.concat(this.leftChecked);
        // 把左边可用的删除
        this.leftOptions = this.leftOptions.filter((item) => {
          let foundIndex = this.leftChecked.findIndex((itemSub) => {
            return itemSub[this.trackByField] === item[this.trackByField];
          });

          // 排除找到的已选择项
          return foundIndex < 0;
        });
        // 把左边已选的删除
        this.leftChecked = [];
      },

      // 更新本地缓存可用项视图
      updateCachedView() {
        let leftTmpOptions = [];
        let rightTmpOptions = [];

        // 从id反向查找出item
        this.optionsList.forEach((item) => {
          let foundIndex = this.checkedOptions.findIndex((itemSub) => {
            return itemSub[this.trackByField] === item[this.trackByField];
          });

          if (foundIndex > - 1) {
            rightTmpOptions.push(item);
          } else {
            leftTmpOptions.push(item);
          }
        });

        this.leftOptions = leftTmpOptions;
        this.rightOptions = rightTmpOptions;

        // 清空本地缓存已勾选
        this.leftChecked = [];
        this.rightChecked = [];
      }
    }
  };
</script>

<style lang="scss">
  @import "~__shared-libs/scss/lib-common-utils";

  .duplex-checklist {
    .checklist {
      @include border-radius(4px);

      float: left;
    }

    &__arrow {
      float: left;
      margin: sz(148) sz(10) 0 sz(10);

      &-first,
      &-send {
        @include border-radius(4px);

        cursor: default;
        display: block;
        width: sz(38);
        height: sz(28);
        border: 1px solid map-get($colors, dialog-input-border);
        position: relative;
        background: map-get($colors, dialog-input-disabled-bg);

        &::after {
          transform: rotate(45deg);
          position: absolute;
          top: 37%;
          display: block;
          content: "";
          width: sz(8);
          height: sz(8);
        }

        &--active {
          cursor: pointer;
          border: 1px solid map-get($colors, theme-blue);
          background: map-get($colors, theme-blue);
        }
      }
      &-first {
        &::after {
          border-left: 1px solid map-get($colors, border-gray);
          border-bottom: 1px solid map-get($colors, border-gray);
          left: sz(17);
        }

        &--active {
          @at-root #{get-bem-root()} &::after {
            border-left: 1px solid map-get($colors, pure-white);
            border-bottom: 1px solid map-get($colors, pure-white);
          }
        }
      }
      &-send {
        margin-top: sz(8);

        &--active {
          @at-root #{get-bem-root()} &::after {
            border-top: 1px solid map-get($colors, pure-white);
            border-right: 1px solid map-get($colors, pure-white);
          }
        }

        &::after {
          border-top: 1px solid map-get($colors, border-gray);
          border-right: 1px solid map-get($colors, border-gray);
          right: sz(17);
        }
      }
    }
  }
</style>
