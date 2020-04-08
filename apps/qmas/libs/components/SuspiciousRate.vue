<template>
  <div :class="{'hide': !display}"
    class="suspicious-rate">
    <div class="suspicious-rate__numerical">
      <span>从</span>
      <input
        :class="{
          'suspicious-rate__numerical-txt--active': isRed
        }"
        v-model="stValue"
        class="suspicious-rate__numerical-txt"
        type="text" />
      <span>%</span>

      <span>到</span>
      <input v-model="edValue"
        :class="{
          'suspicious-rate__numerical-txt--active': isRedTwo
        }"
        class="suspicious-rate__numerical-txt"
        type="text" />
      <span>%</span>
    </div>

    <div class="suspicious-rate__title">
      请输入{{ availableRange[0] }}-{{ availableRange[1] }}的数字
    </div>

    <div class="suspicious-rate__btn">
      <span @click="cancelData">取消</span>
      <span @click="confirmSelect">确定</span>
    </div>
  </div>
</template>

<script>
  import CustomizeCheckbox from "__shared-libs/components/CustomizeCheckbox";
  import isBadNumberFormat from "__libs/js/modules/filter-value-precision";
  import $ from "jquery";

  export default{
    name: "suspicious-rate",

    components: {
      CustomizeCheckbox
    },

    props: {
      // 是否显示
      display: {
        type: Boolean,
        default: false
      },

      // 默认从 0 - 100
      valueRange: {
        type: Array,
        default() {
          return [0, 100];
        }
      },

      // 可填写的范围
      availableRange: {
        type: Array,
        default() {
          return [0, 100];
        }
      }
    },

    data() {
      return {
        stValue: null,
        edValue: null,
        isRed: false,
        isRedTwo: false
      };
    },

    watch: {
      // 同步本地数据
      valueRange() {
        this.doReset();
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
      // 取消按钮
      cancelData() {
        this.cancelSelect();
      },

      // 重置操作
      doReset() {
        // 重置为上一次的状态(注意：上游给的是数字，这里input输入框需要字符串，要显示转换)
        this.stValue = String(this.valueRange[0]);
        this.edValue = String(this.valueRange[1]);
      },

      // 确定按钮
      confirmSelect() {
        // trim (如果没有输入，使用默认值空字符串)
        let stValue = (this.stValue || "").trim();
        let edValue = (this.edValue || "").trim();

        // 每次确认按钮时重新判断，需要赋初值
        this.isRed = false;
        this.isRedTwo = false;

        // 1. 开始值如果输入空字符串，直接报错，不再继续验证格式
        // 2. 开始值格式不对，不是双精度数字，比如 1.2%#sa
        if (
          stValue === "" ||
          isBadNumberFormat(stValue)
        ) {
          this.isRed = true;

          return;
        }

        // 1. 结束值如果输入空字符串，直接报错，不再继续验证格式
        // 2. 结束值格式不对，不是双精度数字，比如 1.2%#sa
        if (
          edValue === "" ||
          isBadNumberFormat(edValue)
        ) {
          this.isRedTwo = true;

          return;
        }

        // 转换为浮点数
        stValue = parseFloat(stValue);
        edValue = parseFloat(edValue);

        // 开始值不是数字，或超出临界值
        if (
          stValue < this.availableRange[0] || stValue > this.availableRange[1]
        ) {
          this.isRed = true;

          return;
        }

        // 结束值不是数字，或超出临界值
        // 开始值不能大于结束值
        if (
          edValue < this.availableRange[0] ||
          edValue > this.availableRange[1] ||
          edValue < stValue
        ) {
          this.isRedTwo = true;

          return;
        }

        this.$emit("confirmSelect", [stValue, edValue]);
      },

      // 取消输入
      cancelSelect() {
        this.isRed = false;
        this.isRedTwo = false;
        this.stValue = String(this.valueRange[0]);
        this.edValue = String(this.valueRange[1]);
        this.$emit("cancelSelect");
      },

      // 如果点击非calendar区域，触发关闭事件
      docClickDebouncer(evt) {
        if ($(evt.target).parents(".suspicious-rate")[0] !== this.$el) {
          this.cancelSelect();
        }
      }
    }
  };
</script>

<style lang="scss">
  @import "~__libs/scss/lib-common-utils";

  .suspicious-rate {
    @include border-radius(5px);

    background: map-get($colors, pure-white);
    width: sz(193);
    height: sz(98);
    border: 1px solid map-get($colors, dropdown-box-border);
    font-size: map-get($font-sizes, xs);
    font-weight: normal;

    &__numerical {
      width: sz(173);
      height: sz(38);
      line-height: sz(38);
      font-size: map-get($font-sizes, base);
      margin: 0 auto;

      &-txt {
        @include border-radius(5px);

        width: sz(40);
        height: sz(25);
        line-height: sz(25);
        padding: 0 sz(7);
        border: 1px solid map-get($app-colors, dropdown-options-border);
        color: map-get($colors, text-light);

        &--active {
          border: 1px solid map-get($app-colors, error-text-color);
        }

        &:focus {
          border: 1px solid map-get($colors, theme-blue);
        }
      }
      span {
        &:last-child {
          margin-right: 0;
        }

        margin-right: sz(5);
      }
    }

    &__title {
      text-align: center;
      line-height: sz(27);
      color: map-get($colors, placeholder-text-color);
    }

    &__btn {
      span {
        @include border-radius(5px);
        cursor: pointer;
        display: inline-block;
        width: sz(45);
        height: sz(20);
        line-height: sz(20);
        text-align: center;
        border: 1px solid map-get($colors, theme-blue);
        margin: sz(5) 0 0 sz(31);
        background: map-get($colors, pure-white);
        color: map-get($colors, theme-blue);

        &:last-child {
          background: map-get($colors, theme-blue);
          color: map-get($colors, pure-white);
        }
      }
    }
  }
</style>
