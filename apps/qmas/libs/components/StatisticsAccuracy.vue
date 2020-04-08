<template>
  <div class="statistics-accuracy clearfix">
    <span v-if="hasText"
      class="statistics-accuracy__title">统计精度</span>

    <template v-for="(item, index) in accuracyItems">
      <a :key="index"
        :class="{
          'btn--white': activeAccuracyCode !== item.code
        }"
        :title="item.name"
        class="btn statistics-accuracy__option"
        href="javascript:;"
        @click="getTabClass(item.code)">
        {{ item.name }}
      </a>
    </template>
  </div>
</template>

<script>
  export default {
    name: "statistics-accuracy",

    props: {
      hasText: {
        type: Boolean,
        default: true
      },
      accuracyItems: {
        type: Array,
        default() {
          return [];
        }
      },
      // 选择当前的统计精度
      activeAccuracyCode: {
        type: String,
        default: ""
      }
    },

    data() {
      return {};
    },

    methods: {
      getTabClass(str) {
        if (str !== this.activeAccuracyCode) {
          this.$emit("accuracyChange", str);
        }
      }
    }
  };
</script>

<style lang="scss">
  @import "~__libs/scss/lib-common-utils";

  .statistics-accuracy {
    &__title {
      width: sz(60);
      margin-top: sz(4);
      float: left;
    }

    &__option {
      @include border-radius(5px);
      @include user-select(none);

      float: left;
      margin-left: sz(10);

      &:first-child {
        margin-left: 0;
      }
    }
  }
</style>
