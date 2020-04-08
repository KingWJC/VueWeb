<template>
  <div class="checkbox-group">
    <p class="checkbox-group__alls">
      <customize-checkbox
        v-model="allCheckedIds"
        :hasText="true"
        :txt="title">
      </customize-checkbox>
    </p>

    <ul class="checkbox-group__contxt clearfix">
      <li
        v-for="(item, index) in optionsList"
        :key="index"
        class="checkbox-group__contxt-alls">
        <customize-checkbox
          v-model="checkedIds"
          :value="item[trackByField]"
          :hasText="true"
          :txt="item[labelField]">
        </customize-checkbox>

        <slot
          :item="item">
        </slot>
      </li>
    </ul>
  </div>
</template>

<script>
  import CustomizeCheckbox from "__shared-libs/components/CustomizeCheckbox";

  export default {
    // 选择列表
    name: "checkbox-group",

    components: {
      CustomizeCheckbox
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

      // 选择器标题
      title: {
        type: String,
        default: ""
      },

      // 输入框提示文案
      inputTips: {
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
      }
    },

    data() {
      return {
        checkedIds: []
      };
    },

    computed: {
      // 全选 全不选
      allCheckedIds: {
        get() {
          if (this.checkedIds.length === 0) {
            return false;
          } else {
            return this.checkedIds.length === this.optionsList.length;
          }
        },

        set() {
          if (this.checkedIds.length === this.optionsList.length) {
            this.twoWaySync([], []);
          } else {
            let mirrorItems = [];
            let tmpCheckedIds = [];

            this.optionsList.forEach((item) => {
              mirrorItems.push(item);
              tmpCheckedIds.push(item[this.trackByField]);
            });

            this.twoWaySync(mirrorItems, tmpCheckedIds);
          }
        }
      }
    },

    watch: {
      // 可用选项变更之后，需要重新计算缓存勾选项
      optionsList() {
        this.updateCachedView();
      },

      // 单个勾选
      checkedIds(ids) {
        // 从id反向查找出item
        let items = this.optionsList.reduce((tmpList, cur) => {
          if (ids.indexOf(cur[this.trackByField]) > -1) {
            tmpList.push(cur);
          }

          return tmpList;
        }, []);

        // 通知上游同步
        this.$emit("syncCheckedOptions", items);
      }
    },

    mounted() {
      this.updateCachedView();
    },

    methods: {
      // 双向同步（上游 v-model，下游 checkbox）
      twoWaySync(checkedItems, checkedIds) {
        // 同步下游checkbox
        this.checkedIds = checkedIds;
        // 通知上游同步
        this.$emit("syncCheckedOptions", checkedItems);
      },

      // 从所有选择项中找出id
      updateCachedView() {
        let checkedIds = [];

        // 从id反向查找出item
        this.optionsList.forEach((item) => {
          let foundIndex = this.checkedOptions.findIndex((itemSub) => {
            return itemSub[this.trackByField] === item[this.trackByField];
          });

          if (foundIndex > -1) {
            checkedIds.push(item[this.trackByField]);
          }
        });

        this.checkedIds = checkedIds;
      }
    }
  };
</script>

<style lang="scss">
  @import "~__shared-libs/scss/lib-common-utils";

  .checkbox-group {
    @include border-radius(6px);

    position: relative;
    width: sz(560);
    border: 1px solid map-get($colors, checkboxgroup-bg);
    background: map-get($colors, tab-bg);

    &__alls {
      background-color: map-get($colors, checkbox-group-head-bg);
      text-align: left;
      position: absolute;
      top: sz(-12);
      left: sz(10);
      margin: 0;
    }

    &__contxt {
      @extend %normalized-list;

      padding: sz(20) sz(10) 0 sz(10);

      &-alls {
        float: left;
        padding-bottom: sz(8);
        text-align: left;
        margin-right: sz(20);
      }
    }
  }
</style>
