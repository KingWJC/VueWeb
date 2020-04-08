<template>
  <div class="baseline-set">
    <div class="baseline-set__line">
      <customize-checkbox
        v-model="checkboxStatus"
        :hasText="true"
        :fallbackValue="false"
        :txt="baselineUnit ?
          `${baselineName} ${baselineUnit} :` : `${baselineName} :`
        ">
      </customize-checkbox>

      <span class="baseline-set__line-wrapper">
        <input :maxlength="baselineInputLength"
          v-model="cachedBaseline"
          class="baseline-set__line-wrapper-input"
          type="text" />

        <!-- 提示信息 -->
        <span
          :class="{
            'baseline-set__line-wrapper-tips--active': showTips
          }"
          class="baseline-set__line-wrapper-tips">
          {{ baseMsg }}
        </span>
      </span>

      <template v-if="isDynamic === 1">
        <span class="baseline-set__line-span">
          注:不同天数的基线根据单日基线自动计算
        </span>
      </template>
    </div>

    <div class="baseline-set__operate">
      <a href="javascript:;"
        class="btn btn--white baseline-set__operate-cancel"
        @click="cancelSaveBaseline">取消
      </a>

      <a href="javascript:;"
        class="btn baseline-set__operate-save"
        @click="saveBaseline">保存
      </a>
    </div>
  </div>
</template>

<script>
  import CustomizeCheckbox from "__shared-libs/components/CustomizeCheckbox";
  import checkBaselineFormat from "__shared-libs/js/modules/check-baseline-format";

  export default({
    name: "baseline-set",

    components: {
      CustomizeCheckbox
    },

    props: {
      // 基线值
      baselineValue: {
        type: String,
        default: ""
      },

      // 单位名称
      sdEkpiUnit: {
        type: String,
        default: "%"
      },

      // 是否使用预警值（选项：0(不使用)；1（使用））
      isDisplay: {
        type: Number,
        default: 1
      },

      // 指标类型
      // eva:评价指标； war：预警指标
      indexType: {
        type: String,
        default: ""
      },

      // 0数值，1百分比，2千分比，3中位数，4分母值
      sdEkpiConver: {
        type: Number,
        default: 1
      },

      // 基线精度
      precision: {
        type: Number,
        // 专病质量默认是 1，不要改成 null
        default: 1
      },

      // 是否为动态基线(from evaluateList)1是动态
      isDynamic: {
        type: Number,
        default: 0
      },

      // 指标类型
      sdEkpiType: {
        type: Number,
        default: 1
      },

      // 全院专科基线设置复选框旁边的文字 有自己的逻辑（evaBaseline）
      typeBaseline: {
        type: String,
        default: "warBaseline"
      }
    },

    data() {
      return {
        // 当前预警值选择对话框状态（已选 1/未选 0）
        checkboxStatus: this.isDisplay === 0 ? false : true,

        // 缓冲的基线值
        cachedBaseline: this.baselineValue === "-" ? "" : this.baselineValue,

        // 是否显示错误提示
        showTips: false,

        // 错误提示内容
        baseMsg: ""
      };
    },

    computed: {
      // 基线显示的单位
      baselineUnit() {
        return this.sdEkpiUnit ? `(${this.sdEkpiUnit})` : "";
      },

      // 基线 or 预警值
      baselineName() {
        let titleText;

        // 如果是专病，没有指标类型，使用 props 默认值空字符串对比，仍然为预警值
        if (this.indexType === "eva") {
          // 除全院专科的逻辑
          if (this.typeBaseline === "warBaseline") {
            // 统计指标
            if (this.sdEkpiType === 2) {
              titleText = this.isDynamic === 0 ? "基线" : "单日基线";
            } else {
              // 过程指标(没有单日基线一说)
              titleText = "预警值";
            }
          } else {
            titleText = this.isDynamic === 0 ? "基线" : "单日基线";
          }
        } else if (this.indexType === "war") {
          titleText = "预警值";
        }

        return titleText;
      },

      // 输入基线的允许位数
      baselineInputLength() {
        let retVal;

        if (
          this.sdEkpiConver === 2 ||
          this.sdEkpiConver === 0 ||
          this.sdEkpiConver === 4
        ) {
          retVal = this.precision + 6;
        } else if (this.sdEkpiConver === 3) {
          retVal = this.precision + 4;
        } else if (this.sdEkpiConver === 1) {
          retVal = this.precision + 3;
        }

        return retVal;
      }
    },

    methods: {
      // 取消保存基线
      cancelSaveBaseline() {
        this.$emit("cancelSet");
      },

      // 确认保存基线
      saveBaseline() {
        this.verifyBaseValue();

        if (!this.showTips) {
          let isDisplay = this.checkboxStatus ? 1 : 0;
          let baseline = this.cachedBaseline.trim();

          // 如果的确进行了更改，值 / 显示隐藏
          if (
            isDisplay !== this.isDisplay ||
            baseline === "" ||
            Number(baseline) !== Number(this.baselineValue)
          ) {
            this.$emit("saveSet", {
              value: baseline !== ""
                ? parseFloat(baseline).toFixed(this.precision)
                : "-",
              display: isDisplay
            });
          } else {
            // else: 没有更改任何项，直接取消设置基线即可
            this.cancelSaveBaseline();
          }
        }
      },

      // 验证基线
      verifyBaseValue() {
        let max = 0,
            code = 0,
            precision = this.precision,
            baseTitle = "预警值";

        // 如果是专病，没有指标类型，使用 props 默认值空字符串对比，仍然为预警值
        if (this.indexType === "eva") {
          baseTitle = "基线";
        } else if (this.indexType === "war") {
          baseTitle = "预警值";
        }

        if (
          this.sdEkpiConver === 2 ||
          this.sdEkpiConver === 0 ||
          this.sdEkpiConver === 4
        ) {
          max = 100000;
        } else if (this.sdEkpiConver === 3) {
          max = 1000;
        } else {
          max = 100;
        }

        code = checkBaselineFormat(this.cachedBaseline.trim(), max, precision);

        if (code !== 0) {
          if (code === 2) {
            this.baseMsg = `${baseTitle}为 0-${max} 之间`;
          } else {
            this.baseMsg = `${baseTitle}最多保留${precision}位小数`;
          }

          this.showTips = true;
        } else {
          this.baseMsg = "";
          this.showTips = false;
        }
      }
    }
  });
