<template>
  <div class="filters">
    <div class="filters__divs filters__divs--name">
      <p>名称:</p>
      <input v-model="ORDER_ITEM_NAME"
        type="text" />
    </div>

    <template v-if="dataSourceCode === '1'">
      <div class="filters__divs filters__divs--unit">
        <p>剂量单位:</p>
        <select-dropdown-v2
          v-model="selectedUnitValue"
          :options="unitList"
          label="DOSE_UNIT"
          trackBy="DOSE_ONCE">
        </select-dropdown-v2>
      </div>
    </template>

    <div class="filters__divs filters__divs--values">
      <p>剂量值:</p>
      <input v-model="doseOnceMin"
        type="text"
        @blur="verifyPrecisionValue" />
      <span>至</span>
      <input v-model="doseOnceMax"
        type="text"
        @blur="verifyPrecisionValue" />
    </div>

    <template v-if="dataSourceCode === '1'">
      <div class="filters__divs filters__divs--usage">
        <p>用法:</p>
        <select-dropdown-v2
          v-model="selectedUsageValue"
          :options="usageList"
          label="GYTJ_NAME"
          trackBy="GYTJ_ID">
        </select-dropdown-v2>
      </div>
    </template>

    <div class="filters__divs filters__divs--actions">
      <p>&nbsp;</p>
      <button @click="filtersAll()">筛选</button>
    </div>
  </div>
</template>

<script>
  import filterValuePrecision from "__libs/js/modules/filter-value-precision";

  export default {
    name: "filters",

    props: {
      dataList: {
        type: Array,
        default() {
          return [];
        }
      },

      // 父级传入的默认筛选项
      filterOptions: {
        type: Object,
        default() {
          return {};
        }
      },

      dataSourceCode: {
        type: String,
        default: ""
      }
    },

    data() {
      return {
        ORDER_ITEM_NAME: "",
        doseOnceMin: "",
        doseOnceMax: "",
        selectedUnitValue: {
          DOSE_UNIT: "全部",
          DOSE_ONCE: "*"
        },
        selectedUsageValue: {
          GYTJ_NAME: "全部",
          GYTJ_ID: "*"
        }
      };
    },

    computed: {
      // 可选单位列表（已去重）
      unitList() {
        return this.getUniqueOptionsList("DOSE_UNIT", "DOSE_ONCE");
      },

      // 可选用法列表（已去重）
      usageList() {
        return this.getUniqueOptionsList("GYTJ_NAME", "GYTJ_ID");
      }
    },

    watch: {
      // 父亲参数变更之后，更新本地缓存
      filterOptions(value) {
        this.ORDER_ITEM_NAME = value.ORDER_ITEM_NAME || "";
        this.doseOnceMin = value.doseOnceMin || "";
        this.doseOnceMax = value.doseOnceMax || "";

        this.selectedUnitValue = value.unitValue
          ? Object.assign(
            {},
            this.selectedUnitValue,
            {DOSE_UNIT: value.unitValue}
        ) : null;

        this.selectedUsageValue = value.useageValue
          ? Object.assign(
            {},
            this.selectedUsageValue,
            {GYTJ_NAME: value.useageValue}
        ) : null;
      }
    },

    methods: {
      verifyPrecisionValue() {
        if (filterValuePrecision(this.doseOnceMin)) {
          this.doseOnceMin = "";
        }

        if (filterValuePrecision(this.doseOnceMax)) {
          this.doseOnceMax = "";
        }
      },

      filtersAll() {
        let options = {};
        let oin = this.ORDER_ITEM_NAME.trim();
        let domin = this.doseOnceMin.trim();
        let domax = this.doseOnceMax.trim();
        let du = this.selectedUnitValue
          ? this.selectedUnitValue.DOSE_UNIT.trim()
          : "";
        let gn = this.selectedUsageValue
          ? this.selectedUsageValue.GYTJ_NAME.trim()
          : "";

        if (oin !== "") {
          options.ORDER_ITEM_NAME = oin;
        }

        if (domin !== "") {
          options.doseOnceMin = domin;
        }

        if (domax !== "") {
          options.doseOnceMax = domax;
        }

        if (du !== "") {
          options.unitValue = this.selectedUnitValue.DOSE_UNIT;
        }

        if (gn !== "") {
          options.useageValue = this.selectedUsageValue.GYTJ_NAME;
        }

        this.$emit("filterOptionsChanged", options);
      },

      // 获得筛选唯一选项列表
      // @params {String} label dropdown label
      // @params {String} trackBy dropdown trackBy
      getUniqueOptionsList(label, trackBy) {
        let initAccu = {};

        initAccu[label] = "全部";
        initAccu[trackBy] = "*";

        return this.dataList.reduce((tmpList, curItem, index) => {
          // 不为空
          if (curItem[label] !== null && curItem[label] !== "") {
            // 单位是不是已经有了，没有就 push
            if (tmpList.findIndex((subItem) => {
              return subItem[label] === curItem[label];
            }) < 0) {
              tmpList.push({
                [label]: curItem[label],
                [trackBy]: index
              });
            }
          }

          return tmpList;
        }, [initAccu]);
      }
    }
  };
</script>

<style lang="scss">
  @import "~__libs/scss/lib-common-utils";

  .filters {
    margin-bottom: sz(10);
    height: sz(60);

    &__divs {
      float: left;
      margin-right: sz(18);

      > p {
        margin: 0;
      }

      span,
      input,
      select,
      button {
        display: inline-block;
        line-height: sz(30);
        height: sz(30);
      }

      &--name {
        width: sz(140);

        input {
          @include border-radius(5px);

          width: 100%;
          border: 1px solid map-get($colors, dialog-input-border);
          padding: 0 sz(5);
        }
      }

      &--unit {
        width: sz(110);

        .select-dropdown-v2 {
          width: sz(110);
        }
      }

      &--values {
        width: sz(174);
        margin-right: 0;

        input {
          @include border-radius(5px);

          width: 38%;
          border: 1px solid map-get($colors, dialog-input-border);
          padding: 0 sz(5);
        }

        span {
          &:nth-child(2) {
            display: inline-block;
            padding: 0 sz(10);
          }
        }
      }

      &--usage {
        .select-dropdown-v2 {
          width: sz(140);
        }

        select {
          @include border-radius(5px);

          width: 100%;
          border: 1px solid map-get($colors, dialog-input-border);
          padding: 0 sz(5);
        }
      }

      &--actions {
        margin-right: 0;
        width: sz(60);

        span {
          color: map-get($colors, pure-white);
        }

        button {
          @include border-radius(5px);

          width: sz(60);
          border: none;
          background: map-get($colors, theme-blue);
          color: map-get($colors, pure-white);
          cursor: pointer;
        }
      }
    }
  }
</style>
