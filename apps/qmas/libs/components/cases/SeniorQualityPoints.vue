<template>
  <div :class="{'hide': !display}"
    class="senior-quality-points">
    <div class="senior-quality-points__list clearfix">
      <div v-for="(item, index) in qualityPoints"
        :key="index"
        class="senior-quality-points__list-itemli clearfix">
        <div class="senior-quality-points__list-itemli-uls" >
          <span class="senior-quality-points__list-itemli-uls-span">
            {{ item.KPI_ALIAS }}
          </span>

          <customize-checkbox
            v-model="localMap[item.KPI_ID]"
            :hasText="true"
            :fallbackValue="2"
            :value="1"
            type="radio"
            txt="是">
          </customize-checkbox>

          <customize-checkbox
            v-model="localMap[item.KPI_ID]"
            :hasText="true"
            :fallbackValue="2"
            :value="0"
            type="radio"
            txt="否">
          </customize-checkbox>
        </div>
      </div>
    </div>

    <div class="senior-quality-points__btn">
      <a href="javascript:;"
        @click="resetSelect">重置</a>
      <a href="javascript:;"
        @click="confirmSelect">确定</a>
    </div>
  </div>
</template>

<script>
  import CustomizeCheckbox from "__shared-libs/components/CustomizeCheckbox";
  import $ from "jquery";

  export default{
    name: "senior-quality-points",

    components: {
      CustomizeCheckbox
    },

    props: {
      // 是否显示
      display: {
        type: Boolean,
        default: false
      },

      // 可用质控点
      qualityPoints: {
        type: Array,
        default() {
          return [];
        }
      },

      // 已选择质控点
      selectedQualityPointsMap: {
        type: Object,
        default() {
          return {};
        }
      }
    },

    data() {
      return {
        // 本地副本 map
        localMap: {}
      };
    },

    watch: {
      // 父亲map发生变化之后，重建本地map
      selectedQualityPointsMap: "updateLocalMap",

      display() {
        // 事件节流，只有对话框打开的时间才响应全局事件
        if (this.display) {
          setTimeout(() => {
            $(document).on("click", this.docClickDebouncer);
          }, 0);
        } else {
          $(document).off("click", this.docClickDebouncer);
        }
      }
    },

    mounted() {
      this.updateLocalMap();
    },

    methods: {
      // 重置按钮
      resetSelect() {
        // 重置的时候，就是清空所有的质控点
        this.localMap = Object.keys(this.localMap).reduce((tmpMap, key) => {
          tmpMap[key] = 2;

          return tmpMap;
        }, {});

        this.$emit("resetSelect", Object.assign({}, this.localMap));
      },

      // 确定按钮
      confirmSelect() {
        this.$emit("confirmSelect", Object.assign({}, this.localMap));
      },

      // 取消选择
      cancelSelect() {
        this.updateLocalMap();
        this.$emit("cancelSelect");
      },

      // 如果点击非calendar区域，触发关闭事件
      docClickDebouncer(evt) {
        if ($(evt.target).parents(".senior-quality-points")[0] !== this.$el) {
          this.cancelSelect();
        }
      },

      // 重建本地map
      updateLocalMap() {
        this.localMap = Object.assign({}, this.selectedQualityPointsMap);
      }
    }
  };
</script>

<style lang="scss">
  @import "~__libs/scss/lib-common-utils";

  .senior-quality-points {
    @include border-radius(5px);
    @include box-shadow(2px 2px 4px rgba(map-get($colors, pure-black), 0.1));

    // 相对页面定位（使用 teleporter 组件）
    position: absolute;
    width: sz(860);
    background: map-get($colors, pure-white);
    border: 1px solid map-get($colors, dropdown-box-border);
    color: map-get($app-colors, echart-axis-color);

    &__list {
      margin: sz(10) 0 sz(15) 0;
      max-height: sz(323);
      overflow-y: auto;
      overflow-x: hidden;

      &-itemli {
        border-right: 1px solid map-get($colors, dropdown-box-border);
        width: sz(410);
        float: left;
        margin-left: sz(10);

        &:nth-child(even) {
          border-right: 0;
        }

        &-uls {
          width: sz(420);

          &-span {
            @include word-hidden(sz(325));

            display: inline-block;
            font-size: map-get($font-sizes, xs);
          }
        }
      }
    }

    &__btn {
      a {
        @include border-radius(5px);

        display: inline-block;
        width: sz(80);
        height: sz(30);
        line-height: sz(30);
        text-align: center;
        border: 1px solid map-get($colors, theme-blue);
        color: map-get($colors, theme-blue);
        margin: 0 0 sz(10) 0;

        &:first-child {
          margin: 0 0 sz(10) sz(310);
        }

        &:last-child {
          background: map-get($colors, theme-blue);
          color: map-get($colors, pure-white);
          margin: 0 0 sz(10) sz(50);
        }
      }
    }

    .customize-checkbox {
      margin-right: sz(10);

      &__radio {
        position: relative;
        top: sz(-6);
      }

      &__label {
        font-size: map-get($font-sizes, xs);
      }
    }
  }
</style>
