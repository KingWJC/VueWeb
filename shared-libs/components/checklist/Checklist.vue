<template>
  <div class="checklist">
    <div class="checklist__header">{{ title }}</div>

    <div class="checklist__center">
      <div class="checklist__center-top">
        <input :placeholder="inputTips"
          v-model="inputValue"
          type="text" />
        <img src="~__shared-libs/imgs/search-magnifier.png" />
      </div>

      <template v-if="availableItemsLength > 0">
        <ul class="checklist__center-down">
          <li v-for="(item,index) in availableItems"
            :key="index"
            class="checklist__center-down-cont">

            <customize-checkbox
              v-model="checkedIds"
              :value="item[trackByField]"
              :hasText="true"
              :txt="item[labelField]"
              :disabled="disabledIndex(item[trackByField])">
            </customize-checkbox>
          </li>
        </ul>
      </template>
      <template v-else>
        <slot name="noResult">
          <p class="checklist__no-result">无相关数据</p>
        </slot>
      </template>
    </div>

    <div class="checklist__footer">
      <customize-checkbox
        v-model="allCheckedIds"
        :hasText="true"
        :txt="
          checkedIdsLength > 0
            ? `已选 ${checkedIdsLength}/${availableItemsLength} 项`
            : `共 ${availableItemsLength} 项`
        "
        :disabled="availableItems.length === disabledList.length">
      </customize-checkbox>
    </div>
  </div>
</template>

<script>
  import CustomizeCheckbox from "__shared-libs/components/CustomizeCheckbox";

  export default {
    // 选择列表
    name: "checklist",

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
      },

      // 禁用列表
      disabledList: {
        type: Array,
        default() {
          return [];
        }
      }
    },

    data() {
      return {
        checkedIds: [],

        // 查询内容
        inputValue: ""
      };
    },

    computed: {

      // vue监测不到 数组长度动态变化，所以要做计算属性
      availableItemsLength() {
        return this.availableItems.length;
      },

      // vue监测不到 数组长度动态变化，所以要做计算属性
      checkedIdsLength() {
        return this.checkedIds.length;
      },

      // 全选 全不选
      allCheckedIds: {
        get() {
          return this.checkedIds.length ===
            this.availableItems.length - this.disabledList.length;
        },

        set(value) {
          if (value) {
            let mirrorItems = [];
            let tmpCheckedIds = [];

            this.availableItems.forEach((item) => {
              let index = this.disabledList.findIndex((obj) => {
                return obj[this.trackByField] === item[this.trackByField];
              });

              if (index < 0) {
                mirrorItems.push(item);
                tmpCheckedIds.push(item[this.trackByField]);
              }
            });
            this.twoWaySync(mirrorItems, tmpCheckedIds);
          } else {
            this.twoWaySync([], []);
          }
        }
      },

      // 需要渲染到下拉框中的数据(包括模糊匹配的结果)
      availableItems() {
        let inputValue = this.inputValue.trim();

        return inputValue === "" ?
          this.optionsList :
          this.optionsList.filter((item) => {
            return item[this.labelField].indexOf(inputValue) > -1;
        });
      }
    },

    watch: {
      // 可用选项变更之后，需要重新计算缓存勾选项
      optionsList() {
        this.checkedIds = [];
      },

      // 单个勾选
      checkedIds(ids) {
        // 从id反向查找出item
        let items = this.availableItems.reduce((tmpList, cur) => {
          if (ids.indexOf(cur[this.trackByField]) > -1) {
            tmpList.push(cur);
          }

          return tmpList;
        }, []);

        // 通知上游同步
        this.$emit("syncCheckedOptions", items);
      },

      // 输入框值发生了变化
      inputValue(val, oldVal) {
        // 如果输入框值发生了变化，需要清空已勾选项
        if (val !== oldVal) {
          this.checkedIds = [];
        }
      }
    },

    methods: {
      // 列表项是否禁用处理
      disabledIndex(trackBy) {
        return this.disabledList.findIndex((item) => {
          return item[this.trackByField] === trackBy;
        }) > - 1;
      },

      // 双向同步（上游 v-model，下游 checkbox）
      twoWaySync(checkedItems, checkedIds) {
        // 同步下游checkbox
        this.checkedIds = checkedIds;
        // 通知上游同步
        this.$emit("syncCheckedOptions", checkedItems);
      }
    }
  };
</script>

<style lang="scss">
  @import "~__shared-libs/scss/lib-common-utils";

  .checklist {
    width: sz(200);
    height: sz(320);
    color: map-get($colors, essential-header);

    &__header,
    &__footer {
      @include border-radius(4px 4px 0 0);
      border: 1px solid map-get($colors, dropdown-box-border);
      height: sz(37);
      line-height: sz(37);
      padding-left: sz(10);
      text-align: left;
      background: map-get($colors, tab-bg);
    }

    &__footer {
      @include border-radius(0 0 4px 4px);
    }

    &__center {
      height: sz(242);
      border: 1px solid map-get($colors, dropdown-box-border);
      border-bottom: none;
      border-top: none;

      &-top {
        position: relative;
        width: sz(198);
        height: sz(36);

        input {
          @include border-radius(5px);
          @include placeholder-color(map-get($colors, placeholder-text-color));

          font-size: map-get($font-sizes, xs);
          height: sz(25);
          width: sz(180);
          margin: sz(10) sz(10);
          border: 1px solid map-get($colors, input-lighter-border);
          padding: 0 sz(30) 0 sz(10);

          &:focus {
            border: 1px solid map-get($colors, theme-blue);
          }
        }

        img {
          position: absolute;
          top: sz(16);
          right: sz(23);
        }
      }

      &-down {
        @extend %normalized-list;
        max-height: sz(206);
        overflow: auto;
        overflow-x: hidden;

        &-cont {
          @include word-hidden(sz(176));
          padding-left: sz(10);
          text-align: left;
          height: sz(32);
          line-height: sz(32);

          &:hover {
            background: map-get($colors, bg-home);
          }
        }
      }
    }

    .customize-checkbox {
      height: 100%;
      padding-top: sz(4);

      &__input {
        width: sz(13);
        height: sz(13);
        margin-right: sz(7);
      }

      &__label {
        @extend %overflow-hidden-word;
        width: sz(137);
        display: inline-block;
      }
    }
  }
</style>
