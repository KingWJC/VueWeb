<template>
  <div class="multi-filter-item">
    <div class="multi-filter-item__all">
      <customize-checkbox
        v-model="checkedAll"
        :hasText="true"
        txt="全选">
      </customize-checkbox>
    </div>

    <div class="multi-filter-item__list">
      <ul>
        <li v-for="(item, index) in originalList"
          :key="index">
          <customize-checkbox
            v-model="checkedList"
            :value="item[trackBy]"
            :hasText="true"
            :txt="item[label]">
          </customize-checkbox>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import CustomizeCheckbox from "__shared-libs/components/CustomizeCheckbox";

  export default {
    name: "multi-filter-item",

    components: {
      CustomizeCheckbox
    },

    model: {
      prop: "upperCheckedList",
      event: "changeChecked"
    },

    props: {
      // 与上游交互的选中列表
      upperCheckedList: {
        type: Array,
        default() {
          return [];
        }
      },

      // 渲染的全部列表
      originalList: {
        type: Array,
        default() {
          return [];
        }
      },

      // 页面渲染内容时的键
      label: {
        type: String,
        default: ""
      },

      // 渲染列表单元唯一标识
      trackBy: {
        type: String,
        default: ""
      }
    },

    computed: {
      // 是够否选中了全部
      checkedAll: {
        get() {
          return this.checkedList.length === 0
            ? false
            : (this.checkedList.length === this.originalList.length
              ? true
              : false
          );
        },

        set(val) {
          if (val) {
            this.checkedList = this.originalList.map((item) => {
              return item[this.trackBy];
            });
          } else {
            this.checkedList = [];
          }
        }
      },

      // 本地的选中列表
      checkedList: {
        get() {
          return this.upperCheckedList.map((item) => {
            return item[this.trackBy];
          });
        },

        set(val) {
          let tmp = val.reduce((fresh, item) => {
            let target = this.originalList.find((obj) => {
              return obj[this.trackBy] === item;
            });

            if (target) {
              fresh.push(target);
            }

            return fresh;
          }, []);

          this.$emit("changeChecked", tmp);
        }
      }
    },

    watch: {
      originalList() {
        this.checkedAll = true;
      }
    },

    mounted() {
      this.checkedAll = true;
    }
  };
</script>

<style lang="scss">
  @import "~__libs/scss/lib-common-utils";

  .multi-filter-item {
    &__all {
      text-align: left;
      padding-left: sz(11);
    }

    &__list {
      @include border-radius(4px);

      text-align: left;
      border: 1px solid map-get($colors, dialog-input-border);
      min-height: sz(30);
      overflow-y: auto;
      margin-top: sz(5);
      max-height: sz(390);

      ul {
        @extend %normalized-list;

        padding-left: sz(10);

        li {
          height: sz(30);
          line-height: sz(38);
        }
      }
    }

    .customize-checkbox {
      font-size: map-get($font-sizes, xs);
      line-height: sz(10);
      color: map-get($colors, dialog-text-color);
    }
  }
</style>