</script>

<style lang="scss">
  @import "~__libs/scss/lib-common-utils";

  .baseline-set {
    line-height: sz(16);

    &__line {
      &-wrapper {
        margin-left: sz(5);
        position: relative;

        &-input {
          @include border-radius(5px);

          border: 1px solid map-get($colors, dialog-input-border);
          height: sz(25);
          text-indent: sz(10);
          width: sz(140);
          font-size: sz(12);

          &::-ms-clear {
            display: none;
          }

          &:focus {
            border-color: map-get($colors, theme-blue);
          }
        }

        &-tips {
          @include border-radius(5px);

          display: none;
          border: 1px solid map-get($app-colors, tips-border);
          padding: 0 sz(10);
          background: map-get($app-colors, tips-background);
          color: map-get($app-colors, tips-color);
          width: sz(155);
          height: sz(25);
          line-height: sz(25);
          position: absolute;
          right: 0;
          top: sz(-37);

          &::before {
            @include transform(rotate(-45deg));

            content: "";
            display: block;
            position: absolute;
            width: sz(6);
            height: sz(6);
            top: sz(22);
            left: sz(160);
            border-bottom: 1px solid map-get($app-colors, tips-border);
            background: map-get($app-colors, tips-background);
          }

          &--active {
            display: inline-block;
          }
        }
      }

      &-span {
        white-space: nowrap;
        display: inline-block;
        margin-left: sz(10);
        color: map-get($colors, text-light);
        font-size: map-get($font-sizes, xs);
      }

      .customize-checkbox {
        vertical-align: middle;

        &__label {
          margin-left: sz(5);
        }

        &__check {
          vertical-align: top;
        }
      }
    }

    &__operate {
      &-save,
      &-cancel {
        margin: sz(10) sz(20) 0 0;
        width: sz(98);
        height: sz(28);
        line-height: sz(28);
      }

      &-save {
        margin: sz(10) 0 0 0;
      }
    }
  }
</style>
