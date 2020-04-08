<template>
  <span
    :class="{
      'customize-checkbox--active': modelValue,
      'customize-checkbox--disabled': disabled
    }"
    class="customize-checkbox"
    @click.stop="changeStatus">
    <span
      :class="{
        'customize-checkbox__check': type==='checkbox',
        'customize-checkbox__radio': type==='radio'
      }"
    ></span>
    <label v-if="hasText"
      :title="txt"
      class="customize-checkbox__label">
      {{ txt }}
    </label>
  </span>
</template>

<script>
  export default {
    name: "customize-checkbox",

    model: {
      prop: "checked",
      event: "change"
    },

    props: {
      // 当取消选择之后 v-model 使用默认值
      // 解决取消选择之后不能再次选上的问题
      fallbackValue: {
        // 和 checked 保持完全一致
        type: [Array, String, Number, Boolean],
        default: null
      },

      // 是否允许取消选择
      allowEmpty: {
        type: Boolean,
        default: true
      },

      hasText: {
        type: Boolean,
        default: false
      },

      type: {
        type: String,
        default: "checkbox"
      },

      disabled: {
        type: Boolean,
        default: false
      },

      checked: {
        type: [Array, String, Number, Boolean],
        default: null
      },

      value: {
        type: [String, Number, Object],
        default: null
      },

      txt: {
        type: String,
        default: ""
      }
    },

    computed: {
      modelValue() {
        let retVal;

        if (
          typeof (this.checked) === "string" &&
          this.type === "radio"
        ) {
          retVal = this.checked === this.value;
        } else if (
          typeof (this.checked) === "boolean" &&
          this.type === "checkbox"
        ) {
          retVal = this.checked === true;
        } else if (
          typeof (this.checked) === "number"
        ) {
          retVal = this.checked === this.value;
        } else if (
          Array.isArray(this.checked) &&
          this.type === "checkbox"
        ) {
          retVal = this.checked.findIndex((item) => {
            return item === this.value;
          }) > -1;
        }

        return retVal;
      }
    },

    methods: {
      // 改变选中的状态
      changeStatus() {
        if (this.disabled) {
          return;
        } else if (!this.modelValue) {
          this.active();
        } else {
          if (this.allowEmpty) {
            this.unActive();
          }
        }
      },

      // 根据父组件定义的缓冲变量类型来确定点击之后产生的状态变化__选中
      active() {
        if (
          typeof (this.checked) === "string" &&
          this.type === "radio"
        ) {
          this.$emit("change", this.value);
        } else if (
          typeof (this.checked) === "number"
        ) {
          this.$emit("change", this.value);
        } else if (
          typeof (this.checked) === "boolean" &&
          this.type === "checkbox"
        ) {
          this.$emit("change", true);
        } else if (
          Array.isArray(this.checked) &&
          this.type === "checkbox"
        ) {
          this.checked.push(this.value);
          this.$emit("change", this.checked);
        }
      },

      // 根据父组件定义的缓冲变量类型来确定点击之后产生的状态变化__未选中
      unActive() {
        if (
          typeof (this.checked) === "string" &&
          this.type === "radio"
        ) {
          this.$emit("change", this.fallbackValue);
        } else if (
          typeof (this.checked) === "number"
        ) {
          this.$emit("change", this.fallbackValue);
        } else if (
          typeof (this.checked) === "boolean" &&
          this.type === "checkbox"
        ) {
          this.$emit("change", this.fallbackValue);
        } else if (
          Array.isArray(this.checked) &&
          this.type === "checkbox"
        ) {
          this.deleteValue();
          this.$emit("change", this.checked);
        }
      },

      // 当未选中状态时,删除对应的项__多个的条件下
      deleteValue() {
        let idx = this.checked.findIndex((item) => {
          return item === this.value;
        });

        this.checked.splice(idx, 1);
      }
    }
  };
</script>

<style lang="scss">
  @import "~__shared-libs/scss/lib-common-utils";

  .customize-checkbox {
    display: inline-block;

    &__check {
      @include border-radius(3px);

      width: sz(16);
      height: sz(16);
      display: inline-block;
      border: 1px solid map-get($colors, border-gray);

      &:hover {
        cursor: pointer;
      }

      @at-root #{get-bem-root()}--active & {
        border-color: map-get($colors, theme-blue);
        background-color: map-get($colors, theme-blue);
        background-image: url("~__shared-libs/imgs/patient-table-check.png");
        background-repeat: no-repeat;
        background-position: center center;
      }

      @at-root #{get-bem-root()}--disabled & {
        border-color: map-get($colors, checkbox-default-border);
        background-image: none;
        background-color: map-get($colors, checkbox-disabled-bg);

        &:hover {
          cursor: default;
        }
      }
    }

    &__radio {
      @include border-radius(50%);

      width: sz(14);
      height: sz(14);
      display: inline-block;
      border: 1px solid map-get($colors, checkbox-default-border);
      cursor: default;
      vertical-align: middle;

      @at-root #{get-bem-root()}--active & {
        width: sz(6);
        height: sz(6);
        border: sz(5) solid map-get($colors, theme-blue);
      }

      @at-root #{get-bem-root()}--disabled & {
        border-color: map-get($colors, checkbox-default-border);
        background-image: none;
        background-color: map-get($colors, checkbox-disabled-bg);

        &:hover {
          cursor: default;
        }
      }
    }

    // 是否显示文字（文字可点击）
    &__label {
      @include word-hidden(sz(500), max-width);

      display: inline-block;
      line-height: sz(18);
      height: sz(18);
    }
  }
</style>
