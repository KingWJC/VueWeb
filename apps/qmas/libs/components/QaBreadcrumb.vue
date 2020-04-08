<template>
  <div class="qa-breadcrumb">
    <div class="qa-breadcrumb__lasts">
      <div class="qa-breadcrumb__lasts-banner clearfix">
        <!-- prevList 数组进行了pop和push 添加key会出现重复键的问题 -->
        <!-- eslint-disable vue/require-v-for-key, vue/valid-v-for -->
        <template v-for="item in prevList">
          <span :title="item.name"
            :class="{
              'qa-breadcrumb__lasts-banner-link--highlight': item.link
            }"
            class="qa-breadcrumb__lasts-banner-link">
            <a :href="item.link"
              class="qa-breadcrumb__lasts-banner-link-name">
              {{ item.name }}
            </a>
          </span>

          <span class="qa-breadcrumb__lasts-banner-line">/</span>
        </template>
        <!-- eslint-enable vue/require-v-for-key, vue/valid-v-for -->

        <span :title="current.name"
          class="qa-breadcrumb__lasts-banner-current">
          {{ current.name }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "qa-breadcrumb",

    props: {
      crumbs: {
        type: Array,
        default: function() {
          // 不能改成箭头函数，因为我们要访问 this 指针
          return this.$pagePayload.BREADCRUMB;
        }
      }
    },

    computed: {
      current() {
        return this.crumbs.slice(-1)[0];
      },

      prevList() {
        return this.crumbs.slice(0, -1);
      }
    }
  };
</script>

<style lang="scss">
  @import "~__libs/scss/lib-common-utils";

  .qa-breadcrumb {
    border-bottom: 1px solid map-get($colors, dialog-cancel-border);

    &__lasts {
      @extend %containerization;

      &-banner {
        height: sz(34);
        line-height: sz(34);
        color: map-get($colors, text-light);

        &-link,
        &-line,
        &-current {
          display: inline-block;
          vertical-align: middle;
          float: left;
        }

        &-link {
          &--highlight {
            &:hover {
              color: map-get($colors, theme-blue);
            }
          }
        }

        &-line {
          margin: 0 sz(10);
        }
      }
    }
  }
</style>
