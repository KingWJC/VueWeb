<template>
  <div :class="{'hide': !display}"
    class="options-dropdown">
    <div class="options-dropdown__names">
      <p class="options-dropdown__names-alls">
        <customize-checkbox
          v-model="checkboxAll"
          :hasText="true"
          :txt="allName">
        </customize-checkbox>
      </p>

      <div class="options-dropdown__names-contxt">
        <p v-for="(item, index) in optionArr"
          :key="index"
          :title="item[objectName]"
          class="options-dropdown__names-contxt-alls">

          <customize-checkbox
            v-model="checkboxItems"
            :value="item[objectCode]"
            :hasText="true"
            :txt="item[objectName]">
          </customize-checkbox>
        </p>
      </div>

      <div class="options-dropdown__names-down">
        <a class="btn btn--white options-dropdown__names-down-cancel"
          @click="cancelData">取消</a>

        <a
          :class="{
            'btn--disabled': checkboxItems.length === 0
          }"
          class="btn options-dropdown__names-down-oks"
          @click="okData">确定</a>
      </div>
    </div>
  </div>
</template>

<script>
  import CustomizeCheckbox from "./CustomizeCheckbox";
  import $ from "jquery";

  export default {
    name: "options-dropdown",

    components: {
      CustomizeCheckbox
    },

    props: {
      // 是否显示
      display: {
        type: Boolean,
        default: false
      },

      // 可选项列表
      // {
      // ...
      // isChecked: Boolean
      // }
      optionArr: {
        type: Array,
        default() {
          return [];
        }
      },

      // 选项唯一id字段名
      objectCode: {
        type: String,
        default: ""
      },

      // 选项title字段名
      objectName: {
        type: String,
        default: ""
      },

      // 选项列表标题
      allName: {
        type: String,
        default: ""
      }
    },

    data() {
      return {
        checkboxItems: this.getOriginalCheckedItemIds()
      };
    },

    computed: {
      // 是否全选
      isCheckall() {
        // 必须显示的return 一个Boolean，
        // 否则customized-checkbox内部无法进行值比对导致
        // 不能再次选中
        return this.checkboxItems.length === this.optionArr.length &&
          this.optionArr.length !== 0;
      },

      // 全选和不选
      checkboxAll: {
        get() {
          return this.isCheckall;
        },

        set() {
          if (this.isCheckall) {
            this.checkboxItems = [];
          } else {
            let ret = [];

            for (let i = 0; i < this.optionArr.length; i++) {
              ret.push(this.optionArr[i][this.objectCode]);
            }
            this.checkboxItems = ret;
          }
        }
      }
    },

    watch: {
      optionArr() {
        this.checkboxItems = this.getOriginalCheckedItemIds();
      },

      display() {
        // 事件节流，只有对话框打开的时间才响应全局事件
        if (this.display) {
          // 异步触发，因为在当前瞬间视图还没更新完成，props状态也还没同步完成
          // 但是我们不能用

          setTimeout(() => {
            $(document).on("click", this.docClickDebouncer);
          }, 0);
        } else {
          $(document).off("click", this.docClickDebouncer);
        }
      }
    },

    methods: {
      // 确定按钮
      okData() {
        // 没有任何被选中
        if (this.checkboxItems.length === 0) {
          return;
        }

        // 选中项的ids,父组件需要据此进行合并更新 options 列表
        this.$emit("checkboxAll", this.checkboxItems);
      },

      // 取消按钮
      cancelData() {
        // 重置选择状态为初始状态
        this.checkboxItems = this.getOriginalCheckedItemIds();
        // this.$emit('checkboxAll',this.checkboxItems,);
        this.$emit("cancelSelect");
      },

      // 筛选出初始状态(props)下选中的item的ids
      getOriginalCheckedItemIds() {
        let ret = [];

        this.optionArr.forEach((item) => {
          if (item.isChecked) {
            ret.push(item[this.objectCode]);
          }
        });

        return ret;
      },

      // 如果点击非calendar区域，触发关闭事件
      docClickDebouncer(evt) {
        if ($(evt.target).parents(".options-dropdown")[0] !== this.$el) {
          this.cancelData();
        }
      }
    }
  };
</script>

<style lang="scss">
  @import "~__shared-libs/scss/lib-common-utils";

  .options-dropdown {
    display: inline-block;
    position: relative;

    .customize-checkbox {
      padding-top: sz(4);

      &__label {
        max-width: sz(160 - 18 - 5 - 2);
      }
    }

    &__shuju {
      display: inline-block;
    }

    &__names {
      @include border-radius(6px 6px 0 0);

      z-index: 1;
      font-size: map-get($font-sizes, base);
      cursor: default;
      width: sz(200);
      height: sz(320);
      background: map-get($colors, pure-white);
      position: absolute;
      top: sz(-15);

      &-alls {
        @include border-radius(6px 6px 0 0);

        margin: 0;
        padding-left: sz(20);
        height: sz(37);
        line-height: sz(37);
        color: map-get($colors, essential-header);
        background: map-get($colors, tab-bg);
        border: 1px solid map-get($colors, dropdown-box-border);
        border-bottom: 0;
      }
      &-contxt {
        height: sz(245);
        overflow-y: auto;
        overflow-x: hidden;
        border: 1px solid map-get($colors, dropdown-box-border);

        &-alls {
          margin: 0;
          padding: 0 sz(20);
          height: sz(32);
          line-height: sz(32);
          color: map-get($colors, essential-header);
          // 减去 2px 的左右宽度
          width: sz(160 - 2);

          &:hover {
            background: map-get($colors, bg-home);
          }

          &-span {
            vertical-align: middle;
          }
        }
      }

      &-down {
        @include border-radius(0 0 6px 6px);

        padding: sz(4) 0;
        text-align: center;
        background: map-get($colors, tab-bg);
        border: 1px solid map-get($colors, dropdown-box-border);
        border-top: 0;

        &-oks,
        &-cancel {
          width: sz(64);
          font-size: map-get($font-sizes, xs);
        }

        &-oks {
          margin-left: sz(4);
        }

        &--active {
          border: 1px solid map-get($colors, theme-blue);
          background: map-get($colors, theme-blue);
          color: map-get($colors, pure-white);
          cursor: pointer;
        }
      }
    }
  }
</style>
